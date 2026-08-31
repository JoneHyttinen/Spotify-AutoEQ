export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  progress: number;
  isPlaying: boolean;
  image?: string;
}
