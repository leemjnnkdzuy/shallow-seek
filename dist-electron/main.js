import { app, ipcMain, BrowserWindow, Menu } from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Database from "better-sqlite3";
import fs from "node:fs";
const userDataPath = app.getPath("userData");
const dbDir = path.join(userDataPath, "database");
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}
const dbPath = path.join(dbDir, "shallow-seek.db");
const db = new Database(dbPath);
db.exec(`
  CREATE TABLE IF NOT EXISTS accounts (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL,
    token TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);
const addAccount = (account) => {
  const stmt = db.prepare("INSERT OR REPLACE INTO accounts (id, email, token) VALUES (?, ?, ?)");
  return stmt.run(account.id, account.email, account.token);
};
const getAccounts = () => {
  const stmt = db.prepare("SELECT * FROM accounts ORDER BY created_at DESC");
  return stmt.all();
};
const deleteAccount = (id) => {
  const stmt = db.prepare("DELETE FROM accounts WHERE id = ?");
  return stmt.run(id);
};
const __filename$1 = fileURLToPath(import.meta.url);
const __dirname$1 = path.dirname(__filename$1);
process.env.APP_ROOT = path.join(__dirname$1, "..");
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
let win;
function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    frame: false,
    titleBarStyle: "hidden",
    icon: path.join(process.env.VITE_PUBLIC, "logo.png"),
    webPreferences: {
      preload: path.join(__dirname$1, "preload.mjs")
    },
    // Hide the menu bar
    autoHideMenuBar: true
  });
  Menu.setApplicationMenu(null);
  win.on("maximize", () => {
    win == null ? void 0 : win.webContents.send("window-state-changed", "maximized");
  });
  win.on("unmaximize", () => {
    win == null ? void 0 : win.webContents.send("window-state-changed", "unmaximized");
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
  const win2 = BrowserWindow.fromWebContents(webContents);
  win2 == null ? void 0 : win2.minimize();
});
ipcMain.on("window-maximize", (event) => {
  const webContents = event.sender;
  const win2 = BrowserWindow.fromWebContents(webContents);
  if (win2 == null ? void 0 : win2.isMaximized()) {
    win2.unmaximize();
  } else {
    win2 == null ? void 0 : win2.maximize();
  }
});
ipcMain.on("window-close", (event) => {
  const webContents = event.sender;
  const win2 = BrowserWindow.fromWebContents(webContents);
  if (win2) {
    win2.hide();
    win2.close();
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
  const parentWindow = BrowserWindow.fromWebContents(event.sender) || void 0;
  const popup = new BrowserWindow({
    width: 450,
    height: 550,
    frame: false,
    resizable: false,
    parent: parentWindow,
    modal: true,
    icon: path.join(process.env.VITE_PUBLIC, "logo.png"),
    webPreferences: {
      preload: path.join(__dirname$1, "preload.mjs")
    }
  });
  if (VITE_DEV_SERVER_URL) {
    popup.loadURL(`${VITE_DEV_SERVER_URL}#/add-account`);
  } else {
    popup.loadFile(path.join(RENDERER_DIST, "index.html"), {
      hash: "/add-account"
    });
  }
});
ipcMain.handle("db-add-account", async (_event, account) => {
  try {
    addAccount(account);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});
ipcMain.handle("db-get-accounts", async () => {
  try {
    const accounts = getAccounts();
    return { success: true, data: accounts };
  } catch (error) {
    return { success: false, error: error.message };
  }
});
ipcMain.handle("db-delete-account", async (_event, id) => {
  try {
    deleteAccount(id);
    return { success: true };
  } catch (error) {
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
export {
  MAIN_DIST,
  RENDERER_DIST,
  VITE_DEV_SERVER_URL
};
