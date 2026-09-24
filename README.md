# Pokify

A fully functional Spotify-style music streaming web app built with Next.js 15, TypeScript, Tailwind CSS, and a real SQLite-backed account system.

## Features
- Real audio playback (play/pause/seek/volume/shuffle/repeat/queue)
- Browse, search, artist & album pages across 20 artists / 30 albums / 135 songs
- Real backend accounts: signup, login, logout, forgot/reset password (bcrypt + sessions + SQLite)
- Playlists (create/rename/delete/add/remove tracks) and Liked Songs, saved per-account server-side
- Dark, Spotify-inspired UI

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Notes
This is an original app inspired by Spotify's functionality — it does not use Spotify's real catalog, trademarks, or licensed music. Audio tracks are royalty-free demo tracks used so playback is genuinely functional.
