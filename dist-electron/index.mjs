"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("electronAPI", {
  platform: process.platform,
  spotify: {
    getCurrentTrack: () => electron.ipcRenderer.invoke("spotify:get-current-track")
  }
});
