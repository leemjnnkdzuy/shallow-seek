import crypto from "node:crypto";
import {Readable} from "node:stream";
import http from "node:http";
import {
	parseDeepSeekSSELine,
	parseSSEChunkForContent,
	hasContentFilterStatus,
} from "../server/SSEParser";
import {
	buildToolPrompt,
	StreamToolSieve,
	parseDSMLToolCalls,
} from "../server/ToolSieve";
import {
	resolveModel,
	getModelConfig,
	getModelType,
} from "../server/ModelConfig";
import * as dsClient from "../server/DeepseekClient";
import type {OpenAIChatRequest} from "../types";
import type {
	ServerInstanceState,
	ToolCall,
	DeepSeekCompletionPayload,
	OpenAIChatMessageLike,
} from "../types/ServerInternal";
import {
	logWithPort,
	getErrorMessage,
	getNextToken,
	readBody,
	streamToString,
	jsonResponse,
	isRecord,
	estimateTokens,
} from "./ServerHelpers";

export async function handleChatCompletions(
	req: http.IncomingMessage,
	res: http.ServerResponse,
	state: ServerInstanceState,
) {
	const reqStart = Date.now();
	const body = await readBody(req);
	let request: OpenAIChatRequest;
	try {
		request = JSON.parse(body);
	} catch {
		jsonResponse(res, 400, {
			error: {message: "Invalid JSON", type: "invalid_request_error"},
		});
		return;
	}

	const streamMode = request.stream ? "stream" : "sync";
	const requestedModel = request.model || "(none)";

	const resolvedModel = resolveModel(
		request.model,
		state.config.modelAliases,
	);
	if (!resolvedModel) {
		logWithPort(
			state.port,
			`[api] ✗ completion rejected — unsupported model: ${requestedModel}`,
		);
		jsonResponse(res, 400, {
			error: {
				message: `Model '${request.model}' is not supported`,
				type: "invalid_request_error",
			},
		});
		return;
	}

	const modelAlias =
		requestedModel !== resolvedModel
			? `${requestedModel} → ${resolvedModel}`
			: resolvedModel;
	logWithPort(
		state.port,
		`[api] ⟶ completion ${streamMode} | model: ${modelAlias} | msgs: ${request.messages?.length || 0}`,
	);

	const {thinking, search} = getModelConfig(resolvedModel);
	const modelType = getModelType(resolvedModel);

	const token = getNextToken(state);
	if (!token) {
		logWithPort(
			state.port,
			`[api] ✗ completion failed — no available accounts`,
		);
		jsonResponse(res, 503, {
			error: {message: "No available accounts", type: "api_error"},
		});
		return;
	}

	let sessionId: string | undefined;
	try {
		sessionId = await dsClient.createSession(token);
		logWithPort(state.port, `[api]   session: ${sessionId.slice(0, 8)}...`);

		const powResponse = await dsClient.getPow(token);
		logWithPort(state.port, `[api]   pow: solved`);

		const prompt = buildPromptText(
			request.messages,
			request.tools as unknown[] | undefined,
		);
		const payload: DeepSeekCompletionPayload = {
			chat_session_id: sessionId,
			prompt: prompt,
			ref_file_ids: [],
			thinking_enabled: thinking,
			search_enabled: search,
		};
		if (modelType) {
			payload.model_class = modelType;
		}

		const dsResponse = await dsClient.callCompletion(
			token,
			payload,
			powResponse,
		);

		if (dsResponse.status !== 200) {
			const errData = await streamToString(dsResponse.data);
			logWithPort(
				state.port,
				`[api] ✗ DeepSeek error ${dsResponse.status}: ${errData.slice(0, 200)}`,
			);
			jsonResponse(res, dsResponse.status, {
				error: {
					message: `DeepSeek API error: ${dsResponse.status}`,
					type: "api_error",
				},
			});
			return;
		}

		logWithPort(state.port, `[api]   streaming response...`);

		if (request.stream) {
			await handleStreamResponse(
				res,
				dsResponse.data,
				resolvedModel,
				thinking,
			);
		} else {
			await handleNonStreamResponse(
				res,
				dsResponse.data,
				resolvedModel,
				prompt,
				thinking,
			);
		}

		const elapsed = ((Date.now() - reqStart) / 1000).toFixed(1);
		logWithPort(
			state.port,
			`[api] ✓ completion done | model: ${resolvedModel} | ${streamMode} | ${elapsed}s`,
		);
	} catch (err: unknown) {
		const message = getErrorMessage(err);
		const elapsed = ((Date.now() - reqStart) / 1000).toFixed(1);
		logWithPort(
			state.port,
			`[api] ✗ completion error (${elapsed}s): ${message}`,
		);
		jsonResponse(res, 500, {
			error: {
				message: message || "Completion failed",
				type: "api_error",
			},
		});
	} finally {
		if (sessionId && token && state.config.autoDeleteMode === "single") {
			dsClient.deleteSession(token, sessionId).catch(() => {});
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
		Connection: "keep-alive",
		"X-Accel-Buffering": "no",
	});

	const completionId = `chatcmpl-${crypto.randomUUID().replace(/-/g, "").slice(0, 24)}`;
	const created = Math.floor(Date.now() / 1000);
	let currentType = thinkingEnabled ? "thinking" : "text";
	let buffer = "";
	let thinkingStartSent = false;
	const sieve = new StreamToolSieve();

	const sendSSE = (data: Record<string, unknown>) => {
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
					choices: [
						{
							index: 0,
							delta: {},
							finish_reason: "stop",
						},
					],
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
					choices: [
						{
							index: 0,
							delta: {},
							finish_reason: "content_filter",
						},
					],
				});
				res.write("data: [DONE]\n\n");
				res.end();
				return;
			}

			const {parts, finished, nextType} = parseSSEChunkForContent(
				parsed,
				thinkingEnabled,
				currentType,
			);
			currentType = nextType;

			if (finished) {
				sendSSE({
					id: completionId,
					object: "chat.completion.chunk",
					created,
					model,
					choices: [
						{
							index: 0,
							delta: {},
							finish_reason: "stop",
						},
					],
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
							choices: [
								{
									index: 0,
									delta: {
										role: "assistant",
										reasoning_content: "",
									},
									finish_reason: null,
								},
							],
						});
						thinkingStartSent = true;
					}
					sendSSE({
						id: completionId,
						object: "chat.completion.chunk",
						created,
						model,
						choices: [
							{
								index: 0,
								delta: {reasoning_content: part.text},
								finish_reason: null,
							},
						],
					});
				} else {
					const result = sieve.processChunk(part.text);
					if (result.outputText) {
						sendSSE({
							id: completionId,
							object: "chat.completion.chunk",
							created,
							model,
							choices: [
								{
									index: 0,
									delta: {content: result.outputText},
									finish_reason: null,
								},
							],
						});
					}
					if (result.toolCalls) {
						sendSSE({
							id: completionId,
							object: "chat.completion.chunk",
							created,
							model,
							choices: [
								{
									index: 0,
									delta: {tool_calls: result.toolCalls},
									finish_reason: null,
								},
							],
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
					choices: [
						{
							index: 0,
							delta: {content: finalResult.outputText},
							finish_reason: null,
						},
					],
				});
			}
			if (finalResult.toolCalls) {
				sendSSE({
					id: completionId,
					object: "chat.completion.chunk",
					created,
					model,
					choices: [
						{
							index: 0,
							delta: {tool_calls: finalResult.toolCalls},
							finish_reason: null,
						},
					],
				});
			}

			sendSSE({
				id: completionId,
				object: "chat.completion.chunk",
				created,
				model,
				choices: [
					{
						index: 0,
						delta: {},
						finish_reason: "stop",
					},
				],
			});
			res.write("data: [DONE]\n\n");
			res.end();
		}
	});

	stream.on("error", (err) => {
		const message = err instanceof Error ? err.message : String(err);
		console.error("[shallowseek-api] Stream error:", message);
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

		const {parts, finished, nextType} = parseSSEChunkForContent(
			parsed,
			thinkingEnabled,
			currentType,
		);
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
	let toolCalls: ToolCall[] | undefined = undefined;

	const toolStartIdx = contentText.indexOf("<|DSML|tool_calls>");
	const toolEndIdx = contentText.indexOf("</|DSML|tool_calls>");
	if (toolStartIdx !== -1 && toolEndIdx !== -1) {
		const fullXml = contentText.substring(
			toolStartIdx,
			toolEndIdx + "</|DSML|tool_calls>".length,
		);
		const parsedTools = parseDSMLToolCalls(fullXml) as ToolCall[];
		if (parsedTools.length > 0) {
			toolCalls = parsedTools;
			finalContent = contentText.substring(0, toolStartIdx);
		}
	}

	const responseBody: Record<string, unknown> = {
		id: completionId,
		object: "chat.completion",
		created,
		model,
		choices: [
			{
				index: 0,
				message: {
					role: "assistant",
					content: finalContent,
					...(thinkingEnabled && thinkingText
						? {reasoning_content: thinkingText}
						: {}),
					...(toolCalls ? {tool_calls: toolCalls} : {}),
				},
				finish_reason: finishReason,
			},
		],
		usage: {
			prompt_tokens: estimateTokens(prompt),
			completion_tokens: estimateTokens(contentText + thinkingText),
			total_tokens: estimateTokens(prompt + contentText + thinkingText),
		},
	};

	jsonResponse(res, 200, responseBody);
}

export function buildPromptText(
	messages: OpenAIChatMessageLike[],
	tools?: unknown[],
): string {
	if (!Array.isArray(messages) || messages.length === 0) return "";

	const parts: string[] = [];
	const toolPrompt = buildToolPrompt(tools || []);

	let systemInjected = false;

	for (const msg of messages) {
		const role = msg.role || "user";
		let content =
			typeof msg.content === "string"
				? msg.content
				: JSON.stringify(msg.content);

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
					if (!call.function) continue;
					historyToolCalls += `  <|DSML|invoke name="${call.function.name}">\n`;
					const argValue = (() => {
						try {
							return JSON.parse(
								call.function.arguments,
							) as unknown;
						} catch {
							return call.function.arguments as unknown;
						}
					})();
					if (isRecord(argValue)) {
						for (const [k, v] of Object.entries(argValue)) {
							const valStr =
								typeof v === "object"
									? JSON.stringify(v)
									: String(v);
							historyToolCalls += `    <|DSML|parameter name="${k}"><![CDATA[${valStr}]]></|DSML|parameter>\n`;
						}
					} else {
						historyToolCalls += `    <|DSML|parameter name="args"><![CDATA[${call.function.arguments}]]></|DSML|parameter>\n`;
					}
					historyToolCalls += `  </|DSML|invoke>\n`;
				}
				historyToolCalls += "</|DSML|tool_calls>";
				content =
					content
						? `${content}\n${historyToolCalls}`
						: historyToolCalls;
			}
			parts.push(`[Assistant]\n${content}`);
		} else if (role === "tool") {
			parts.push(`[Tool]\nResult: ${content}`);
		}
	}

	if (toolPrompt && !systemInjected) {
		parts.unshift(`[System]\n${toolPrompt}`);
	}

	return parts.join("\n\n");
}
