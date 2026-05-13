import {ToolMarkupTag} from "@/types/ToolSieve";
import {
	TOOL_MARKUP_NAMES,
	XML_TAG_START_CHARS,
	XML_TAG_END_CHARS,
} from "@/constants";

export function normalizeFullwidthASCIIChar(ch: string): string {
	if (!ch) return "";
	const code = ch.charCodeAt(0);
	if (code >= 0xff01 && code <= 0xff5e) {
		return String.fromCharCode(code - 0xfee0);
	}
	if (XML_TAG_START_CHARS.includes(ch)) return "<";
	if (XML_TAG_END_CHARS.includes(ch)) return ">";
	if (ch === "！") return "!";
	if (ch === "／") return "/";
	if (ch === "＝") return "=";
	if (ch === "“" || ch === "”" || ch === "＂") return '"';
	if (ch === "‘" || ch === "’" || ch === "＇") return "'";
	if (ch === "｜") return "|";
	return ch;
}

export function normalizeFullwidthASCII(text: string): string {
	let out = "";
	for (const ch of text) {
		out += normalizeFullwidthASCIIChar(ch);
	}
	return out;
}

export function isXmlTagStartDelimiter(ch: string): boolean {
	return XML_TAG_START_CHARS.includes(ch);
}

export function isXmlTagEndDelimiter(ch: string): boolean {
	return XML_TAG_END_CHARS.includes(ch);
}

export function scanToolMarkupTagAt(
	text: string,
	start: number,
): ToolMarkupTag | null {
	if (
		start < 0 ||
		start >= text.length ||
		!isXmlTagStartDelimiter(text[start])
	) {
		return null;
	}

	let i = start + 1;
	while (i < text.length && isXmlTagStartDelimiter(text[i])) {
		i++;
	}

	let closing = false;
	if (i < text.length && (text[i] === "/" || text[i] === "／")) {
		closing = true;
		i++;
	}

	while (i < text.length && isIgnorableToolMarkupChar(text[i])) {
		i++;
	}

	let dsmlLike = false;
	if (text.slice(i).toUpperCase().startsWith("|DSML|")) {
		dsmlLike = true;
		i += 6;
	} else if (text.slice(i).toUpperCase().startsWith("DSML|")) {
		dsmlLike = true;
		i += 5;
	}

	const nameMatch = matchToolMarkupName(text, i);
	if (!nameMatch) return null;

	const name = nameMatch.canonical;
	const nameEnd = i + nameMatch.len;
	i = nameEnd;

	let end = -1;
	for (let j = i; j < text.length; j++) {
		if (isXmlTagEndDelimiter(text[j])) {
			end = j;
			break;
		}
		if (isXmlTagStartDelimiter(text[j])) break;
	}

	if (end === -1) return null;

	return {
		name,
		closing,
		start,
		end,
		nameEnd,
		dsmlLike,
		canonical: !dsmlLike,
		selfClosing: text[end - 1] === "/" || text[end - 1] === "／",
	};
}

function isIgnorableToolMarkupChar(ch: string): boolean {
	return ch === "|" || ch === "｜" || /\s/.test(ch);
}

function matchToolMarkupName(text: string, start: number) {
	const sub = normalizeFullwidthASCII(
		text.slice(start, start + 20).toLowerCase(),
	);
	for (const entry of TOOL_MARKUP_NAMES) {
		if (sub.startsWith(entry.raw)) {
			return {canonical: entry.canonical, len: entry.raw.length};
		}
	}
	return null;
}

export function findToolMarkupTag(
	text: string,
	from: number,
): ToolMarkupTag | null {
	for (let i = from; i < text.length; i++) {
		if (isXmlTagStartDelimiter(text[i])) {
			const tag = scanToolMarkupTagAt(text, i);
			if (tag) return tag;
		}
	}
	return null;
}
