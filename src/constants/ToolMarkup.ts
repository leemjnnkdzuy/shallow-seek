export const TOOL_MARKUP_NAMES = [
	{canonical: "tool_calls", raw: "tool_calls"},
	{canonical: "tool_calls", raw: "tool-calls", dsmlOnly: true},
	{canonical: "tool_calls", raw: "toolcalls", dsmlOnly: true},
	{canonical: "invoke", raw: "invoke"},
	{canonical: "parameter", raw: "parameter"},
];

export const TOOL_KEYWORD_FOLD_MAP: Record<string, string> = {
	а: "a",
	α: "a",
	с: "c",
	С: "c",
	ϲ: "c",
	Ϲ: "c",
	ԁ: "d",
	ⅾ: "d",
	е: "e",
	Е: "e",
	Ε: "e",
	ε: "e",
	і: "i",
	І: "i",
	Ι: "i",
	ι: "i",
	ı: "i",
	к: "k",
	К: "k",
	Κ: "k",
	κ: "k",
	ⅼ: "l",
	м: "m",
	М: "m",
	Μ: "m",
	μ: "m",
	ո: "n",
	о: "o",
	О: "o",
	Ο: "o",
	ο: "o",
	р: "p",
	Р: "p",
	Ρ: "p",
	ρ: "p",
	ѕ: "s",
	Ѕ: "s",
	т: "t",
	Т: "t",
	Τ: "t",
	τ: "t",
	ν: "v",
	Ν: "v",
	ѵ: "v",
	ⅴ: "v",
};

export const TOOL_MARKUP_EQUALS_CHARS = ["=", "＝", "﹦", "꞊"];
export const XML_TAG_START_CHARS = ["<", "＜", "﹤", "〈"];
export const XML_TAG_END_CHARS = [">", "＞", "﹥", "〉"];
export const TOOL_MARKUP_SLASH_CHARS = ["/", "／", "∕", "⁄", "⧸"];
export const TOOL_MARKUP_PIPE_CHARS = ["|", "│", "∣", "❘", "ǀ", "￨"];
export const TOOL_MARKUP_DASH_CHARS = [
	"_",
	"＿",
	"﹍",
	"﹎",
	"﹏",
	"-",
	"‐",
	"‑",
	"‒",
	"–",
	"—",
	"―",
	"−",
	"﹣",
	"－",
];

export const XML_QUOTE_PAIRS: Record<string, string> = {
	'"': '"',
	"'": "'",
	"“": "”",
	"‘": "’",
	"＂": "＂",
	"＇": "＇",
	"„": "”",
	"‟": "”",
};

export const XML_ATTR_PATTERN =
	/\b([a-z0-9_:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/gis;
export const CDATA_BR_SEPARATOR_PATTERN = /<br\s*\/?>/gi;
