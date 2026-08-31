import { useEffect, useState } from 'react'
import type { Track } from '../types/track'

const POLL_INTERVAL = 2000

export function useCurrentTrack(
  connected: boolean,
) {
  const [track, setTrack] =
    useState<Track | null>(null)

  const [loading, setLoading] =
    useState(false)

  const [error, setError] =
    useState<string | null>(null)

  useEffect(() => {
    if (!connected) {
      setTrack(null)
      return
    }

    let cancelled = false

    const fetchTrack = async () => {
      try {
        setLoading(true)
        setError(null)

        const currentTrack =
          await window.electronAPI.spotify
            .getCurrentTrack()

        if (!cancelled) {
          setTrack(currentTrack)}
      } catch (error) {
        if (!cancelled) {
          setError(
            error instanceof Error
              ? error.message
              : 'Failed to get current track',
          )
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    fetchTrack()

    const interval = setInterval(
      fetchTrack,
      POLL_INTERVAL,
    )

    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [connected])

  return {
    track,
    loading,
    error,
  }
}