// ── Payloads for IPC handlers (main-process side) ──

export interface LoginPayload {
	email?: string;
	password?: string;
	deviceId?: string;
}

export interface LoginResult {
	ok: boolean;
	status?: number;
	data?: unknown;
	platformToken?: string | null;
	proxy?: string;
	error?: {
		message: string;
		code?: string;
		status?: number;
		dataPreview?: string;
	};
}

export interface TokenPayload {
	token: string;
	cookies?: string;
}

export interface SessionPayload extends TokenPayload {
	sessionId: string;
}

export interface ChatStreamPayload {
	token: string;
	cookies?: string;
	payload: any;
}

export interface UploadFilePayload {
	token: string;
	cookies?: string;
	filePath: string;
	fileName: string;
	fileSize?: number;
}

export interface FetchFilesPayload {
	token: string;
	fileIds: string[];
}

export interface SaveTempFilePayload {
	base64Data: string;
	fileName: string;
}

export interface EditApiKeysPayload {
	token: string;
	body: any;
}

export interface IpcResult<T = any> {
	ok: boolean;
	data?: T;
	error?: { message: string } | any;
}

export interface SaveTempFileResult {
	ok: boolean;
	filePath?: string;
	error?: { message: string };
}
