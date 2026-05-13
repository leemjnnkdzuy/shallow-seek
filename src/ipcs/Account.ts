import {ipcMain, BrowserWindow, session, app} from "electron";
import path from "node:path";
import axios from "axios";
import fs from "node:fs";
import FormData from "form-data";
import {
	DEEPSEEK_HISTORY_URL,
	DEEPSEEK_COMPLETION_TARGET_PATH,
	DEEPSEEK_CREATE_POW_URL,
	DEEPSEEK_COMPLETION_URL,
	DEEPSEEK_HISTORY_MESSAGES_URL,
	DEEPSEEK_CREATE_SESSION_URL,
	DEEPSEEK_DELETE_SESSION_URL,
	DEEPSEEK_PLATFORM_GET_API_KEYS_URL,
	DEEPSEEK_PLATFORM_EDIT_API_KEYS_URL,
	DEEPSEEK_UPLOAD_FILE_URL,
	DEEPSEEK_FETCH_FILES_URL,
} from "../constants/DeepseekURL";
import {
	getHistoryHeaders,
	getChatHeaders,
	getPlatformHeaders,
} from "../constants/DeepseekApi";
import {solveAndBuildHeader} from "./Pow";
import {
	credentialTrackerScript,
	loginPollerScript,
	getAutoLoginScript,
	chatPollerScript,
} from "../scripts";

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

	ipcMain.on("open-create-api-key", (event, token: string) => {
		const parentWindow =
			BrowserWindow.fromWebContents(event.sender) || undefined;

		const popup = new BrowserWindow({
			width: 450,
			height: 560,
			frame: false,
			resizable: false,
			parent: parentWindow,
			modal: true,
			icon: path.join(process.env.VITE_PUBLIC || "", "logo.png"),
			webPreferences: {
				preload: path.join(__dirname, "preload.mjs"),
			},
		});

		const encodedToken = encodeURIComponent(token);
		if (VITE_DEV_SERVER_URL) {
			popup.loadURL(
				`${VITE_DEV_SERVER_URL}#/create-api-key/${encodedToken}`,
			);
		} else {
			popup.loadFile(path.join(RENDERER_DIST, "index.html"), {
				hash: `/create-api-key/${encodedToken}`,
			});
		}
	});

	ipcMain.handle(
		"deepseek-login",
		async (
			_event,
			_payload: unknown,
		): Promise<{
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
		}> => {
			return new Promise(async (resolve) => {
				const partitionName = `platform-waf-${Date.now()}`;
				const ses = session.fromPartition(partitionName, {
					cache: false,
				});

				const win = new BrowserWindow({
					width: 800,
					height: 600,
					show: true,
					webPreferences: {
						session: ses,
						nodeIntegration: false,
						contextIsolation: true,
						webSecurity: true,
						preload: path.join(__dirname, "preload.mjs"),
					},
				});

				const standardUA =
					"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36";
				ses.setUserAgent(standardUA);
				win.webContents.setUserAgent(standardUA);

				let platformToken: string | null = null;
				let chatToken: string | null = null;
				let hasNavigatedToChat = false;
				let isResolved = false;
				let capturedEmail = "";
				let capturedPassword = "";

				const completeLogin = () => {
					if (isResolved) return;
					if (platformToken && chatToken) {
						isResolved = true;
						console.log(
							"[deepseek-login] Both tokens captured successfully, fetching user profile via main process (Android client mode)...",
						);

						axios
							.get(
								"https://chat.deepseek.com/api/v0/users/current",
								{
									headers: getHistoryHeaders(chatToken),
								},
							)
							.then((response) => {
								const bizData = response.data?.data?.biz_data;
								console.log(
									"[deepseek-login] User profile fetched successfully:",
									bizData,
								);
								resolve({
									ok: true,
									status: 200,
									data: {
										data: {
											biz_data: {
												user: {
													id:
														bizData?.id ||
														`temp_${Date.now()}`,
													email:
														capturedEmail ||
														bizData?.email ||
														"unknown@deepseek.com",
													token: chatToken,
												},
											},
										},
									},
									platformToken,
								});
							})
							.catch((err) => {
								console.error(
									"[deepseek-login] Main-process profile fetch failed, using captured credentials fallback:",
									err.message,
								);
								resolve({
									ok: true,
									status: 200,
									data: {
										data: {
											biz_data: {
												user: {
													id: `temp_${Date.now()}`,
													email:
														capturedEmail ||
														"unknown@deepseek.com",
													token: chatToken,
												},
											},
										},
									},
									platformToken,
								});
							})
							.finally(() => {
								setTimeout(() => {
									if (!win.isDestroyed()) {
										win.destroy();
										ses.clearStorageData().catch(() => {});
									}
								}, 500);
							});
					}
				};

				ses.webRequest.onBeforeSendHeaders(
					{urls: ["*://*/*"]},
					(details, callback) => {
						// Strip Electron from sec-ch-ua
						if (details.requestHeaders["sec-ch-ua"]) {
							details.requestHeaders["sec-ch-ua"] =
								details.requestHeaders["sec-ch-ua"]
									.split(", ")
									.filter(
										(part: string) =>
											!part.includes("Electron") &&
											!part.includes("shallow-seek"),
									)
									.join(", ");
						}

						callback({
							cancel: false,
							requestHeaders: details.requestHeaders,
						});
					},
				);

				win.webContents.on("did-finish-load", async () => {
					const url = win.webContents.getURL();
					if (url.includes("platform.deepseek.com")) {
						// 1. Inject credential tracker
						await win.webContents
							.executeJavaScript(credentialTrackerScript)
							.catch(() => {});

						// 2. Inject login poller
						await win.webContents
							.executeJavaScript(loginPollerScript)
							.catch(() => {});
					} else if (url.includes("chat.deepseek.com")) {
						// 1. Inject auto-login script
						if (capturedEmail && capturedPassword) {
							console.log(
								"[deepseek-login] Injecting auto-login credentials into Chat page...",
								{capturedEmail},
							);
							await win.webContents
								.executeJavaScript(
									getAutoLoginScript(
										capturedEmail,
										capturedPassword,
									),
								)
								.catch(() => {});
						}

						// 2. Inject chat poller
						await win.webContents
							.executeJavaScript(chatPollerScript)
							.catch(() => {});
					}
				});

				win.webContents.on(
					"console-message",
					async (_event, level, message) => {
						console.log(
							`[Browser Console] [Level ${level}]:`,
							message,
						);
						if (message.startsWith("__TRACKED_EMAIL__:")) {
							capturedEmail = message
								.replace("__TRACKED_EMAIL__:", "")
								.trim();
						} else if (
							message.startsWith("__TRACKED_PASSWORD__:")
						) {
							capturedPassword = message
								.replace("__TRACKED_PASSWORD__:", "")
								.trim();
						} else if (message.startsWith("__PLATFORM_TOKEN__:")) {
							const token = message
								.replace("__PLATFORM_TOKEN__:", "")
								.trim();
							if (!platformToken) {
								platformToken = token;
								console.log(
									"[deepseek-login] Captured platform token from localStorage!",
								);
							}

							if (platformToken && !hasNavigatedToChat) {
								hasNavigatedToChat = true;

								// Debug cookies to see if SSO cookies exist
								try {
									const cookies = await ses.cookies.get({});
									console.log(
										"[deepseek-login] Domain cookies:",
										cookies.map(
											(c) =>
												`${c.domain} - ${c.name}=${c.value ? "***" : "empty"}`,
										),
									);
								} catch (cookieErr: any) {
									console.error(
										"[deepseek-login] Error getting cookies:",
										cookieErr.message,
									);
								}

								console.log(
									"[deepseek-login] Platform token found, waiting 2.5s before navigating to chat...",
								);
								setTimeout(() => {
									win.loadURL("https://chat.deepseek.com/");
								}, 2500);
							}
						} else if (message.startsWith("__CHAT_TOKEN__:")) {
							const token = message
								.replace("__CHAT_TOKEN__:", "")
								.trim();
							if (!chatToken) {
								chatToken = token;
								console.log(
									"[deepseek-login] Captured chat token from localStorage!",
								);
							}
						}
						completeLogin();
					},
				);

				win.on("closed", () => {
					if (!isResolved) {
						isResolved = true;
						resolve({
							ok: false,
							error: {
								message:
									"User closed window before login complete",
							},
						});
					}
				});

				console.log(
					"[deepseek-login] Opening platform sign_in page...",
				);
				await win.loadURL("https://platform.deepseek.com/sign_in");
			});
		},
	);

	ipcMain.handle(
		"deepseek-fetch-history",
		async (_event, payload: {token: string; cookies?: string}) => {
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
		},
	);

	ipcMain.handle(
		"deepseek-fetch-session-messages",
		async (
			_event,
			payload: {token: string; cookies?: string; sessionId: string},
		) => {
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
		},
	);

	ipcMain.handle(
		"deepseek-create-session",
		async (_event, payload: {token: string; cookies?: string}) => {
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
		},
	);

	ipcMain.handle(
		"deepseek-delete-session",
		async (
			_event,
			payload: {token: string; cookies?: string; sessionId: string},
		) => {
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
		},
	);

	ipcMain.handle(
		"deepseek-get-api-keys",
		async (_event, payload: {token: string}) => {
			console.log(
				"[deepseek-get-api-keys] Request with token prefix:",
				payload.token ?
					`${payload.token.substring(0, 10)}... (len: ${payload.token.length})`
				:	"missing",
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
		},
	);

	ipcMain.handle(
		"deepseek-edit-api-keys",
		async (_event, payload: {token: string; body: any}) => {
			console.log(
				"[deepseek-edit-api-keys] Request with token prefix:",
				payload.token ?
					`${payload.token.substring(0, 10)}... (len: ${payload.token.length})`
				:	"missing",
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
		},
	);

	ipcMain.handle(
		"deepseek-upload-file",
		async (_event, payload: {token: string; cookies?: string; filePath: string; fileName: string; fileSize?: number}) => {
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
				formData.append('file', fs.createReadStream(payload.filePath), payload.fileName);

				// 3. Upload file
				const headers = {
					...getHistoryHeaders(payload.token, payload.cookies),
					"x-ds-pow-response": powHeaderStr,
					...formData.getHeaders()
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
	);

	ipcMain.handle(
		"deepseek-fetch-files",
		async (_event, payload: {token: string; fileIds: string[]}) => {
			try {
				const query = payload.fileIds.map(id => `file_ids=${encodeURIComponent(id)}`).join('&');
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
	);

	ipcMain.handle(
		"deepseek-save-temp-file",
		async (_event, payload: {base64Data: string; fileName: string}) => {
			try {
				const tempDir = app.getPath("temp");
				const filePath = path.join(tempDir, payload.fileName);
				const buffer = Buffer.from(payload.base64Data, "base64");
				await fs.promises.writeFile(filePath, buffer);
				return {ok: true, filePath};
			} catch (err: unknown) {
				const message = err instanceof Error ? err.message : "Unknown error";
				return {ok: false, error: {message}};
			}
		}
	);

	ipcMain.on(
		"deepseek-chat-stream",
		async (
			event,
			payload: {
				token: string;
				cookies?: string;
				payload: any;
			},
		) => {
			try {
				// 1. Get PoW challenge
				const powResponse = await axios.post(
					DEEPSEEK_CREATE_POW_URL,
					{target_path: DEEPSEEK_COMPLETION_TARGET_PATH},
					{
						headers: getHistoryHeaders(
							payload.token,
							payload.cookies,
						),
						validateStatus: () => true,
					},
				);

				if (
					powResponse.status !== 200 ||
					powResponse.data?.code !== 0
				) {
					event.sender.send("deepseek-chat-error", {
						message: "Failed to get PoW challenge",
					});
					return;
				}

				const challenge = powResponse.data?.data?.biz_data?.challenge;
				if (!challenge) {
					event.sender.send("deepseek-chat-error", {
						message: "Invalid PoW challenge response",
					});
					return;
				}

				// 2. Solve PoW
				const powHeaderStr = solveAndBuildHeader(challenge);

				// 3. Start streaming completion
				const chatHeaders = getChatHeaders(
					payload.token,
					powHeaderStr,
					payload.cookies,
				);
				console.log(
					"[deepseek-chat-stream] Request URL:",
					DEEPSEEK_COMPLETION_URL,
				);
				console.log(
					"[deepseek-chat-stream] Request Headers:",
					JSON.stringify(chatHeaders),
				);
				console.log(
					"[deepseek-chat-stream] Request Body:",
					JSON.stringify(payload.payload),
				);

				const response = await axios.post(
					DEEPSEEK_COMPLETION_URL,
					payload.payload,
					{
						headers: chatHeaders,
						responseType: "stream",
						validateStatus: () => true,
					},
				);

				if (response.status !== 200) {
					const stream = response.data;
					let errorData = "";
					for await (const chunk of stream) {
						errorData += chunk.toString();
					}
					console.error(
						"[deepseek-chat-stream] Error Status:",
						response.status,
					);
					console.error(
						"[deepseek-chat-stream] Error Data:",
						errorData,
					);
					event.sender.send("deepseek-chat-error", {
						message: `DeepSeek API Error: ${response.status}. ${errorData}`,
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
					event.sender.send("deepseek-chat-error", {
						message: err.message,
					});
				});
			} catch (err: unknown) {
				const message =
					err instanceof Error ? err.message : "Unknown error";
				event.sender.send("deepseek-chat-error", {message});
			}
		},
	);
}
