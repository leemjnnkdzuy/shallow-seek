import {ToolMarkupTag} from "@/types/ToolCall";
import {
	TOOL_MARKUP_NAMES,
	TOOL_KEYWORD_FOLD_MAP,
	TOOL_MARKUP_EQUALS_CHARS,
	XML_TAG_START_CHARS,
	XML_TAG_END_CHARS,
	TOOL_MARKUP_SLASH_CHARS,
	TOOL_MARKUP_PIPE_CHARS,
	TOOL_MARKUP_DASH_CHARS,
	XML_QUOTE_PAIRS,
} from "@/constants";

export interface CanonicalToolMarkupAttr {
	Key: string;
	Value: string;
}


export function canonicalizeToolCallCandidateSpans(text: string): string {
	if (!text) return "";
	let out = "";
	for (let i = 0; i < text.length; ) {
		const {next, advanced, blocked} = skipXMLIgnoredSection(text, i);
		if (blocked) {
			out += text.slice(i);
			break;
		}
		if (advanced) {
			out += text.slice(i, next);
			i = next;
			continue;
		}
		const codeEnd = markdownCodeSpanEnd(text, i);
		if (codeEnd !== -1) {
			out += text.slice(i, codeEnd);
			i = codeEnd;
			continue;
		}
		const tag = scanToolMarkupTagAt(text, i);
		if (!tag) {
			out += text[i];
			i++;
			continue;
		}
		out += canonicalizeRecognizedToolMarkupTag(
			text.slice(tag.Start, tag.End + 1),
			tag,
		);
		i = tag.End + 1;
	}
	return out;
}

export function skipXMLIgnoredSection(
	text: string,
	idx: number,
): {next: number; advanced: boolean; blocked: boolean} {
	if (text.startsWith("<![CDATA[", idx)) {
		const end = text.indexOf("]]>", idx + 9);
		if (end === -1)
			return {next: text.length, advanced: true, blocked: true};
		return {next: end + 3, advanced: true, blocked: false};
	}
	if (text.startsWith("<!--", idx)) {
		const end = text.indexOf("-->", idx + 4);
		if (end === -1)
			return {next: text.length, advanced: true, blocked: true};
		return {next: end + 3, advanced: true, blocked: false};
	}
	return {next: idx, advanced: false, blocked: false};
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

function scanToolMarkupTagAt(text: string, idx: number): ToolMarkupTag | null {
	const startLen = xmlTagStartDelimiterLenAt(text, idx);
	if (startLen === 0) return null;

	let pos = idx + startLen;
	pos = skipToolMarkupIgnorables(text, pos);

	let closing = false;
	const {next: afterSlash, ok: hasSlash} = consumeToolMarkupClosingSlash(
		text,
		pos,
	);
	if (hasSlash) {
		closing = true;
		pos = afterSlash;
	}

	pos = skipToolMarkupIgnorables(text, pos);
	let dsmlLike = false;
	if (text.startsWith("|DSML|", pos)) {
		dsmlLike = true;
		pos += 6;
	}

	for (const entry of TOOL_MARKUP_NAMES) {
		const {next: afterName, ok: nameMatch} = consumeToolKeyword(
			text,
			pos,
			entry.raw,
		);
		if (nameMatch) {
			let endPos = afterName;
			let selfClosing = false;
			while (endPos < text.length) {
				const endLen = xmlTagEndDelimiterLenAt(text, endPos);
				if (endLen > 0) {
					return {
						Name: entry.canonical,
						Start: idx,
						End: endPos + endLen - 1,
						NameStart: pos,
						NameEnd: afterName,
						Closing: closing,
						SelfClosing: selfClosing,
						DSMLLike: dsmlLike,
						Canonical: !dsmlLike,
					};
				}
				const {next: nextAfterSlash, ok: scSlash} =
					consumeToolMarkupClosingSlash(text, endPos);
				if (scSlash) {
					selfClosing = true;
					endPos = nextAfterSlash;
					continue;
				}
				endPos++;
			}
		}
	}
	return null;
}

function canonicalizeRecognizedToolMarkupTag(
	raw: string,
	tag: ToolMarkupTag,
): string {
	let idx = 0;
	const startDelim = xmlTagStartDelimiterLenAt(raw, idx);
	idx += startDelim;

	while (idx < raw.length) {
		idx = skipToolMarkupIgnorables(raw, idx);
		const d = xmlTagStartDelimiterLenAt(raw, idx);
		if (d > 0) {
			idx += d;
			continue;
		}
		break;
	}

	idx = skipToolMarkupIgnorables(raw, idx);
	if (tag.Closing) {
		const {next} = consumeToolMarkupClosingSlash(raw, idx);
		idx = next;
	}

	if (raw.startsWith("|DSML|", idx)) idx += 6;
	const {next: afterName} = consumeToolKeyword(raw, idx, rawNameForTag(tag));

	const attrs = parseCanonicalToolMarkupAttrs(raw, afterName);
	let out =
		"<" +
		(tag.Closing ? "/" : "") +
		(tag.DSMLLike ? "|DSML|" : "") +
		tag.Name;
	for (const attr of attrs) {
		out += ` ${attr.Key}="${attr.Value.replace(/"/g, "&quot;")}"`;
	}
	out += (tag.SelfClosing ? "/" : "") + ">";
	return out;
}

function rawNameForTag(tag: ToolMarkupTag): string {
	return (
		TOOL_MARKUP_NAMES.find((n) => n.canonical === tag.Name)?.raw || tag.Name
	);
}

function parseCanonicalToolMarkupAttrs(
	raw: string,
	idx: number,
): CanonicalToolMarkupAttr[] {
	const out: CanonicalToolMarkupAttr[] = [];
	while (idx < raw.length) {
		idx = skipToolMarkupIgnorables(raw, idx);
		if (xmlTagEndDelimiterLenAt(raw, idx) > 0) break;

		const {next: pNext, ok: hasPipe} = consumeToolMarkupPipe(raw, idx);
		if (hasPipe) {
			idx = pNext;
			continue;
		}

		const {next: sNext, ok: hasSlash} = consumeToolMarkupClosingSlash(
			raw,
			idx,
		);
		if (hasSlash) {
			idx = sNext;
			continue;
		}

		const keyStart = idx;
		while (idx < raw.length) {
			if (toolMarkupWhitespaceLikeLenAt(raw, idx) > 0) break;
			if (toolMarkupEqualsLenAt(raw, idx) > 0) break;
			if (xmlTagEndDelimiterLenAt(raw, idx) > 0) break;
			idx++;
		}
		const key = raw.slice(keyStart, idx).trim();
		if (!key) {
			idx++;
			continue;
		}

		idx = skipToolMarkupIgnorables(raw, idx);
		const eqLen = toolMarkupEqualsLenAt(raw, idx);
		if (eqLen === 0) continue;
		idx += eqLen;

		idx = skipToolMarkupIgnorables(raw, idx);
		const {quote, quoteLen} = xmlQuotePairAt(raw, idx);
		let value = "";
		if (quoteLen > 0) {
			idx += quoteLen;
			const vStart = idx;
			while (idx < raw.length) {
				if (raw.startsWith(quote, idx)) {
					value = raw.slice(vStart, idx);
					idx += quote.length;
					break;
				}
				idx++;
			}
		} else {
			const vStart = idx;
			while (idx < raw.length) {
				if (
					toolMarkupWhitespaceLikeLenAt(raw, idx) > 0 ||
					xmlTagEndDelimiterLenAt(raw, idx) > 0
				)
					break;
				idx++;
			}
			value = raw.slice(vStart, idx);
		}

		if (key.toLowerCase().includes("name")) {
			out.push({Key: "name", Value: value});
		}
	}
	return out;
}

export function skipToolMarkupIgnorables(text: string, idx: number): number {
	while (idx < text.length) {
		const code = text.charCodeAt(idx);
		if (
			(code >= 0x200b && code <= 0x200f) ||
			(code >= 0x202a && code <= 0x202e) ||
			(code < 32 && ![9, 10, 13].includes(code))
		) {
			idx++;
			continue;
		}
		break;
	}
	return idx;
}

export function toolMarkupWhitespaceLikeLenAt(
	text: string,
	idx: number,
): number {
	const ch = text[idx];
	if ([" ", "\t", "\n", "\r"].includes(ch)) return 1;
	if (text.startsWith("▁", idx)) return 1;
	return 0;
}

export function toolMarkupEqualsLenAt(text: string, idx: number): number {
	const ch = text[idx];
	if (TOOL_MARKUP_EQUALS_CHARS.includes(ch)) return ch.length;
	return 0;
}

export function xmlTagStartDelimiterLenAt(text: string, idx: number): number {
	const ch = text[idx];
	if (XML_TAG_START_CHARS.includes(ch)) return ch.length;
	return 0;
}

export function xmlTagEndDelimiterLenAt(text: string, idx: number): number {
	const ch = text[idx];
	if (XML_TAG_END_CHARS.includes(ch)) return ch.length;
	return 0;
}

export function consumeToolMarkupClosingSlash(
	text: string,
	idx: number,
): {next: number; ok: boolean} {
	const ch = text[idx];
	if (TOOL_MARKUP_SLASH_CHARS.includes(ch))
		return {next: idx + ch.length, ok: true};
	return {next: idx, ok: false};
}

export function consumeToolMarkupPipe(
	text: string,
	idx: number,
): {next: number; ok: boolean} {
	const ch = text[idx];
	if (TOOL_MARKUP_PIPE_CHARS.includes(ch))
		return {next: idx + ch.length, ok: true};
	return {next: idx, ok: false};
}

export function xmlQuotePairAt(
	text: string,
	idx: number,
): {quote: string; quoteLen: number} {
	const ch = text[idx];
	if (XML_QUOTE_PAIRS[ch]) return {quote: XML_QUOTE_PAIRS[ch], quoteLen: ch.length};
	return {quote: "", quoteLen: 0};
}

export function foldToolKeywordRune(r: string): string | null {
	const code = r.charCodeAt(0);
	let normalized = r.toLowerCase();
	if (code >= 0xff21 && code <= 0xff3a)
		normalized = String.fromCharCode(code - 0xfee0).toLowerCase();
	else if (code >= 0xff41 && code <= 0xff5a)
		normalized = String.fromCharCode(code - 0xfee0);

	return (
		TOOL_KEYWORD_FOLD_MAP[normalized] ||
		(/[a-z0-9]/.test(normalized) ? normalized : null)
	);
}

export function consumeToolKeyword(
	text: string,
	idx: number,
	keyword: string,
): {next: number; ok: boolean} {
	let next = idx;
	for (let i = 0; i < keyword.length; i++) {
		next = skipToolMarkupIgnorables(text, next);
		if (next >= text.length) return {next: idx, ok: false};
		const target = keyword[i].toLowerCase();
		const ch = text[next];
		if (target === "_" || target === "-") {
			if (TOOL_MARKUP_DASH_CHARS.includes(ch)) {
				next++;
				continue;
			}
			return {next: idx, ok: false};
		}
		if (foldToolKeywordRune(ch) !== target) return {next: idx, ok: false};
		next++;
	}
	return {next, ok: true};
}

export function hasRepairableXMLToolCallsWrapper(text: string): boolean {
	if (!text.trim()) return false;
	const invoke = scanToolMarkupTagAt(text, text.indexOf("<"));
	if (!invoke || invoke.Name !== "invoke") return false;
	const lastTag = text.lastIndexOf("<");
	const close = scanToolMarkupTagAt(text, lastTag);
	return !!(close && close.Name === "tool_calls" && close.Closing);
}
export function isToolMarkupDash(r: string): boolean {
	return r === "-" || r === "—" || r === "–";
}

export function isToolMarkupUnderscore(r: string): boolean {
	return r === "_";
}
