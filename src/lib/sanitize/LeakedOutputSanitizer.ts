import {
	findToolMarkupTagOutsideIgnored,
	findMatchingToolMarkupClose,
} from "@/lib/toolcall/ToolScanner";

const emptyJSONFencePattern = /```json\s*```/gis;
const leakedToolCallArrayPattern =
	/\[\{\s*"function"\s*:\s*\{[\s\S]*?\}\s*,\s*"id"\s*:\s*"call[^"]*"\s*,\s*"type"\s*:\s*"function"\s*\}\]/gis;
const leakedToolResultBlobPattern =
	/<\s*\|\s*tool\s*\|\s*>\s*\{[\s\S]*?"tool_call_id"\s*:\s*"call[^"]*"\s*\}/gis;

const leakedThinkTagPattern = /<\/?\s*think\s*>/gis;

const leakedBOSMarkerPattern =
	/<[|\uFF5C]\s*begin[_\u2581]of[_\u2581]sentence\s*[|\uFF5C]>/gi;

const leakedThoughtMarkerPattern =
	/<[|\uFF5C]\s*(?:begin[_\u2581])?[_\u2581]*of[_\u2581]thought\s*[|\uFF5C]>/gi;

const leakedMetaMarkerPattern =
	/<[|\uFF5C]\s*(?:assistant|tool|end[_\u2581]of[_\u2581]sentence|end[_\u2581]of[_\u2581]thinking|end[_\u2581]of[_\u2581]thought|end[_\u2581]of[_\u2581]toolresults|end[_\u2581]of[_\u2581]instructions)\s*[|\uFF5C]>/gi;

const leakedAgentXMLBlockPatterns = [
	/(<attempt_completion\b[^>]*>)([\s\S]*?)(<\/attempt_completion>)/gis,
	/(<ask_followup_question\b[^>]*>)([\s\S]*?)(<\/ask_followup_question>)/gis,
	/(<new_task\b[^>]*>)([\s\S]*?)(<\/new_task>)/gis,
];

const leakedAgentWrapperTagPattern =
	/<\/?(?:attempt_completion|ask_followup_question|new_task)\b[^>]*>/gis;
const leakedAgentWrapperPlusResultOpenPattern =
	/<(?:attempt_completion|ask_followup_question|new_task)\b[^>]*>\s*<result>/gis;
const leakedAgentResultPlusWrapperClosePattern =
	/<\/result>\s*<\/(?:attempt_completion|ask_followup_question|new_task)\b[^>]*>/gis;
const leakedAgentResultTagPattern = /<\/?result>/gis;

export function sanitizeLeakedOutput(text: string): string {
	if (!text) return text;

	let out = text;
	out = out.replace(emptyJSONFencePattern, "");
	out = out.replace(leakedToolCallArrayPattern, "");
	out = out.replace(leakedToolResultBlobPattern, "");
	out = stripDanglingThinkSuffix(out);
	out = out.replace(leakedThinkTagPattern, "");
	out = out.replace(leakedBOSMarkerPattern, "");
	out = out.replace(leakedThoughtMarkerPattern, "");
	out = out.replace(leakedMetaMarkerPattern, "");
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

	for (const pattern of leakedAgentXMLBlockPatterns) {
		pattern.lastIndex = 0;
		out = out.replace(pattern, (_match, _open, inner, _close) => {
			return inner.replace(leakedAgentResultTagPattern, "");
		});
	}

	leakedAgentWrapperTagPattern.lastIndex = 0;
	if (leakedAgentWrapperTagPattern.test(out)) {
		leakedAgentWrapperPlusResultOpenPattern.lastIndex = 0;
		out = out.replace(leakedAgentWrapperPlusResultOpenPattern, (match) => {
			leakedAgentResultTagPattern.lastIndex = 0;
			return match.replace(leakedAgentResultTagPattern, "");
		});

		leakedAgentResultPlusWrapperClosePattern.lastIndex = 0;
		out = out.replace(leakedAgentResultPlusWrapperClosePattern, (match) => {
			leakedAgentResultTagPattern.lastIndex = 0;
			return match.replace(leakedAgentResultTagPattern, "");
		});

		leakedAgentWrapperTagPattern.lastIndex = 0;
		out = out.replace(leakedAgentWrapperTagPattern, "");
	}

	return out;
}
