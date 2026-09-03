# Spotify AutoEQ

Desktop app built with Electron + React for connecting to Spotify and showing your currently playing track, intended as a foundation for automatic EQ profile switching.

## Current status

The project currently supports:

- Spotify OAuth login (Authorization Code + PKCE)
- Secure Electron preload bridge for Spotify actions
- Polling Spotify playback state every 2 seconds
- Displaying current track metadata (title, artist, album, artwork, play/pause)

AutoEQ preset detection/switching is not implemented yet.

## Tech stack

- Electron
- React + TypeScript
- Vite
- ESLint

## Prerequisites

- Node.js 18+ (Node 20 recommended)
- npm
- A Spotify account
- A Spotify app created in the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)

## Spotify app setup

1. Create or open your Spotify app.
2. Copy your **Client ID**.
3. Add a redirect URI in your app settings, for example:
   - `http://127.0.0.1:3000/callback`
4. Save settings.

> The redirect URI must exactly match `SPOTIFY_REDIRECT_URI` in your `.env` file.

## Environment variables

Create `/home/runner/work/Spotify-AutoEQ/Spotify-AutoEQ/.env`:

```env
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_REDIRECT_URI=http://127.0.0.1:3000/callback
```

## Install and run

```bash
npm install
npm run dev
```

When the app starts:

1. Click **Connect Spotify**
2. Approve access in the browser
3. Return to the app to see your current playback info

## Scripts

- `npm run dev` — run in development
- `npm run lint` — run ESLint
- `npm run build` — type-check, build frontend, and package with electron-builder
- `npm run preview` — preview Vite frontend build

## Project structure

- `electron/` — Electron main/preload and Spotify integration
- `src/` — React renderer app
- `dist-electron/` — generated Electron build output

## Troubleshooting

- **`SPOTIFY_CLIENT_ID is not configured`**
  - Ensure `.env` exists and includes `SPOTIFY_CLIENT_ID`.
- **`SPOTIFY_REDIRECT_URI is not configured`**
  - Add `SPOTIFY_REDIRECT_URI` to `.env`.
- **OAuth callback/state errors**
  - Verify the redirect URI value exactly matches in both Spotify Dashboard and `.env`.
- **Nothing is currently playing**
  - Start playback on any Spotify device and keep it active.

## License

MIT — see [LICENSE](./LICENSE).
