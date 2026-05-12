/**
 * SSE Parser for DeepSeek's JSON-patch streaming format.
 * Ported from ds2api/internal/sse/parser.go
 */
import type { ContentPart } from "./types";

const SKIP_CONTAINS_PATTERNS = [
	"quasi_status",
	"elapsed_secs",
	"token_usage",
	"pending_fragment",
	"conversation_mode",
	"fragments/-1/status",
	"fragments/-2/status",
	"fragments/-3/status",
];

const SKIP_EXACT_PATHS = new Set(["response/search_status"]);

const THINK_CLOSE = /<\/\s*think\s*>/gi;
const THINK_OPEN = /<\s*think\s*>/gi;

function isFragmentStatusPath(path: string): boolean {
	if (!path || path === "response/status") return false;
	if (!path.startsWith("response/fragments/") || !path.endsWith("/status")) return false;
	const mid = path.slice("response/fragments/".length, path.length - "/status".length).replace(/^-/, "");
	return mid.length > 0 && /^\d+$/.test(mid);
}

function shouldSkipPath(path: string): boolean {
	if (isFragmentStatusPath(path)) return true;
	if (SKIP_EXACT_PATHS.has(path)) return true;
	for (const p of SKIP_CONTAINS_PATTERNS) {
		if (path.includes(p)) return true;
	}
	return false;
}

function isStatusPath(path: string): boolean {
	return path === "response/status" || path === "status";
}

function stripThinkTags(s: string): string {
	return s.replace(THINK_CLOSE, "").replace(THINK_OPEN, "");
}

/**
 * Parse a single SSE data line.
 * Returns [chunk, isDone, isValid].
 */
export function parseDeepSeekSSELine(raw: string): [Record<string, any> | null, boolean, boolean] {
	const line = raw.trim();
	if (!line || !line.startsWith("data:")) return [null, false, false];
	const dataStr = line.slice(5).trim();
	if (dataStr === "[DONE]") return [null, true, true];
	try {
		const chunk = JSON.parse(dataStr);
		return [chunk, false, true];
	} catch {
		return [null, false, false];
	}
}

/**
 * Parse a DeepSeek SSE chunk for content, returning extracted content parts.
 */
export function parseSSEChunkForContent(
	chunk: Record<string, any>,
	thinkingEnabled: boolean,
	currentFragmentType: string,
): { parts: ContentPart[]; finished: boolean; nextType: string } {
	const v = chunk["v"];
	if (v === undefined) {
		return { parts: [], finished: false, nextType: currentFragmentType };
	}

	const path: string = chunk["p"] ?? "";
	if (shouldSkipPath(path)) {
		return { parts: [], finished: false, nextType: currentFragmentType };
	}

	// Status check
	if (isStatusPath(path) && typeof v === "string") {
		if (v.trim().toUpperCase() === "FINISHED") {
			return { parts: [], finished: true, nextType: currentFragmentType };
		}
		return { parts: [], finished: false, nextType: currentFragmentType };
	}

	let newType = currentFragmentType;
	const parts: ContentPart[] = [];

	// Update type from explicit path
	if (path === "response/content") newType = "text";
	else if (path === "response/thinking_content") {
		if (!thinkingEnabled || newType !== "text") newType = "thinking";
	}

	// Collect direct fragments
	if (path === "response/fragments" && (chunk["o"] ?? "").toString().toUpperCase() === "APPEND") {
		const frags = Array.isArray(v) ? v : [];
		for (const frag of frags) {
			if (typeof frag !== "object" || !frag) continue;
			const { typeName, content } = parseFragmentTypeContent(frag);
			switch (typeName) {
				case "THINK": case "THINKING":
					newType = "thinking";
					if (content) parts.push({ text: content, type: "thinking" });
					break;
				case "RESPONSE":
					newType = "text";
					if (content) parts.push({ text: content, type: "text" });
					break;
				default:
					if (content) parts.push({ text: content, type: "text" });
			}
		}
	}

	// Update type from nested response
	if (path === "response" && Array.isArray(v)) {
		for (const it of v) {
			if (typeof it !== "object" || !it) continue;
			if (it.p !== "fragments" || it.o !== "APPEND") continue;
			const frags = Array.isArray(it.v) ? it.v : [];
			for (const frag of frags) {
				if (typeof frag !== "object" || !frag) continue;
				const { typeName } = parseFragmentTypeContent(frag);
				if (typeName === "THINK" || typeName === "THINKING") newType = "thinking";
				else if (typeName === "RESPONSE") newType = "text";
			}
		}
	}

	// Resolve part type
	let partType: string;
	if (path === "response/thinking_content") {
		partType = (!thinkingEnabled || newType !== "text") ? "thinking" : "text";
	} else if (path === "response/content") {
		partType = "text";
	} else if (path.includes("response/fragments") && path.includes("/content")) {
		partType = newType;
	} else if (path === "") {
		partType = newType || "text";
	} else {
		partType = "text";
	}

	// Append chunk value content
	const appendResult = appendChunkValueContent(v, partType, path);
	if (appendResult.finished) {
		return { parts: [], finished: true, nextType: newType };
	}
	parts.push(...appendResult.parts);
	if (appendResult.newType) newType = appendResult.newType;

	// Split thinking parts (handle </think> tag)
	const { parts: splitParts, transitioned } = splitThinkingParts(parts);
	if (transitioned) newType = "text";

	// Drop thinking parts if not enabled
	const finalParts = thinkingEnabled
		? splitParts
		: splitParts.filter(p => p.type !== "thinking");

	return { parts: finalParts, finished: false, nextType: newType };
}

function parseFragmentTypeContent(m: Record<string, any>): { typeName: string; content: string } {
	const typeName = ((m.type || "") as string).toUpperCase();
	const content = (m.content || "") as string;
	return { typeName, content };
}

function appendChunkValueContent(
	v: any,
	partType: string,
	path: string,
): { parts: ContentPart[]; finished: boolean; newType?: string } {
	const parts: ContentPart[] = [];

	if (typeof v === "string") {
		if (v === "FINISHED" && (path === "" || path === "status")) {
			return { parts: [], finished: true };
		}
		if (isStatusPath(path)) return { parts: [], finished: false };
		if (v) parts.push({ text: v, type: partType as any });
		return { parts, finished: false };
	}

	if (Array.isArray(v)) {
		const result = extractContentRecursive(v, partType);
		if (result.finished) return { parts: [], finished: true };
		return { parts: result.parts, finished: false };
	}

	if (typeof v === "object" && v !== null) {
		// Try extracting text/content from the object
		if (path === "response/content" || path === "response/thinking_content" || path === "") {
			const text = v.text || v.content || "";
			if (text) {
				parts.push({ text, type: partType as any });
				return { parts, finished: false };
			}
		}
		// Wrapped fragments
		const resp = v.response || v;
		const frags = resp?.fragments;
		if (Array.isArray(frags)) {
			let newType: string | undefined;
			for (const item of frags) {
				if (typeof item !== "object" || !item) continue;
				const { typeName, content } = parseFragmentTypeContent(item);
				switch (typeName) {
					case "THINK": case "THINKING":
						newType = "thinking";
						if (content) parts.push({ text: content, type: "thinking" });
						break;
					case "RESPONSE":
						newType = "text";
						if (content) parts.push({ text: content, type: "text" });
						break;
					default:
						if (content) parts.push({ text: content, type: partType as any });
				}
			}
			return { parts, finished: false, newType };
		}
	}

	return { parts, finished: false };
}

function extractContentRecursive(
	items: any[],
	defaultType: string,
): { parts: ContentPart[]; finished: boolean } {
	const parts: ContentPart[] = [];
	for (const it of items) {
		if (typeof it !== "object" || !it) continue;
		const itemPath = (it.p || "") as string;
		const itemV = it.v;
		if (itemV === undefined) continue;

		if (isStatusPath(itemPath)) {
			if (typeof itemV === "string" && itemV.trim().toUpperCase() === "FINISHED") {
				return { parts: [], finished: true };
			}
			continue;
		}
		if (shouldSkipPath(itemPath)) continue;

		// Direct content field
		if (typeof it.content === "string" && it.content) {
			const typeName = ((it.type || "") as string).toUpperCase();
			switch (typeName) {
				case "THINK": case "THINKING":
					parts.push({ text: it.content, type: "thinking" });
					break;
				case "RESPONSE":
					parts.push({ text: it.content, type: "text" });
					break;
				default:
					parts.push({ text: it.content, type: defaultType as any });
			}
			continue;
		}

		const partType = itemPath.includes("thinking") ? "thinking"
			: (itemPath.includes("content") || itemPath === "response" || itemPath === "fragments") ? "text"
			: defaultType;

		if (typeof itemV === "string") {
			if (isStatusPath(itemPath)) continue;
			if (itemV && itemV !== "FINISHED") {
				parts.push({ text: itemV, type: partType as any });
			}
		} else if (Array.isArray(itemV)) {
			for (const inner of itemV) {
				if (typeof inner === "object" && inner?.content) {
					const typeName = ((inner.type || "") as string).toUpperCase();
					switch (typeName) {
						case "THINK": case "THINKING":
							parts.push({ text: inner.content, type: "thinking" });
							break;
						case "RESPONSE":
							parts.push({ text: inner.content, type: "text" });
							break;
						default:
							parts.push({ text: inner.content, type: partType as any });
					}
				} else if (typeof inner === "string" && inner) {
					parts.push({ text: inner, type: partType as any });
				}
			}
		}
	}
	return { parts, finished: false };
}

function splitThinkingParts(parts: ContentPart[]): { parts: ContentPart[]; transitioned: boolean } {
	const out: ContentPart[] = [];
	let thinkingDone = false;

	for (const p of parts) {
		if (thinkingDone && p.type === "thinking") {
			const cleaned = stripThinkTags(p.text);
			if (cleaned) out.push({ text: cleaned, type: "text" });
			continue;
		}
		if (p.type !== "thinking") {
			const cleaned = stripThinkTags(p.text);
			if (cleaned) out.push({ text: cleaned, type: p.type });
			continue;
		}
		const match = THINK_CLOSE.exec(p.text);
		THINK_CLOSE.lastIndex = 0; // reset regex
		if (!match) {
			out.push(p);
			continue;
		}
		thinkingDone = true;
		const before = p.text.slice(0, match.index);
		const after = stripThinkTags(p.text.slice(match.index + match[0].length));
		if (before) out.push({ text: before, type: "thinking" });
		if (after) out.push({ text: after, type: "text" });
	}

	return { parts: out, transitioned: thinkingDone };
}

/** Check if chunk indicates content filter. */
export function hasContentFilterStatus(chunk: Record<string, any>): boolean {
	const code = chunk.code;
	if (typeof code === "string" && code.trim().toLowerCase() === "content_filter") return true;
	return hasContentFilterStatusValue(chunk);
}

function hasContentFilterStatusValue(v: any): boolean {
	if (Array.isArray(v)) return v.some(item => hasContentFilterStatusValue(item));
	if (typeof v === "object" && v !== null) {
		const p = v.p;
		if (typeof p === "string" && p.toLowerCase().includes("status")) {
			if (typeof v.v === "string" && v.v.trim().toLowerCase() === "content_filter") return true;
		}
		if (typeof v.code === "string" && v.code.trim().toLowerCase() === "content_filter") return true;
		for (const val of Object.values(v)) {
			if (hasContentFilterStatusValue(val)) return true;
		}
	}
	return false;
}
