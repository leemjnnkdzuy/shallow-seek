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
import {resolveThinkingAndSearch} from "@/server/Thinking";
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
	getAlternateToken,
	readBody,
	streamToString,
	jsonResponse,
	estimateTokens,
} from "@/handlers/ServerHelpers";
import {cleanVisibleOutput} from "@/lib/sanitize/OutputClean";
import {StreamTextAccumulator} from "@/lib/sanitize/StreamDedup";
import {
	shouldRetryEmptyOutput,
	clonePayloadForEmptyOutputRetry,
} from "@/server/EmptyRetry";
import {EMPTY_OUTPUT_RETRY_MAX_ATTEMPTS, MEMORY_FILENAME} from "@/constants";
import {parseToolCallsDetailed} from "@/lib/toolcall/ToolParser";
import {normalizeParsedToolCallsForSchemas} from "@/lib/toolcall/ToolSchema";
import {uploadContextMemory} from "@/server/ContextMemory";

export interface CompletionResult {
	lastMessageId: number | null;
	contentText: string;
	thinkingText: string;
	toolCalls?: ToolCall[];
}


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

	const modelDefaults = getModelConfig(resolvedModel);
	const {thinking, search} = resolveThinkingAndSearch(request, modelDefaults);
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
		const {systemMessages, conversationMessages} =
			extractSystemAndUserMessages(request.messages);
		const tools = (request.tools as unknown[] | undefined) || [];

		const prompt = buildUserOnlyPromptText(conversationMessages);
		const promptTokens = estimateTokens(prompt);

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

		let refFileIds: string[] = [];
		let finalPrompt = prompt;
		let hasMemoryFile = false;
		let hasToolsFile = false;
		let rulesSucceeded = false;

		try {
			const ruleFiles = await uploadRuleFiles(
				token,
				systemMessages,
				tools,
				state.port,
			);
			refFileIds = ruleFiles.refFileIds;
			hasToolsFile = ruleFiles.toolsFileId !== null;
			rulesSucceeded = true;
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
		}

		try {
			const memoryFileId = await uploadContextMemory(
				token,
				request.messages,
				sessionId,
				state.port,
			);
			if (memoryFileId) {
				refFileIds.push(memoryFileId);
				hasMemoryFile = true;
				logWithPort(
					state.port,
					`[api]   context-memory uploaded: fileId=${memoryFileId.slice(0, 8)}...`,
				);
			}
		} catch (memErr: unknown) {
			const message =
				memErr instanceof Error ? memErr.message : String(memErr);
			logWithPort(
				state.port,
				`[api]   ⚠ context memory upload failed: ${message}`,
			);
		}

		const contextSummary = state.sessionManager.getContextSummary(token);

		if (rulesSucceeded) {
			const userPrompt = contextSummary ?
				`[Compressed context from previous conversation]\n${contextSummary}\n\n---\n\n${prompt}`
			:	prompt;

			finalPrompt = buildLivePrompt(
				userPrompt,
				hasToolsFile,
				hasMemoryFile,
			);
		} else {
			finalPrompt = buildPromptText(request.messages, tools);
			if (contextSummary) {
				finalPrompt = `[Compressed context from previous conversation]\n${contextSummary}\n\n---\n\n${finalPrompt}`;
			}
			if (hasMemoryFile) {
				finalPrompt = `Also refer to the attached ${MEMORY_FILENAME} file for complete context, session history, and step-by-step progress/tool outputs. Use it to coordinate your actions and do not repeat completed tasks.\n\n${finalPrompt}`;
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

		let lastMessageId: number | null = null;
		let completionResult: CompletionResult | null = null;

		if (request.stream) {
			completionResult = await handleStreamWithRetry(
				res,
				state,
				token,
				payload,
				powResponse,
				resolvedModel,
				thinking,
				tools,
			);
		} else {
			completionResult = await handleNonStreamWithRetry(
				res,
				state,
				token,
				payload,
				powResponse,
				resolvedModel,
				finalPrompt,
				thinking,
				tools,
			);
		}

		if (completionResult) {
			lastMessageId = completionResult.lastMessageId;
			state.sessionManager.recordExchange(
				token,
				prompt,
				completionResult.contentText || "(response recorded)",
				lastMessageId,
				completionResult.toolCalls,
			);
		} else {
			state.sessionManager.recordExchange(
				token,
				prompt,
				"(response recorded)",
				null,
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

async function handleNonStreamWithRetry(
	res: http.ServerResponse,
	state: ServerInstanceState,
	token: string,
	payload: DeepSeekCompletionPayload,
	pow: string,
	model: string,
	prompt: string,
	thinkingEnabled: boolean,
	tools: unknown[],
): Promise<CompletionResult | null> {
	let currentPayload = {...payload};
	let currentPow = pow;
	let currentToken = token;
	let attempts = 0;
	let accountSwitchAttempted = false;

	const running = true;
	while (running) {
		const dsResponse = await dsClient.callCompletion(
			currentToken,
			currentPayload,
			currentPow,
		);

		if (dsResponse.status === 429 && !accountSwitchAttempted) {
			const altToken = getAlternateToken(state, currentToken);
			if (altToken) {
				accountSwitchAttempted = true;
				logWithPort(
					state.port,
					`[api]   ⟲ 429 rate limit — rotating to alternate account`,
				);
				currentToken = altToken;
				try {
					const newSession = await dsClient.createSession(altToken);
					currentPayload = {
						...currentPayload,
						chat_session_id: newSession,
					};
					delete (currentPayload as Record<string, unknown>)
						.parent_message_id;
					currentPow = await dsClient.getPow(altToken);
					continue;
				} catch (switchErr) {
					logWithPort(
						state.port,
						`[api]   ✗ account switch failed: ${getErrorMessage(switchErr)}`,
					);
				}
			}
		}

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
				await state.sessionManager.resetSession(currentToken);
			}

			jsonResponse(res, dsResponse.status, {
				error: {
					message: `DeepSeek API error: ${dsResponse.status}`,
					type: "api_error",
				},
			});
			return null;
		}

		const result = await collectNonStreamResponse(
			dsResponse.data,
			thinkingEnabled,
			tools,
		);

		if (
			shouldRetryEmptyOutput(
				result.contentText,
				result.toolCalls !== undefined && result.toolCalls.length > 0,
				result.finishReason === "content_filter",
				attempts,
				EMPTY_OUTPUT_RETRY_MAX_ATTEMPTS,
			)
		) {
			attempts++;
			logWithPort(
				state.port,
				`[api]   ⟲ empty output — retry #${attempts} (parent: ${result.lastMessageId || "none"})`,
			);
			currentPayload = clonePayloadForEmptyOutputRetry(
				currentPayload,
				result.lastMessageId,
			) as DeepSeekCompletionPayload;
			try {
				currentPow = await dsClient.getPow(currentToken);
			} catch {
				logWithPort(
					state.port,
					`[api]   ⚠ retry PoW fetch failed, reusing original`,
				);
			}
			continue;
		}

		const cleanedContent = cleanVisibleOutput(result.contentText);
		const cleanedThinking = thinkingEnabled
			? cleanVisibleOutput(result.thinkingText)
			: "";

		let finalToolCalls = result.toolCalls;
		if (
			(!finalToolCalls || finalToolCalls.length === 0) &&
			!cleanedContent.trim()
		) {
			const thinkingSource =
				result.thinkingText || cleanedThinking || "";
			if (thinkingSource.trim()) {
				const thinkingParsed =
					parseToolCallsDetailed(thinkingSource);

				if (thinkingParsed.Calls.length > 0) {
					logWithPort(
						state.port,
						`[api]   ↗ recovered ${thinkingParsed.Calls.length} tool call(s) from thinking content`,
					);

					let calls = thinkingParsed.Calls;
					if (tools && tools.length > 0) {
						calls = normalizeParsedToolCallsForSchemas(
							calls,
							tools,
						);
					}

					finalToolCalls = calls.map((c) => ({
						id: `call_${crypto.randomUUID().replace(/-/g, "")}`,
						type: "function" as const,
						function: {
							name: c.Name,
							arguments: JSON.stringify(c.Input),
						},
					}));
				}
			}
		}

		const finishReason =
			finalToolCalls && finalToolCalls.length > 0
				? "tool_calls"
				: result.finishReason;

		const completionId = `chatcmpl-${crypto.randomUUID().replace(/-/g, "").slice(0, 24)}`;
		const created = Math.floor(Date.now() / 1000);

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
						content: cleanedContent,
						...(thinkingEnabled && cleanedThinking
							? {reasoning_content: cleanedThinking}
							: {}),
						...(finalToolCalls && finalToolCalls.length > 0
							? {tool_calls: finalToolCalls}
							: {}),
					},
					finish_reason: finishReason,
				},
			],
			usage: {
				prompt_tokens: estimateTokens(prompt),
				completion_tokens: estimateTokens(
					result.contentText + result.thinkingText,
				),
				total_tokens: estimateTokens(
					prompt + result.contentText + result.thinkingText,
				),
			},
		};

		jsonResponse(res, 200, responseBody);
		return {
			lastMessageId: result.lastMessageId,
			contentText: cleanedContent,
			thinkingText: cleanedThinking,
			toolCalls: finalToolCalls,
		};
	}
	return null;
}

interface NonStreamCollectResult {
	thinkingText: string;
	contentText: string;
	finishReason: string;
	lastMessageId: number | null;
	toolCalls: ToolCall[] | undefined;
}

async function collectNonStreamResponse(
	stream: Readable,
	thinkingEnabled: boolean,
	tools: unknown[],
): Promise<NonStreamCollectResult> {
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

	let toolCalls: ToolCall[] | undefined = undefined;
	const toolStartIdx = contentText.indexOf("<|DSML|tool_calls>");
	const toolEndIdx = contentText.indexOf("</|DSML|tool_calls>");
	if (toolStartIdx !== -1 && toolEndIdx !== -1) {
		const fullXml = contentText.substring(
			toolStartIdx,
			toolEndIdx + "</|DSML|tool_calls>".length,
		);
		const parsedTools = parseDSMLToolCalls(
			fullXml,
			tools,
		) as ToolCall[];
		if (parsedTools.length > 0) {
			toolCalls = parsedTools;
			contentText = contentText.substring(0, toolStartIdx);
			if (finishReason === "stop") finishReason = "tool_calls";
		}
	}

	return {thinkingText, contentText, finishReason, lastMessageId, toolCalls};
}

async function handleStreamWithRetry(
	res: http.ServerResponse,
	state: ServerInstanceState,
	token: string,
	payload: DeepSeekCompletionPayload,
	pow: string,
	model: string,
	thinkingEnabled: boolean,
	tools: unknown[],
): Promise<CompletionResult | null> {
	let currentToken = token;
	let currentPayload = {...payload};
	let currentPow = pow;

	const dsResponse = await dsClient.callCompletion(
		currentToken,
		currentPayload,
		currentPow,
	);

	if (dsResponse.status === 429) {
		const altToken = getAlternateToken(state, currentToken);
		if (altToken) {
			logWithPort(
				state.port,
				`[api]   ⟲ 429 rate limit — rotating to alternate account (stream)`,
			);
			try {
				const newSession = await dsClient.createSession(altToken);
				currentPayload = {
					...currentPayload,
					chat_session_id: newSession,
				};
				delete (currentPayload as Record<string, unknown>)
					.parent_message_id;
				currentPow = await dsClient.getPow(altToken);
				currentToken = altToken;

				const retryResponse = await dsClient.callCompletion(
					currentToken,
					currentPayload,
					currentPow,
				);
				if (retryResponse.status === 200) {
					logWithPort(state.port, `[api]   streaming response...`);
					return handleStreamResponse(
						res,
						retryResponse.data,
						model,
						thinkingEnabled,
						state,
						tools,
					);
				}
			} catch (switchErr) {
				logWithPort(
					state.port,
					`[api]   ✗ account switch failed: ${getErrorMessage(switchErr)}`,
				);
			}
		}
	}

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
			await state.sessionManager.resetSession(currentToken);
		}

		jsonResponse(res, dsResponse.status, {
			error: {
				message: `DeepSeek API error: ${dsResponse.status}`,
				type: "api_error",
			},
		});
		return null;
	}

	logWithPort(state.port, `[api]   streaming response...`);
	return handleStreamResponse(
		res,
		dsResponse.data,
		model,
		thinkingEnabled,
		state,
		tools,
	);
}

async function handleStreamResponse(
	res: http.ServerResponse,
	stream: Readable,
	model: string,
	thinkingEnabled: boolean,
	state: ServerInstanceState,
	tools: unknown[],
): Promise<CompletionResult> {
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
	const sieve = new StreamToolSieve(tools);

	const textAccum = new StreamTextAccumulator();
	const thinkingAccum = new StreamTextAccumulator();

	let contentText = "";
	let thinkingText = "";
	const sieveToolCalls: ToolCall[] = [];

	return new Promise<CompletionResult>((resolve, reject) => {
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
					resolve({
						lastMessageId,
						contentText,
						thinkingText,
						toolCalls: sieveToolCalls.length > 0 ? sieveToolCalls : undefined,
					});
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
					resolve({
						lastMessageId,
						contentText,
						thinkingText,
						toolCalls: sieveToolCalls.length > 0 ? sieveToolCalls : undefined,
					});
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
					resolve({
						lastMessageId,
						contentText,
						thinkingText,
						toolCalls: sieveToolCalls.length > 0 ? sieveToolCalls : undefined,
					});
					return;
				}

				for (const part of parts) {
					if (part.type === "thinking") {
						const deduped = thinkingAccum.append(part.text);
						if (!deduped) continue;

						const cleaned = cleanVisibleOutput(deduped);
						if (!cleaned) continue;

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
									delta: {reasoning_content: cleaned},
									finish_reason: null,
								},
							],
						});
						thinkingText += cleaned;
					} else {
						const deduped = textAccum.append(part.text);
						if (!deduped) continue;

						const cleaned = cleanVisibleOutput(deduped);

						const result = sieve.processChunk(cleaned || deduped);
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
							contentText += result.outputText;
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
							sieveToolCalls.push(...result.toolCalls);
						}
					}
				}
			}
		});

		stream.on("end", () => {
			if (!res.writableEnded) {
				const finalResult = sieve.flush();
				if (finalResult.outputText) {
					const cleaned = cleanVisibleOutput(finalResult.outputText);
					if (cleaned) {
						sendSSE({
							id: completionId,
							object: "chat.completion.chunk",
							created,
							model,
							choices: [
								{
									index: 0,
									delta: {content: cleaned},
									finish_reason: null,
								},
							],
						});
						contentText += cleaned;
					}
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
					sieveToolCalls.push(...finalResult.toolCalls);
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
							finish_reason:
								hasToolCalls ? "tool_calls" : "stop",
						},
					],
				});
				res.write("data: [DONE]\n\n");
				res.end();
				resolve({
					lastMessageId,
					contentText,
					thinkingText,
					toolCalls: sieveToolCalls.length > 0 ? sieveToolCalls : undefined,
				});
			}
		});

		stream.on("error", (err) => {
			const message = err instanceof Error ? err.message : String(err);
			logWithPort(
				state.port,
				`[api] ✗ stream error: ${message}`,
			);
			if (!res.writableEnded) res.end();
			reject(err);
		});
	});
}
