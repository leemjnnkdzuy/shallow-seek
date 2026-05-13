import { WindowControlsAPI, DbAPI, DeepseekAPI, ServerAPI } from "@/types";

declare global {
	interface Window {
		electron?: {
			send: (channel: string, data: any) => void;
			receive: (channel: string, func: (...args: any[]) => void) => void;
			windowControls: WindowControlsAPI;
			db: DbAPI;
			deepseek?: DeepseekAPI;
			server: ServerAPI;
			log?: (payload: unknown) => void;
		};
	}
}

export {};
