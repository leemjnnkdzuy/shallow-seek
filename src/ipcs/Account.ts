import {ipcMain, BrowserWindow, app} from "electron";
import path from "node:path";
import {performLogin} from "@/handlers/DeepseekLogin";
import {
	fetchHistory,
	fetchSessionMessages,
	createSession,
	deleteSession,
	getApiKeys,
	editApiKeys,
	uploadFile,
	fetchFiles,
	saveTempFile,
} from "@/handlers/DeepseekApi";
import {handleChatStream} from "@/handlers/DeepseekChatStream";
import type {
	TokenPayload,
	SessionPayload,
	ChatStreamPayload,
	UploadFilePayload,
	FetchFilesPayload,
	EditApiKeysPayload,
	SaveTempFilePayload,
} from "@/types";

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

	ipcMain.handle("deepseek-login", async (_event, _payload: unknown) => {
		return performLogin({__dirname, VITE_DEV_SERVER_URL, RENDERER_DIST});
	});

	ipcMain.handle(
		"deepseek-fetch-history",
		async (_event, payload: TokenPayload) => {
			return fetchHistory(payload);
		},
	);

	ipcMain.handle(
		"deepseek-fetch-session-messages",
		async (_event, payload: SessionPayload) => {
			return fetchSessionMessages(payload);
		},
	);

	ipcMain.handle(
		"deepseek-create-session",
		async (_event, payload: TokenPayload) => {
			return createSession(payload);
		},
	);

	ipcMain.handle(
		"deepseek-delete-session",
		async (_event, payload: SessionPayload) => {
			return deleteSession(payload);
		},
	);

	ipcMain.handle(
		"deepseek-get-api-keys",
		async (_event, payload: {token: string}) => {
			return getApiKeys(payload);
		},
	);

	ipcMain.handle(
		"deepseek-edit-api-keys",
		async (_event, payload: EditApiKeysPayload) => {
			return editApiKeys(payload);
		},
	);

	ipcMain.handle(
		"deepseek-upload-file",
		async (_event, payload: UploadFilePayload) => {
			return uploadFile(payload);
		},
	);

	ipcMain.handle(
		"deepseek-fetch-files",
		async (_event, payload: FetchFilesPayload) => {
			return fetchFiles(payload);
		},
	);

	ipcMain.handle(
		"deepseek-save-temp-file",
		async (_event, payload: SaveTempFilePayload) => {
			return saveTempFile(payload, app.getPath("temp"));
		},
	);

	ipcMain.on(
		"deepseek-chat-stream",
		async (event, payload: ChatStreamPayload) => {
			return handleChatStream(event.sender, payload);
		},
	);
}
