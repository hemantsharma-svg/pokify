"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { Play } from "lucide-react";
import { getArtist, getArtistAlbums, getArtistTracks } from "@/lib/catalog";
import { CoverArt } from "@/components/cover-art";
import { TrackRow } from "@/components/track-row";
import { PlaylistCard } from "@/components/playlist-card";
import { usePlayer } from "@/lib/player-context";

export default function ArtistPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const artist = getArtist(id);
  const { playTrack } = usePlayer();

  if (!artist) return notFound();

  const tracks = getArtistTracks(artist.id);
  const albums = getArtistAlbums(artist.id);
  const topTracks = tracks.slice(0, 5);

  return (
    <div className="space-y-8">
      <div className={`-mx-6 flex items-end gap-6 bg-gradient-to-b p-6 pb-8 ${artist.cover}`}>
        <CoverArt gradient={artist.cover} size="xl" rounded="full" />
        <div>
          <p className="text-sm font-semibold text-white">Artist</p>
          <h1 className="text-5xl font-black text-white drop-shadow">{artist.name}</h1>
          <p className="mt-2 text-sm text-white/80">{artist.genre}</p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button
          onClick={() => tracks.length > 0 && playTrack(tracks[0], tracks)}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-black shadow-xl transition hover:scale-105"
          aria-label="Play"
        >
          <Play className="h-6 w-6 pl-1" />
        </button>
      </div>

      <section>
        <h2 className="mb-4 text-xl font-bold text-white">Popular</h2>
        <div className="space-y-1">
          {topTracks.map((t, i) => (
            <TrackRow key={t.id} track={t} index={i} queue={topTracks} showAlbum={false} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-bold text-white">Albums</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {albums.map((a) => (
            <PlaylistCard
              key={a.id}
              href={`/album/${a.id}`}
              cover={a.cover}
              title={a.name}
              subtitle={`${a.year}`}
              tracks={tracks.filter((t) => t.albumId === a.id)}
            />
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-bold text-white">About</h2>
        <p className="max-w-2xl text-neutral-300">{artist.bio}</p>
      </section>
    </div>
  );
}
