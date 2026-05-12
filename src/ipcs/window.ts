import {ipcMain, BrowserWindow} from "electron";

export function registerWindowIpcs() {
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
}
