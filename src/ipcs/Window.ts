import {ipcMain, BrowserWindow, shell} from "electron";
import path from "node:path";

export function registerWindowIpcs(
	__dirname: string,
	VITE_DEV_SERVER_URL: string | undefined,
	RENDERER_DIST: string,
) {
	ipcMain.on("window-minimize", (event) => {
		const webContents = event.sender;
		const win = BrowserWindow.fromWebContents(webContents);
		win?.minimize();
	});

	ipcMain.on("window-maximize", (event) => {
		const webContents = event.sender;
		const win = BrowserWindow.fromWebContents(webContents);
		if (win?.isMaximized()) {
			win.unmaximize();
		} else {
			win?.maximize();
		}
	});

	ipcMain.on("window-close", (event) => {
		const webContents = event.sender;
		const win = BrowserWindow.fromWebContents(webContents);
		if (win) {
			win.hide();
			win.close();
		}
	});

	ipcMain.on("window-zoom-in", (event) => {
		const webContents = event.sender;
		const currentZoom = webContents.getZoomLevel();
		webContents.setZoomLevel(currentZoom + 0.5);
	});

	ipcMain.on("window-zoom-out", (event) => {
		const webContents = event.sender;
		const currentZoom = webContents.getZoomLevel();
		webContents.setZoomLevel(currentZoom - 0.5);
	});

	ipcMain.on("window-zoom-reset", (event) => {
		const webContents = event.sender;
		webContents.setZoomLevel(0);
	});

	ipcMain.on("renderer-log", (_event, payload: unknown) => {
		console.log("[renderer-log]", payload);
	});

	let confirmResolve: ((value: boolean) => void) | null = null;

	ipcMain.handle("open-confirm", async (event, options: any) => {
		const parentWindow =
			BrowserWindow.fromWebContents(event.sender) || undefined;

		const params = new URLSearchParams();
		Object.entries(options).forEach(([key, value]) => {
			params.append(key, String(value));
		});

		const popup = new BrowserWindow({
			width: 500,
			height: 240,
			frame: false,
			resizable: false,
			parent: parentWindow,
			modal: true,
			show: false,
			webPreferences: {
				preload: path.join(__dirname, "preload.mjs"),
			},
		});

		if (VITE_DEV_SERVER_URL) {
			popup.loadURL(
				`${VITE_DEV_SERVER_URL}#/confirm?${params.toString()}`,
			);
		} else {
			popup.loadFile(path.join(RENDERER_DIST, "index.html"), {
				hash: `/confirm?${params.toString()}`,
			});
		}

		popup.once("ready-to-show", () => {
			popup.show();
		});

		return new Promise((resolve) => {
			confirmResolve = resolve;

			popup.on("closed", () => {
				if (confirmResolve) {
					confirmResolve(false);
					confirmResolve = null;
				}
			});
		});
	});

	ipcMain.on("confirm-result", (event, result: boolean) => {
		if (confirmResolve) {
			confirmResolve(result);
			confirmResolve = null;
		}
		const win = BrowserWindow.fromWebContents(event.sender);
		win?.close();
	});

	ipcMain.on("open-settings", (event) => {
		const parentWindow =
			BrowserWindow.fromWebContents(event.sender) || undefined;

		const settingsWin = new BrowserWindow({
			width: 900,
			height: 600,
			frame: false,
			parent: parentWindow,
			modal: true,
			webPreferences: {
				preload: path.join(__dirname, "preload.mjs"),
			},
		});

		if (VITE_DEV_SERVER_URL) {
			settingsWin.loadURL(`${VITE_DEV_SERVER_URL}#/settings/interface`);
		} else {
			settingsWin.loadFile(path.join(RENDERER_DIST, "index.html"), {
				hash: "/settings/interface",
			});
		}
	});

	ipcMain.on("theme-changed", (_event, theme: string) => {
		BrowserWindow.getAllWindows().forEach((win) => {
			win.webContents.send("on-theme-changed", theme);
		});
	});

	ipcMain.on("language-changed", (_event, lang: string) => {
		BrowserWindow.getAllWindows().forEach((win) => {
			win.webContents.send("on-language-changed", lang);
		});
	});

	ipcMain.on("open-external", (_event, url: string) => {
		shell.openExternal(url);
	});
}
