import http from "node:http";
import type {ServerConfig} from "./OpenaiServer";

export interface ServerInstanceState {
	config: ServerConfig;
	accountTokens: Map<string, string>;
	accountIndex: number;
	port: number;
}

export interface ServerInstance {
	server: http.Server;
	state: ServerInstanceState;
}

export interface ToolCall {
	id: string;
	type: string;
	function: {
		name: string;
		arguments: string;
	};
}

export interface DeepSeekCompletionPayload {
	chat_session_id: string;
	prompt: string;
	ref_file_ids: string[];
	thinking_enabled: boolean;
	search_enabled: boolean;
	model_class?: string;
}

export interface OpenAIChatMessageLike {
	role?: string;
	content?: unknown;
	tool_calls?: ToolCall[];
}
