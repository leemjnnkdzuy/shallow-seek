import {ipcMain, BrowserWindow, session} from "electron";
import path from "node:path";
import axios from "axios";
import {
	DEEPSEEK_LOGIN_URL,
	DEEPSEEK_HISTORY_URL,
	DEEPSEEK_COMPLETION_TARGET_PATH,
	DEEPSEEK_CREATE_POW_URL,
	DEEPSEEK_COMPLETION_URL,
	DEEPSEEK_HISTORY_MESSAGES_URL,
	DEEPSEEK_CREATE_SESSION_URL,
	DEEPSEEK_DELETE_SESSION_URL,
	DEEPSEEK_PLATFORM_GET_API_KEYS_URL,
	DEEPSEEK_PLATFORM_EDIT_API_KEYS_URL,
	DEEPSEEK_PLATFORM_LOGIN_URL,
} from "../constants/DeepseekURL";
import {
	getLoginHeaders,
	getLoginRequestBody,
	getHistoryHeaders,
	getChatHeaders,
	getPlatformHeaders,
	getPlatformLoginHeaders,
} from "../constants/DeepseekApi";
import {maskIdentifier, previewValue} from "../lib/utils";
import {solveAndBuildHeader} from "./pow";

/**
 * Acquires a platform token by:
 * 1. Opening a hidden BrowserWindow to platform.deepseek.com/sign_in
 * 2. Waiting for the AWS WAF SDK to generate the aws-waf-token cookie
 * 3. Extracting that cookie and using it to make the platform login API call
 */
async function acquirePlatformToken(
	email: string,
	password: string,
	deviceId: string,
): Promise<string | null> {
	const partitionName = `platform-waf-${Date.now()}`;
	const ses = session.fromPartition(partitionName, {cache: false});

	const win = new BrowserWindow({
		width: 800,
		height: 600,
		show: true, // visible for debugging - change to false once working
		webPreferences: {
			session: ses,
			nodeIntegration: false,
			contextIsolation: true,
			webSecurity: true,
		},
	});

	try {
		console.log("[platform-token] Loading platform sign_in page...");

		// Create a promise that resolves when we intercept the login API response
		const tokenPromise = new Promise<string | null>((resolve) => {
			const timeout = setTimeout(() => {
				console.log("[platform-token] Login response timeout (60s)");
				resolve(null);
			}, 60_000);

			// Intercept the platform login API response
			ses.webRequest.onCompleted(
				{urls: ["*://platform.deepseek.com/auth-api/*"]},
				(details) => {
					console.log(`[platform-token] AUTH API response: ${details.statusCode} ${details.url}`);
				},
			);

			// Use onBeforeSendHeaders to log what's being sent
			ses.webRequest.onBeforeSendHeaders(
				{urls: ["*://platform.deepseek.com/auth-api/*"]},
				(details, callback) => {
					console.log(`[platform-token] AUTH API request: ${details.method} ${details.url}`);
					const cookieHeader = details.requestHeaders["Cookie"] || details.requestHeaders["cookie"];
					if (cookieHeader) {
						console.log(`[platform-token] Request cookies: ${cookieHeader.substring(0, 100)}`);
					}
					callback({cancel: false, requestHeaders: details.requestHeaders});
				},
			);

			// Monitor ALL network requests for debugging
			ses.webRequest.onBeforeRequest((details, callback) => {
				const url = details.url;
				// Log WAF-related and interesting requests
				if (url.includes("awswaf") || url.includes("aws-waf") || url.includes("mp_verify")) {
					console.log(`[platform-token] WAF-related: ${details.method} ${url}`);
				}
				callback({cancel: false});
			});

			// Intercept the response body for the login API call
			win.webContents.session.webRequest.onHeadersReceived(
				{urls: ["*://platform.deepseek.com/auth-api/v0/users/login"]},
				(details, callback) => {
					console.log(`[platform-token] Login response headers received: ${details.statusCode}`);
					callback({cancel: false, responseHeaders: details.responseHeaders});
				},
			);

			// Listen for console messages to capture the login response
			win.webContents.on("console-message", (_event, _level, message) => {
				// Check if our injected code logged the token
				if (message.startsWith("__PLATFORM_TOKEN__:")) {
					const token = message.replace("__PLATFORM_TOKEN__:", "").trim();
					if (token && token !== "null" && token !== "undefined") {
						console.log(`[platform-token] Got token via console: ${token.substring(0, 15)}... (len: ${token.length})`);
						clearTimeout(timeout);
						resolve(token);
					}
				} else if (message.startsWith("__PLATFORM_LOGIN_ERROR__:")) {
					console.log(`[platform-token] Login error: ${message}`);
				} else if (message.startsWith("__PLATFORM_LOGIN_STATUS__:")) {
					console.log(`[platform-token] Login status: ${message}`);
				}
			});
		});

		// Load the page
		await win.loadURL("https://platform.deepseek.com/sign_in");
		console.log("[platform-token] Page loaded, checking for WAF SDK...");

		// Wait for page to fully render (SPA needs time)
		await new Promise(resolve => setTimeout(resolve, 3000));

		// Check what scripts are on the page
		const scriptSrcs = await win.webContents.executeJavaScript(`
			Array.from(document.querySelectorAll('script[src]')).map(s => s.src)
		`);
		console.log("[platform-token] Page scripts:", JSON.stringify(scriptSrcs));

		// Check for WAF-related elements
		const hasWafScript = await win.webContents.executeJavaScript(`
			!!document.querySelector('script[src*="awswaf"]') || 
			!!document.querySelector('script[src*="challenge"]') ||
			!!window.AwsWafIntegration ||
			!!window.AwsWafCaptcha
		`);
		console.log("[platform-token] Has WAF SDK on page:", hasWafScript);

		// Now inject code to programmatically log in via fetch
		// This runs INSIDE the page context, so it will have the WAF token if the SDK has set it
		console.log("[platform-token] Injecting login fetch...");
		
		await win.webContents.executeJavaScript(`
			(async () => {
				try {
					await new Promise(r => setTimeout(r, 2000));
					
					const loginPayload = {
						email: ${JSON.stringify(email)},
						mobile: "",
						password: ${JSON.stringify(password)},
						area_code: "",
						device_id: ${JSON.stringify(deviceId)},
						os: "web"
					};
					const fetchOpts = {
						method: "POST",
						headers: {
							"accept": "*/*",
							"content-type": "application/json",
							"x-app-version": "1.0.0",
						},
						credentials: "include",
						body: JSON.stringify(loginPayload)
					};

					// Attempt 1: This will likely return 202 and trigger the WAF challenge
					console.log("__PLATFORM_LOGIN_STATUS__: Attempt 1 - triggering WAF challenge...");
					const firstResponse = await fetch("https://platform.deepseek.com/auth-api/v0/users/login", fetchOpts);
					console.log("__PLATFORM_LOGIN_STATUS__: Attempt 1 status = " + firstResponse.status);
					
					if (firstResponse.status === 200) {
						// Lucky - no WAF challenge needed
						const data = await firstResponse.json();
						if (data?.code === 0 && data?.data?.biz_data?.user?.token) {
							console.log("__PLATFORM_TOKEN__:" + data.data.biz_data.user.token);
							return;
						}
						console.log("__PLATFORM_LOGIN_ERROR__: " + JSON.stringify(data).substring(0, 300));
						return;
					}

					// Got 202 - WAF challenge has been triggered.
					// Wait for the WAF SDK to complete the challenge and set the cookie.
					console.log("__PLATFORM_LOGIN_STATUS__: Got 202, waiting for WAF challenge to complete...");
					
					// Poll for aws-waf-token cookie (WAF SDK sets it after challenge)
					for (let i = 0; i < 20; i++) {
						await new Promise(r => setTimeout(r, 1000));
						if (document.cookie.includes("aws-waf-token")) {
							console.log("__PLATFORM_LOGIN_STATUS__: WAF token cookie found after " + (i+1) + "s");
							break;
						}
						if (i === 19) {
							console.log("__PLATFORM_LOGIN_STATUS__: WAF cookie not found after 20s, retrying anyway...");
						}
					}

					// Retry with the WAF token cookie now set
					console.log("__PLATFORM_LOGIN_STATUS__: Attempt 2 - retrying with WAF cookie...");
					console.log("__PLATFORM_LOGIN_STATUS__: cookies = " + document.cookie.substring(0, 200));
					
					const retryResponse = await fetch("https://platform.deepseek.com/auth-api/v0/users/login", {
						...fetchOpts,
						body: JSON.stringify(loginPayload) // fresh body
					});
					
					console.log("__PLATFORM_LOGIN_STATUS__: Attempt 2 status = " + retryResponse.status);
					
					if (retryResponse.status === 200) {
						const data = await retryResponse.json();
						console.log("__PLATFORM_LOGIN_STATUS__: Response code = " + (data?.code ?? "unknown"));
						if (data?.code === 0 && data?.data?.biz_data?.user?.token) {
							console.log("__PLATFORM_TOKEN__:" + data.data.biz_data.user.token);
						} else {
							console.log("__PLATFORM_LOGIN_ERROR__: " + JSON.stringify(data).substring(0, 300));
						}
					} else {
						console.log("__PLATFORM_LOGIN_ERROR__: Retry also returned " + retryResponse.status);
					}
				} catch (err) {
					console.log("__PLATFORM_LOGIN_ERROR__: " + err.message);
				}
			})();
		`);

		// Wait for the token to be captured
		const token = await tokenPromise;
		return token;
	} finally {
		win.destroy();
		ses.clearStorageData().catch(() => {});
	}
}

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
			payload: unknown,
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

				// Also attempt to get the Platform Token via hidden BrowserWindow (AWS WAF bypass)
				let platformToken: string | null = null;
				try {
					platformToken = await acquirePlatformToken(email, password, deviceId);
				} catch (platformErr) {
					console.warn("[deepseek-login] Platform token acquisition failed:", platformErr);
				}

				const chatToken = response.data?.data?.biz_data?.user?.token || "NULL";
				console.log(`[deepseek-login] Login Success!`);
				console.log(`- Chat Token: ${chatToken.substring(0, 15)}... (len: ${chatToken.length})`);
				console.log(`- Platform Token: ${platformToken ? `${platformToken.substring(0, 15)}... (len: ${platformToken.length})` : 'NULL'}`);

				return {
					ok: true, 
					status: response.status, 
					data: response.data,
					platformToken
				};
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
				payload.token ? `${payload.token.substring(0, 10)}... (len: ${payload.token.length})` : "missing",
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
				payload.token ? `${payload.token.substring(0, 10)}... (len: ${payload.token.length})` : "missing",
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
