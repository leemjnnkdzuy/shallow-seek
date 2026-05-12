import {ipcMain, BrowserWindow} from "electron";
import path from "node:path";
import axios from "axios";
import {
	DEEPSEEK_LOGIN_URL,
	getLoginHeaders,
	getLoginRequestBody,
} from "../constants/DeepseekApi";
import {maskIdentifier, previewValue} from "../lib/utils";

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
}
