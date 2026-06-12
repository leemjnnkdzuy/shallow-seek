import * as dsClient from "@/server/DeepseekClient";
import type {ActiveSession, HistoryMessage} from "@/types/Session";
import {clearRuleFileCache, clearAllRuleFileCache} from "@/server/RuleFileUploader";

import {
	DEFAULT_CONTEXT_WINDOW,
	COMPRESS_THRESHOLD,
	RESPONSE_RESERVE,
	MAX_HISTORY_MESSAGES,
	CJK_RANGES,
} from "@/constants";


function estimateTokenCount(text: string): number {
	if (!text) return 0;
	let cjk = 0;
	for (let i = 0; i < text.length; i++) {
		const c = text.charCodeAt(i);
		if (CJK_RANGES.some((r) => c >= r.start && c <= r.end)) cjk++;
	}
	const ascii = text.length - cjk;
	return Math.ceil(ascii / 4 + cjk / 1.5);
}

export class SessionManager {
	private sessions = new Map<string, ActiveSession>();
	private contextWindow: number;

	constructor(contextWindow = DEFAULT_CONTEXT_WINDOW) {
		this.contextWindow = contextWindow;
	}

	async getSession(
		token: string,
		incomingPromptTokens: number,
	): Promise<{ sessionId: string; isNew: boolean }> {
		const existing = this.sessions.get(token);

		if (existing) {
			const projectedTokens =
				existing.totalTokens + incomingPromptTokens + RESPONSE_RESERVE;
			const threshold = this.contextWindow * COMPRESS_THRESHOLD;

			if (
				projectedTokens < threshold &&
				existing.history.length < MAX_HISTORY_MESSAGES
			) {
				existing.lastUsedAt = Date.now();
				existing.requestCount++;
				return { sessionId: existing.sessionId, isNew: false };
			}

			console.log(
				`[session-mgr] Context approaching limit (${existing.totalTokens}/${this.contextWindow} tokens, ${existing.history.length} messages). Compressing...`,
			);
			await this.compressAndRotate(token, existing);
			const rotated = this.sessions.get(token);
			if (rotated) {
				return { sessionId: rotated.sessionId, isNew: true };
			}
		}

		const sessionId = await dsClient.createSession(token);
		this.sessions.set(token, {
			sessionId,
			token,
			history: [],
			totalTokens: 0,
			createdAt: Date.now(),
			lastUsedAt: Date.now(),
			requestCount: 1,
			contextSummary: "",
			lastMessageId: null,
		});

		return { sessionId, isNew: true };
	}

	recordExchange(
		token: string,
		userPrompt: string,
		assistantResponse: string,
		assistantMessageId?: number | null,
		toolCalls?: any[] | null,
	): void {
		const session = this.sessions.get(token);
		if (!session) return;

		const userTokens = estimateTokenCount(userPrompt);
		const assistantTokens = estimateTokenCount(assistantResponse);

		session.history.push({
			role: "user",
			content: userPrompt,
			tokenEstimate: userTokens,
			timestamp: Date.now(),
		});
		session.history.push({
			role: "assistant",
			content: assistantResponse,
			tokenEstimate: assistantTokens,
			timestamp: Date.now(),
			tool_calls: toolCalls || undefined,
		});

		session.totalTokens += userTokens + assistantTokens;
		session.lastUsedAt = Date.now();
		if (assistantMessageId) {
			session.lastMessageId = assistantMessageId;
		}
	}

	/**
	 * Get the parent message ID for the next request.
	 */
	getParentMessageId(token: string): number | null {
		return this.sessions.get(token)?.lastMessageId || null;
	}

	getContextSummary(token: string): string {
		return this.sessions.get(token)?.contextSummary || "";
	}

	getSessionInfo(token: string): {
		sessionId: string | null;
		requestCount: number;
		totalTokens: number;
		historyMessages: number;
		hasCompressedContext: boolean;
	} {
		const session = this.sessions.get(token);
		if (!session) {
			return {
				sessionId: null,
				requestCount: 0,
				totalTokens: 0,
				historyMessages: 0,
				hasCompressedContext: false,
			};
		}
		return {
			sessionId: session.sessionId,
			requestCount: session.requestCount,
			totalTokens: session.totalTokens,
			historyMessages: session.history.length,
			hasCompressedContext: !!session.contextSummary,
		};
	}

	async resetSession(token: string): Promise<void> {
		const existing = this.sessions.get(token);
		if (existing) {
			dsClient.deleteSession(token, existing.sessionId).catch(() => {});
			this.sessions.delete(token);
		}
		clearRuleFileCache(token);
	}

	async cleanup(): Promise<void> {
		for (const [token, session] of this.sessions) {
			dsClient.deleteSession(token, session.sessionId).catch(() => {});
		}
		this.sessions.clear();
		clearAllRuleFileCache();
	}

	cleanupStale(maxIdleMs = 30 * 60 * 1000): void {
		const now = Date.now();
		for (const [token, session] of this.sessions) {
			if (now - session.lastUsedAt > maxIdleMs) {
				console.log(
					`[session-mgr] Cleaning stale session ${session.sessionId.slice(0, 8)}... (idle ${Math.round((now - session.lastUsedAt) / 60000)}min)`,
				);
				dsClient.deleteSession(token, session.sessionId).catch(() => {});
				this.sessions.delete(token);
				clearRuleFileCache(token);
			}
		}
	}

	private async compressAndRotate(
		token: string,
		existing: ActiveSession,
	): Promise<void> {
		const summary = this.buildCompressedSummary(existing);

		dsClient.deleteSession(token, existing.sessionId).catch(() => {});

		const newSessionId = await dsClient.createSession(token);

		this.sessions.set(token, {
			sessionId: newSessionId,
			token,
			history: [],
			totalTokens: estimateTokenCount(summary),
			createdAt: Date.now(),
			lastUsedAt: Date.now(),
			requestCount: 1,
			contextSummary: summary,
			lastMessageId: null, // Reset ID chain on compression rotation
		});

		console.log(
			`[session-mgr] Compressed ${existing.history.length} messages (${existing.totalTokens} tokens) → summary (${estimateTokenCount(summary)} tokens). New session: ${newSessionId.slice(0, 8)}...`,
		);
	}

	private buildCompressedSummary(session: ActiveSession): string {
		const parts: string[] = [];

		if (session.contextSummary) {
			parts.push(
				"[Previous context summary]\n" +
					this.truncateText(session.contextSummary, 2000),
			);
		}

		if (session.history.length === 0) return parts.join("\n\n");

		const recentCount = Math.min(6, session.history.length);
		const older = session.history.slice(0, -recentCount);
		const recent = session.history.slice(-recentCount);

		if (older.length > 0) {
			const olderSummary = this.summarizeMessages(older);
			if (olderSummary) {
				parts.push(
					`[Conversation history summary — ${older.length} messages, ${session.requestCount} exchanges]\n` +
						olderSummary,
				);
			}
		}

		if (recent.length > 0) {
			const recentText = recent
				.map((m) => {
					const label = m.role.toUpperCase();
					const content = this.truncateText(m.content, 4000);
					return `[${label}]\n${content}`;
				})
				.join("\n\n");
			parts.push("[Recent conversation — keep for context]\n" + recentText);
		}

		return parts.join("\n\n---\n\n");
	}

	private summarizeMessages(messages: HistoryMessage[]): string {
		const topics = new Set<string>();
		const toolCalls: string[] = [];
		const keyDecisions: string[] = [];

		for (const msg of messages) {
			const toolMatches = msg.content.match(
				/<\|DSML\|invoke name="([^"]+)"/g,
			);
			if (toolMatches) {
				for (const m of toolMatches) {
					const name = m.match(/name="([^"]+)"/)?.[1];
					if (name) toolCalls.push(name);
				}
			}

			if (msg.role === "user") {
				const firstLine = msg.content.split("\n")[0]?.trim();
				if (firstLine && firstLine.length < 200) {
					topics.add(firstLine);
				}
			}

			const fileMatches = msg.content.match(
				/(?:\/[\w.-]+)+\.\w+|[\w.-]+\.(?:ts|js|go|py|tsx|jsx|css|html|json)/g,
			);
			if (fileMatches) {
				for (const f of fileMatches.slice(0, 10)) {
					topics.add(`File: ${f}`);
				}
			}
		}

		const parts: string[] = [];

		if (topics.size > 0) {
			const topicList = [...topics].slice(0, 15).join("\n- ");
			parts.push(`Topics discussed:\n- ${topicList}`);
		}

		if (toolCalls.length > 0) {
			const uniqueTools = [...new Set(toolCalls)];
			parts.push(`Tools used: ${uniqueTools.join(", ")}`);
		}

		if (keyDecisions.length > 0) {
			parts.push(`Key decisions:\n- ${keyDecisions.join("\n- ")}`);
		}

		parts.push(
			`Total exchanges: ${Math.ceil(messages.length / 2)}, Total tokens: ~${messages.reduce((s, m) => s + m.tokenEstimate, 0)}`,
		);

		return parts.join("\n");
	}

	private truncateText(text: string, maxLen: number): string {
		if (text.length <= maxLen) return text;
		const truncated = text.slice(0, maxLen);
		const lastNewline = truncated.lastIndexOf("\n");
		const cutPoint = lastNewline > maxLen * 0.5 ? lastNewline : maxLen;
		return truncated.slice(0, cutPoint) + "\n... [truncated]";
	}
}
