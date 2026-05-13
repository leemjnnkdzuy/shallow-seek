import http from "node:http";
import type {ServerConfig} from "@/types/OpenaiServer";
import type {SessionManager} from "@/server/SessionManager";
import type {ToolCall} from "@/types/Tool";
import type {DeepSeekCompletionPayload} from "@/types/DeepseekInternal";
import type {OpenAIChatMessageLike} from "@/types/OpenaiServer";

export {ToolCall, DeepSeekCompletionPayload, OpenAIChatMessageLike};

export interface ServerInstanceState {
	config: ServerConfig;
	accountTokens: Map<string, string>;
	accountIndex: number;
	port: number;
	sessionManager: SessionManager;
}

export interface ServerInstance {
	server: http.Server;
	state: ServerInstanceState;
}
