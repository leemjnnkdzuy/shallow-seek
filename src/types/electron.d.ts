export {};

declare global {
	interface Window {
		electron?: {
			send: (channel: string, data: any) => void;
			receive: (channel: string, func: (...args: any[]) => void) => void;
			windowControls: {
				minimize: () => void;
				maximize: () => void;
				close: () => void;
				zoomIn: () => void;
				zoomOut: () => void;
				resetZoom: () => void;
				onWindowStateChange: (
					callback: (state: "maximized" | "unmaximized") => void,
				) => void;
				openAddAccount: () => void;
				openCreateApiKey: (token: string) => void;
				openSettings: () => void;
				notifyThemeChanged: (theme: string) => void;
				onThemeChanged: (callback: (theme: string) => void) => () => void;
				notifyLanguageChanged: (lang: string) => void;
				onLanguageChanged: (callback: (lang: string) => void) => () => void;
				openConfirm: (options: {
					title?: string;
					message?: string;
					confirmText?: string;
					cancelText?: string;
					variant?: "default" | "destructive" | "warning";
					type?: "question" | "danger" | "warning" | "success";
					showTitle?: boolean;
				}) => Promise<boolean>;
				confirmResult: (result: boolean) => void;
			};
			db: {
				addAccount: (account: {
					id: string;
					email: string;
					chat_token: string;
					platform_token?: string;
				}) => Promise<{success: boolean; error?: string}>;
				getAccounts: () => Promise<{
					success: boolean;
					data?: {id: string; email: string; chat_token: string; platform_token?: string}[];
					error?: string;
				}>;
				deleteAccount: (
					id: string,
				) => Promise<{success: boolean; error?: string}>;
				checkAccountExists: (
					email: string,
				) => Promise<{success: boolean; exists: boolean; error?: string}>;
				getSetting: (key: string) => Promise<{success: boolean; value?: string; error?: string}>;
				setSetting: (key: string, value: string) => Promise<{success: boolean; error?: string}>;
				getAllSettings: () => Promise<{success: boolean; data?: Record<string, string>; error?: string}>;
			};
			deepseek?: {
				login: (payload: {
					email: string;
					password: string;
					deviceId: string;
				}) => Promise<{
					ok: boolean;
					status?: number;
					data?: unknown;
					platformToken?: string | null;
					error?: {
						message: string;
						code?: string;
						status?: number;
						dataPreview?: string;
					};
				}>;
				fetchHistory: (payload: {
					token: string;
					cookies?: string;
				}) => Promise<{ok: boolean; data?: any; error?: any}>;
				fetchSessionMessages: (payload: {
					token: string;
					cookies?: string;
					sessionId: string;
				}) => Promise<{ok: boolean; data?: any; error?: any}>;
				createChatSession: (payload: {token: string; cookies?: string}) => Promise<{ok: boolean; data?: any; error?: any}>;
				deleteChatSession: (payload: {token: string; cookies?: string; sessionId: string}) => Promise<{ok: boolean; data?: any; error?: any}>;
				getApiKeys: (payload: {token: string}) => Promise<{ok: boolean; data?: any; error?: any}>;
				editApiKeys: (payload: {token: string; body: any}) => Promise<{ok: boolean; data?: any; error?: any}>;
				startChatStream: (payload: {
					token: string;
					cookies?: string;
					payload: any;
				}) => void;
				onChatChunk: (callback: (chunk: string) => void) => () => void;
				onChatEnd: (callback: () => void) => () => void;
				onChatError: (callback: (err: {message: string}) => void) => () => void;
			};
			server: {
				start: (config?: { token?: string; port?: number; apiKey?: string }) => Promise<{ ok: boolean; error?: string; port?: number }>;
				stop: () => Promise<{ ok: boolean; error?: string }>;
				status: () => Promise<{ isRunning: boolean }>;
				getLogs: () => Promise<{ logs: string[] }>;
				onLog: (callback: (msg: string) => void) => () => void;
				onStatusChanged: (callback: (isRunning: boolean) => void) => () => void;
			};
			log?: (payload: unknown) => void;
		};
	}
}
