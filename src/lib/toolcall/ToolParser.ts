import {ParsedToolCall, ToolCallParseResult} from "@/types/ToolCall";
import {normalizeDSMLToolCallMarkup} from "./ToolDsml";
import {parseXMLToolCalls} from "./ToolMarkupParser";
import {
	SanitizeLooseCDATA,
	indexToolCDATAOpen,
	toolCDATAOpenLenAt,
	toolCDATACloseLenAt,
} from "./ToolMarkup";

export function parseToolCallsDetailed(text: string): ToolCallParseResult {
	const result: ToolCallParseResult = {
		Calls: [],
		SawToolCallSyntax: false,
		RejectedByPolicy: false,
		RejectedToolNames: [],
	};

	const trimmed = text.trim();
	if (!trimmed) return result;

	const stripped = stripFencedCodeBlocks(trimmed);
	const finalTrimmed = stripped.trim();
	if (!finalTrimmed) return result;

	const {text: normalized} = normalizeDSMLToolCallMarkup(finalTrimmed);

	result.SawToolCallSyntax = looksLikeToolCallSyntax(normalized);

	let parsed = parseXMLToolCalls(normalized);
	if (
		(!parsed || parsed.length === 0) &&
		indexToolCDATAOpen(normalized, 0) >= 0
	) {
		const recovered = SanitizeLooseCDATA(normalized);
		if (recovered !== normalized) {
			parsed = parseXMLToolCalls(recovered);
		}
	}

	if (!parsed || parsed.length === 0) {
		return result;
	}

	result.SawToolCallSyntax = true;
	const filtered = filterToolCallsDetailed(parsed);
	result.Calls = filtered.calls;
	result.RejectedToolNames = filtered.rejectedNames;
	result.RejectedByPolicy =
		filtered.rejectedNames.length > 0 && filtered.calls.length === 0;

	return result;
}

function filterToolCallsDetailed(parsed: ParsedToolCall[]): {
	calls: ParsedToolCall[];
	rejectedNames: string[];
} {
	const calls: ParsedToolCall[] = [];
	const rejectedNames: string[] = [];
	for (const tc of parsed) {
		if (!tc.Name) continue;
		if (!tc.Input) tc.Input = {};
		calls.push(tc);
	}
	return {calls, rejectedNames};
}

function looksLikeToolCallSyntax(text: string): boolean {
	return (
		text.includes("<tool_calls>") ||
		text.includes("<invoke") ||
		text.includes("<|DSML|")
	);
}

export function stripFencedCodeBlocks(text: string): string {
	if (!text) return "";

	const lines = text.split(/\r?\n/);
	let out = "";
	let inFence = false;
	let fenceMarker = "";
	let inCDATA = false;
	let cdataFenceMarker = "";
	let beforeFenceOut = "";

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i] + (i < lines.length - 1 ? "\n" : "");

		if (inCDATA || cdataStartsBeforeFence(line)) {
			out += line;
			const res = updateCDATAStateForStrip(
				inCDATA,
				cdataFenceMarker,
				line,
			);
			inCDATA = res.state;
			cdataFenceMarker = res.fenceMarker;
			continue;
		}

		const trimmed = line.trimStart();
		if (!inFence) {
			const marker = parseFenceOpen(trimmed);
			if (marker) {
				inFence = true;
				fenceMarker = marker;
				beforeFenceOut = out;
				continue;
			}
			out += line;
			continue;
		}

		if (isFenceClose(trimmed, fenceMarker)) {
			inFence = false;
			fenceMarker = "";
		}
	}

	if (inFence) {
		return beforeFenceOut;
	}
	return out;
}

function cdataStartsBeforeFence(line: string): boolean {
	const cdataIdx = indexToolCDATAOpen(line, 0);
	if (cdataIdx < 0) return false;
	const fenceIdx = firstFenceMarkerIndex(line);
	return fenceIdx < 0 || cdataIdx < fenceIdx;
}

function firstFenceMarkerIndex(line: string): number {
	const idx3 = line.indexOf("```");
	const idxT = line.indexOf("~~~");
	if (idx3 < 0) return idxT;
	if (idxT < 0) return idx3;
	return Math.min(idx3, idxT);
}

function updateCDATAStateForStrip(
	inCDATA: boolean,
	cdataFenceMarker: string,
	line: string,
): {state: boolean; fenceMarker: string} {
	let pos = 0;
	let state = inCDATA;
	let fenceMarker = cdataFenceMarker;
	let lineForFence = line;

	if (!state) {
		const start = indexToolCDATAOpen(line, pos);
		if (start < 0) return {state: false, fenceMarker: ""};
		pos = start + toolCDATAOpenLenAt(line, start);
		state = true;
		lineForFence = line.slice(pos);
	}

	const trimmed = lineForFence.trimStart();
	if (!fenceMarker) {
		const m = parseFenceOpen(trimmed);
		if (m) fenceMarker = m;
	} else if (isFenceClose(trimmed, fenceMarker)) {
		fenceMarker = "";
	}

	while (pos < line.length) {
		let endPos = -1;
		let closeLen = 0;
		for (let search = pos; search < line.length; search++) {
			const foundLen = toolCDATACloseLenAt(line, search);
			if (foundLen > 0) {
				endPos = search;
				closeLen = foundLen;
				break;
			}
		}

		if (endPos < 0) return {state: true, fenceMarker};

		pos = endPos + closeLen;
		if (fenceMarker !== "") continue;

		const tail = line.slice(pos).trimStart();
		if (tail === "" || tail.startsWith("<")) {
			state = false;
			const nextStart = indexToolCDATAOpen(line, pos);
			if (nextStart < 0) return {state: false, fenceMarker: ""};
			pos = nextStart + toolCDATAOpenLenAt(line, nextStart);
			state = true;
			const trimmedTail = line.slice(pos).trimStart();
			const m = parseFenceOpen(trimmedTail);
			fenceMarker = m || "";
		}
	}

	return {state, fenceMarker};
}

function parseFenceOpen(line: string): string | null {
	if (line.length < 3) return null;
	const ch = line[0];
	if (ch !== "`" && ch !== "~") return null;
	let count = 0;
	while (count < line.length && line[count] === ch) count++;
	if (count < 3) return null;
	return ch.repeat(count);
}

function isFenceClose(line: string, marker: string): boolean {
	if (!marker) return false;
	const ch = marker[0];
	if (!line || line[0] !== ch) return false;
	let count = 0;
	while (count < line.length && line[count] === ch) count++;
	if (count < marker.length) return false;
	return line.slice(count).trim() === "";
}
