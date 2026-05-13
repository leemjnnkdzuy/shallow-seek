import type { ModelInfo } from "@/types";

const NO_THINKING_SUFFIX = "-nothinking";

export const DEEPSEEK_BASE_MODELS: ModelInfo[] = [
	{ id: "deepseek-v4-flash", object: "model", created: 1677610602, owned_by: "deepseek" },
	{ id: "deepseek-v4-pro", object: "model", created: 1677610602, owned_by: "deepseek" },
	{ id: "deepseek-v4-flash-search", object: "model", created: 1677610602, owned_by: "deepseek" },
	{ id: "deepseek-v4-pro-search", object: "model", created: 1677610602, owned_by: "deepseek" },
	{ id: "deepseek-v4-vision", object: "model", created: 1677610602, owned_by: "deepseek" },
];

function appendNoThinkingVariants(models: ModelInfo[]): ModelInfo[] {
	const out: ModelInfo[] = [];
	for (const model of models) {
		out.push(model);
		out.push({ ...model, id: model.id + NO_THINKING_SUFFIX });
	}
	return out;
}

export const ALL_MODELS = appendNoThinkingVariants(DEEPSEEK_BASE_MODELS);

export function getModelConfig(model: string): { thinking: boolean; search: boolean; ok: boolean } {
	const { base, noThinking } = splitNoThinking(model);
	switch (base) {
		case "deepseek-v4-flash":
		case "deepseek-v4-pro":
		case "deepseek-v4-vision":
			return { thinking: !noThinking, search: false, ok: true };
		case "deepseek-v4-flash-search":
		case "deepseek-v4-pro-search":
			return { thinking: !noThinking, search: true, ok: true };
		default:
			return { thinking: false, search: false, ok: false };
	}
}

export function getModelType(model: string): string | null {
	const { base } = splitNoThinking(model);
	switch (base) {
		case "deepseek-v4-flash":
		case "deepseek-v4-flash-search":
			return "default";
		case "deepseek-v4-pro":
		case "deepseek-v4-pro-search":
			return "expert";
		case "deepseek-v4-vision":
			return "vision";
		default:
			return null;
	}
}

export function isSupportedModel(model: string): boolean {
	return getModelConfig(model).ok;
}

export const DEFAULT_MODEL_ALIASES: Record<string, string> = {
	// OpenAI GPT
	"gpt-4": "deepseek-v4-flash",
	"gpt-4-turbo": "deepseek-v4-flash",
	"gpt-4o": "deepseek-v4-flash",
	"gpt-4o-mini": "deepseek-v4-flash",
	"gpt-4.1": "deepseek-v4-flash",
	"gpt-4.1-mini": "deepseek-v4-flash",
	"gpt-4.1-nano": "deepseek-v4-flash",
	"gpt-5": "deepseek-v4-flash",
	"gpt-5.5": "deepseek-v4-flash",
	"gpt-5.3-codex": "deepseek-v4-pro",
	"gpt-5-codex": "deepseek-v4-pro",
	"codex-mini-latest": "deepseek-v4-pro",
	// Reasoning
	"o1": "deepseek-v4-pro",
	"o1-mini": "deepseek-v4-pro",
	"o3": "deepseek-v4-pro",
	"o3-mini": "deepseek-v4-pro",
	"o4-mini": "deepseek-v4-pro",
	// Claude
	"claude-opus-4-6": "deepseek-v4-pro",
	"claude-sonnet-4-6": "deepseek-v4-flash",
	"claude-haiku-4-5": "deepseek-v4-flash",
	"claude-sonnet-4-5": "deepseek-v4-flash",
	"claude-opus-4-0": "deepseek-v4-pro",
	"claude-3-5-sonnet-latest": "deepseek-v4-flash",
	"claude-3-opus-20240229": "deepseek-v4-pro",
	// Gemini
	"gemini-2.5-pro": "deepseek-v4-pro",
	"gemini-2.5-flash": "deepseek-v4-flash",
	"gemini-2.0-flash": "deepseek-v4-flash",
	"gemini-3.1-pro": "deepseek-v4-pro",
	"gemini-3-flash": "deepseek-v4-flash",
};

export function resolveModel(
	requested: string,
	customAliases?: Record<string, string>,
): string | null {
	const model = requested.trim().toLowerCase();
	if (!model) return null;

	const aliases = { ...DEFAULT_MODEL_ALIASES, ...(customAliases || {}) };

	if (isSupportedModel(model)) return model;

	const mapped = aliases[model];
	if (mapped && isSupportedModel(mapped)) return mapped;

	const { base, noThinking } = splitNoThinking(model);
	const baseMapped = aliases[base];
	if (baseMapped && isSupportedModel(baseMapped)) {
		return noThinking ? baseMapped + NO_THINKING_SUFFIX : baseMapped;
	}

	return null;
}

function splitNoThinking(model: string): { base: string; noThinking: boolean } {
	const m = model.trim().toLowerCase();
	if (m.endsWith(NO_THINKING_SUFFIX)) {
		return { base: m.slice(0, -NO_THINKING_SUFFIX.length), noThinking: true };
	}
	return { base: m, noThinking: false };
}

export function openAIModelsResponse(): Record<string, any> {
	return { object: "list", data: ALL_MODELS };
}
