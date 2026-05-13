export interface StreamParserCallbacks {
	setIsStreaming: (streaming: boolean) => void;
	setParentMessageId: (id: number) => void;
	onAppendText: (text: string, messageId?: number) => void;
	onUpdateSearchResults?: (results: any[], messageId?: number) => void;
}
