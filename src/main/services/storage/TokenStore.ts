import { app } from "electron";
import fs from "node:fs";
import path from "node:path";

interface SpotifyTokens {
  refreshToken?: string;
}

const tokenFile = path.join(app.getPath("userData"), "spotify.json");

export class TokenStore {
  static save(refreshToken: string) {
    const data: SpotifyTokens = { refreshToken };
    fs.writeFileSync(tokenFile, JSON.stringify(data, null, 2));
  }

  static load(): SpotifyTokens {
    if (!fs.existsSync(tokenFile)) {
      return {};
    }

    return JSON.parse(fs.readFileSync(tokenFile, "utf8"));
  }
}
