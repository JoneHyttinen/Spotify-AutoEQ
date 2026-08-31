import { useState } from "react";
import { useCurrentTrack } from "../../hooks/useCurrentTrack";

export default function Dashboard() {
  const [connected, setConnected] = useState(false);

  const { track, loading, error } = useCurrentTrack(connected);

  const handleConnect = async () => {
    try {
      await window.electronAPI.spotify.login();

      setConnected(true);
    } catch (error) {
      console.error("Spotify connection failed:", error);
    }
  };

  return (
    <main>
      <h1>Spotify AutoEQ</h1>

      {!connected && <button onClick={handleConnect}>Connect Spotify</button>}

      {connected && (
        <section>
          <p>Spotify connected</p>

          {loading && <p>Checking playback...</p>}

          {error && <p>{error}</p>}

          {track && (
            <div>
              {track.image && (
                <img src={track.image} alt={track.album} width={200} />
              )}

              <h2>{track.title}</h2>

              <p>{track.artist}</p>

              <p>{track.album}</p>

              <p>{track.isPlaying ? "Playing" : "Paused"}</p>
            </div>
          )}

          {!loading && !track && <p>Nothing is currently playing.</p>}
        </section>
      )}
    </main>
  );
}
