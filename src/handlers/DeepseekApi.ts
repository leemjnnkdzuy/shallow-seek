import axios from "axios";
import fs from "node:fs";
import FormData from "form-data";
import {
	DEEPSEEK_HISTORY_URL,
	DEEPSEEK_HISTORY_MESSAGES_URL,
	DEEPSEEK_CREATE_SESSION_URL,
	DEEPSEEK_DELETE_SESSION_URL,
	DEEPSEEK_PLATFORM_GET_API_KEYS_URL,
	DEEPSEEK_PLATFORM_EDIT_API_KEYS_URL,
	DEEPSEEK_CREATE_POW_URL,
	DEEPSEEK_UPLOAD_FILE_URL,
	DEEPSEEK_FETCH_FILES_URL,
	getHistoryHeaders,
	getPlatformHeaders,
} from "@/constants";
import {solveAndBuildHeader} from "@/ipcs/Pow";
import type {
	TokenPayload,
	SessionPayload,
	UploadFilePayload,
	FetchFilesPayload,
	EditApiKeysPayload,
	IpcResult,
} from "@/types";

export async function fetchHistory(payload: TokenPayload): Promise<IpcResult> {
	console.log(
		"[deepseek-fetch-history] Requesting history with token:",
		payload.token ? "present" : "missing",
	);
	try {
		const response = await axios.get(DEEPSEEK_HISTORY_URL, {
			headers: getHistoryHeaders(payload.token, payload.cookies),
			validateStatus: () => true,
		});
		console.log(
			"[deepseek-fetch-history] Response status:",
			response.status,
		);
		if (response.status !== 200) {
			console.error(
				"[deepseek-fetch-history] Error response data:",
				response.data,
			);
		}
		return {ok: true, data: response.data};
	} catch (err: unknown) {
		const message =
			err instanceof Error ? err.message : "Unknown error";
		console.error("[deepseek-fetch-history] Catch error:", message);
		return {ok: false, error: {message}};
	}
}

export async function fetchSessionMessages(
	payload: SessionPayload,
): Promise<IpcResult> {
	try {
		const headers = getHistoryHeaders(
			payload.token,
			payload.cookies,
		);

		const res = await axios.get(
			`${DEEPSEEK_HISTORY_MESSAGES_URL}?chat_session_id=${payload.sessionId}`,
			{
				headers,
			},
		);

		console.log(
			"[deepseek-fetch-session-messages] Response status:",
			res.status,
		);
		if (res.data?.data?.biz_data?.chat_messages?.length > 0) {
			console.log(
				"[deepseek-fetch-session-messages] Message keys:",
				Object.keys(res.data.data.biz_data.chat_messages[0]),
			);
			console.log(
				"[deepseek-fetch-session-messages] Message sample:",
				JSON.stringify(
					res.data.data.biz_data.chat_messages[0],
				).substring(0, 1000),
			);
		}

		return {ok: true, data: res.data};
	} catch (error: any) {
		console.error(
			"[deepseek-fetch-session-messages] error:",
			error?.message,
		);
		return {
			ok: false,
			error: error?.response?.data || error?.message,
		};
	}
}

export async function createSession(
	payload: TokenPayload,
): Promise<IpcResult> {
	try {
		const response = await axios.post(
			DEEPSEEK_CREATE_SESSION_URL,
			{},
			{
				headers: getHistoryHeaders(
					payload.token,
					payload.cookies,
				),
				validateStatus: () => true,
			},
		);
		console.log(
			"[deepseek-create-session] Response status:",
			response.status,
		);
		return {ok: true, data: response.data};
	} catch (err: unknown) {
		const message =
			err instanceof Error ? err.message : "Unknown error";
		console.error(
			"[deepseek-create-session] Catch error:",
			message,
		);
		return {ok: false, error: {message}};
	}
}

export async function deleteSession(
	payload: SessionPayload,
): Promise<IpcResult> {
	try {
		const response = await axios.post(
			DEEPSEEK_DELETE_SESSION_URL,
			{chat_session_id: payload.sessionId},
			{
				headers: getHistoryHeaders(
					payload.token,
					payload.cookies,
				),
				validateStatus: () => true,
			},
		);
		console.log(
			"[deepseek-delete-session] Response status:",
			response.status,
		);
		return {ok: true, data: response.data};
	} catch (err: unknown) {
		const message =
			err instanceof Error ? err.message : "Unknown error";
		console.error(
			"[deepseek-delete-session] Catch error:",
			message,
		);
		return {ok: false, error: {message}};
	}
}

export async function getApiKeys(
	payload: {token: string},
): Promise<IpcResult> {
	console.log(
		"[deepseek-get-api-keys] Request with token prefix:",
		payload.token
			? `${payload.token.substring(0, 10)}... (len: ${payload.token.length})`
			: "missing",
	);
	try {
		const response = await axios.get(
			DEEPSEEK_PLATFORM_GET_API_KEYS_URL,
			{
				headers: getPlatformHeaders(payload.token),
				validateStatus: () => true,
			},
		);
		console.log(
			"[deepseek-get-api-keys] Response status:",
			response.status,
			"body:",
			JSON.stringify(response.data),
		);
		return {ok: true, data: response.data};
	} catch (err: unknown) {
		const message =
			err instanceof Error ? err.message : "Unknown error";
		console.error("[deepseek-get-api-keys] Catch error:", message);
		return {ok: false, error: {message}};
	}
}

export async function editApiKeys(
	payload: EditApiKeysPayload,
): Promise<IpcResult> {
	console.log(
		"[deepseek-edit-api-keys] Request with token prefix:",
		payload.token
			? `${payload.token.substring(0, 10)}... (len: ${payload.token.length})`
			: "missing",
		"body:",
		JSON.stringify(payload.body),
	);
	try {
		const response = await axios.post(
			DEEPSEEK_PLATFORM_EDIT_API_KEYS_URL,
			payload.body,
			{
				headers: {
					...getPlatformHeaders(payload.token),
					"Content-Type": "application/json",
				},
				validateStatus: () => true,
			},
		);
		console.log(
			"[deepseek-edit-api-keys] Response status:",
			response.status,
			"body:",
			JSON.stringify(response.data),
		);
		return {ok: true, data: response.data};
	} catch (err: unknown) {
		const message =
			err instanceof Error ? err.message : "Unknown error";
		console.error("[deepseek-edit-api-keys] Catch error:", message);
		return {ok: false, error: {message}};
	}
}


export async function uploadFile(
	payload: UploadFilePayload,
): Promise<IpcResult> {
	try {
		// 1. Get PoW challenge
		const powResponse = await axios.post(
			DEEPSEEK_CREATE_POW_URL,
			{target_path: "/api/v0/file/upload_file"},
			{
				headers: getHistoryHeaders(
					payload.token,
					payload.cookies,
				),
				validateStatus: () => true,
			},
		);

		if (powResponse.status !== 200 || powResponse.data?.code !== 0) {
			return {ok: false, error: {message: "Failed to get PoW challenge for upload"}};
		}

		const challenge = powResponse.data?.data?.biz_data?.challenge;
		const powHeaderStr = solveAndBuildHeader(challenge);

		// 2. Read file and create form data
		const formData = new FormData();
		formData.append("file", fs.createReadStream(payload.filePath), payload.fileName);

		// 3. Upload file
		const headers = {
			...getHistoryHeaders(payload.token, payload.cookies),
			"x-ds-pow-response": powHeaderStr,
			...formData.getHeaders(),
		};

		const response = await axios.post(DEEPSEEK_UPLOAD_FILE_URL, formData, {
			headers,
			maxBodyLength: Infinity,
			maxContentLength: Infinity,
			validateStatus: () => true,
		});

		if (response.status !== 200 || response.data?.code !== 0) {
			return {ok: false, error: response.data || {message: "Upload failed"}};
		}

		return {ok: true, data: response.data};
	} catch (err: unknown) {
		const message = err instanceof Error ? err.message : "Unknown error";
		return {ok: false, error: {message}};
	}
}

export async function fetchFiles(
	payload: FetchFilesPayload,
): Promise<IpcResult> {
	try {
		const query = payload.fileIds.map((id) => `file_ids=${encodeURIComponent(id)}`).join("&");
		const response = await axios.get(`${DEEPSEEK_FETCH_FILES_URL}?${query}`, {
			headers: getHistoryHeaders(payload.token),
			validateStatus: () => true,
		});

		if (response.status !== 200 || response.data?.code !== 0) {
			return {ok: false, error: response.data || {message: "Fetch files failed"}};
		}

		return {ok: true, data: response.data};
	} catch (err: unknown) {
		const message = err instanceof Error ? err.message : "Unknown error";
		return {ok: false, error: {message}};
	}
}

export async function saveTempFile(
	payload: {base64Data: string; fileName: string},
	tempDir: string,
): Promise<{ok: boolean; filePath?: string; error?: {message: string}}> {
	try {
		const path = await import("node:path");
		const filePath = path.join(tempDir, payload.fileName);
		const buffer = Buffer.from(payload.base64Data, "base64");
		await fs.promises.writeFile(filePath, buffer);
		return {ok: true, filePath};
	} catch (err: unknown) {
		const message = err instanceof Error ? err.message : "Unknown error";
		return {ok: false, error: {message}};
	}
}
