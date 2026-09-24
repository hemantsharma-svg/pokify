"use client";

import { useMemo } from "react";
import { PlaylistCard } from "@/components/playlist-card";
import { TrackRow } from "@/components/track-row";
import { CoverArt } from "@/components/cover-art";
import Link from "next/link";
import { ARTISTS, ALBUMS, TRACKS, FEATURED_PLAYLISTS_SEED, getTrack } from "@/lib/catalog";
import { useApp } from "@/lib/store";

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default function HomePage() {
  const { playlists, recentIds, user } = useApp();

  const recentTracks = useMemo(
    () => recentIds.map((id) => getTrack(id)).filter(Boolean).slice(0, 5) as typeof TRACKS,
    [recentIds]
  );

  const quickTiles = [...FEATURED_PLAYLISTS_SEED.slice(0, 4), ...playlists.slice(0, 2)];

  return (
    <div className="space-y-10 pt-6">
      <section>
        <h1 className="mb-4 text-2xl font-bold text-white">{greeting()}</h1>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {quickTiles.map((p) => (
            <Link
              key={p.id}
              href={`/playlist/${p.id}`}
              className="flex items-center gap-4 overflow-hidden rounded-md bg-white/5 transition hover:bg-white/10"
            >
              <CoverArt gradient={p.cover} size="md" />
              <span className="truncate font-semibold text-white">{p.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {recentTracks.length > 0 && (
        <section>
          <h2 className="mb-4 text-xl font-bold text-white">Recently played</h2>
          <div className="space-y-1">
            {recentTracks.map((t, i) => (
              <TrackRow key={t.id} track={t} index={i} queue={recentTracks} />
            ))}
          </div>
        </section>
      )}

      {user && playlists.length > 0 && (
        <section>
          <h2 className="mb-4 text-xl font-bold text-white">Your playlists</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {playlists.map((p) => (
              <PlaylistCard
                key={p.id}
                href={`/playlist/${p.id}`}
                cover={p.cover}
                title={p.name}
                subtitle={p.description || `${p.trackIds.length} songs`}
                tracks={p.trackIds.map((id) => getTrack(id)).filter(Boolean) as typeof TRACKS}
              />
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="mb-4 text-xl font-bold text-white">Featured playlists</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {FEATURED_PLAYLISTS_SEED.map((p) => (
            <PlaylistCard
              key={p.id}
              href={`/playlist/${p.id}`}
              cover={p.cover}
              title={p.name}
              subtitle={p.description || `${p.trackIds.length} songs`}
              tracks={p.trackIds.map((id) => getTrack(id)).filter(Boolean) as typeof TRACKS}
            />
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-bold text-white">New releases</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {ALBUMS.slice(0, 10).map((a) => (
            <PlaylistCard
              key={a.id}
              href={`/album/${a.id}`}
              cover={a.cover}
              title={a.name}
              subtitle={`${a.year} · ${a.artistName}`}
              tracks={TRACKS.filter((t) => t.albumId === a.id)}
            />
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-bold text-white">More albums</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {ALBUMS.slice(10, 20).map((a) => (
            <PlaylistCard
              key={a.id}
              href={`/album/${a.id}`}
              cover={a.cover}
              title={a.name}
              subtitle={`${a.year} · ${a.artistName}`}
              tracks={TRACKS.filter((t) => t.albumId === a.id)}
            />
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-bold text-white">Popular artists</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {ARTISTS.map((a) => (
            <Link key={a.id} href={`/artist/${a.id}`} className="rounded-md bg-neutral-900/60 p-4 text-center transition hover:bg-neutral-800">
              <CoverArt gradient={a.cover} size="lg" rounded="full" className="mx-auto mb-4" />
              <p className="truncate font-semibold text-white">{a.name}</p>
              <p className="text-sm text-neutral-400">Artist</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
