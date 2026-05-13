import crypto from "node:crypto";

import {
	TOOL_CALL_INSTRUCTIONS,
	READ_TOOL_CACHE_GUARD,
	buildCorrectToolExamples,
	hasReadLikeTool,
} from "@/constants";

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
	const results: any[] = [];
	const invokeRegex =
		/<\|DSML\|invoke\s+name="([^"]+)">([\s\S]*?)<\/\|DSML\|invoke>/g;
	const paramRegex =
		/<\|DSML\|parameter\s+name="([^"]+)">([\s\S]*?)<\/\|DSML\|parameter>/g;
	const cdataRegex = /^\s*<!\[CDATA\[([\s\S]*?)\]\]>\s*$/;

	let match;
	while ((match = invokeRegex.exec(xmlContent)) !== null) {
		const name = match[1];
		const paramsStr = match[2];
		const args: Record<string, any> = {};

		let paramMatch;
		while ((paramMatch = paramRegex.exec(paramsStr)) !== null) {
			const pName = paramMatch[1];
			let pValue = paramMatch[2].trim();

			const cdataMatch = pValue.match(cdataRegex);
			if (cdataMatch) {
				pValue = cdataMatch[1];
			} else {
				// if no CDATA, it might be a nested XML item or plain text, just try to decode it.
				// In this simple implementation, we fall back to string parsing or attempt simple object deserialization if needed.
				// Copilot tool calls usually accept strings for arguments and parse it themselves.
			}
			args[pName] = pValue;
		}

		results.push({
			id: `call_${crypto.randomUUID().replace(/-/g, "")}`,
			type: "function",
			function: {
				name,
				arguments: JSON.stringify(args),
			},
		});
	}

	return results;
}

export class StreamToolSieve {
	private buffer: string = "";
	private inTool: boolean = false;
	private finishedTool: boolean = false;

	public processChunk(text: string): {
		outputText: string;
		toolCalls: any[] | null;
	} {
		if (this.finishedTool) return {outputText: text, toolCalls: null};

		this.buffer += text;

		const toolStartIdx = this.buffer.indexOf("<|DSML|tool_calls>");
		if (toolStartIdx !== -1) {
			this.inTool = true;
			const toolEndIdx = this.buffer.indexOf("</|DSML|tool_calls>");
			if (toolEndIdx !== -1) {
				const fullXml = this.buffer.substring(
					toolStartIdx,
					toolEndIdx + "</|DSML|tool_calls>".length,
				);
				this.finishedTool = true;

				const preText = this.buffer.substring(0, toolStartIdx);
				const postText = this.buffer.substring(
					toolEndIdx + "</|DSML|tool_calls>".length,
				);

				const toolCalls = parseDSMLToolCalls(fullXml);

				this.buffer = postText;

				return {
					outputText: preText,
					toolCalls: toolCalls.length > 0 ? toolCalls : null,
				};
			}

			if (toolStartIdx > 0) {
				const preText = this.buffer.substring(0, toolStartIdx);
				this.buffer = this.buffer.substring(toolStartIdx);
				return {outputText: preText, toolCalls: null};
			}
			return {outputText: "", toolCalls: null};
		}

		const lastLt = this.buffer.lastIndexOf("<");
		if (lastLt !== -1) {
			const safeText = this.buffer.substring(0, lastLt);
			this.buffer = this.buffer.substring(lastLt);
			return {outputText: safeText, toolCalls: null};
		}

		const safeText = this.buffer;
		this.buffer = "";
		return {outputText: safeText, toolCalls: null};
	}

	public flush(): {outputText: string; toolCalls: any[] | null} {
		if (this.inTool && this.buffer.includes("<|DSML|tool_calls>")) {
			const fullXml = this.buffer + "</|DSML|invoke></|DSML|tool_calls>";
			const toolCalls = parseDSMLToolCalls(fullXml);
			const preText = this.buffer.substring(
				0,
				this.buffer.indexOf("<|DSML|tool_calls>"),
			);
			return {
				outputText: preText,
				toolCalls: toolCalls.length > 0 ? toolCalls : null,
			};
		}

		const remainder = this.buffer;
		this.buffer = "";
		return {outputText: remainder, toolCalls: null};
	}
}
