import crypto from "node:crypto";
import {
	buildToolCallInstructions,
	hasReadLikeTool,
} from "@/lib/toolcall/ToolPrompt";
import {normalizeParsedToolCallsForSchemas} from "@/lib/toolcall/ToolSchema";
import {READ_TOOL_CACHE_GUARD} from "@/constants";
import {
	StreamToolSieve as NewSieve,
	parseToolCalls as newParseToolCalls,
} from "@/lib/toolsieve";
import {ParsedToolCall} from "@/types/ToolCall";

export function buildToolPrompt(tools: any[]): string {
	if (!tools || tools.length === 0) return "";

	const toolSchemas: string[] = [];
	const names: string[] = [];

	for (const t of tools) {
		if (t.type !== "function" || !t.function) continue;
		const name = t.function.name;
		const desc = t.function.description || "No description available";
		const parameters = JSON.stringify(t.function.parameters || {});
		names.push(name);
		toolSchemas.push(
			`Tool: ${name}\nDescription: ${desc}\nParameters: ${parameters}`,
		);
	}

	if (names.length === 0) return "";

	const descriptions =
		"You have access to these tools:\n\n" + toolSchemas.join("\n\n");

	let fullPrompt = descriptions + "\n\n" + buildToolCallInstructions(names);

	if (hasReadLikeTool(names)) {
		fullPrompt += "\n\n" + READ_TOOL_CACHE_GUARD;
	}

	return fullPrompt;
}

export function parseDSMLToolCalls(xmlContent: string, tools?: any[]): any[] {
	const result = newParseToolCalls(xmlContent);
	let calls = result.calls.map((c) => ({
		Name: c.name,
		Input: c.input,
	}));

	if (tools && tools.length > 0) {
		calls = normalizeParsedToolCallsForSchemas(calls, tools);
	}

	return calls.map((c) => ({
		id: `call_${crypto.randomUUID().replace(/-/g, "")}`,
		type: "function",
		function: {
			name: c.Name,
			arguments: JSON.stringify(c.Input),
		},
	}));
}

export class StreamToolSieve {
	private sieve: NewSieve;
	private tools?: any[];

	constructor(tools?: any[]) {
		this.sieve = new NewSieve();
		this.tools = tools;
	}

	public processChunk(text: string): {
		outputText: string;
		toolCalls: any[] | null;
	} {
		const events = this.sieve.processChunk(text);
		let outputText = "";
		let toolCalls: any[] | null = null;

		for (const ev of events) {
			if (ev.type === "text" && ev.text) {
				outputText += ev.text;
			} else if (ev.type === "tool_calls" && ev.calls) {
				let callsToNormalize: ParsedToolCall[] = ev.calls.map((c) => ({
					Name: c.name,
					Input: c.input,
				}));

				if (this.tools && this.tools.length > 0) {
					callsToNormalize = normalizeParsedToolCallsForSchemas(
						callsToNormalize,
						this.tools,
					);
				}

				const formatted = callsToNormalize.map((c) => ({
					id: `call_${crypto.randomUUID().replace(/-/g, "")}`,
					type: "function",
					function: {
						name: c.Name,
						arguments: JSON.stringify(c.Input),
					},
				}));
				toolCalls = [...(toolCalls || []), ...formatted];
			}
		}

		return {outputText, toolCalls};
	}

	public flush(): {outputText: string; toolCalls: any[] | null} {
		const events = this.sieve.flush();
		let outputText = "";
		let toolCalls: any[] | null = null;

		for (const ev of events) {
			if (ev.type === "text" && ev.text) {
				outputText += ev.text;
			} else if (ev.type === "tool_calls" && ev.calls) {
				let callsToNormalize: ParsedToolCall[] = ev.calls.map((c) => ({
					Name: c.name,
					Input: c.input,
				}));

				if (this.tools && this.tools.length > 0) {
					callsToNormalize = normalizeParsedToolCallsForSchemas(
						callsToNormalize,
						this.tools,
					);
				}

				const formatted = callsToNormalize.map((c) => ({
					id: `call_${crypto.randomUUID().replace(/-/g, "")}`,
					type: "function",
					function: {
						name: c.Name,
						arguments: JSON.stringify(c.Input),
					},
				}));
				toolCalls = [...(toolCalls || []), ...formatted];
			}
		}

		return {outputText, toolCalls};
	}
}
