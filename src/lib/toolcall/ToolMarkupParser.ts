import {decode} from "html-entities";
import {ParsedToolCall, ToolMarkupTag, XMLElementBlock} from "@/types/ToolCall";
import {XML_ATTR_PATTERN, CDATA_BR_SEPARATOR_PATTERN} from "@/constants";
import {
	findToolMarkupTagOutsideIgnored,
	findMatchingToolMarkupClose,
} from "./ToolScanner";
import {xmlTagEndDelimiterLenAt} from "./ToolCandidateDetector";
import {parseMarkupValue, extractStandaloneCDATA} from "./ToolMarkup";
import {parseStructuredToolCallInput, parseXMLFragmentValue} from "./ToolXml";
import {parseLooseJSONArrayValue, coerceArrayValue} from "./ToolArrayParser";

export function parseXMLToolCalls(text: string): ParsedToolCall[] | null {
	let wrappers = findToolCallElementBlocksOutsideIgnored(text);
	if (wrappers.length === 0) {
		const repaired = repairMissingXMLToolCallsOpeningWrapper(text);
		if (repaired !== text) {
			wrappers = findToolCallElementBlocksOutsideIgnored(repaired);
		}
	}

	if (wrappers.length === 0) {
		return null;
	}

	const out: ParsedToolCall[] = [];
	for (const wrapper of wrappers) {
		for (const block of findXMLElementBlocks(wrapper.Body, "invoke")) {
			const call = parseSingleXMLToolCall(block);
			if (call) {
				out.push(call);
			}
		}
	}

	return out.length === 0 ? null : out;
}

export function findToolCallElementBlocksOutsideIgnored(
	text: string,
): XMLElementBlock[] {
	if (!text) return [];

	const out: XMLElementBlock[] = [];
	let searchFrom = 0;
	while (searchFrom < text.length) {
		const tag = findToolMarkupTagOutsideIgnored(text, searchFrom);
		if (!tag) break;

		if (tag.Closing || tag.Name !== "tool_calls") {
			searchFrom = tag.End + 1;
			continue;
		}

		const closeTag = findMatchingToolMarkupClose(text, tag);
		if (!closeTag) {
			searchFrom = tag.End + 1;
			continue;
		}

		let attrsEnd = tag.End + 1;
		const endLen = xmlTagEndDelimiterLenAt(text, tag.End);
		if (endLen > 0) {
			attrsEnd = tag.End + 1 - endLen;
		}

		out.push({
			Attrs: text.slice(tag.NameEnd, attrsEnd),
			Body: text.slice(tag.End + 1, closeTag.Start),
			Start: tag.Start,
			End: closeTag.End + 1,
		});
		searchFrom = closeTag.End + 1;
	}
	return out;
}

function repairMissingXMLToolCallsOpeningWrapper(text: string): string {
	if (firstToolMarkupTagByName(text, "tool_calls", false)) {
		return text;
	}

	const invokeTag = firstToolMarkupTagByName(text, "invoke", false);
	if (!invokeTag) return text;

	const closeTag = lastToolMarkupTagByName(text, "tool_calls", true);
	if (!closeTag || invokeTag.Start >= closeTag.Start) {
		return text;
	}

	return (
		text.slice(0, invokeTag.Start) +
		"<tool_calls>" +
		text.slice(invokeTag.Start, closeTag.Start) +
		"</tool_calls>" +
		text.slice(closeTag.End + 1)
	);
}

function firstToolMarkupTagByName(
	text: string,
	name: string,
	closing: boolean,
): ToolMarkupTag | null {
	let searchFrom = 0;
	while (searchFrom < text.length) {
		const tag = findToolMarkupTagOutsideIgnored(text, searchFrom);
		if (!tag) break;
		if (tag.Name === name && tag.Closing === closing) {
			return tag;
		}
		searchFrom = tag.End + 1;
	}
	return null;
}

function lastToolMarkupTagByName(
	text: string,
	name: string,
	closing: boolean,
): ToolMarkupTag | null {
	let last: ToolMarkupTag | null = null;
	let searchFrom = 0;
	while (searchFrom < text.length) {
		const tag = findToolMarkupTagOutsideIgnored(text, searchFrom);
		if (!tag) break;
		if (tag.Name === name && tag.Closing === closing) {
			last = tag;
		}
		searchFrom = tag.End + 1;
	}
	return last;
}

export function findXMLElementBlocks(
	text: string,
	name: string,
): XMLElementBlock[] {
	if (!text) return [];

	const out: XMLElementBlock[] = [];
	let searchFrom = 0;
	while (searchFrom < text.length) {
		const tag = findToolMarkupTagOutsideIgnored(text, searchFrom);
		if (!tag) break;

		if (tag.Closing || tag.Name !== name) {
			searchFrom = tag.End + 1;
			continue;
		}

		if (tag.SelfClosing) {
			let attrsEnd = tag.End + 1;
			const endLen = xmlTagEndDelimiterLenAt(text, tag.End);
			if (endLen > 0) {
				attrsEnd = tag.End + 1 - endLen;
			}
			out.push({
				Attrs: text.slice(tag.NameEnd, attrsEnd),
				Body: "",
				Start: tag.Start,
				End: tag.End + 1,
			});
			searchFrom = tag.End + 1;
			continue;
		}

		const closeTag = findMatchingToolMarkupClose(text, tag);
		if (!closeTag) {
			searchFrom = tag.End + 1;
			continue;
		}

		let attrsEnd = tag.End + 1;
		const endLen = xmlTagEndDelimiterLenAt(text, tag.End);
		if (endLen > 0) {
			attrsEnd = tag.End + 1 - endLen;
		}

		out.push({
			Attrs: text.slice(tag.NameEnd, attrsEnd),
			Body: text.slice(tag.End + 1, closeTag.Start),
			Start: tag.Start,
			End: closeTag.End + 1,
		});
		searchFrom = closeTag.End + 1;
	}
	return out;
}

function parseSingleXMLToolCall(block: XMLElementBlock): ParsedToolCall | null {
	const attrs = parseXMLTagAttributes(block.Attrs);
	const name = attrs["name"] || "";
	if (!name) return null;

	const input: Record<string, any> = {};
	for (const paramBlock of findXMLElementBlocks(block.Body, "parameter")) {
		const paramAttrs = parseXMLTagAttributes(paramBlock.Attrs);
		const paramName = paramAttrs["name"];
		if (!paramName) continue;

		const val = parseInvokeParameterValue(paramName, paramBlock.Body);
		input[paramName] = val;
	}

	return {Name: name, Input: input};
}

export function parseXMLTagAttributes(raw: string): Record<string, string> {
	const trimmed = raw.trim();
	if (!trimmed) return {};

	const out: Record<string, string> = {};
	XML_ATTR_PATTERN.lastIndex = 0;
	let match;
	while ((match = XML_ATTR_PATTERN.exec(trimmed)) !== null) {
		const key = match[1].toLowerCase();
		const val = match[2] !== undefined ? match[2] : match[3];
		out[key] = val;
	}
	return out;
}

export function parseInvokeParameterValue(paramName: string, raw: string): any {
	const trimmed = raw.trim();
	if (!trimmed) return "";

	const standaloneCDATA = extractStandaloneCDATA(trimmed);
	if (standaloneCDATA.ok) {
		const value = standaloneCDATA.value;
		try {
			if (/^[-0-9"[{tfnu]/.test(value.trim())) {
				const parsed = JSON.parse(value);
				const coerced = coerceArrayValue(parsed, paramName);
				if (coerced) return coerced;
				return parsed;
			}
		} catch (e) {}

		const structured = parseStructuredCDATAParameterValue(paramName, value);
		if (structured.ok) return structured.value;

		const looseArray = parseLooseJSONArrayValue(value, paramName);
		if (looseArray) return looseArray;

		return value;
	}

	const decoded = decode(parseMarkupValue(trimmed));

	if (decoded.includes("<") && decoded.includes(">")) {
		const {value: parsedValue, ok} = parseXMLFragmentValue(decoded);
		if (ok) {
			if (parsedValue && typeof parsedValue === "object") {
				if (Array.isArray(parsedValue)) return parsedValue;
				const coerced = coerceArrayValue(parsedValue, paramName);
				if (coerced) return coerced;
				return parsedValue;
			}
			if (typeof parsedValue === "string") {
				const text = parsedValue.trim();
				if (!text) return "";
				try {
					if (/^[-0-9"[{tfnu]/.test(text)) {
						const parsedText = JSON.parse(text);
						const coerced = coerceArrayValue(parsedText, paramName);
						if (coerced) return coerced;
						return parsedText;
					}
				} catch (e) {}

				const looseArray = parseLooseJSONArrayValue(text, paramName);
				if (looseArray) return looseArray;
				return parsedValue;
			}
			return parsedValue;
		}

		const parsed = parseStructuredToolCallInput(decoded);
		if (Object.keys(parsed).length > 0) {
			if (Object.keys(parsed).length === 1 && "_raw" in parsed) {
				const rawValue = parsed["_raw"];
				const looseArray = parseLooseJSONArrayValue(
					rawValue,
					paramName,
				);
				if (looseArray) return looseArray;
				return rawValue;
			}
			const coerced = coerceArrayValue(parsed, paramName);
			if (coerced) return coerced;
			return parsed;
		}
	}

	try {
		const dt = decoded.trim();
		if (/^[-0-9"[{tfnu]/.test(dt)) {
			const parsed = JSON.parse(dt);
			const coerced = coerceArrayValue(parsed, paramName);
			if (coerced) return coerced;
			return parsed;
		}
	} catch (e) {}

	const looseArray = parseLooseJSONArrayValue(decoded, paramName);
	if (looseArray) return looseArray;

	return decoded;
}

function parseStructuredCDATAParameterValue(
	paramName: string,
	raw: string,
): {value: any; ok: boolean} {
	if (preservesCDATAStringParameter(paramName)) {
		return {value: null, ok: false};
	}

	const normalized = normalizeCDATAForStructuredParse(raw);
	if (!normalized.includes("<") || !normalized.includes(">")) {
		return {value: null, ok: false};
	}

	if (!cdataFragmentLooksExplicitlyStructured(normalized)) {
		return {value: null, ok: false};
	}

	const {value, ok} = parseXMLFragmentValue(normalized);
	if (!ok) return {value: null, ok: false};

	if (Array.isArray(value)) return {value, ok: true};
	if (value && typeof value === "object" && Object.keys(value).length > 0) {
		return {value, ok: true};
	}

	return {value: null, ok: false};
}

function normalizeCDATAForStructuredParse(raw: string): string {
	if (!raw) return "";
	const normalized = raw.replace(CDATA_BR_SEPARATOR_PATTERN, "\n");
	return decode(normalized.trim());
}

function cdataFragmentLooksExplicitlyStructured(raw: string): boolean {
	const trimmed = raw.trim();
	if (!trimmed) return false;

	const tags = trimmed.match(/<[^>]+>/g);
	if (!tags || tags.length < 2) return false;

	if (!trimmed.startsWith("<") || !trimmed.endsWith(">")) return false;

	return true;
}

function preservesCDATAStringParameter(name: string): boolean {
	const n = name.toLowerCase().trim();
	return [
		"content",
		"file_content",
		"text",
		"prompt",
		"query",
		"command",
		"cmd",
		"script",
		"code",
		"old_string",
		"new_string",
		"pattern",
		"path",
		"file_path",
	].includes(n);
}
