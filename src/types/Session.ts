export interface HistoryMessage {
	role: string;
	content: string;
	tokenEstimate: number;
	timestamp: number;
}

export interface ActiveSession {
	sessionId: string;
	token: string;
	history: HistoryMessage[];
	totalTokens: number;
	createdAt: number;
	lastUsedAt: number;
	requestCount: number;
	contextSummary: string;
	lastMessageId: number | null;
}
