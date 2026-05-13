import {randomUUID} from "node:crypto";
import {ParsedToolCall} from "@/types/ToolCall";
import {normalizeParsedToolCallsForSchemas} from "./ToolSchema";

export function formatOpenAIToolCalls(
	calls: ParsedToolCall[],
	toolsRaw: any,
): any[] {
	const normalized = normalizeParsedToolCallsForSchemas(calls, toolsRaw);
	return normalized.map((c) => ({
		id: "call_" + randomUUID().replace(/-/g, ""),
		type: "function",
		function: {
			name: c.Name,
			arguments: JSON.stringify(c.Input),
		},
	}));
}

export function formatOpenAIStreamToolCalls(
	calls: ParsedToolCall[],
	toolsRaw: any,
): any[] {
	const normalized = normalizeParsedToolCallsForSchemas(calls, toolsRaw);
	return normalized.map((c, i) => ({
		index: i,
		id: "call_" + randomUUID().replace(/-/g, ""),
		type: "function",
		function: {
			name: c.Name,
			arguments: JSON.stringify(c.Input),
		},
	}));
}
