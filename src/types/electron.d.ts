export {}

interface Track {
  title: string
  artist: string
}

declare global {
  interface Window {
    electronAPI: {
      platform: string

      spotify: {
        getCurrentTrack: () => Promise<Track>
      }
    }
  }
}
