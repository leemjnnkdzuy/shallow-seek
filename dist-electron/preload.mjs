"use strict";
const electron = require("electron");
try {
  Object.defineProperty(navigator, "webdriver", {
    get: () => void 0
  });
  if (!window.chrome) {
    window.chrome = {
      runtime: {}
    };
  }
} catch (e) {
}
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
    openCreateApiKey: (token) => electron.ipcRenderer.send("open-create-api-key", token),
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
    confirmResult: (result) => electron.ipcRenderer.send("confirm-result", result),
    openExternal: (url) => electron.ipcRenderer.send("open-external", url)
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
    login: (payload) => electron.ipcRenderer.invoke("deepseek-login", payload),
    fetchHistory: (payload) => electron.ipcRenderer.invoke("deepseek-fetch-history", payload),
    fetchSessionMessages: (payload) => electron.ipcRenderer.invoke("deepseek-fetch-session-messages", payload),
    createChatSession: (payload) => electron.ipcRenderer.invoke("deepseek-create-session", payload),
    deleteChatSession: (payload) => electron.ipcRenderer.invoke("deepseek-delete-session", payload),
    getApiKeys: (payload) => electron.ipcRenderer.invoke("deepseek-get-api-keys", payload),
    editApiKeys: (payload) => electron.ipcRenderer.invoke("deepseek-edit-api-keys", payload),
    uploadFile: (payload) => electron.ipcRenderer.invoke("deepseek-upload-file", payload),
    fetchFiles: (payload) => electron.ipcRenderer.invoke("deepseek-fetch-files", payload),
    saveTempFile: (payload) => electron.ipcRenderer.invoke("deepseek-save-temp-file", payload),
    startChatStream: (payload) => electron.ipcRenderer.send("deepseek-chat-stream", payload),
    onChatChunk: (callback) => {
      const listener = (_event, chunk) => callback(chunk);
      electron.ipcRenderer.on("deepseek-chat-chunk", listener);
      return () => electron.ipcRenderer.off("deepseek-chat-chunk", listener);
    },
    onChatEnd: (callback) => {
      const listener = () => callback();
      electron.ipcRenderer.on("deepseek-chat-end", listener);
      return () => electron.ipcRenderer.off("deepseek-chat-end", listener);
    },
    onChatError: (callback) => {
      const listener = (_event, err) => callback(err);
      electron.ipcRenderer.on("deepseek-chat-error", listener);
      return () => electron.ipcRenderer.off("deepseek-chat-error", listener);
    }
  },
  server: {
    start: (config) => electron.ipcRenderer.invoke("server-start", config),
    stop: () => electron.ipcRenderer.invoke("server-stop"),
    status: () => electron.ipcRenderer.invoke("server-status"),
    getLogs: () => electron.ipcRenderer.invoke("server-logs"),
    onLog: (callback) => {
      const listener = (_event, msg) => callback(msg);
      electron.ipcRenderer.on("server-log", listener);
      return () => electron.ipcRenderer.off("server-log", listener);
    },
    onStatusChanged: (callback) => {
      const listener = (_event, isRunning, port) => callback(isRunning, port);
      electron.ipcRenderer.on("server-status-changed", listener);
      return () => electron.ipcRenderer.off("server-status-changed", listener);
    }
  },
  log: (payload) => electron.ipcRenderer.send("renderer-log", payload)
});
