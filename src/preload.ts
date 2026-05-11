import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electron', {
  send: (channel: string, data: any) => {
    let validChannels = ['toMain']
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data)
    }
  },
  receive: (channel: string, func: (...args: any[]) => void) => {
    let validChannels = ['fromMain']
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (_event, ...args) => func(...args))
    }
  },
  windowControls: {
    minimize: () => ipcRenderer.send('window-minimize'),
    maximize: () => ipcRenderer.send('window-maximize'),
    close: () => ipcRenderer.send('window-close'),
    zoomIn: () => ipcRenderer.send('window-zoom-in'),
    zoomOut: () => ipcRenderer.send('window-zoom-out'),
    resetZoom: () => ipcRenderer.send('window-zoom-reset'),
    onWindowStateChange: (callback: (state: 'maximized' | 'unmaximized') => void) => {
      ipcRenderer.on('window-state-changed', (_event, state) => callback(state))
    },
    openAddAccount: () => ipcRenderer.send('open-add-account')
  },
  db: {
    addAccount: (account: any) => ipcRenderer.invoke('db-add-account', account),
    getAccounts: () => ipcRenderer.invoke('db-get-accounts'),
    deleteAccount: (id: string) => ipcRenderer.invoke('db-delete-account', id)
  }
})
