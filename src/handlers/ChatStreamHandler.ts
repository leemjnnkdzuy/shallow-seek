export interface StreamParserCallbacks {
	setIsStreaming: (streaming: boolean) => void;
	setParentMessageId: (id: number) => void;
	onAppendText: (text: string, messageId?: number) => void;
}

export function parseStreamLine(
	line: string,
	currentEventType: string,
	callbacks: StreamParserCallbacks
): string {
	const trimmedLine = line.trim();
	if (!trimmedLine) {
		return "";
	}

	if (trimmedLine.startsWith("event:") || trimmedLine.startsWith("event: ")) {
		const eventType = trimmedLine.replace(/^event:\s*/, "").trim();
		if (eventType === "close") {
			callbacks.setIsStreaming(false);
		}
		return eventType;
	}

	if (trimmedLine.startsWith("data: ") || trimmedLine.startsWith("data:")) {
		const data = trimmedLine.replace(/^data:\s*/, "").trim();
		if (data === "[DONE]") {
			callbacks.setIsStreaming(false);
			return currentEventType;
		}
		if (!data) return currentEventType;

		try {
			const parsed = JSON.parse(data);

			if (currentEventType === "ready" && parsed.response_message_id) {
				callbacks.setParentMessageId(parsed.response_message_id);
				return currentEventType;
			}

			if (currentEventType === "update_session" || currentEventType === "close") {
				return currentEventType;
			}

			let textDelta = "";
			let responseMessageId: number | undefined;
			let isFinished = false;

			if (parsed?.v?.response) {
				const resp = parsed.v.response;
				if (resp.message_id) {
					responseMessageId = resp.message_id;
				}
				if (resp.fragments && Array.isArray(resp.fragments)) {
					for (const frag of resp.fragments) {
						if (frag.content) {
							textDelta += frag.content;
						}
					}
				}
				if (resp.status === "FINISHED") {
					isFinished = true;
				}
			} else if (parsed?.o === "APPEND" && typeof parsed?.v === "string") {
				textDelta = parsed.v;
			} else if (parsed?.o === "SET") {
				if (parsed.p === "response/status" && parsed.v === "FINISHED") {
					isFinished = true;
				}
			} else if (parsed?.o === "BATCH" && Array.isArray(parsed?.v)) {
				for (const patch of parsed.v) {
					if (patch.p === "quasi_status" && patch.v === "FINISHED") {
						isFinished = true;
					}
				}
			} else if (typeof parsed?.v === "string" && !parsed?.p && !parsed?.o) {
				textDelta = parsed.v;
			} else if (Array.isArray(parsed?.v)) {
				for (const patch of parsed.v) {
					if (
						(patch.p === "text" || patch.p === "message/content") &&
						typeof patch.v === "string"
					) {
						textDelta += patch.v;
					}
				}
			} else if (
				parsed?.v &&
				typeof parsed.v === "string" &&
				(parsed.p === "text" || parsed.p === "message/content")
			) {
				textDelta = parsed.v;
			} else if (parsed?.choices?.[0]?.delta?.content) {
				textDelta = parsed.choices[0].delta.content;
			} else if (parsed?.message?.content) {
				textDelta = parsed.message.content;
			}

			if (textDelta) {
				callbacks.onAppendText(
					textDelta,
					responseMessageId || parsed.message_id || parsed.id
				);
			}

			if (isFinished) {
				callbacks.setIsStreaming(false);
			}
		} catch (e) {
			// ignore parse errors
		}
	}

	return currentEventType;
}
