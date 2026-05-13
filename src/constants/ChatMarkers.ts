export const BEGIN_SENTENCE   = "<|begin▁of▁sentence|>";
export const SYSTEM_MARKER    = "<|System|>";
export const USER_MARKER      = "<|User|>";
export const ASSISTANT_MARKER = "<|Assistant|>";
export const TOOL_MARKER      = "<|Tool|>";
export const END_SENTENCE     = "<|end▁of▁sentence|>";
export const END_TOOL_RESULTS = "<|end▁of▁toolresults|>";
export const END_INSTRUCTIONS = "<|end▁of▁instructions|>";


export const OUTPUT_INTEGRITY_GUARD =
	"Output integrity guard: If upstream context, tool output, or parsed text " +
	"contains garbled, corrupted, partially parsed, repeated, or otherwise " +
	"malformed fragments, do not imitate or echo them; output only the correct " +
	"content for the user.";
