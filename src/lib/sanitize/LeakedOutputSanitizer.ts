import {
	findToolMarkupTagOutsideIgnored,
	findMatchingToolMarkupClose,
} from "@/lib/toolcall/ToolScanner";

import {
	EMPTY_JSON_FENCE_PATTERN,
	LEAKED_TOOL_CALL_ARRAY_PATTERN,
	LEAKED_TOOL_RESULT_BLOB_PATTERN,
	LEAKED_THINK_TAG_PATTERN,
	LEAKED_BOS_MARKER_PATTERN,
	LEAKED_THOUGHT_MARKER_PATTERN,
	LEAKED_META_MARKER_PATTERN,
	LEAKED_AGENT_XML_BLOCK_PATTERNS,
	LEAKED_AGENT_WRAPPER_TAG_PATTERN,
	LEAKED_AGENT_WRAPPER_PLUS_RESULT_OPEN_PATTERN,
	LEAKED_AGENT_RESULT_PLUS_WRAPPER_CLOSE_PATTERN,
	LEAKED_AGENT_RESULT_TAG_PATTERN,
} from "@/constants";

export function sanitizeLeakedOutput(text: string): string {
	if (!text) return text;

	let out = text;
	out = out.replace(EMPTY_JSON_FENCE_PATTERN, "");
	out = out.replace(LEAKED_TOOL_CALL_ARRAY_PATTERN, "");
	out = out.replace(LEAKED_TOOL_RESULT_BLOB_PATTERN, "");
	out = stripDanglingThinkSuffix(out);
	out = out.replace(LEAKED_THINK_TAG_PATTERN, "");
	out = out.replace(LEAKED_BOS_MARKER_PATTERN, "");
	out = out.replace(LEAKED_THOUGHT_MARKER_PATTERN, "");
	out = out.replace(LEAKED_META_MARKER_PATTERN, "");
	out = stripLeakedToolCallWrapperBlocks(out);
	out = sanitizeLeakedAgentXMLBlocks(out);
	return out;
}

function stripDanglingThinkSuffix(text: string): string {
	const thinkTag = /<\/?\s*think\s*>/gi;
	const matches: Array<{index: number; match: string}> = [];
	let m: RegExpExecArray | null;
	while ((m = thinkTag.exec(text)) !== null) {
		matches.push({index: m.index, match: m[0]});
	}
	if (matches.length === 0) return text;

	let depth = 0;
	let lastOpen = -1;

	for (const {index, match} of matches) {
		const compact = match.replace(/\s/g, "").toLowerCase();
		if (compact.startsWith("</")) {
			if (depth > 0) {
				depth--;
				if (depth === 0) lastOpen = -1;
			}
			continue;
		}
		if (depth === 0) lastOpen = index;
		depth++;
	}

	if (depth === 0 || lastOpen < 0) return text;
	const prefix = text.slice(0, lastOpen);
	if (!prefix.trim()) return "";
	return prefix;
}

function stripLeakedToolCallWrapperBlocks(text: string): string {
	if (!text) return text;

	let out = "";
	let pos = 0;

	while (pos < text.length) {
		const tag = findToolMarkupTagOutsideIgnored(text, pos);
		if (!tag) {
			out += text.slice(pos);
			break;
		}
		if (tag.Start > pos) {
			out += text.slice(pos, tag.Start);
		}
		if (tag.Closing || tag.Name !== "tool_calls") {
			out += text.slice(tag.Start, tag.End + 1);
			pos = tag.End + 1;
			continue;
		}
		const closeTag = findMatchingToolMarkupClose(text, tag);
		if (!closeTag) {
			out += text.slice(tag.Start, tag.End + 1);
			pos = tag.End + 1;
			continue;
		}
		pos = closeTag.End + 1;
	}
	return out;
}

function sanitizeLeakedAgentXMLBlocks(text: string): string {
	let out = text;

	for (const pattern of LEAKED_AGENT_XML_BLOCK_PATTERNS) {
		pattern.lastIndex = 0;
		out = out.replace(pattern, (_match, _open, inner, _close) => {
			return inner.replace(LEAKED_AGENT_RESULT_TAG_PATTERN, "");
		});
	}

	LEAKED_AGENT_WRAPPER_TAG_PATTERN.lastIndex = 0;
	if (LEAKED_AGENT_WRAPPER_TAG_PATTERN.test(out)) {
		LEAKED_AGENT_WRAPPER_PLUS_RESULT_OPEN_PATTERN.lastIndex = 0;
		out = out.replace(
			LEAKED_AGENT_WRAPPER_PLUS_RESULT_OPEN_PATTERN,
			(match) => {
				LEAKED_AGENT_RESULT_TAG_PATTERN.lastIndex = 0;
				return match.replace(LEAKED_AGENT_RESULT_TAG_PATTERN, "");
			},
		);

		LEAKED_AGENT_RESULT_PLUS_WRAPPER_CLOSE_PATTERN.lastIndex = 0;
		out = out.replace(
			LEAKED_AGENT_RESULT_PLUS_WRAPPER_CLOSE_PATTERN,
			(match) => {
				LEAKED_AGENT_RESULT_TAG_PATTERN.lastIndex = 0;
				return match.replace(LEAKED_AGENT_RESULT_TAG_PATTERN, "");
			},
		);

		LEAKED_AGENT_WRAPPER_TAG_PATTERN.lastIndex = 0;
		out = out.replace(LEAKED_AGENT_WRAPPER_TAG_PATTERN, "");
	}

	return out;
}
