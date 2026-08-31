import type { Track } from "./Spotify.ts";

export {};

declare global {
  interface Window {
    electronAPI: {
      platform: string;

      spotify: {
        login: () => Promise<boolean>;
        getCurrentTrack: () => Promise<Track | null>;
      };
    };
  }
}
