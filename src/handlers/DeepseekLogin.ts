import {BrowserWindow, BrowserView, session} from "electron";
import path from "node:path";
import axios from "axios";
import {getHistoryHeaders} from "@/constants";
import {
	credentialTrackerScript,
	loginPollerScript,
	getAutoLoginScript,
	chatPollerScript,
} from "@/scripts";
import {getProxyAgent} from "@/services/ProxyAgent";
import type {LoginResult} from "@/types";

export interface LoginContext {
	__dirname: string;
	VITE_DEV_SERVER_URL: string | undefined;
	RENDERER_DIST: string;
	proxy?: string;
}

export function performLogin(ctx: LoginContext): Promise<LoginResult> {
	return new Promise(async (resolve) => {
		const partitionName = `platform-waf-${Date.now()}`;
		const ses = session.fromPartition(partitionName, {
			cache: false,
		});

		if (ctx.proxy) {
			await ses.setProxy({proxyRules: ctx.proxy}).catch((err) => {
				console.error(
					"[deepseek-login] Failed to set proxy for session:",
					err.message,
				);
			});
		}

		const win = new BrowserWindow({
			width: 800,
			height: 600,
			show: true,
			frame: false,
			icon: path.join(process.env.VITE_PUBLIC || "", "logo.png"),
			webPreferences: {
				nodeIntegration: false,
				contextIsolation: true,
				preload: path.join(ctx.__dirname, "preload.mjs"),
			},
		});

		if (ctx.VITE_DEV_SERVER_URL) {
			win.loadURL(`${ctx.VITE_DEV_SERVER_URL}#/deepseek-browser`);
		} else {
			win.loadFile(path.join(ctx.RENDERER_DIST, "index.html"), {
				hash: "/deepseek-browser",
			});
		}

		const view = new BrowserView({
			webPreferences: {
				session: ses,
				nodeIntegration: false,
				contextIsolation: true,
				webSecurity: true,
				preload: path.join(ctx.__dirname, "preload.mjs"),
			},
		});
		win.setBrowserView(view);

		const [width, height] = win.getContentSize();
		view.setBounds({x: 0, y: 40, width, height: height - 40});
		view.setAutoResize({width: true, height: true});

		win.on("resize", () => {
			const [w, h] = win.getContentSize();
			view.setBounds({x: 0, y: 40, width: w, height: h - 40});
		});

		const standardUA =
			"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36";
		ses.setUserAgent(standardUA);
		view.webContents.setUserAgent(standardUA);

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

				const httpsAgent = getProxyAgent(ctx.proxy);
				axios
					.get(
						"https://chat.deepseek.com/api/v0/users/current",
						{
							headers: getHistoryHeaders(chatToken),
							httpsAgent,
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
							proxy: ctx.proxy,
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
							proxy: ctx.proxy,
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

		view.webContents.on("did-finish-load", async () => {
			const url = view.webContents.getURL();
			if (url.includes("platform.deepseek.com")) {
				// 1. Inject credential tracker
				await view.webContents
					.executeJavaScript(credentialTrackerScript)
					.catch(() => {});

				// 2. Inject login poller
				await view.webContents
					.executeJavaScript(loginPollerScript)
					.catch(() => {});
			} else if (url.includes("chat.deepseek.com")) {
				// 1. Inject auto-login script
				if (capturedEmail && capturedPassword) {
					console.log(
						"[deepseek-login] Injecting auto-login credentials into Chat page...",
						{capturedEmail},
					);
					await view.webContents
						.executeJavaScript(
							getAutoLoginScript(
								capturedEmail,
								capturedPassword,
							),
						)
						.catch(() => {});
				}

				await view.webContents
					.executeJavaScript(chatPollerScript)
					.catch(() => {});
			}
		});

		view.webContents.on(
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
							view.webContents.loadURL("https://chat.deepseek.com/");
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
		await view.webContents.loadURL("https://platform.deepseek.com/sign_in");
	});
}
