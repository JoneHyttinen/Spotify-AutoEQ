import "dotenv/config";

import { app, BrowserWindow, ipcMain } from "electron";
import { SpotifyService } from "./services/spotify/SpotifyService";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const spotifyService = new SpotifyService();

const createWindow = (): void => {
  const window = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 900,
    minHeight: 600,

    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    window.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    window.loadFile(path.join(__dirname, "../dist/index.html"));
  }
};

ipcMain.handle("spotify:login", async () => {
  await spotifyService.login();

  return true;
});

ipcMain.handle("spotify:get-current-track", async () => {
  return spotifyService.getCurrentTrack();
});

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

console.log("Spotify Client ID:", process.env.SPOTIFY_CLIENT_ID);

console.log("Spotify Redirect URI:", process.env.SPOTIFY_REDIRECT_URI);
