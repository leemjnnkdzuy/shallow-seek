import {contextBridge, ipcRenderer} from "electron";

// Mask navigator.webdriver to bypass Cloudflare/WAF checks in the login popup
try {
	Object.defineProperty(navigator, "webdriver", {
		get: () => undefined,
	});
	// Mock chrome object
	if (!(window as any).chrome) {
		(window as any).chrome = {
			runtime: {}
		};
	}
} catch (e) {
	// ignore
}

contextBridge.exposeInMainWorld("electron", {
	send: (channel: string, data: any) => {
		let validChannels = ["toMain"];
		if (validChannels.includes(channel)) {
			ipcRenderer.send(channel, data);
		}
	},
	receive: (channel: string, func: (...args: any[]) => void) => {
		let validChannels = ["fromMain"];
		if (validChannels.includes(channel)) {
			ipcRenderer.on(channel, (_event, ...args) => func(...args));
		}
	},
	windowControls: {
		minimize: () => ipcRenderer.send("window-minimize"),
		maximize: () => ipcRenderer.send("window-maximize"),
		close: () => ipcRenderer.send("window-close"),
		zoomIn: () => ipcRenderer.send("window-zoom-in"),
		zoomOut: () => ipcRenderer.send("window-zoom-out"),
		resetZoom: () => ipcRenderer.send("window-zoom-reset"),
		onWindowStateChange: (
			callback: (state: "maximized" | "unmaximized") => void,
		) => {
			ipcRenderer.on("window-state-changed", (_event, state) =>
				callback(state),
			);
		},
		openAddAccount: () => ipcRenderer.send("open-add-account"),
		openCreateApiKey: (token: string) => ipcRenderer.send("open-create-api-key", token),
		openSettings: () => ipcRenderer.send("open-settings"),
		notifyThemeChanged: (theme: string) => ipcRenderer.send("theme-changed", theme),
		onThemeChanged: (callback: (theme: string) => void) => {
			const listener = (_event: any, theme: string) => callback(theme);
			ipcRenderer.on("on-theme-changed", listener);
			return () => ipcRenderer.off("on-theme-changed", listener);
		},
		notifyLanguageChanged: (lang: string) => ipcRenderer.send("language-changed", lang),
		onLanguageChanged: (callback: (lang: string) => void) => {
			const listener = (_event: any, lang: string) => callback(lang);
			ipcRenderer.on("on-language-changed", listener);
			return () => ipcRenderer.off("on-language-changed", listener);
		},
		openConfirm: (options: {
			title?: string;
			message?: string;
			confirmText?: string;
			cancelText?: string;
			variant?: "default" | "destructive" | "warning";
			type?: "question" | "danger" | "warning" | "success";
			showTitle?: boolean;
		}) => ipcRenderer.invoke("open-confirm", options),
		confirmResult: (result: boolean) =>
			ipcRenderer.send("confirm-result", result),
		openExternal: (url: string) =>
			ipcRenderer.send("open-external", url),
	},
	db: {
		addAccount: (account: any) =>
			ipcRenderer.invoke("db-add-account", account),
		getAccounts: () => ipcRenderer.invoke("db-get-accounts"),
		deleteAccount: (id: string) =>
			ipcRenderer.invoke("db-delete-account", id),
		checkAccountExists: (email: string) =>
			ipcRenderer.invoke("db-check-account-exists", email),
		getSetting: (key: string) => ipcRenderer.invoke("db-get-setting", key),
		setSetting: (key: string, value: string) =>
			ipcRenderer.invoke("db-set-setting", key, value),
		getAllSettings: () => ipcRenderer.invoke("db-get-all-settings"),
	},
	deepseek: {
		login: (payload: {email: string; password: string; deviceId: string}) =>
			ipcRenderer.invoke("deepseek-login", payload),
		fetchHistory: (payload: {token: string; cookies?: string}) =>
			ipcRenderer.invoke("deepseek-fetch-history", payload),
		fetchSessionMessages: (payload: {token: string; cookies?: string; sessionId: string}) =>
			ipcRenderer.invoke("deepseek-fetch-session-messages", payload),
		createChatSession: (payload: {token: string; cookies?: string}) =>
			ipcRenderer.invoke("deepseek-create-session", payload),
		deleteChatSession: (payload: {token: string; cookies?: string; sessionId: string}) =>
			ipcRenderer.invoke("deepseek-delete-session", payload),
		getApiKeys: (payload: {token: string}) =>
			ipcRenderer.invoke("deepseek-get-api-keys", payload),
		editApiKeys: (payload: {token: string; body: any}) =>
			ipcRenderer.invoke("deepseek-edit-api-keys", payload),
		startChatStream: (payload: {token: string; cookies?: string; payload: any}) =>
			ipcRenderer.send("deepseek-chat-stream", payload),
		onChatChunk: (callback: (chunk: string) => void) => {
			const listener = (_event: any, chunk: string) => callback(chunk);
			ipcRenderer.on("deepseek-chat-chunk", listener);
			return () => ipcRenderer.off("deepseek-chat-chunk", listener);
		},
		onChatEnd: (callback: () => void) => {
			const listener = () => callback();
			ipcRenderer.on("deepseek-chat-end", listener);
			return () => ipcRenderer.off("deepseek-chat-end", listener);
		},
		onChatError: (callback: (err: {message: string}) => void) => {
			const listener = (_event: any, err: {message: string}) => callback(err);
			ipcRenderer.on("deepseek-chat-error", listener);
			return () => ipcRenderer.off("deepseek-chat-error", listener);
		},
	},
	server: {
		start: (config?: { token?: string; port?: number; apiKey?: string }) => ipcRenderer.invoke("server-start", config),
		stop: () => ipcRenderer.invoke("server-stop"),
		status: () => ipcRenderer.invoke("server-status"),
		getLogs: () => ipcRenderer.invoke("server-logs"),
		onLog: (callback: (msg: string) => void) => {
			const listener = (_event: any, msg: string) => callback(msg);
			ipcRenderer.on("server-log", listener);
			return () => ipcRenderer.off("server-log", listener);
		},
		onStatusChanged: (callback: (isRunning: boolean, port?: number) => void) => {
			const listener = (_event: any, isRunning: boolean, port?: number) => callback(isRunning, port);
			ipcRenderer.on("server-status-changed", listener);
			return () => ipcRenderer.off("server-status-changed", listener);
		}
	},
	log: (payload: unknown) => ipcRenderer.send("renderer-log", payload),
});
