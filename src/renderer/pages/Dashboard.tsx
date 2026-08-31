import Card from "../components/Card";
import "./Dashboard.css";

const handleConnect = async () => {
  try {
    await window.electronAPI.spotify.login();

    console.log("Spotify connected!");

    const track = await window.electronAPI.spotify.getCurrentTrack();

    if (track) {
      console.log("Current track:", track);
    } else {
      console.log("No track is currently playing.");
    }
  } catch (error) {
    console.error("Spotify connection failed:", error);
  }
};

export default function Dashboard() {
  return (
    <div className="dashboard">
      <div className="header">
        <h1>Dashboard</h1>
        <button className="spotifyButton" onClick={handleConnect}>
          Connect Spotify
        </button>
      </div>

      <div className="cards">
        <Card title="Now Playing">
          <h2>Cherry Waves</h2>
          <p>Deftones</p>
          <small>Saturday Night Wrist</small>
        </Card>

        <Card title="Active Preset">
          <h2>Airy Shoegaze</h2>
          <p>Automatically selected.</p>
        </Card>

        <Card title="AutoEQ">
          <label className="toggle">
            <input type="checkbox" defaultChecked />
            Enabled
          </label>
        </Card>
      </div>
    </div>
  );
}
