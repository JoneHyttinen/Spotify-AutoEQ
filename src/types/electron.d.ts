import type { Track } from "./track.ts";

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
