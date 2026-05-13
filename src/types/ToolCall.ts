export interface PromptToolExample {
	name: string;
	params: string;
}

export interface ToolDefinition {
	type: "function";
	function: {
		name: string;
		description?: string;
		parameters?: Record<string, any>;
	};
}

export interface ToolMarkupTag {
	Start: number;
	End: number;
	NameStart: number;
	NameEnd: number;
	Name: string;
	Closing: boolean;
	SelfClosing: boolean;
	DSMLLike: boolean;
	Canonical: boolean;
}

export interface ParsedToolCall {
	Name: string;
	Input: Record<string, any>;
}

export interface ToolCallParseResult {
	Calls: ParsedToolCall[];
	SawToolCallSyntax: boolean;
	RejectedByPolicy: boolean;
	RejectedToolNames: string[];
}

export interface XMLElementBlock {
	Attrs: string;
	Body: string;
	Start: number;
	End: number;
}
