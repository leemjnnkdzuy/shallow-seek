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
      electron.ipcRenderer.on("window-state-changed", (_event, state) => callback(state));
    },
    openAddAccount: () => electron.ipcRenderer.send("open-add-account")
  },
  db: {
    addAccount: (account) => electron.ipcRenderer.invoke("db-add-account", account),
    getAccounts: () => electron.ipcRenderer.invoke("db-get-accounts"),
    deleteAccount: (id) => electron.ipcRenderer.invoke("db-delete-account", id)
  }
});
