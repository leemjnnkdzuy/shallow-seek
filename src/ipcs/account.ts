import {ipcMain, BrowserWindow} from "electron";
import path from "node:path";
import axios from "axios";
import {
	DEEPSEEK_LOGIN_URL,
	getLoginHeaders,
	getLoginRequestBody,
	DEEPSEEK_HISTORY_URL,
	getHistoryHeaders,
	DEEPSEEK_COMPLETION_TARGET_PATH,
	DEEPSEEK_CREATE_POW_URL,
	DEEPSEEK_COMPLETION_URL,
	DEEPSEEK_HISTORY_MESSAGES_URL,
	DEEPSEEK_CREATE_SESSION_URL,
	DEEPSEEK_DELETE_SESSION_URL,
	getChatHeaders,
} from "../constants/DeepseekApi";
import {maskIdentifier, previewValue} from "../lib/utils";
import {solveAndBuildHeader} from "./pow";

export function registerAccountIpcs(
	__dirname: string,
	VITE_DEV_SERVER_URL: string | undefined,
	RENDERER_DIST: string,
) {
	ipcMain.on("open-add-account", (event) => {
		const parentWindow =
			BrowserWindow.fromWebContents(event.sender) || undefined;

		const popup = new BrowserWindow({
			width: 450,
			height: 550,
			frame: false,
			resizable: false,
			parent: parentWindow,
			modal: true,
			icon: path.join(process.env.VITE_PUBLIC || "", "logo.png"),
			webPreferences: {
				preload: path.join(__dirname, "preload.mjs"),
			},
		});

		if (VITE_DEV_SERVER_URL) {
			popup.loadURL(`${VITE_DEV_SERVER_URL}#/add-account`);
		} else {
			popup.loadFile(path.join(RENDERER_DIST, "index.html"), {
				hash: "/add-account",
			});
		}
	});

	ipcMain.handle(
		"deepseek-login",
		async (
			_event,
			payload: unknown,
		): Promise<{
			ok: boolean;
			status?: number;
			data?: unknown;
			error?: {
				message: string;
				code?: string;
				status?: number;
				dataPreview?: string;
			};
		}> => {
			const body = payload as {
				email?: unknown;
				password?: unknown;
				deviceId?: unknown;
			};

			const email = typeof body?.email === "string" ? body.email : "";
			const password =
				typeof body?.password === "string" ? body.password : "";
			const deviceId =
				typeof body?.deviceId === "string" ? body.deviceId : "";

			if (!email || !password) {
				return {
					ok: false,
					error: {message: "Missing email or password."},
				};
			}

			try {
				const requestBody = getLoginRequestBody(
					email,
					password,
					deviceId,
				);
				const response = await axios.post(
					DEEPSEEK_LOGIN_URL,
					requestBody,
					{
						headers: getLoginHeaders(),
						validateStatus: () => true,
					},
				);


				if (response.status >= 400 || response.status === 202) {
					console.log("[deepseek-login] non-200", {
						status: response.status,
						dataPreview: previewValue(response.data),
					});
				}

				return {ok: true, status: response.status, data: response.data};
			} catch (err: unknown) {
				if (axios.isAxiosError(err)) {
					const status = err.response?.status;
					const code = err.code;
					const dataPreview = previewValue(err.response?.data);
					console.log("[deepseek-login] network error", {
						emailMasked: maskIdentifier(email),
						deviceIdPrefix: deviceId ? deviceId.slice(0, 8) : "",
						deviceIdLength: deviceId.length,
						message: err.message,
						code,
						status,
						dataPreview,
					});
					return {
						ok: false,
						error: {
							message:
								status ?
									`HTTP ${status}`
								:	err.message || "Network Error",
							code,
							status,
							dataPreview,
						},
					};
				}

				const message =
					err instanceof Error ? err.message : "Unknown error";
				console.log("[deepseek-login] unknown error", {
					emailMasked: maskIdentifier(email),
					deviceIdPrefix: deviceId ? deviceId.slice(0, 8) : "",
					deviceIdLength: deviceId.length,
					message,
				});
				return {ok: false, error: {message}};
			}
		},
	);

	ipcMain.handle(
		"deepseek-fetch-history",
		async (_event, payload: { token: string; cookies?: string }) => {
			console.log("[deepseek-fetch-history] Requesting history with token:", payload.token ? "present" : "missing");
			try {
				const response = await axios.get(
					DEEPSEEK_HISTORY_URL,
					{
						headers: getHistoryHeaders(payload.token, payload.cookies),
						validateStatus: () => true,
					}
				);
				console.log("[deepseek-fetch-history] Response status:", response.status);
				if (response.status !== 200) {
					console.error("[deepseek-fetch-history] Error response data:", response.data);
				}
				return { ok: true, data: response.data };
			} catch (err: unknown) {
				const message = err instanceof Error ? err.message : "Unknown error";
				console.error("[deepseek-fetch-history] Catch error:", message);
				return { ok: false, error: { message } };
			}
		}
	);

	ipcMain.handle(
		"deepseek-fetch-session-messages",
		async (_event, payload: {token: string; cookies?: string; sessionId: string}) => {
			try {
				const headers = getHistoryHeaders(payload.token, payload.cookies);

				const res = await axios.get(
					`${DEEPSEEK_HISTORY_MESSAGES_URL}?chat_session_id=${payload.sessionId}`,
					{
						headers,
					},
				);
				
				console.log("[deepseek-fetch-session-messages] Response status:", res.status);
				if (res.data?.data?.biz_data?.chat_messages?.length > 0) {
					console.log("[deepseek-fetch-session-messages] Message keys:", Object.keys(res.data.data.biz_data.chat_messages[0]));
					console.log("[deepseek-fetch-session-messages] Message sample:", JSON.stringify(res.data.data.biz_data.chat_messages[0]).substring(0, 1000));
				}

				return {ok: true, data: res.data};
			} catch (error: any) {
				console.error("[deepseek-fetch-session-messages] error:", error?.message);
				return {
					ok: false,
					error: error?.response?.data || error?.message,
				};
			}
		},
	);
	
	ipcMain.handle(
		"deepseek-create-session",
		async (_event, payload: { token: string; cookies?: string }) => {
			try {
				const response = await axios.post(
					DEEPSEEK_CREATE_SESSION_URL,
					{},
					{
						headers: getHistoryHeaders(payload.token, payload.cookies),
						validateStatus: () => true,
					}
				);
				console.log("[deepseek-create-session] Response status:", response.status);
				return { ok: true, data: response.data };
			} catch (err: unknown) {
				const message = err instanceof Error ? err.message : "Unknown error";
				console.error("[deepseek-create-session] Catch error:", message);
				return { ok: false, error: { message } };
			}
		}
	);

	ipcMain.handle(
		"deepseek-delete-session",
		async (_event, payload: { token: string; cookies?: string; sessionId: string }) => {
			try {
				const response = await axios.post(
					DEEPSEEK_DELETE_SESSION_URL,
					{ chat_session_id: payload.sessionId },
					{
						headers: getHistoryHeaders(payload.token, payload.cookies),
						validateStatus: () => true,
					}
				);
				console.log("[deepseek-delete-session] Response status:", response.status);
				return { ok: true, data: response.data };
			} catch (err: unknown) {
				const message = err instanceof Error ? err.message : "Unknown error";
				console.error("[deepseek-delete-session] Catch error:", message);
				return { ok: false, error: { message } };
			}
		}
	);

	ipcMain.on("deepseek-chat-stream", async (event, payload: {
		token: string;
		cookies?: string;
		payload: any;
	}) => {
		try {
			// 1. Get PoW challenge
			const powResponse = await axios.post(
				DEEPSEEK_CREATE_POW_URL,
				{ target_path: DEEPSEEK_COMPLETION_TARGET_PATH },
				{
					headers: getHistoryHeaders(payload.token, payload.cookies),
					validateStatus: () => true,
				}
			);

			if (powResponse.status !== 200 || powResponse.data?.code !== 0) {
				event.sender.send("deepseek-chat-error", { message: "Failed to get PoW challenge" });
				return;
			}

			const challenge = powResponse.data?.data?.biz_data?.challenge;
			if (!challenge) {
				event.sender.send("deepseek-chat-error", { message: "Invalid PoW challenge response" });
				return;
			}

			// 2. Solve PoW
			const powHeaderStr = solveAndBuildHeader(challenge);

			// 3. Start streaming completion
			const chatHeaders = getChatHeaders(payload.token, powHeaderStr, payload.cookies);
			console.log("[deepseek-chat-stream] Request URL:", DEEPSEEK_COMPLETION_URL);
			console.log("[deepseek-chat-stream] Request Headers:", JSON.stringify(chatHeaders));
			console.log("[deepseek-chat-stream] Request Body:", JSON.stringify(payload.payload));

			const response = await axios.post(
				DEEPSEEK_COMPLETION_URL,
				payload.payload,
				{
					headers: chatHeaders,
					responseType: "stream",
					validateStatus: () => true,
				}
			);

			if (response.status !== 200) {
				const stream = response.data;
				let errorData = "";
				for await (const chunk of stream) {
					errorData += chunk.toString();
				}
				console.error("[deepseek-chat-stream] Error Status:", response.status);
				console.error("[deepseek-chat-stream] Error Data:", errorData);
				event.sender.send("deepseek-chat-error", { 
					message: `DeepSeek API Error: ${response.status}. ${errorData}` 
				});
				return;
			}

			const stream = response.data;
			stream.on("data", (chunk: Buffer) => {
				const text = chunk.toString("utf-8");
				event.sender.send("deepseek-chat-chunk", text);
			});

			stream.on("end", () => {
				event.sender.send("deepseek-chat-end");
			});

			stream.on("error", (err: Error) => {
				event.sender.send("deepseek-chat-error", { message: err.message });
			});

		} catch (err: unknown) {
			const message = err instanceof Error ? err.message : "Unknown error";
			event.sender.send("deepseek-chat-error", { message });
		}
	});
}
