import { useEffect, useState } from 'react'
import './App.css'

interface Track {
  title: string
  artist: string
}

function App() {
  const [track, setTrack] = useState<Track | null>(null)

  useEffect(() => {
    window.electronAPI?.spotify.getCurrentTrack().then(setTrack)
  }, [])

  return (
    <main style={{ padding: 32 }}>
      <h1>Spotify AutoEQ</h1>

      <p>Platform: {window.electronAPI?.platform ?? 'unknown'}</p>

      <h2>Now Playing</h2>

      <p>{track?.title ?? 'Loading...'}</p>
      <p>{track?.artist}</p>
    </main>
  )
}

export default App
