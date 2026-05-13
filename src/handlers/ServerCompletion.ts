import crypto from "node:crypto";
import {Readable} from "node:stream";
import http from "node:http";
import {
	parseDeepSeekSSELine,
	parseSSEChunkForContent,
	hasContentFilterStatus,
} from "@/server/SSEParser";
import {StreamToolSieve, parseDSMLToolCalls} from "@/server/ToolSieve";
import {
	buildPromptText,
	extractSystemAndUserMessages,
	buildUserOnlyPromptText,
} from "@/server/PromptBuilder";
import {uploadRuleFiles, buildLivePrompt} from "@/server/RuleFileUploader";
import {
	resolveModel,
	getModelConfig,
	getModelType,
} from "@/server/ModelConfig";
import * as dsClient from "@/server/DeepseekClient";
import type {OpenAIChatRequest} from "@/types";
import type {
	ServerInstanceState,
	ToolCall,
	DeepSeekCompletionPayload,
} from "@/types/ServerInternal";
import {
	logWithPort,
	getErrorMessage,
	getNextToken,
	readBody,
	streamToString,
	jsonResponse,
	estimateTokens,
} from "@/handlers/ServerHelpers";

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
		requestedModel !== resolvedModel ?
			`${requestedModel} → ${resolvedModel}`
		:	resolvedModel;
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

	state.sessionManager.cleanupStale();

	let sessionId: string | undefined;
	try {
		// ── Step 1: Split messages into system instructions vs conversation ──
		const {systemMessages, conversationMessages} =
			extractSystemAndUserMessages(request.messages);
		const tools = (request.tools as unknown[] | undefined) || [];

		// ── Step 2: Build conversation-only prompt (no system/tool inlined) ──
		const prompt = buildUserOnlyPromptText(conversationMessages);
		const promptTokens = estimateTokens(prompt);

		// ── Step 3: Get or reuse session via SessionManager ──
		const sessionResult = await state.sessionManager.getSession(
			token,
			promptTokens,
		);
		sessionId = sessionResult.sessionId;

		const parentMessageId = state.sessionManager.getParentMessageId(token);

		const sessionInfo = state.sessionManager.getSessionInfo(token);
		const sessionTag =
			sessionResult.isNew ? "new" : `reuse #${sessionInfo.requestCount}`;
		logWithPort(
			state.port,
			`[api]   session: ${sessionId.slice(0, 8)}... (${sessionTag}, ~${sessionInfo.totalTokens} tokens, parent: ${parentMessageId || "none"})`,
		);

		// ── Step 4: Upload rule files (system prompt + tools as ref_file_ids) ──
		let refFileIds: string[] = [];
		let finalPrompt = prompt;

		try {
			const ruleFiles = await uploadRuleFiles(
				token,
				systemMessages,
				tools,
				state.port,
			);
			refFileIds = ruleFiles.refFileIds;

			const contextSummary =
				state.sessionManager.getContextSummary(token);
			const userPrompt =
				contextSummary ?
					`[Compressed context from previous conversation]\n${contextSummary}\n\n---\n\n${prompt}`
				:	prompt;

			finalPrompt = buildLivePrompt(
				userPrompt,
				ruleFiles.toolsFileId !== null,
			);
			logWithPort(
				state.port,
				`[api]   rule-files: rules=${ruleFiles.rulesFileId.slice(0, 8)}... tools=${ruleFiles.toolsFileId ? ruleFiles.toolsFileId.slice(0, 8) + "..." : "none"}`,
			);
		} catch (ruleErr: unknown) {
			const message =
				ruleErr instanceof Error ? ruleErr.message : String(ruleErr);
			logWithPort(
				state.port,
				`[api]   rule-file upload failed, falling back to inline: ${message}`,
			);
			finalPrompt = buildPromptText(request.messages, tools);
			const contextSummary =
				state.sessionManager.getContextSummary(token);
			if (contextSummary) {
				finalPrompt = `[Compressed context from previous conversation]\n${contextSummary}\n\n---\n\n${finalPrompt}`;
			}
		}

		const powResponse = await dsClient.getPow(token);
		logWithPort(state.port, `[api]   pow: solved`);

		const payload: DeepSeekCompletionPayload = {
			chat_session_id: sessionId,
			prompt: finalPrompt,
			ref_file_ids: refFileIds,
			thinking_enabled: thinking,
			search_enabled: search,
			parent_message_id: parentMessageId,
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

			if (dsResponse.status === 422 || dsResponse.status === 400) {
				logWithPort(
					state.port,
					`[api]   resetting session due to error...`,
				);
				await state.sessionManager.resetSession(token);
			}

			jsonResponse(res, dsResponse.status, {
				error: {
					message: `DeepSeek API error: ${dsResponse.status}`,
					type: "api_error",
				},
			});
			return;
		}

		logWithPort(state.port, `[api]   streaming response...`);

		let lastMessageId: number | null = null;
		if (request.stream) {
			lastMessageId = await handleStreamResponse(
				res,
				dsResponse.data,
				resolvedModel,
				thinking,
			);
		} else {
			lastMessageId = await handleNonStreamResponse(
				res,
				dsResponse.data,
				resolvedModel,
				finalPrompt,
				thinking,
			);
		}

		state.sessionManager.recordExchange(
			token,
			prompt,
			"(response recorded)",
			lastMessageId,
		);

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

		if (message.includes("create session failed")) {
			await state.sessionManager.resetSession(token);
		}

		jsonResponse(res, 500, {
			error: {
				message: message || "Completion failed",
				type: "api_error",
			},
		});
	}
}

async function handleStreamResponse(
	res: http.ServerResponse,
	stream: Readable,
	model: string,
	thinkingEnabled: boolean,
): Promise<number | null> {
	let lastMessageId: number | null = null;
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
	let hasToolCalls = false;
	const sieve = new StreamToolSieve();

	return new Promise((resolve, reject) => {
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

				const {parts, finished, nextType, messageId} =
					parseSSEChunkForContent(
						parsed,
						thinkingEnabled,
						currentType,
					);
				if (messageId) {
					lastMessageId = messageId;
				}
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
							hasToolCalls = true;
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
					hasToolCalls = true;
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
							finish_reason: hasToolCalls ? "tool_calls" : "stop",
						},
					],
				});
				res.write("data: [DONE]\n\n");
				res.end();
				resolve(lastMessageId);
			}
		});

		stream.on("error", (err) => {
			const message = err instanceof Error ? err.message : String(err);
			console.error("[shallowseek-api] Stream error:", message);
			if (!res.writableEnded) res.end();
			reject(err);
		});
	});
}

async function handleNonStreamResponse(
	res: http.ServerResponse,
	stream: Readable,
	model: string,
	prompt: string,
	thinkingEnabled: boolean,
): Promise<number | null> {
	const completionId = `chatcmpl-${crypto.randomUUID().replace(/-/g, "").slice(0, 24)}`;
	const created = Math.floor(Date.now() / 1000);

	let thinkingText = "";
	let contentText = "";
	let currentType = thinkingEnabled ? "thinking" : "text";
	let finishReason = "stop";
	let lastMessageId: number | null = null;

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

		const {parts, finished, nextType, messageId} = parseSSEChunkForContent(
			parsed,
			thinkingEnabled,
			currentType,
		);
		if (messageId) {
			lastMessageId = messageId;
		}
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
			if (finishReason === "stop") finishReason = "tool_calls";
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
					...(thinkingEnabled && thinkingText ?
						{reasoning_content: thinkingText}
					:	{}),
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
	return lastMessageId;
}
