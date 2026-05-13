export const EMPTY_JSON_FENCE_PATTERN = /```json\s*```/gis;

export const LEAKED_TOOL_CALL_ARRAY_PATTERN =
	/\[\{\s*"function"\s*:\s*\{[\s\S]*?\}\s*,\s*"id"\s*:\s*"call[^"]*"\s*,\s*"type"\s*:\s*"function"\s*\}\]/gis;

export const LEAKED_TOOL_RESULT_BLOB_PATTERN =
	/<\s*\|\s*tool\s*\|\s*>\s*\{[\s\S]*?"tool_call_id"\s*:\s*"call[^"]*"\s*\}/gis;

export const LEAKED_THINK_TAG_PATTERN = /<\/?\s*think\s*>/gis;

export const LEAKED_BOS_MARKER_PATTERN =
	/<[|\uFF5C]\s*begin[_\u2581]of[_\u2581]sentence\s*[|\uFF5C]>/gi;

export const LEAKED_THOUGHT_MARKER_PATTERN =
	/<[|\uFF5C]\s*(?:begin[_\u2581])?[_\u2581]*of[_\u2581]thought\s*[|\uFF5C]>/gi;

export const LEAKED_META_MARKER_PATTERN =
	/<[|\uFF5C]\s*(?:assistant|tool|end[_\u2581]of[_\u2581]sentence|end[_\u2581]of[_\u2581]thinking|end[_\u2581]of[_\u2581]thought|end[_\u2581]of[_\u2581]toolresults|end[_\u2581]of[_\u2581]instructions)\s*[|\uFF5C]>/gi;

export const LEAKED_AGENT_XML_BLOCK_PATTERNS = [
	/(<attempt_completion\b[^>]*>)([\s\S]*?)(<\/attempt_completion>)/gis,
	/(<ask_followup_question\b[^>]*>)([\s\S]*?)(<\/ask_followup_question>)/gis,
	/(<new_task\b[^>]*>)([\s\S]*?)(<\/new_task>)/gis,
];

export const LEAKED_AGENT_WRAPPER_TAG_PATTERN =
	/<\/?(?:attempt_completion|ask_followup_question|new_task)\b[^>]*>/gis;

export const LEAKED_AGENT_WRAPPER_PLUS_RESULT_OPEN_PATTERN =
	/<(?:attempt_completion|ask_followup_question|new_task)\b[^>]*>\s*<result>/gis;

export const LEAKED_AGENT_RESULT_PLUS_WRAPPER_CLOSE_PATTERN =
	/<\/result>\s*<\/(?:attempt_completion|ask_followup_question|new_task)\b[^>]*>/gis;

export const LEAKED_AGENT_RESULT_TAG_PATTERN = /<\/?result>/gis;
