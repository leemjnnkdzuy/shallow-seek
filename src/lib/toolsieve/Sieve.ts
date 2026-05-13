import { SieveEvent, ToolSieveState } from "@/types/ToolSieve";
import {
	createToolSieveState,
	resetIncrementalToolState,
	noteText,
	insideCodeFenceWithState,
} from "./SieveState";
import { findToolMarkupTagOutsideIgnored, findMatchingToolMarkupClose } from "../toolcall/ToolScanner";
import { parseToolCallsDetailed } from "../toolcall/ToolParser";

export class StreamToolSieve {
	private state: ToolSieveState;

	constructor() {
		this.state = createToolSieveState();
	}

	public processChunk(chunk: string): SieveEvent[] {
		if (chunk) {
			this.state.pending += chunk;
		}

		const events: SieveEvent[] = [];

		while (true) {
			if (this.state.pendingToolCalls.length > 0) {
				events.push({
					type: "tool_calls",
					calls: this.state.pendingToolCalls as any,
				});
				this.state.pendingToolRaw = "";
				this.state.pendingToolCalls = [];
				continue;
			}

			// Nếu đang ở trạng thái capture (bên trong thẻ tool_calls)
			if (this.state.capturing) {
				if (this.state.pending) {
					this.state.capture += this.state.pending;
					this.state.pending = "";
				}

				const result = this.consumeToolCapture();
				if (!result.ready) break;

				const captured = this.state.capture;
				this.state.capture = "";
				this.state.capturing = false;
				resetIncrementalToolState(this.state);

				if (result.calls.length > 0) {
					if (result.prefix) {
						noteText(this.state, result.prefix);
						events.push({ type: "text", text: result.prefix });
					}
					this.state.pendingToolRaw = captured;
					this.state.pendingToolCalls = result.calls as any;
					if (result.suffix) {
						this.state.pending = result.suffix + this.state.pending;
					}
					continue;
				}

				// Nếu không có tool call hợp lệ nào trong khối bị capture
				if (result.prefix) {
					noteText(this.state, result.prefix);
					events.push({ type: "text", text: result.prefix });
				}
				if (result.suffix) {
					this.state.pending = result.suffix + this.state.pending;
				}
				continue;
			}

			const pending = this.state.pending;
			if (!pending) break;

			const start = this.findToolSegmentStart(pending);

			if (start >= 0) {
				const prefix = pending.slice(0, start);
				if (prefix) {
					noteText(this.state, prefix);
					events.push({ type: "text", text: prefix });
				}
				this.state.pending = "";
				this.state.capture = pending.slice(start);
				this.state.capturing = true;
				resetIncrementalToolState(this.state);
				continue;
			}

			// Split safe content để tránh cắt dở dang thẻ markup
			const [safe, hold] = this.splitSafeContent(pending);
			if (!safe && hold) break;

			this.state.pending = hold;
			if (safe) {
				noteText(this.state, safe);
				events.push({ type: "text", text: safe });
			}
			if (!safe) break;
		}

		return events;
	}

	private findToolSegmentStart(text: string): number {
		let offset = 0;
		while (true) {
			const tag = findToolMarkupTagOutsideIgnored(text, offset);
			if (!tag) return -1;

			// Kiểm tra xem thẻ có nằm trong code fence không
			if (insideCodeFenceWithState(this.state, text.slice(0, tag.Start))) {
				offset = tag.End + 1;
				continue;
			}

			// Chỉ quan tâm đến thẻ mở tool_calls
			if (!tag.Closing && tag.Name === "tool_calls") {
				return tag.Start;
			}
			offset = tag.End + 1;
		}
	}

	private splitSafeContent(text: string): [string, string] {
		// Giữ lại 20 ký tự cuối nếu có dấu '<' để tránh cắt dở dang thẻ
		const lastLt = text.lastIndexOf("<");
		if (lastLt >= 0 && lastLt > text.length - 20) {
			return [text.slice(0, lastLt), text.slice(lastLt)];
		}
		return [text, ""];
	}

	private consumeToolCapture() {
		const captured = this.state.capture;
		const tag = findToolMarkupTagOutsideIgnored(captured, 0);
		
		if (tag && !tag.Closing && tag.Name === "tool_calls") {
			const closeTag = findMatchingToolMarkupClose(captured, tag);
			if (closeTag) {
				const fullBlock = captured.slice(tag.Start, closeTag.End + 1);
				const parseResult = parseToolCallsDetailed(fullBlock);
				
				return {
					ready: true,
					prefix: captured.slice(0, tag.Start),
					calls: parseResult.Calls,
					suffix: captured.slice(closeTag.End + 1),
				};
			}
			// Chưa thấy thẻ đóng, tiếp tục capture
			return { ready: false, prefix: "", calls: [], suffix: "" };
		}

		// Nếu không phải thẻ tool_calls hợp lệ ở đầu
		return { ready: true, prefix: captured, calls: [], suffix: "" };
	}

	public flush(): SieveEvent[] {
		const events = this.processChunk("");
		if (this.state.capture) {
			events.push({ type: "text", text: this.state.capture });
			this.state.capture = "";
		}
		if (this.state.pending) {
			events.push({ type: "text", text: this.state.pending });
			this.state.pending = "";
		}
		return events;
	}
}
