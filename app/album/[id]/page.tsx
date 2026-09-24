"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Play } from "lucide-react";
import { getAlbum, getAlbumTracks, formatDuration } from "@/lib/catalog";
import { CoverArt } from "@/components/cover-art";
import { TrackRow } from "@/components/track-row";
import { usePlayer } from "@/lib/player-context";

export default function AlbumPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const album = getAlbum(id);
  const { playTrack } = usePlayer();

  if (!album) return notFound();

  const tracks = getAlbumTracks(album.id);
  const totalSeconds = tracks.reduce((sum, t) => sum + t.duration, 0);

  return (
    <div className="space-y-6">
      <div className="-mx-6 flex items-end gap-6 bg-gradient-to-b from-neutral-700 to-transparent p-6 pb-8">
        <CoverArt gradient={album.cover} size="xl" />
        <div>
          <p className="text-sm font-semibold text-white">Album</p>
          <h1 className="text-5xl font-black text-white drop-shadow">{album.name}</h1>
          <p className="mt-2 text-sm text-white/80">
            <Link href={`/artist/${album.artistId}`} className="font-semibold hover:underline">
              {album.artistName}
            </Link>{" "}
            · {album.year} · {tracks.length} songs, {Math.round(totalSeconds / 60)} min
          </p>
        </div>
      </div>

      <button
        onClick={() => tracks.length > 0 && playTrack(tracks[0], tracks)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-black shadow-xl transition hover:scale-105"
        aria-label="Play album"
      >
        <Play className="h-6 w-6 pl-1" />
      </button>

      <div className="space-y-1">
        {tracks.map((t, i) => (
          <TrackRow key={t.id} track={t} index={i} queue={tracks} showAlbum={false} />
        ))}
      </div>
      <p className="pt-4 text-xs text-neutral-500">Total: {formatDuration(totalSeconds)}</p>
    </div>
  );
}
