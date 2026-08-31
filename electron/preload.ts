import { contextBridge, ipcRenderer } from "electron";

console.log("Spotify AutoEQ preload loaded");

contextBridge.exposeInMainWorld("electronAPI", {
  platform: process.platform,

  spotify: {
    login: () => {
      console.log("IPC: spotify:login");

      return ipcRenderer.invoke("spotify:login");
    },

    getCurrentTrack: () => {
      return ipcRenderer.invoke("spotify:get-current-track");
    },
  },
});
