export interface DeepseekAPI {
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
	}) => Promise<{ ok: boolean; data?: any; error?: any }>;
	fetchSessionMessages: (payload: {
		token: string;
		cookies?: string;
		sessionId: string;
	}) => Promise<{ ok: boolean; data?: any; error?: any }>;
	createChatSession: (payload: { token: string; cookies?: string }) => Promise<{ ok: boolean; data?: any; error?: any }>;
	deleteChatSession: (payload: { token: string; cookies?: string; sessionId: string }) => Promise<{ ok: boolean; data?: any; error?: any }>;
	getApiKeys: (payload: { token: string }) => Promise<{ ok: boolean; data?: any; error?: any }>;
	editApiKeys: (payload: { token: string; body: any }) => Promise<{ ok: boolean; data?: any; error?: any }>;
	uploadFile: (payload: { token: string; filePath: string; fileName: string; fileSize?: number }) => Promise<{ ok: boolean; data?: any; error?: any }>;
	fetchFiles: (payload: { token: string; fileIds: string[] }) => Promise<{ ok: boolean; data?: any; error?: any }>;
	saveTempFile: (payload: { base64Data: string; fileName: string }) => Promise<{ ok: boolean; filePath?: string; error?: any }>;
	startChatStream: (payload: {
		token: string;
		cookies?: string;
		payload: any;
	}) => void;
	onChatChunk: (callback: (chunk: string) => void) => () => void;
	onChatEnd: (callback: () => void) => () => void;
	onChatError: (callback: (err: { message: string }) => void) => () => void;
}
