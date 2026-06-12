import {OpenAIChatMessageLike} from "@/types/ServerInternal";
import {uploadTextFile} from "@/server/RuleFileUploader";
import {MEMORY_FILENAME} from "@/constants/RuleUploader";

export function buildContextMemoryText(
	messages: OpenAIChatMessageLike[],
	sessionId: string,
): string {
	const parts: string[] = [];
	parts.push(`# ShallowSeek Context Memory`);
	parts.push("");
	parts.push(`*Active Session:* \`${sessionId}\``);
	parts.push(`*Generated At:* ${new Date().toISOString()}`);
	parts.push("");

	// 1. Extract Goal / Task description
	let goal = "Not specified.";
	for (const msg of messages) {
		if (msg.role === "user") {
			const content =
				typeof msg.content === "string"
					? msg.content
					: JSON.stringify(msg.content);
			if (content.trim()) {
				const lines = content
					.split("\n")
					.map((l) => l.trim())
					.filter(Boolean);
				if (lines.length > 0) {
					goal = lines.slice(0, 3).join("\n");
					break;
				}
			}
		}
	}
	parts.push(`## 🎯 Primary Goal`);
	parts.push(goal);
	parts.push("");

	// 2. Extract Files list
	const filesMentioned = new Set<string>();
	const filePattern =
		/(?:\/[\w.-]+)+\.\w+|[\w.-]+\.(?:ts|js|go|py|tsx|jsx|css|html|json|md|sh)/g;
	for (const msg of messages) {
		const content =
			typeof msg.content === "string"
				? msg.content
				: JSON.stringify(msg.content);
		const matches = content.match(filePattern);
		if (matches) {
			for (const m of matches) {
				filesMentioned.add(m);
			}
		}
	}
	if (filesMentioned.size > 0) {
		parts.push(`## 📁 Files Involved`);
		for (const file of filesMentioned) {
			parts.push(`- \`${file}\``);
		}
		parts.push("");
	}

	// 3. Chronological History & Timeline
	parts.push(`## ⏱️ Execution Timeline & Steps`);
	parts.push("");

	let stepNum = 1;
	for (const msg of messages) {
		const role = msg.role;
		const content =
			typeof msg.content === "string"
				? msg.content
				: JSON.stringify(msg.content);
		if (role === "system" || role === "developer") {
			continue; // Skip system messages to save context in the memory file
		}

		if (role === "user") {
			parts.push(`### Step ${stepNum++}: User Request`);
			parts.push(content);
			parts.push("");
		} else if (role === "assistant") {
			parts.push(`### Step ${stepNum++}: Assistant Action`);
			// Handle custom thinking/reasoning if present
			const msgWithReasoning = msg as Record<string, unknown>;
			if (msgWithReasoning.reasoning_content && typeof msgWithReasoning.reasoning_content === "string") {
				parts.push(`#### Reasoning:`);
				parts.push(msgWithReasoning.reasoning_content);
				parts.push("");
			}
			if (content && content.trim() && content !== "(response recorded)") {
				parts.push(`#### Response:`);
				parts.push(content);
				parts.push("");
			}
			if (
				msg.tool_calls &&
				Array.isArray(msg.tool_calls) &&
				msg.tool_calls.length > 0
			) {
				parts.push(`#### Called Tools:`);
				for (const tc of msg.tool_calls) {
					const fnName = tc.function?.name || (tc as unknown as Record<string, unknown>).name || "unknown";
					const fnArgs = tc.function?.arguments || (tc as unknown as Record<string, unknown>).arguments || "{}";
					parts.push(`- **Tool:** \`${fnName}\``);
					parts.push(`  **Arguments:** \`${fnArgs}\``);
				}
				parts.push("");
			}
		} else if (role === "tool") {
			const msgWithId = msg as Record<string, unknown>;
			const toolId = msgWithId.tool_call_id || msgWithId.name || "unknown";
			parts.push(
				`### Step ${stepNum++}: Tool Execution Result (ID: \`${toolId}\`)`,
			);
			const maxLines = 150;
			const lines = content.split("\n");
			if (lines.length > maxLines) {
				const startLines = lines.slice(0, 50).join("\n");
				const endLines = lines.slice(-50).join("\n");
				parts.push("```");
				parts.push(startLines);
				parts.push(
					`\n... [TRUNCATED ${lines.length - 100} LINES OF TOOL OUTPUT] ...\n`,
				);
				parts.push(endLines);
				parts.push("```");
			} else {
				parts.push("```");
				parts.push(content);
				parts.push("```");
			}
			parts.push("");
		}
	}

	return parts.join("\n");
}

export async function uploadContextMemory(
	token: string,
	messages: OpenAIChatMessageLike[],
	sessionId: string,
	port: number,
): Promise<string> {
	const memoryText = buildContextMemoryText(messages, sessionId);
	return await uploadTextFile(token, MEMORY_FILENAME, memoryText, port);
}
