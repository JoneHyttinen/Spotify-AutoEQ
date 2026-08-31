import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,

  spotify: {
    getCurrentTrack: () =>
      ipcRenderer.invoke('spotify:get-current-track')
  }
})
