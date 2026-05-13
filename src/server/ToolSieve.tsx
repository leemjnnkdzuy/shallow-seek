import crypto from "node:crypto";

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
		toolSchemas.push(`Tool: ${name}\nDescription: ${desc}\nParameters: ${parameters}`);
	}

	if (names.length === 0) return "";

	const descriptions = "You have access to these tools:\n\n" + toolSchemas.join("\n\n");

	const instructions = `TOOL CALL FORMAT — FOLLOW EXACTLY:

<|DSML|tool_calls>
  <|DSML|invoke name="TOOL_NAME_HERE">
    <|DSML|parameter name="PARAMETER_NAME"><![CDATA[PARAMETER_VALUE]]></|DSML|parameter>
  </|DSML|invoke>
</|DSML|tool_calls>

RULES:
1) Use the <|DSML|tool_calls> wrapper format.
2) Put one or more <|DSML|invoke> entries under a single <|DSML|tool_calls> root.
3) Put the tool name in the invoke name attribute: <|DSML|invoke name="TOOL_NAME">.
4) All string values must use <![CDATA[...]]>, even short ones.
5) Every top-level argument must be a <|DSML|parameter name="ARG_NAME">...</|DSML|parameter> node.
6) Objects use nested XML elements inside the parameter body. Arrays may repeat <item> children.
7) Numbers, booleans, and null stay plain text.
8) Use only the parameter names in the tool schema. Do not invent fields.
9) If you call a tool, the first non-whitespace characters of that tool block must be exactly <|DSML|tool_calls>.
10) Do NOT wrap XML in markdown fences.

PARAMETER SHAPES:
- string => <|DSML|parameter name="x"><![CDATA[value]]></|DSML|parameter>
- object => <|DSML|parameter name="x"><field>...</field></|DSML|parameter>
- array => <|DSML|parameter name="x"><item>...</item><item>...</item></|DSML|parameter>
- number/bool/null => <|DSML|parameter name="x">plain_text</|DSML|parameter>

Remember: The ONLY valid way to use tools is the <|DSML|tool_calls>...</|DSML|tool_calls> block at the end of your response.`;

	return descriptions + "\n\n" + instructions;
}

export function parseDSMLToolCalls(xmlContent: string): any[] {
	const results: any[] = [];
	const invokeRegex = /<\|DSML\|invoke\s+name="([^"]+)">([\s\S]*?)<\/\|DSML\|invoke>/g;
	const paramRegex = /<\|DSML\|parameter\s+name="([^"]+)">([\s\S]*?)<\/\|DSML\|parameter>/g;
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

			// Strip CDATA if present
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
				arguments: JSON.stringify(args)
			}
		});
	}

	return results;
}

export class StreamToolSieve {
	private buffer: string = "";
	private inTool: boolean = false;
	private finishedTool: boolean = false;

	public processChunk(text: string): { outputText: string; toolCalls: any[] | null } {
		if (this.finishedTool) return { outputText: text, toolCalls: null };

		this.buffer += text;

		// Check if we entered a tool wrapper
		const toolStartIdx = this.buffer.indexOf("<|DSML|tool_calls>");
		if (toolStartIdx !== -1) {
			this.inTool = true;

			// Did it also close?
			const toolEndIdx = this.buffer.indexOf("</|DSML|tool_calls>");
			if (toolEndIdx !== -1) {
				const fullXml = this.buffer.substring(toolStartIdx, toolEndIdx + "</|DSML|tool_calls>".length);
				this.finishedTool = true;
				
				const preText = this.buffer.substring(0, toolStartIdx);
				const postText = this.buffer.substring(toolEndIdx + "</|DSML|tool_calls>".length);
				
				const toolCalls = parseDSMLToolCalls(fullXml);
				
				this.buffer = postText; // keep remaining text for future (though unlikely)
				
				return { outputText: preText, toolCalls: toolCalls.length > 0 ? toolCalls : null };
			}

			// We are inside the wrapper, buffering. Return the preText if any, then output nothing until it closes.
			if (toolStartIdx > 0) {
				const preText = this.buffer.substring(0, toolStartIdx);
				this.buffer = this.buffer.substring(toolStartIdx);
				return { outputText: preText, toolCalls: null };
			}
			return { outputText: "", toolCalls: null };
		}

		// Not in tool wrapper yet. But we might be mid-way through the tag `<|DSM`
		// We should safely emit up to the last `<` if we don't have `<|DSML|tool_calls>`
		const lastLt = this.buffer.lastIndexOf("<");
		if (lastLt !== -1) {
			const safeText = this.buffer.substring(0, lastLt);
			this.buffer = this.buffer.substring(lastLt);
			return { outputText: safeText, toolCalls: null };
		}

		// Fully safe to emit
		const safeText = this.buffer;
		this.buffer = "";
		return { outputText: safeText, toolCalls: null };
	}

	public flush(): { outputText: string; toolCalls: any[] | null } {
		// If stream ends while inTool but we never saw </|DSML|tool_calls>, try to salvage what we have
		if (this.inTool && this.buffer.includes("<|DSML|tool_calls>")) {
			const fullXml = this.buffer + "</|DSML|invoke></|DSML|tool_calls>"; // auto-close
			const toolCalls = parseDSMLToolCalls(fullXml);
			const preText = this.buffer.substring(0, this.buffer.indexOf("<|DSML|tool_calls>"));
			return { outputText: preText, toolCalls: toolCalls.length > 0 ? toolCalls : null };
		}
		
		const remainder = this.buffer;
		this.buffer = "";
		return { outputText: remainder, toolCalls: null };
	}
}
