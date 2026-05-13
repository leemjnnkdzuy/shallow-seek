import {repairInvalidJSONBackslashes, repairLooseJSON} from "./ToolJsonRepair";
import {decode} from "html-entities";

export function parseToolCallInput(v: any): Record<string, any> {
	if (v === null || v === undefined) {
		return {};
	}

	if (typeof v === "object" && !Array.isArray(v)) {
		return v as Record<string, any>;
	}

	if (typeof v === "string") {
		const raw = decode(v).trim();
		if (raw === "") {
			return {};
		}

		try {
			const parsed = JSON.parse(raw);
			if (
				parsed &&
				typeof parsed === "object" &&
				!Array.isArray(parsed)
			) {
				repairPathLikeControlChars(parsed);
				return parsed;
			}
		} catch (e) {
			// ignore and try repairs
		}

		const repaired = repairInvalidJSONBackslashes(raw);
		if (repaired !== raw) {
			try {
				const parsed = JSON.parse(repaired);
				if (
					parsed &&
					typeof parsed === "object" &&
					!Array.isArray(parsed)
				) {
					repairPathLikeControlChars(parsed);
					return parsed;
				}
			} catch (e) {
				// ignore
			}
		}

		const repairedLoose = repairLooseJSON(raw);
		if (repairedLoose !== raw) {
			try {
				const parsed = JSON.parse(repairedLoose);
				if (
					parsed &&
					typeof parsed === "object" &&
					!Array.isArray(parsed)
				) {
					repairPathLikeControlChars(parsed);
					return parsed;
				}
			} catch (e) {
				// ignore
			}
		}

		return {_raw: raw};
	}

	try {
		const b = JSON.stringify(v);
		const parsed = JSON.parse(b);
		if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
			return parsed;
		}
	} catch (e) {
		// ignore
	}

	return {};
}

function repairPathLikeControlChars(m: Record<string, any>): void {
	for (const k in m) {
		if (!Object.prototype.hasOwnProperty.call(m, k)) continue;

		const v = m[k];
		if (v && typeof v === "object" && !Array.isArray(v)) {
			repairPathLikeControlChars(v);
		} else if (Array.isArray(v)) {
			for (const item of v) {
				if (item && typeof item === "object" && !Array.isArray(item)) {
					repairPathLikeControlChars(item);
				}
			}
		} else if (typeof v === "string") {
			if (isPathLikeKey(k) && containsControlChar(v)) {
				m[k] = escapeControlChars(v);
			}
		}
	}
}

function isPathLikeKey(key: string): boolean {
	const k = key.trim().toLowerCase();
	return k.includes("path") || k.includes("file");
}

function containsControlChar(s: string): boolean {
	for (let i = 0; i < s.length; i++) {
		const code = s.charCodeAt(i);
		if (code < 32 || code === 127) {
			return true;
		}
	}
	return false;
}

function escapeControlChars(s: string): string {
	let out = "";
	for (let i = 0; i < s.length; i++) {
		const ch = s[i];
		switch (ch) {
			case "\b":
				out += "\\b";
				break;
			case "\f":
				out += "\\f";
				break;
			case "\n":
				out += "\\n";
				break;
			case "\r":
				out += "\\r";
				break;
			case "\t":
				out += "\\t";
				break;
			default:
				out += ch;
		}
	}
	return out;
}
