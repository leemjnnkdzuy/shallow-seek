export const SKIP_CONTAINS_PATTERNS = [
	"quasi_status",
	"elapsed_secs",
	"token_usage",
	"pending_fragment",
	"conversation_mode",
	"fragments/-1/status",
	"fragments/-2/status",
	"fragments/-3/status",
];

export const SKIP_EXACT_PATHS = new Set(["response/search_status"]);

export const THINK_CLOSE_PATTERN = /<\/\s*think\s*>/gi;
export const THINK_OPEN_PATTERN = /<\s*think\s*>/gi;
