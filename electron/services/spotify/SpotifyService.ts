import { SpotifyAuth } from "./SpotifyAuth";
import { SpotifyClient } from "./SpotifyClient";

export class SpotifyService {
  private readonly auth: SpotifyAuth;
  private readonly client: SpotifyClient;

  constructor() {
    this.auth = new SpotifyAuth();
    this.client = new SpotifyClient();
  }

  async login(): Promise<void> {
    const tokens = await this.auth.login();

    this.client.setAccessToken(tokens.access_token);
  }

  async getCurrentTrack() {
    const currentlyPlaying = await this.client.getCurrentlyPlaying();

    if (!currentlyPlaying?.item) {
      return null;
    }

    const track = currentlyPlaying.item;

    return {
      id: track.id,
      title: track.name,

      artist: track.artists.map((artist) => artist.name).join(", "),

      album: track.album.name,

      duration: track.duration_ms,

      progress: currentlyPlaying.progress_ms ?? 0,

      isPlaying: currentlyPlaying.is_playing,

      image: track.album.images[0]?.url ?? null,
    };
  }
}
