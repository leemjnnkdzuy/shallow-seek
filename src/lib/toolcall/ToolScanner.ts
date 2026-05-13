import {
	skipToolMarkupIgnorables,
	xmlTagStartDelimiterLenAt,
	xmlTagEndDelimiterLenAt,
	consumeToolMarkupClosingSlash,
	consumeToolKeyword,
} from "./ToolCandidateDetector";
import {ToolMarkupTag} from "@/types/ToolCall";
import {skipXMLIgnoredSection} from "./ToolCandidateDetector";

import {TOOL_MARKUP_NAMES} from "@/constants";

export function containsToolMarkupSyntaxOutsideIgnored(text: string): {
	hasDSML: boolean;
	hasCanonical: boolean;
} {
	let hasDSML = false;
	let hasCanonical = false;

	for (let i = 0; i < text.length; ) {
		const {next, advanced, blocked} = skipXMLIgnoredSection(text, i);
		if (blocked) break;
		if (advanced) {
			i = next;
			continue;
		}
		const codeEnd = markdownCodeSpanEnd(text, i);
		if (codeEnd !== -1) {
			i = codeEnd;
			continue;
		}

		const tag = scanToolMarkupTagAt(text, i);
		if (tag) {
			if (tag.DSMLLike) hasDSML = true;
			else hasCanonical = true;
			if (hasDSML && hasCanonical)
				return {hasDSML: true, hasCanonical: true};
			i = tag.End + 1;
			continue;
		}
		i++;
	}
	return {hasDSML, hasCanonical};
}

export function findToolMarkupTagOutsideIgnored(
	text: string,
	start: number,
): ToolMarkupTag | null {
	for (let i = Math.max(start, 0); i < text.length; ) {
		const {next, advanced, blocked} = skipXMLIgnoredSection(text, i);
		if (blocked) break;
		if (advanced) {
			i = next;
			continue;
		}
		const codeEnd = markdownCodeSpanEnd(text, i);
		if (codeEnd !== -1) {
			i = codeEnd;
			continue;
		}

		const tag = scanToolMarkupTagAt(text, i);
		if (tag) return tag;
		i++;
	}
	return null;
}

export function findMatchingToolMarkupClose(
	text: string,
	open: ToolMarkupTag,
): ToolMarkupTag | null {
	if (!text || !open.Name || open.Closing || open.End >= text.length)
		return null;
	let depth = 1;
	let pos = open.End + 1;
	while (pos < text.length) {
		const tag = findToolMarkupTagOutsideIgnored(text, pos);
		if (!tag) return null;
		if (tag.Name !== open.Name) {
			pos = tag.End + 1;
			continue;
		}
		if (tag.Closing) {
			depth--;
			if (depth === 0) return tag;
		} else if (!tag.SelfClosing) {
			depth++;
		}
		pos = tag.End + 1;
	}
	return null;
}

export function scanToolMarkupTagAt(
	text: string,
	start: number,
): ToolMarkupTag | null {
	const startLen = xmlTagStartDelimiterLenAt(text, start);
	if (startLen === 0) return null;

	let i = start + startLen;
	while (true) {
		const nextLen = xmlTagStartDelimiterLenAt(text, i);
		if (nextLen === 0) break;
		i += nextLen;
	}

	let closing = false;
	const slashRes = consumeToolMarkupClosingSlash(text, i);
	if (slashRes.ok) {
		closing = true;
		i = slashRes.next;
	}

	const prefixStart = i;
	const {next: afterPrefix, dsmlLike} = consumeToolMarkupNamePrefix(text, i);
	i = afterPrefix;

	let {name, nameLen} = matchToolMarkupName(text, i, dsmlLike);
	let finalDsmlLike = dsmlLike;

	if (nameLen === 0) {
		const fallback = matchToolMarkupNameAfterArbitraryPrefix(
			text,
			prefixStart,
		);
		if (!fallback) return null;
		name = fallback.name;
		i = fallback.start;
		nameLen = fallback.len;
		finalDsmlLike = true;
	}

	const nameEnd = i + nameLen;
	const end = findXmlTagEnd(text, nameEnd);
	if (end === -1) return null;

	const tagText = text.slice(start, end + 1).trim();

	return {
		Start: start,
		End: end,
		NameStart: i,
		NameEnd: nameEnd,
		Name: name,
		Closing: closing,
		SelfClosing:
			tagText.endsWith("/>") ||
			tagText.endsWith("/＞") ||
			tagText.endsWith("/〉"),
		DSMLLike: finalDsmlLike,
		Canonical: !finalDsmlLike,
	};
}

function consumeToolMarkupNamePrefix(
	text: string,
	idx: number,
): {next: number; dsmlLike: boolean} {
	let dsmlLike = false;
	let current = idx;
	while (true) {
		const next = skipToolMarkupIgnorables(text, current);
		const {next: afterKeyword, ok} = consumeToolKeyword(text, next, "dsml");
		if (ok) {
			current = afterKeyword;
			if (text[current] === "-" || text[current] === "_") current++;
			dsmlLike = true;
			continue;
		}
		break;
	}
	return {next: current, dsmlLike};
}

function matchToolMarkupName(
	text: string,
	start: number,
	dsmlLike: boolean,
): {name: string; nameLen: number} {
	for (const entry of TOOL_MARKUP_NAMES) {
		if ((entry as any).dsmlOnly && !dsmlLike) continue;
		const {next, ok} = consumeToolKeyword(text, start, entry.raw);
		if (ok) return {name: entry.canonical, nameLen: next - start};
	}
	return {name: "", nameLen: 0};
}

function matchToolMarkupNameAfterArbitraryPrefix(
	text: string,
	start: number,
): {name: string; start: number; len: number} | null {
	for (let idx = start; idx < text.length; idx++) {
		if (isToolMarkupTagTerminator(text[idx])) break;
		for (const entry of TOOL_MARKUP_NAMES) {
			const {next, ok} = consumeToolKeyword(text, idx, entry.raw);
			if (ok) return {name: entry.canonical, start: idx, len: next - idx};
		}
	}
	return null;
}

function isToolMarkupTagTerminator(ch: string): boolean {
	return ch === ">" || ch === "＞" || ch === "﹥" || ch === "〉";
}

function findXmlTagEnd(text: string, start: number): number {
	for (let i = start; i < text.length; i++) {
		const endLen = xmlTagEndDelimiterLenAt(text, i);
		if (endLen > 0) return i + endLen - 1;
	}
	return -1;
}

export function isPartialToolMarkupTagPrefix(text: string): boolean {
	if (!text || text[0] !== "<") return false;
	if (text.includes(">") || text.includes("＞")) return false;
	return true;
}

function markdownCodeSpanEnd(text: string, idx: number): number {
	if (text[idx] !== "`") return -1;
	let count = 0;
	while (idx + count < text.length && text[idx + count] === "`") count++;
	const fence = text.slice(idx, idx + count);
	const end = text.indexOf(fence, idx + count);
	if (end === -1) return -1;
	return end + count;
}
