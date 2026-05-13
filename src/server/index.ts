import http from "node:http";
import crypto from "node:crypto";
import { Readable } from "node:stream";

import * as dsClient from "./DeepseekClient";
import { parseDeepSeekSSELine, parseSSEChunkForContent, hasContentFilterStatus } from "./SSEParser";
import { buildToolPrompt, StreamToolSieve, parseDSMLToolCalls } from "./ToolSieve";
import { resolveModel, getModelConfig, getModelType, openAIModelsResponse, ALL_MODELS } from "./ModelConfig";
import type { ServerConfig, OpenAIChatRequest } from "../types";

let currentServer: http.Server | null = null;
let currentConfig: ServerConfig | null = null;

let accountTokens: Map<string, string> = new Map();
let accountIndex = 0;

let _logCallback: ((msg: string) => void) | null = null;

export function setLogCallback(cb: (msg: string) => void) {
	_logCallback = cb;
}

function serverLog(msg: string) {
	console.log(msg);
	if (_logCallback) _logCallback(msg);
}

export async function startServer(config: ServerConfig): Promise<number> {
	if (currentServer) throw new Error("Server is already running");
	currentConfig = config;
	accountTokens = new Map();

	for (const acc of config.accounts) {
		if (acc.token) {
			accountTokens.set(acc.email, acc.token);
		} else {
			try {
				const token = await dsClient.login(acc);
				accountTokens.set(acc.email, token);
				serverLog(`[shallowseek-api] ✓ Logged in: ${acc.email.slice(0, 3)}***`);
			} catch (err: any) {
				serverLog(`[shallowseek-api] ✗ Login failed for ${acc.email}: ${err.message}`);
			}
		}
	}

	if (accountTokens.size === 0) {
		throw new Error("No accounts available (all login attempts failed)");
	}

	const server = http.createServer(handleRequest);
	return new Promise((resolve, reject) => {
		server.listen(config.port, () => {
			currentServer = server;
			serverLog(`[shallowseek-api] OpenAI-compatible API server listening on port ${config.port}`);
			resolve(config.port);
		});
		server.on("error", reject);
	});
}

export async function stopServer(): Promise<void> {
	if (!currentServer) throw new Error("Server is not running");
	return new Promise((resolve) => {
		currentServer!.close(() => {
			currentServer = null;
			serverLog("[shallowseek-api] Server stopped");
			resolve();
		});
	});
}

export function isRunning(): boolean {
	return currentServer !== null;
}

async function handleRequest(req: http.IncomingMessage, res: http.ServerResponse) {
	const startTime = Date.now();
	const method = req.method || "GET";

	setCORS(res, req);
	if (method === "OPTIONS") {
		res.writeHead(204);
		res.end();
		return;
	}

	const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
	const path = url.pathname;
	const clientIP = req.socket.remoteAddress || "unknown";

	const origEnd = res.end.bind(res);
	(res as any).end = function (...args: any[]) {
		const duration = Date.now() - startTime;
		const status = res.statusCode;
		if (path !== "/healthz" && path !== "/readyz") {
			serverLog(`[api] ${method} ${path} → ${status} (${duration}ms) [${clientIP}]`);
		}
		return origEnd(...args);
	};

	try {
		if (path === "/healthz" || path === "/readyz") {
			jsonResponse(res, 200, { status: "ok" });
			return;
		}

		if ((path === "/v1/models" || path === "/models") && method === "GET") {
			jsonResponse(res, 200, openAIModelsResponse());
			return;
		}

		const modelMatch = path.match(/^\/(?:v1\/)?models\/(.+)$/);
		if (modelMatch && method === "GET") {
			const modelId = modelMatch[1];
			const model = ALL_MODELS.find(m => m.id === modelId);
			if (model) {
				jsonResponse(res, 200, model);
			} else {
				jsonResponse(res, 404, { error: { message: `Model '${modelId}' not found`, type: "invalid_request_error" } });
			}
			return;
		}

		if ((path === "/v1/chat/completions" || path === "/chat/completions") && method === "POST") {
			if (!validateAuth(req, res)) return;
			await handleChatCompletions(req, res);
			return;
		}

		jsonResponse(res, 404, { error: { message: "Not found", type: "invalid_request_error" } });
	} catch (err: any) {
		serverLog(`[api] ✗ ${method} ${path} — unhandled error: ${err.message}`);
		jsonResponse(res, 500, { error: { message: "Internal Server Error", type: "api_error" } });
	}
}

function validateAuth(req: http.IncomingMessage, res: http.ServerResponse): boolean {
	if (!currentConfig || currentConfig.apiKeys.length === 0) return true;

	const authHeader = req.headers["authorization"] || "";
	let key = "";
	if (authHeader.startsWith("Bearer ")) {
		key = authHeader.slice(7).trim();
	}
	if (!key) {
		const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
		key = url.searchParams.get("key") || url.searchParams.get("api_key") || "";
	}

	if (!key || !currentConfig.apiKeys.includes(key)) {
		jsonResponse(res, 401, {
			error: { message: "Invalid API key", type: "invalid_request_error", code: "invalid_api_key" },
		});
		return false;
	}
	return true;
}

async function handleChatCompletions(req: http.IncomingMessage, res: http.ServerResponse) {
	const reqStart = Date.now();
	const body = await readBody(req);
	let request: OpenAIChatRequest;
	try {
		request = JSON.parse(body);
	} catch {
		jsonResponse(res, 400, { error: { message: "Invalid JSON", type: "invalid_request_error" } });
		return;
	}

	const streamMode = request.stream ? "stream" : "sync";
	const requestedModel = request.model || "(none)";

	const resolvedModel = resolveModel(request.model, currentConfig?.modelAliases);
	if (!resolvedModel) {
		serverLog(`[api] ✗ completion rejected — unsupported model: ${requestedModel}`);
		jsonResponse(res, 400, {
			error: { message: `Model '${request.model}' is not supported`, type: "invalid_request_error" },
		});
		return;
	}

	const modelAlias = requestedModel !== resolvedModel ? `${requestedModel} → ${resolvedModel}` : resolvedModel;
	serverLog(`[api] ⟶ completion ${streamMode} | model: ${modelAlias} | msgs: ${request.messages?.length || 0}`);

	const { thinking, search } = getModelConfig(resolvedModel);
	const modelType = getModelType(resolvedModel);

	const token = getNextToken();
	if (!token) {
		serverLog(`[api] ✗ completion failed — no available accounts`);
		jsonResponse(res, 503, {
			error: { message: "No available accounts", type: "api_error" },
		});
		return;
	}

	let sessionId: string | undefined;
	try {
		sessionId = await dsClient.createSession(token);
		serverLog(`[api]   session: ${sessionId.slice(0, 8)}...`);

		const powResponse = await dsClient.getPow(token);
		serverLog(`[api]   pow: solved`);

		const prompt = buildPromptText(request.messages, request.tools);
		const payload: Record<string, any> = {
			chat_session_id: sessionId,
			prompt: prompt,
			ref_file_ids: [],
			thinking_enabled: thinking,
			search_enabled: search,
		};
		if (modelType) {
			payload.model_class = modelType;
		}

		const dsResponse = await dsClient.callCompletion(token, payload, powResponse);

		if (dsResponse.status !== 200) {
			const errData = await streamToString(dsResponse.data);
			serverLog(`[api] ✗ DeepSeek error ${dsResponse.status}: ${errData.slice(0, 200)}`);
			jsonResponse(res, dsResponse.status, {
				error: { message: `DeepSeek API error: ${dsResponse.status}`, type: "api_error" },
			});
			return;
		}

		serverLog(`[api]   streaming response...`);

		if (request.stream) {
			await handleStreamResponse(res, dsResponse.data, resolvedModel, thinking);
		} else {
			await handleNonStreamResponse(res, dsResponse.data, resolvedModel, prompt, thinking);
		}

		const elapsed = ((Date.now() - reqStart) / 1000).toFixed(1);
		serverLog(`[api] ✓ completion done | model: ${resolvedModel} | ${streamMode} | ${elapsed}s`);
	} catch (err: any) {
		const elapsed = ((Date.now() - reqStart) / 1000).toFixed(1);
		serverLog(`[api] ✗ completion error (${elapsed}s): ${err.message}`);
		jsonResponse(res, 500, {
			error: { message: err.message || "Completion failed", type: "api_error" },
		});
	} finally {
		if (sessionId && token && currentConfig?.autoDeleteMode === "single") {
			dsClient.deleteSession(token, sessionId).catch(() => { });
		}
	}
}

async function handleStreamResponse(
	res: http.ServerResponse,
	stream: Readable,
	model: string,
	thinkingEnabled: boolean,
) {
	res.writeHead(200, {
		"Content-Type": "text/event-stream",
		"Cache-Control": "no-cache, no-transform",
		"Connection": "keep-alive",
		"X-Accel-Buffering": "no",
	});

	const completionId = `chatcmpl-${crypto.randomUUID().replace(/-/g, "").slice(0, 24)}`;
	const created = Math.floor(Date.now() / 1000);
	let currentType = thinkingEnabled ? "thinking" : "text";
	let buffer = "";
	let thinkingStartSent = false;
	const sieve = new StreamToolSieve();

	const sendSSE = (data: any) => {
		res.write(`data: ${JSON.stringify(data)}\n\n`);
	};

	stream.on("data", (chunk: Buffer) => {
		buffer += chunk.toString("utf-8");
		const lines = buffer.split("\n");
		buffer = lines.pop() || "";

		for (const line of lines) {
			const trimmed = line.trim();
			if (!trimmed) continue;

			const [parsed, isDone, isValid] = parseDeepSeekSSELine(trimmed);
			if (!isValid) continue;
			if (isDone) {
				sendSSE({
					id: completionId,
					object: "chat.completion.chunk",
					created,
					model,
					choices: [{
						index: 0,
						delta: {},
						finish_reason: "stop",
					}],
				});
				res.write("data: [DONE]\n\n");
				res.end();
				return;
			}

			if (!parsed) continue;

			if (hasContentFilterStatus(parsed)) {
				sendSSE({
					id: completionId,
					object: "chat.completion.chunk",
					created,
					model,
					choices: [{
						index: 0,
						delta: {},
						finish_reason: "content_filter",
					}],
				});
				res.write("data: [DONE]\n\n");
				res.end();
				return;
			}

			const { parts, finished, nextType } = parseSSEChunkForContent(parsed, thinkingEnabled, currentType);
			currentType = nextType;

			if (finished) {
				sendSSE({
					id: completionId,
					object: "chat.completion.chunk",
					created,
					model,
					choices: [{
						index: 0,
						delta: {},
						finish_reason: "stop",
					}],
				});
				res.write("data: [DONE]\n\n");
				res.end();
				return;
			}

			for (const part of parts) {
				if (part.type === "thinking") {
					if (!thinkingStartSent) {
						sendSSE({
							id: completionId,
							object: "chat.completion.chunk",
							created,
							model,
							choices: [{
								index: 0,
								delta: { role: "assistant", reasoning_content: "" },
								finish_reason: null,
							}],
						});
						thinkingStartSent = true;
					}
					sendSSE({
						id: completionId,
						object: "chat.completion.chunk",
						created,
						model,
						choices: [{
							index: 0,
							delta: { reasoning_content: part.text },
							finish_reason: null,
						}],
					});
				} else {
					const result = sieve.processChunk(part.text);
					if (result.outputText) {
						sendSSE({
							id: completionId,
							object: "chat.completion.chunk",
							created,
							model,
							choices: [{
								index: 0,
								delta: { content: result.outputText },
								finish_reason: null,
							}],
						});
					}
					if (result.toolCalls) {
						sendSSE({
							id: completionId,
							object: "chat.completion.chunk",
							created,
							model,
							choices: [{
								index: 0,
								delta: { tool_calls: result.toolCalls },
								finish_reason: null,
							}],
						});
					}
				}
			}
		}
	});

	stream.on("end", () => {
		if (!res.writableEnded) {
			const finalResult = sieve.flush();
			if (finalResult.outputText) {
				sendSSE({
					id: completionId,
					object: "chat.completion.chunk",
					created,
					model,
					choices: [{
						index: 0,
						delta: { content: finalResult.outputText },
						finish_reason: null,
					}],
				});
			}
			if (finalResult.toolCalls) {
				sendSSE({
					id: completionId,
					object: "chat.completion.chunk",
					created,
					model,
					choices: [{
						index: 0,
						delta: { tool_calls: finalResult.toolCalls },
						finish_reason: null,
					}],
				});
			}

			sendSSE({
				id: completionId,
				object: "chat.completion.chunk",
				created,
				model,
				choices: [{
					index: 0,
					delta: {},
					finish_reason: "stop",
				}],
			});
			res.write("data: [DONE]\n\n");
			res.end();
		}
	});

	stream.on("error", (err) => {
		console.error("[shallowseek-api] Stream error:", err.message);
		if (!res.writableEnded) res.end();
	});
}

async function handleNonStreamResponse(
	res: http.ServerResponse,
	stream: Readable,
	model: string,
	prompt: string,
	thinkingEnabled: boolean,
) {
	const completionId = `chatcmpl-${crypto.randomUUID().replace(/-/g, "").slice(0, 24)}`;
	const created = Math.floor(Date.now() / 1000);

	let thinkingText = "";
	let contentText = "";
	let currentType = thinkingEnabled ? "thinking" : "text";
	let finishReason = "stop";

	const raw = await streamToString(stream);
	const lines = raw.split("\n");

	for (const line of lines) {
		const trimmed = line.trim();
		if (!trimmed) continue;

		const [parsed, isDone, isValid] = parseDeepSeekSSELine(trimmed);
		if (!isValid || isDone) continue;
		if (!parsed) continue;

		if (hasContentFilterStatus(parsed)) {
			finishReason = "content_filter";
			break;
		}

		const { parts, finished, nextType } = parseSSEChunkForContent(parsed, thinkingEnabled, currentType);
		currentType = nextType;

		if (finished) break;

		for (const part of parts) {
			if (part.type === "thinking") {
				thinkingText += part.text;
			} else {
				contentText += part.text;
			}
		}
	}

	let finalContent = contentText;
	let toolCalls: any[] | undefined = undefined;

	const toolStartIdx = contentText.indexOf("<|DSML|tool_calls>");
	const toolEndIdx = contentText.indexOf("</|DSML|tool_calls>");
	if (toolStartIdx !== -1 && toolEndIdx !== -1) {
		const fullXml = contentText.substring(toolStartIdx, toolEndIdx + "</|DSML|tool_calls>".length);
		const parsedTools = parseDSMLToolCalls(fullXml);
		if (parsedTools.length > 0) {
			toolCalls = parsedTools;
			finalContent = contentText.substring(0, toolStartIdx);
		}
	}

	const responseBody: Record<string, any> = {
		id: completionId,
		object: "chat.completion",
		created,
		model,
		choices: [{
			index: 0,
			message: {
				role: "assistant",
				content: finalContent,
				...(thinkingEnabled && thinkingText ? { reasoning_content: thinkingText } : {}),
				...(toolCalls ? { tool_calls: toolCalls } : {})
			},
			finish_reason: finishReason,
		}],
		usage: {
			prompt_tokens: estimateTokens(prompt),
			completion_tokens: estimateTokens(contentText + thinkingText),
			total_tokens: estimateTokens(prompt + contentText + thinkingText),
		},
	};

	jsonResponse(res, 200, responseBody);
}

// ─── Helpers ──────────────────────────────────────────────────────────

function getNextToken(): string | null {
	if (accountTokens.size === 0) return null;
	const entries = Array.from(accountTokens.entries());
	const [, token] = entries[accountIndex % entries.length];
	accountIndex = (accountIndex + 1) % entries.length;
	return token;
}

function buildPromptText(messages: any[], tools?: any[]): string {
	if (!Array.isArray(messages) || messages.length === 0) return "";
	
	const parts: string[] = [];
	const toolPrompt = buildToolPrompt(tools || []);

	let systemInjected = false;
	
	for (const msg of messages) {
		const role = msg.role || "user";
		let content = typeof msg.content === "string" ? msg.content : JSON.stringify(msg.content);

		if (role === "system") {
			if (toolPrompt && !systemInjected) {
				content = content + "\n\n" + toolPrompt;
				systemInjected = true;
			}
			parts.push(`[System]\n${content}`);
		} else if (role === "user") {
			parts.push(content);
		} else if (role === "assistant") {
			// Restore tool calls in history
			if (msg.tool_calls && Array.isArray(msg.tool_calls)) {
				let historyToolCalls = "<|DSML|tool_calls>\n";
				for (const call of msg.tool_calls) {
					if (call.function) {
						historyToolCalls += `  <|DSML|invoke name="${call.function.name}">\n`;
						try {
							const args = typeof call.function.arguments === "string" 
								? JSON.parse(call.function.arguments) 
								: call.function.arguments;
							for (const [k, v] of Object.entries(args)) {
								const valStr = typeof v === "object" ? JSON.stringify(v) : String(v);
								historyToolCalls += `    <|DSML|parameter name="${k}"><![CDATA[${valStr}]]></|DSML|parameter>\n`;
							}
						} catch {
							historyToolCalls += `    <|DSML|parameter name="args"><![CDATA[${call.function.arguments}]]></|DSML|parameter>\n`;
						}
						historyToolCalls += `  </|DSML|invoke>\n`;
					}
				}
				historyToolCalls += "</|DSML|tool_calls>";
				content = content ? `${content}\n${historyToolCalls}` : historyToolCalls;
			}
			parts.push(`[Assistant]\n${content}`);
		} else if (role === "tool") {
			parts.push(`[Tool]\nResult: ${content}`);
		}
	}

	// If no system message existed but we have tools, prepend it.
	if (toolPrompt && !systemInjected) {
		parts.unshift(`[System]\n${toolPrompt}`);
	}

	return parts.join("\n\n");
}

function readBody(req: http.IncomingMessage): Promise<string> {
	return new Promise((resolve, reject) => {
		let body = "";
		req.on("data", (chunk) => { body += chunk.toString(); });
		req.on("end", () => resolve(body));
		req.on("error", reject);
	});
}

function streamToString(stream: Readable): Promise<string> {
	return new Promise((resolve, reject) => {
		let data = "";
		stream.on("data", (chunk) => { data += chunk.toString(); });
		stream.on("end", () => resolve(data));
		stream.on("error", reject);
	});
}

function jsonResponse(res: http.ServerResponse, status: number, data: any) {
	res.writeHead(status, { "Content-Type": "application/json" });
	res.end(JSON.stringify(data));
}

function setCORS(res: http.ServerResponse, req: http.IncomingMessage) {
	const origin = req.headers["origin"] || "*";
	res.setHeader("Access-Control-Allow-Origin", origin);
	res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
	res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-API-Key");
	res.setHeader("Access-Control-Max-Age", "600");
}

/** Rough token estimate (~4 chars per token). */
function estimateTokens(text: string): number {
	return Math.ceil(text.length / 4);
}
