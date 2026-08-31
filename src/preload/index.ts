import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  platform: process.platform,

  spotify: {
    login: () => ipcRenderer.invoke("spotify:login"),
    getCurrentTrack: () => ipcRenderer.invoke("spotify:get-current-track"),
  },
});
