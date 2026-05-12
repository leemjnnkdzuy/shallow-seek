/**
 * OpenAI-compatible HTTP API server built-in to the Electron app.
 * Replaces the external Go ds2api process.
 *
 * Endpoints:
 *   GET  /v1/models              - List available models
 *   GET  /v1/models/:id          - Get specific model
 *   POST /v1/chat/completions    - Chat completion (stream + non-stream)
 *   GET  /healthz                - Health check
 */
import http from "node:http";
import crypto from "node:crypto";
import { Readable } from "node:stream";

import * as dsClient from "./deepseek-client";
import { parseDeepSeekSSELine, parseSSEChunkForContent, hasContentFilterStatus } from "./sse-parser";
import { resolveModel, getModelConfig, getModelType, openAIModelsResponse, ALL_MODELS } from "./model-config";
import type { ServerConfig, OpenAIChatRequest } from "./types";

let currentServer: http.Server | null = null;
let currentConfig: ServerConfig | null = null;

// Simple round-robin account pool
let accountTokens: Map<string, string> = new Map(); // email -> token
let accountIndex = 0;

// Pluggable log callback for piping logs to the UI
let _logCallback: ((msg: string) => void) | null = null;

/** Set a callback to receive all server log messages. */
export function setLogCallback(cb: (msg: string) => void) {
	_logCallback = cb;
}

function serverLog(msg: string) {
	console.log(msg);
	if (_logCallback) _logCallback(msg);
}

/** Start the API server. Returns the port. */
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

/** Stop the API server. */
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

// ─── Request Handling ─────────────────────────────────────────────────

async function handleRequest(req: http.IncomingMessage, res: http.ServerResponse) {
	const startTime = Date.now();
	const method = req.method || "GET";

	// CORS
	setCORS(res, req);
	if (method === "OPTIONS") {
		res.writeHead(204);
		res.end();
		return;
	}

	const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
	const path = url.pathname;
	const clientIP = req.socket.remoteAddress || "unknown";

	// Wrap res.end to log after response is sent
	const origEnd = res.end.bind(res);
	(res as any).end = function (...args: any[]) {
		const duration = Date.now() - startTime;
		const status = res.statusCode;
		// Skip noisy healthcheck logging
		if (path !== "/healthz" && path !== "/readyz") {
			serverLog(`[api] ${method} ${path} → ${status} (${duration}ms) [${clientIP}]`);
		}
		return origEnd(...args);
	};

	try {
		// Health check
		if (path === "/healthz" || path === "/readyz") {
			jsonResponse(res, 200, { status: "ok" });
			return;
		}

		// Models
		if ((path === "/v1/models" || path === "/models") && method === "GET") {
			jsonResponse(res, 200, openAIModelsResponse());
			return;
		}

		// Model by ID
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

		// Chat completions
		if ((path === "/v1/chat/completions" || path === "/chat/completions") && method === "POST") {
			// Auth check
			if (!validateAuth(req, res)) return;
			await handleChatCompletions(req, res);
			return;
		}

		// 404
		jsonResponse(res, 404, { error: { message: "Not found", type: "invalid_request_error" } });
	} catch (err: any) {
		serverLog(`[api] ✗ ${method} ${path} — unhandled error: ${err.message}`);
		jsonResponse(res, 500, { error: { message: "Internal Server Error", type: "api_error" } });
	}
}

// ─── Auth ─────────────────────────────────────────────────────────────

function validateAuth(req: http.IncomingMessage, res: http.ServerResponse): boolean {
	if (!currentConfig || currentConfig.apiKeys.length === 0) return true;

	const authHeader = req.headers["authorization"] || "";
	let key = "";
	if (authHeader.startsWith("Bearer ")) {
		key = authHeader.slice(7).trim();
	}
	if (!key) {
		// Check query param
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

// ─── Chat Completions ─────────────────────────────────────────────────

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

	// Resolve model
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

	// Get an account token
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
		// Create session
		sessionId = await dsClient.createSession(token);
		serverLog(`[api]   session: ${sessionId.slice(0, 8)}...`);

		// Get PoW
		const powResponse = await dsClient.getPow(token);
		serverLog(`[api]   pow: solved`);

		// Build completion payload
		const prompt = buildPromptText(request.messages);
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

		// Call DeepSeek
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
		// Auto-delete session
		if (sessionId && token && currentConfig?.autoDeleteMode === "single") {
			dsClient.deleteSession(token, sessionId).catch(() => { });
		}
	}
}

// ─── Stream Response ──────────────────────────────────────────────────

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
				// Send final chunk with finish_reason
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

			// Check content filter
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
					// Send as reasoning_content (OpenAI thinking format)
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
					sendSSE({
						id: completionId,
						object: "chat.completion.chunk",
						created,
						model,
						choices: [{
							index: 0,
							delta: { content: part.text },
							finish_reason: null,
						}],
					});
				}
			}
		}
	});

	stream.on("end", () => {
		if (!res.writableEnded) {
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

// ─── Non-Stream Response ──────────────────────────────────────────────

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

	const responseBody: Record<string, any> = {
		id: completionId,
		object: "chat.completion",
		created,
		model,
		choices: [{
			index: 0,
			message: {
				role: "assistant",
				content: contentText,
				...(thinkingEnabled && thinkingText ? { reasoning_content: thinkingText } : {}),
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

function buildPromptText(messages: any[]): string {
	if (!Array.isArray(messages) || messages.length === 0) return "";
	// For DeepSeek web API, we send the last user message as prompt
	// and pack system/history into a special format
	const parts: string[] = [];
	for (const msg of messages) {
		const role = msg.role || "user";
		const content = typeof msg.content === "string" ? msg.content : JSON.stringify(msg.content);
		if (role === "system") {
			parts.push(`[System]\n${content}`);
		} else if (role === "user") {
			parts.push(content);
		} else if (role === "assistant") {
			parts.push(`[Assistant]\n${content}`);
		}
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
