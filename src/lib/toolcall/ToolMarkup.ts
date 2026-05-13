import {decode} from "html-entities";
import {parseStructuredToolCallInput} from "./ToolXml";
import {
	consumeToolKeyword,
	xmlTagStartDelimiterLenAt,
	skipToolMarkupIgnorables,
} from "./ToolCandidateDetector";

export function parseMarkupKVObject(text: string): Record<string, any> | null {
	const trimmed = text.trim();
	if (!trimmed) return null;

	const out: Record<string, any> = {};
	const regex =
		/<(?:[a-z0-9_:-]+:)?([a-z0-9_\-.]+)\b[^>]*>(.*?)<\/(?:[a-z0-9_:-]+:)?([a-z0-9_\-.]+)>/gis;

	let match;
	while ((match = regex.exec(trimmed)) !== null) {
		const key = match[1].trim();
		const endKey = match[3].trim();
		const inner = match[2];

		if (!key || key.toLowerCase() !== endKey.toLowerCase()) {
			continue;
		}

		const value = parseMarkupValue(inner);
		if (value === null || value === undefined) {
			continue;
		}

		appendMarkupValue(out, key, value);
	}

	if (Object.keys(out).length === 0) {
		return null;
	}
	return out;
}

export function parseMarkupValue(inner: string): any {
	const standaloneCDATA = extractStandaloneCDATA(inner);
	if (standaloneCDATA.ok) {
		return standaloneCDATA.value;
	}

	const value = extractRawTagValue(inner).trim();
	if (value === "") {
		return "";
	}

	if (value.includes("<") && value.includes(">")) {
		const parsed = parseStructuredToolCallInput(value);
		if (Object.keys(parsed).length > 0) {
			if (Object.keys(parsed).length === 1 && "_raw" in parsed) {
				return parsed["_raw"];
			}
			return parsed;
		}
	}

	try {
		if (/^[-0-9"[{tfnu]/.test(value)) {
			return JSON.parse(value);
		}
	} catch (e) {}

	return value;
}

function appendMarkupValue(
	out: Record<string, any>,
	key: string,
	value: any,
): void {
	if (Object.prototype.hasOwnProperty.call(out, key)) {
		const existing = out[key];
		if (Array.isArray(existing)) {
			existing.push(value);
		} else {
			out[key] = [existing, value];
		}
	} else {
		out[key] = value;
	}
}

function extractRawTagValue(inner: string): string {
	const trimmed = inner.trim();
	if (!trimmed) return "";

	const standaloneCDATA = extractStandaloneCDATA(trimmed);
	if (standaloneCDATA.ok) {
		return standaloneCDATA.value;
	}

	return decode(inner);
}

export function extractStandaloneCDATA(inner: string): {
	value: string;
	ok: boolean;
} {
	const trimmed = inner.trim();
	const openLen = toolCDATAOpenLenAt(trimmed, 0);
	if (openLen > 0) {
		const closeStart = findTrailingToolCDATACloseStart(trimmed);
		if (closeStart >= openLen) {
			return {value: trimmed.slice(openLen, closeStart), ok: true};
		}
		const end = findToolCDATAEnd(trimmed, openLen);
		if (end >= 0) {
			return {value: trimmed.slice(openLen, end), ok: true};
		}
		return {value: trimmed.slice(openLen), ok: true};
	}
	return {value: "", ok: false};
}

export function toolCDATAOpenLenAt(text: string, idx: number): number {
	const start = skipToolMarkupIgnorables(text, idx);
	const ltLen = xmlTagStartDelimiterLenAt(text, start);
	if (ltLen === 0) return 0;

	let pos = start + ltLen;
	for (let skipped = 0; skipped <= 4 && pos < text.length; skipped++) {
		pos = skipToolMarkupIgnorables(text, pos);
		if (pos >= text.length) return 0;

		if (text[pos] === "[") {
			pos++;
			const {next, ok} = consumeToolKeyword(text, pos, "cdata");
			if (!ok) return 0;
			pos = skipToolMarkupIgnorables(text, next);
			if (pos >= text.length || text[pos] !== "[") return 0;
			pos++;
			return pos - idx;
		}

		const ch = text[pos];
		if (!isToolMarkupSeparator(ch)) return 0;
		pos++;
	}
	return 0;
}

function isToolMarkupSeparator(ch: string): boolean {
	return [" ", "\t", "\n", "\r", "|", "│", "∣", "❘", "ǀ", "￨"].includes(ch);
}

function findTrailingToolCDATACloseStart(text: string): number {
	for (let i = text.length - 1; i >= 0; i--) {
		const closeLen = toolCDATACloseLenAt(text, i);
		if (closeLen > 0 && i + closeLen === text.length) {
			return i;
		}
	}
	return -1;
}

export function toolCDATACloseLenAt(text: string, idx: number): number {
	if (idx < 0 || idx >= text.length) return 0;
	if (text.startsWith("]]〉", idx)) return 3;
	if (text.startsWith("]]＞", idx)) return 3;
	if (text.startsWith("]]>", idx)) return 3;
	return 0;
}

function findToolCDATAEnd(text: string, from: number): number {
	if (from < 0 || from >= text.length) return -1;
	let firstNonFenceEnd = -1;
	for (let searchFrom = from; searchFrom < text.length; ) {
		const end = indexToolCDATAClose(text, searchFrom);
		if (end < 0) break;

		const closeLen = toolCDATACloseLenAt(text, end);
		searchFrom = end + closeLen;

		if (cdataOffsetIsInsideMarkdownFence(text.slice(from, end))) {
			continue;
		}

		if (cdataEndLooksStructural(text, searchFrom)) {
			return end;
		}

		if (firstNonFenceEnd < 0) {
			firstNonFenceEnd = end;
		}
	}
	return firstNonFenceEnd;
}

function indexToolCDATAClose(text: string, from: number): number {
	if (from < 0) from = 0;
	const s = text.slice(from);
	const asciiIdx = s.indexOf("]]>");
	const fullIdx = s.indexOf("]]＞");
	const cjkIdx = s.indexOf("]]〉");

	let best = -1;
	[asciiIdx, fullIdx, cjkIdx].forEach((idx) => {
		if (idx >= 0 && (best < 0 || idx < best)) {
			best = idx;
		}
	});

	return best < 0 ? -1 : from + best;
}

function cdataEndLooksStructural(text: string, after: number): boolean {
	while (after < text.length) {
		const ch = text[after];
		if ([" ", "\t", "\r", "\n"].includes(ch)) {
			after++;
			continue;
		}
		if (text.startsWith("</", after)) {
			return true;
		}
		return false;
	}
	return false;
}

function cdataOffsetIsInsideMarkdownFence(fragment: string): boolean {
	if (!fragment) return false;
	const lines = fragment.split("\n");
	let inFence = false;
	let fenceMarker = "";

	for (const line of lines) {
		const trimmed = line.trimStart();
		if (!inFence) {
			const {marker, ok} = parseFenceOpen(trimmed);
			if (ok) {
				inFence = true;
				fenceMarker = marker;
			}
			continue;
		}
		if (isFenceClose(trimmed, fenceMarker)) {
			inFence = false;
			fenceMarker = "";
		}
	}
	return inFence;
}

function parseFenceOpen(line: string): {marker: string; ok: boolean} {
	if (line.length < 3) return {marker: "", ok: false};
	const ch = line[0];
	if (ch !== "`" && ch !== "~") return {marker: "", ok: false};

	let count = 0;
	while (count < line.length && line[count] === ch) {
		count++;
	}
	if (count < 3) return {marker: "", ok: false};
	return {marker: ch.repeat(count), ok: true};
}

function isFenceClose(line: string, marker: string): boolean {
	if (!marker) return false;
	const ch = marker[0];
	if (line === "" || line[0] !== ch) return false;

	let count = 0;
	while (count < line.length && line[count] === ch) {
		count++;
	}
	if (count < marker.length) return false;

	const rest = line.slice(count).trim();
	return rest === "";
}

export function SanitizeLooseCDATA(text: string): string {
	if (!text) return "";

	let out = "";
	let pos = 0;
	let changed = false;

	while (pos < text.length) {
		const start = indexToolCDATAOpen(text, pos);
		if (start < 0) {
			out += text.slice(pos);
			break;
		}

		const openLen = toolCDATAOpenLenAt(text, start);
		const contentStart = start + openLen;
		out += text.slice(pos, start);

		const endRel = findToolCDATAEnd(text, contentStart);
		if (endRel >= 0) {
			const end = endRel + toolCDATACloseLenAt(text, endRel);
			out += text.slice(start, end);
			pos = end;
			continue;
		}

		changed = true;
		out += text.slice(contentStart);
		pos = text.length;
	}

	return changed ? out : text;
}

export function indexToolCDATAOpen(text: string, start: number): number {
	for (let i = Math.max(start, 0); i < text.length; i++) {
		if (toolCDATAOpenLenAt(text, i) > 0) {
			return i;
		}
	}
	return -1;
}
