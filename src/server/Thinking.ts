import type {ThinkingConfig} from "@/types/Thinking";

export function resolveThinkingAndSearch(
	request: Record<string, any>,
	modelDefaults: ThinkingConfig,
): ThinkingConfig {
	const resolved: ThinkingConfig = {...modelDefaults};

	const [thinkingOverride, hasThinkingOverride] =
		resolveThinkingOverride(request);
	if (hasThinkingOverride) {
		resolved.thinking = thinkingOverride;
	}

	const [searchOverride, hasSearchOverride] = resolveSearchOverride(request);
	if (hasSearchOverride) {
		resolved.search = searchOverride;
	}

	return resolved;
}

function resolveThinkingOverride(req: Record<string, any>): [boolean, boolean] {
	if (!req) return [false, false];

	const [t1, ok1] = parseThinkingSetting(req.thinking);
	if (ok1) return [t1, true];

	const [t2, ok2] = parseReasoningSetting(req.reasoning);
	if (ok2) return [t2, true];

	const [t3, ok3] = parseReasoningEffort(req.reasoning_effort);
	if (ok3) return [t3, true];

	if (req.extra_body && typeof req.extra_body === "object") {
		const eb = req.extra_body as Record<string, any>;

		const [et1, eok1] = parseThinkingSetting(eb.thinking);
		if (eok1) return [et1, true];

		const [et2, eok2] = parseReasoningSetting(eb.reasoning);
		if (eok2) return [et2, true];

		const [et3, eok3] = parseReasoningEffort(eb.reasoning_effort);
		if (eok3) return [et3, true];
	}

	return [false, false];
}

function resolveSearchOverride(req: Record<string, any>): [boolean, boolean] {
	if (!req) return [false, false];

	const s1 = req.search ?? req.search_enabled;
	if (typeof s1 === "boolean") return [s1, true];

	if (req.extra_body && typeof req.extra_body === "object") {
		const eb = req.extra_body as Record<string, any>;
		const es = eb.search ?? eb.search_enabled;
		if (typeof es === "boolean") return [es, true];
	}

	return [false, false];
}

function parseThinkingSetting(raw: any): [boolean, boolean] {
	if (typeof raw === "boolean") return [raw, true];

	if (typeof raw === "string") {
		const s = raw.toLowerCase().trim();
		if (["enabled", "enable", "on", "true"].includes(s))
			return [true, true];
		if (["disabled", "disable", "off", "false", "none"].includes(s))
			return [false, true];
		return [false, false];
	}

	if (raw && typeof raw === "object" && !Array.isArray(raw)) {
		if (raw.type !== undefined) {
			return parseThinkingSetting(raw.type);
		}
	}

	return [false, false];
}

function parseReasoningSetting(raw: any): [boolean, boolean] {
	if (typeof raw === "boolean") return [raw, true];

	if (typeof raw === "string") {
		return parseReasoningEffort(raw);
	}

	if (raw && typeof raw === "object" && !Array.isArray(raw)) {
		for (const key of ["effort", "type", "enabled"]) {
			const [val, ok] = parseReasoningSetting(raw[key]);
			if (ok) return [val, true];
		}
	}

	return [false, false];
}

function parseReasoningEffort(raw: any): [boolean, boolean] {
	const s = String(raw ?? "")
		.toLowerCase()
		.trim();
	if (["minimal", "low", "medium", "high", "xhigh"].includes(s))
		return [true, true];
	if (["none", "disabled", "disable", "off", "false"].includes(s))
		return [false, true];
	return [false, false];
}
