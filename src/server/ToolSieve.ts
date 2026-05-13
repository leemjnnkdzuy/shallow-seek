import crypto from "node:crypto";
import {
	TOOL_CALL_INSTRUCTIONS,
	READ_TOOL_CACHE_GUARD,
	buildCorrectToolExamples,
	hasReadLikeTool,
} from "@/constants";
import {
	StreamToolSieve as NewSieve,
	parseToolCalls as newParseToolCalls,
} from "@/lib/toolsieve";

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

	let fullPrompt = descriptions + "\n\n" + TOOL_CALL_INSTRUCTIONS;

	const examples = buildCorrectToolExamples(names);
	if (examples) {
		fullPrompt += "\n\n" + examples;
	}

	if (hasReadLikeTool(names)) {
		fullPrompt += "\n\n" + READ_TOOL_CACHE_GUARD;
	}

	return fullPrompt;
}

export function parseDSMLToolCalls(xmlContent: string): any[] {
	const result = newParseToolCalls(xmlContent);
	return result.calls.map((c) => ({
		id: `call_${crypto.randomUUID().replace(/-/g, "")}`,
		type: "function",
		function: {
			name: c.name,
			arguments: JSON.stringify(c.input),
		},
	}));
}

export class StreamToolSieve {
	private sieve: NewSieve;

	constructor() {
		this.sieve = new NewSieve();
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
				const formatted = ev.calls.map((c) => ({
					id: `call_${crypto.randomUUID().replace(/-/g, "")}`,
					type: "function",
					function: {
						name: c.name,
						arguments: JSON.stringify(c.input),
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
				const formatted = ev.calls.map((c) => ({
					id: `call_${crypto.randomUUID().replace(/-/g, "")}`,
					type: "function",
					function: {
						name: c.name,
						arguments: JSON.stringify(c.input),
					},
				}));
				toolCalls = [...(toolCalls || []), ...formatted];
			}
		}

		return {outputText, toolCalls};
	}
}
