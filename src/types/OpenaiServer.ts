export interface AccountConfig {
	id: string;
	name?: string;
	email: string;
	password: string;
	token?: string;
}

export interface ApiKeyConfig {
	key: string;
	name?: string;
}

export interface ServerConfig {
	port: number;
	apiKeys: string[];
	accounts: AccountConfig[];
	modelAliases: Record<string, string>;
	autoDeleteMode: "none" | "single" | "all";
}

export interface ModelInfo {
	id: string;
	object: string;
	created: number;
	owned_by: string;
	permission?: any[];
}

export interface ContentPart {
	text: string;
	type: "thinking" | "text";
}

export interface OpenAIChatMessage {
	role: "system" | "user" | "assistant";
	content: string;
}

export interface OpenAIChatRequest {
	model: string;
	messages: OpenAIChatMessage[];
	stream?: boolean;
	temperature?: number;
	max_tokens?: number;
	top_p?: number;
	[key: string]: any;
}

export interface DeepSeekPowChallenge {
	algorithm: string;
	challenge: string;
	salt: string;
	expire_at: number;
	difficulty: number;
	signature: string;
	target_path: string;
}
