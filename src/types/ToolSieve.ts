export interface ParsedToolCall {
	name: string;
	input: Record<string, any>;
}

export interface ToolCallParseResult {
	calls: ParsedToolCall[];
	sawToolCallSyntax: boolean;
	rejectedByPolicy: boolean;
	rejectedToolNames: string[];
}

export interface ToolMarkupTag {
	name: string;
	closing: boolean;
	start: number;
	end: number;
	nameEnd: number;
	dsmlLike: boolean;
	canonical: boolean;
	selfClosing?: boolean;
}

export interface XmlElementBlock {
	attrs: string;
	body: string;
	start: number;
	end: number;
}

export interface SieveEvent {
	type: "text" | "tool_calls" | "tool_call_deltas";
	text?: string;
	calls?: ParsedToolCall[];
	deltas?: ToolCallDelta[];
}

export interface ToolCallDelta {
	index: number;
	name?: string;
	arguments?: string;
}

export interface ToolSieveState {
	pending: string;
	capture: string;
	capturing: boolean;
	codeFenceStack: number[];
	codeFencePendingTicks: number;
	codeFencePendingTildes: number;
	codeFenceLineStart: boolean;
	markdownCodeSpanTicks: number;
	pendingToolRaw: string;
	pendingToolCalls: ParsedToolCall[];
	disableDeltas: boolean;
	toolNameSent: boolean;
	toolName: string;
	toolArgsStart: number;
	toolArgsSent: number;
	toolArgsString: boolean;
	toolArgsDone: boolean;
}

export interface SieveConsumeResult {
	ready: boolean;
	prefix: string;
	calls: ParsedToolCall[];
	suffix: string;
}
