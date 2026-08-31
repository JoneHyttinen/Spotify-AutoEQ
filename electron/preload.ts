import { contextBridge, ipcRenderer } from 'electron'

const electronAPI = {
  platform: process.platform,

  spotify: {
    getCurrentTrack: () => ipcRenderer.invoke('spotify:get-current-track'),
  },
}

contextBridge.exposeInMainWorld('electronAPI', electronAPI)
