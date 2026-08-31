export interface SpotifyTrack {
  id: string;
  name: string;

  artists: {
    name: string;
  }[];

  album: {
    name: string;

    images: {
      url: string;
      height: number | null;
      width: number | null;
    }[];
  };

  duration_ms: number;
}

export interface SpotifyCurrentlyPlaying {
  is_playing: boolean;
  progress_ms: number | null;
  item: SpotifyTrack | null;
}

export class SpotifyClient {
  private accessToken: string | null = null;

  setAccessToken(accessToken: string): void {
    this.accessToken = accessToken;
  }

  async getCurrentlyPlaying(): Promise<SpotifyCurrentlyPlaying | null> {
    if (!this.accessToken) {
      throw new Error("Spotify is not authenticated");
    }

    const response = await fetch(
      "https://api.spotify.com/v1/me/player/currently-playing",
      {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      },
    );

    if (response.status === 204) {
      return null;
    }

    if (!response.ok) {
      throw new Error(`Spotify API error: ${response.status}`);
    }

    return response.json() as Promise<SpotifyCurrentlyPlaying>;
  }
}
