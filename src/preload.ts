import {contextBridge, ipcRenderer} from "electron";

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
	},
	log: (payload: unknown) => ipcRenderer.send("renderer-log", payload),
});
