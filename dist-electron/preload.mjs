"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("electron", {
  send: (channel, data) => {
    let validChannels = ["toMain"];
    if (validChannels.includes(channel)) {
      electron.ipcRenderer.send(channel, data);
    }
  },
  receive: (channel, func) => {
    let validChannels = ["fromMain"];
    if (validChannels.includes(channel)) {
      electron.ipcRenderer.on(channel, (_event, ...args) => func(...args));
    }
  },
  windowControls: {
    minimize: () => electron.ipcRenderer.send("window-minimize"),
    maximize: () => electron.ipcRenderer.send("window-maximize"),
    close: () => electron.ipcRenderer.send("window-close"),
    zoomIn: () => electron.ipcRenderer.send("window-zoom-in"),
    zoomOut: () => electron.ipcRenderer.send("window-zoom-out"),
    resetZoom: () => electron.ipcRenderer.send("window-zoom-reset"),
    onWindowStateChange: (callback) => {
      electron.ipcRenderer.on(
        "window-state-changed",
        (_event, state) => callback(state)
      );
    },
    openAddAccount: () => electron.ipcRenderer.send("open-add-account"),
    openSettings: () => electron.ipcRenderer.send("open-settings"),
    notifyThemeChanged: (theme) => electron.ipcRenderer.send("theme-changed", theme),
    onThemeChanged: (callback) => {
      const listener = (_event, theme) => callback(theme);
      electron.ipcRenderer.on("on-theme-changed", listener);
      return () => electron.ipcRenderer.off("on-theme-changed", listener);
    },
    notifyLanguageChanged: (lang) => electron.ipcRenderer.send("language-changed", lang),
    onLanguageChanged: (callback) => {
      const listener = (_event, lang) => callback(lang);
      electron.ipcRenderer.on("on-language-changed", listener);
      return () => electron.ipcRenderer.off("on-language-changed", listener);
    },
    openConfirm: (options) => electron.ipcRenderer.invoke("open-confirm", options),
    confirmResult: (result) => electron.ipcRenderer.send("confirm-result", result)
  },
  db: {
    addAccount: (account) => electron.ipcRenderer.invoke("db-add-account", account),
    getAccounts: () => electron.ipcRenderer.invoke("db-get-accounts"),
    deleteAccount: (id) => electron.ipcRenderer.invoke("db-delete-account", id),
    checkAccountExists: (email) => electron.ipcRenderer.invoke("db-check-account-exists", email),
    getSetting: (key) => electron.ipcRenderer.invoke("db-get-setting", key),
    setSetting: (key, value) => electron.ipcRenderer.invoke("db-set-setting", key, value),
    getAllSettings: () => electron.ipcRenderer.invoke("db-get-all-settings")
  },
  deepseek: {
    login: (payload) => electron.ipcRenderer.invoke("deepseek-login", payload)
  },
  log: (payload) => electron.ipcRenderer.send("renderer-log", payload)
});
