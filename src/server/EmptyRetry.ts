export const EMPTY_OUTPUT_RETRY_SUFFIX =
	"Previous reply had no visible output. Please regenerate the visible final answer or tool call now.";

export const EMPTY_OUTPUT_RETRY_MAX_ATTEMPTS = 1;

export function shouldRetryEmptyOutput(
	visibleText: string,
	hasToolCalls: boolean,
	contentFilter: boolean,
	attempts: number,
	maxAttempts = EMPTY_OUTPUT_RETRY_MAX_ATTEMPTS,
): boolean {
	return (
		attempts < maxAttempts &&
		!contentFilter &&
		!hasToolCalls &&
		!visibleText.trim()
	);
}

export function clonePayloadForEmptyOutputRetry(
	payload: Record<string, any>,
	parentMessageId: number | null,
): Record<string, any> {
	const clone = {...payload};
	const original = typeof payload.prompt === "string" ? payload.prompt : "";
	clone.prompt = appendEmptyOutputRetrySuffix(original);
	if (parentMessageId && parentMessageId > 0) {
		clone.parent_message_id = parentMessageId;
	}
	return clone;
}

export function appendEmptyOutputRetrySuffix(prompt: string): string {
	const trimmed = prompt.replace(/[\r\n\t ]+$/, "");
	if (!trimmed) return EMPTY_OUTPUT_RETRY_SUFFIX;
	return `${trimmed}\n\n${EMPTY_OUTPUT_RETRY_SUFFIX}`;
}
