import {app, BrowserWindow, Menu} from "electron";
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
		minWidth: 1200,
		minHeight: 800,
		frame: false,
		titleBarStyle: "hidden",
		icon: path.join(process.env.VITE_PUBLIC, "logo.png"),
		webPreferences: {
			preload: path.join(__dirname, "preload.mjs"),
		},
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

import {registerIpcs} from "./ipcs";

registerIpcs(__dirname, VITE_DEV_SERVER_URL, RENDERER_DIST);

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
