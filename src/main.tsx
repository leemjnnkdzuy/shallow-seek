import {app, BrowserWindow, Menu, ipcMain} from "electron";
import path from "node:path";

import {fileURLToPath} from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
process.env.APP_ROOT = path.join(__dirname, "..");

export const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
export const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
export const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");

process.env.VITE_PUBLIC =
	VITE_DEV_SERVER_URL ?
		path.join(process.env.APP_ROOT, "public")
	:	RENDERER_DIST;

let win: BrowserWindow | null;

function createWindow() {
	win = new BrowserWindow({
		width: 1200,
		height: 800,
		frame: false,
		titleBarStyle: "hidden",
		icon: path.join(process.env.VITE_PUBLIC, "logo.png"),
		webPreferences: {
			preload: path.join(__dirname, "preload.mjs"),
		},
		// Hide the menu bar
		autoHideMenuBar: true,
	});

	Menu.setApplicationMenu(null);

	win.on("maximize", () => {
		win?.webContents.send("window-state-changed", "maximized");
	});

	win.on("unmaximize", () => {
		win?.webContents.send("window-state-changed", "unmaximized");
	});

	if (VITE_DEV_SERVER_URL) {
		console.log("Loading URL:", VITE_DEV_SERVER_URL);
		win.loadURL(VITE_DEV_SERVER_URL);
	} else {
		console.log("Loading file:", path.join(RENDERER_DIST, "index.html"));
		win.loadFile(path.join(RENDERER_DIST, "index.html"));
	}
}

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
		icon: path.join(process.env.VITE_PUBLIC, "logo.png"),
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

import { addAccount, getAccounts, deleteAccount } from './services/db';

ipcMain.handle('db-add-account', async (_event, account) => {
  try {
    addAccount(account);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('db-get-accounts', async () => {
  try {
    const accounts = getAccounts();
    return { success: true, data: accounts };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('db-delete-account', async (_event, id) => {
  try {
    deleteAccount(id);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
});

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
		win = null;
	}
});

app.on("activate", () => {
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow();
	}
});

app.whenReady().then(createWindow);
