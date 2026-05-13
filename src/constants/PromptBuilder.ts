import type {OpenAIChatMessageLike} from "@/types/ServerInternal";
import {buildToolPrompt} from "@/server/ToolSieve";
import {
	BEGIN_SENTENCE,
	SYSTEM_MARKER,
	USER_MARKER,
	ASSISTANT_MARKER,
	TOOL_MARKER,
	END_SENTENCE,
	END_TOOL_RESULTS,
	END_INSTRUCTIONS,
	OUTPUT_INTEGRITY_GUARD,
} from "@/constants/ChatMarkers";

export function normalizeContent(v: unknown): string {
	if (v == null) return "";
	if (typeof v === "string") return v;
	if (Array.isArray(v)) {
		const texts: string[] = [];
		for (const item of v) {
			if (typeof item !== "object" || item === null) continue;
			const obj = item as Record<string, unknown>;
			const typeStr = (typeof obj.type === "string" ? obj.type : "")
				.toLowerCase()
				.trim();
			if (
				typeStr === "text" ||
				typeStr === "output_text" ||
				typeStr === "input_text"
			) {
				const txt =
					typeof obj.text === "string" ? obj.text
					: typeof obj.content === "string" ? obj.content
					: "";
				if (txt) texts.push(txt);
			}
		}
		if (texts.length > 0) return texts.join("\n");
	}
	try {
		return JSON.stringify(v);
	} catch {
		return String(v);
	}
}

export function normalizeRole(role: string | undefined): string {
	const r = (role || "user").toLowerCase().trim();
	if (r === "developer") return "system";
	return r;
}

export function renderPromptCDATA(text: string): string {
	if (!text) return "";
	if (text.includes("]]>")) {
		return "<![CDATA[" + text.replace(/]]>/g, "]]]><![CDATA[>") + "]]>";
	}
	return "<![CDATA[" + text + "]]>";
}

export function formatToolCallsForPrompt(toolCalls: unknown): string {
	if (!Array.isArray(toolCalls) || toolCalls.length === 0) return "";

	const blocks: string[] = [];
	for (const item of toolCalls) {
		if (typeof item !== "object" || item === null) continue;
		const call = item as Record<string, unknown>;

		let name = "";
		let argsRaw: unknown = null;

		const fn = call.function as Record<string, unknown> | undefined;
		if (fn && typeof fn === "object") {
			name = typeof fn.name === "string" ? fn.name.trim() : "";
			argsRaw = fn.arguments ?? fn.input ?? null;
		}
		if (!name) {
			name =
				typeof call.name === "string" ?
					(call.name as string).trim()
				:	"";
			if (!argsRaw) argsRaw = call.arguments ?? call.input ?? null;
		}
		if (!name) continue;

		let args: Record<string, unknown> | null = null;
		if (typeof argsRaw === "string") {
			const trimmed = argsRaw.trim();
			if (trimmed) {
				try {
					args = JSON.parse(trimmed);
				} catch {
					/* keep null */
				}
			}
		} else if (typeof argsRaw === "object" && argsRaw !== null) {
			args = argsRaw as Record<string, unknown>;
		}

		let paramLines = "";
		if (args && typeof args === "object" && !Array.isArray(args)) {
			for (const [k, v] of Object.entries(args)) {
				const valStr =
					typeof v === "object" && v !== null ?
						JSON.stringify(v)
					:	String(v ?? "");
				paramLines += `    <|DSML|parameter name="${k}">${renderPromptCDATA(valStr)}</|DSML|parameter>\n`;
			}
		} else if (typeof argsRaw === "string" && argsRaw.trim()) {
			paramLines = `    <|DSML|parameter name="content">${renderPromptCDATA(argsRaw)}</|DSML|parameter>\n`;
		}

		if (paramLines) {
			blocks.push(
				`  <|DSML|invoke name="${name}">\n${paramLines}  </|DSML|invoke>`,
			);
		} else {
			blocks.push(`  <|DSML|invoke name="${name}"></|DSML|invoke>`);
		}
	}

	if (blocks.length === 0) return "";
	return "<|DSML|tool_calls>\n" + blocks.join("\n") + "\n</|DSML|tool_calls>";
}

interface NormalizedMsg {
	role: string;
	content: string;
}

export function buildPromptText(
	messages: OpenAIChatMessageLike[],
	tools?: unknown[],
): string {
	if (!Array.isArray(messages) || messages.length === 0) return "";

	const toolPrompt = buildToolPrompt(tools || []);

	// ── Step 1: Normalize messages into {role, content} with tool history inline ──
	const normalized: NormalizedMsg[] = [];

	normalized.push({role: "system", content: OUTPUT_INTEGRITY_GUARD});
	let systemInjected = false;

	for (const msg of messages) {
		const role = normalizeRole(msg.role);
		let content = normalizeContent(msg.content);

		if (role === "assistant") {
			const toolHistory = formatToolCallsForPrompt(msg.tool_calls);
			if (toolHistory) {
				content =
					content ? content + "\n\n" + toolHistory : toolHistory;
			}
		} else if (role === "system") {
			if (toolPrompt && !systemInjected) {
				content = content ? content + "\n\n" + toolPrompt : toolPrompt;
				systemInjected = true;
			}
		} else if (role === "tool") {
			if (!content.trim()) content = "null";
		}

		normalized.push({role, content});
	}

	if (toolPrompt && !systemInjected) {
		normalized.splice(1, 0, {role: "system", content: toolPrompt});
	}

	// ── Step 2: Merge consecutive same-role messages ──
	const merged: NormalizedMsg[] = [];
	for (const msg of normalized) {
		if (merged.length > 0 && merged[merged.length - 1].role === msg.role) {
			merged[merged.length - 1].content += "\n\n" + msg.content;
		} else {
			merged.push({...msg});
		}
	}

	// ── Step 3: Render with DeepSeek chat template markers ──
	const parts: string[] = [BEGIN_SENTENCE];
	let lastRole = "";

	for (const msg of merged) {
		lastRole = msg.role;
		switch (msg.role) {
			case "system": {
				const text = msg.content.trim();
				if (text) {
					parts.push(SYSTEM_MARKER + text + END_INSTRUCTIONS);
				}
				break;
			}
			case "user":
				parts.push(USER_MARKER + msg.content);
				break;
			case "assistant":
				parts.push(ASSISTANT_MARKER + msg.content + END_SENTENCE);
				break;
			case "tool": {
				const text = msg.content.trim();
				if (text) {
					parts.push(TOOL_MARKER + text + END_TOOL_RESULTS);
				}
				break;
			}
			default: {
				const text = msg.content.trim();
				if (text) parts.push(text);
				break;
			}
		}
	}

	if (lastRole !== "assistant") {
		parts.push(ASSISTANT_MARKER);
	}

	return parts.join("");
}

export function extractSystemAndUserMessages(
	messages: OpenAIChatMessageLike[],
): {systemMessages: string[]; conversationMessages: OpenAIChatMessageLike[]} {
	const systemMessages: string[] = [];
	const conversationMessages: OpenAIChatMessageLike[] = [];

	for (const msg of messages) {
		const role = normalizeRole(msg.role);
		const content = normalizeContent(msg.content);
		if (role === "system" || role === "developer") {
			if (content.trim()) {
				systemMessages.push(content);
			}
		} else {
			conversationMessages.push(msg);
		}
	}

	return {systemMessages, conversationMessages};
}

export function buildUserOnlyPromptText(
	messages: OpenAIChatMessageLike[],
): string {
	if (!Array.isArray(messages) || messages.length === 0) return "";

	const normalized: NormalizedMsg[] = [];

	for (const msg of messages) {
		const role = normalizeRole(msg.role);
		let content = normalizeContent(msg.content);

		if (role === "assistant") {
			const toolHistory = formatToolCallsForPrompt(msg.tool_calls);
			if (toolHistory) {
				content =
					content ? content + "\n\n" + toolHistory : toolHistory;
			}
		} else if (role === "tool") {
			if (!content.trim()) content = "null";
		}

		normalized.push({role, content});
	}

	const merged: NormalizedMsg[] = [];
	for (const msg of normalized) {
		if (merged.length > 0 && merged[merged.length - 1].role === msg.role) {
			merged[merged.length - 1].content += "\n\n" + msg.content;
		} else {
			merged.push({...msg});
		}
	}

	const parts: string[] = [BEGIN_SENTENCE];
	let lastRole = "";

	for (const msg of merged) {
		lastRole = msg.role;
		switch (msg.role) {
			case "user":
				parts.push(USER_MARKER + msg.content);
				break;
			case "assistant":
				parts.push(ASSISTANT_MARKER + msg.content + END_SENTENCE);
				break;
			case "tool": {
				const text = msg.content.trim();
				if (text) {
					parts.push(TOOL_MARKER + text + END_TOOL_RESULTS);
				}
				break;
			}
			default: {
				const text = msg.content.trim();
				if (text) parts.push(text);
				break;
			}
		}
	}

	if (lastRole !== "assistant") {
		parts.push(ASSISTANT_MARKER);
	}

	return parts.join("");
}
