import {preservesCDATAStringParameter} from "@/lib/toolsieve";
import {repairInvalidJSONBackslashes, repairLooseJSON} from "./ToolJsonRepair";
import {parseXMLFragmentValue} from "./ToolXml";

export function parseLooseJSONArrayValue(
	raw: string,
	paramName: string,
): any[] | null {
	if (preservesCDATAStringParameter(paramName)) {
		return null;
	}

	const trimmed = raw.trim();
	if (!trimmed) return null;

	const candidate = parseLooseArrayElementValue(trimmed);
	if (candidate.ok) {
		const coerced = coerceArrayValue(candidate.value, paramName);
		if (coerced) return coerced;
	}

	const segments = splitTopLevelJSONValues(trimmed);
	if (!segments) return null;

	const out: any[] = [];
	for (const segment of segments) {
		const parsed = parseLooseArrayElementValue(segment);
		if (!parsed.ok) return null;
		out.push(parsed.value);
	}
	return out;
}

function parseLooseArrayElementValue(raw: string): {value: any; ok: boolean} {
	const trimmed = raw.trim();
	if (!trimmed) return {value: null, ok: false};

	try {
		return {value: JSON.parse(trimmed), ok: true};
	} catch {}

	const repairedBackslashes = repairInvalidJSONBackslashes(trimmed);
	if (repairedBackslashes !== trimmed) {
		try {
			return {value: JSON.parse(repairedBackslashes), ok: true};
		} catch {}
	}

	const repairedLoose = repairLooseJSON(trimmed);
	if (repairedLoose !== trimmed) {
		try {
			return {value: JSON.parse(repairedLoose), ok: true};
		} catch {}
	}

	if (trimmed.includes("<") && trimmed.includes(">")) {
		const xmlParsed = parseXMLFragmentValue(trimmed);
		if (xmlParsed.ok) return xmlParsed;
	}

	return {value: null, ok: false};
}

export function coerceArrayValue(value: any, paramName: string): any[] | null {
	if (Array.isArray(value)) return value;

	if (typeof value === "object" && value !== null) {
		const keys = Object.keys(value);
		if (keys.length === 1) {
			if (keys[0] === "item") {
				const items = (value as any).item;
				return Array.isArray(items) ? items : [items];
			}
			if (paramName && keys[0] === paramName) {
				const wrapped = (value as any)[paramName];
				return Array.isArray(wrapped) ? wrapped : [wrapped];
			}
		}
	}
	return null;
}

function splitTopLevelJSONValues(raw: string): string[] | null {
	const trimmed = raw.trim();
	if (!trimmed) return null;

	const values: string[] = [];
	let start = 0;
	let depth = 0;
	let inString = false;
	let escaped = false;

	for (let i = 0; i < trimmed.length; i++) {
		const ch = trimmed[i];
		if (inString) {
			if (escaped) {
				escaped = false;
				continue;
			}
			if (ch === "\\") {
				escaped = true;
			} else if (ch === '"') {
				inString = false;
			}
			continue;
		}

		switch (ch) {
			case '"':
				inString = true;
				break;
			case "{":
			case "[":
				depth++;
				break;
			case "}":
			case "]":
				if (depth > 0) depth--;
				break;
			case ",":
				if (depth === 0) {
					const segment = trimmed.slice(start, i).trim();
					if (!segment) return null;
					values.push(segment);
					start = i + 1;
				}
				break;
		}
	}

	const last = trimmed.slice(start).trim();
	if (!last) return null;
	values.push(last);

	return values.length >= 2 ? values : null;
}
