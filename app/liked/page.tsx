"use client";

import { useMemo, useState } from "react";
import { Play, Heart, LogIn } from "lucide-react";
import { getTrack, formatDuration } from "@/lib/catalog";
import { TrackRow } from "@/components/track-row";
import { usePlayer } from "@/lib/player-context";
import { useApp } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { AuthDialog } from "@/components/auth-dialog";

export default function LikedSongsPage() {
  const { likedIds, user, authLoading } = useApp();
  const { playTrack } = usePlayer();
  const [authOpen, setAuthOpen] = useState(false);

  const tracks = useMemo(
    () => likedIds.map((id) => getTrack(id)).filter(Boolean) as NonNullable<ReturnType<typeof getTrack>>[],
    [likedIds]
  );
  const totalSeconds = tracks.reduce((sum, t) => sum + t.duration, 0);

  if (!authLoading && !user) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 pt-24 text-center">
        <Heart className="h-16 w-16 text-neutral-600" />
        <h1 className="text-2xl font-bold text-white">Log in to see your Liked Songs</h1>
        <p className="max-w-sm text-neutral-400">Songs you like are saved to your account so they follow you everywhere.</p>
        <Button onClick={() => setAuthOpen(true)} className="rounded-full bg-green-500 font-semibold text-black hover:bg-green-400">
          <LogIn className="mr-2 h-4 w-4" /> Log in
        </Button>
        <AuthDialog open={authOpen} onOpenChange={setAuthOpen} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="-mx-6 flex items-end gap-6 bg-gradient-to-b from-indigo-700 to-transparent p-6 pb-8">
        <div className="flex h-56 w-56 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-indigo-600 to-purple-400 shadow-lg">
          <Heart className="h-20 w-20 fill-white text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold text-white">Playlist</p>
          <h1 className="text-5xl font-black text-white drop-shadow">Liked Songs</h1>
          <p className="mt-2 text-sm text-white/80">
            {tracks.length} songs{tracks.length > 0 ? `, ${formatDuration(totalSeconds)}` : ""}
          </p>
        </div>
      </div>

      <button
        onClick={() => tracks.length > 0 && playTrack(tracks[0], tracks)}
        disabled={tracks.length === 0}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-black shadow-xl transition hover:scale-105 disabled:opacity-40"
        aria-label="Play liked songs"
      >
        <Play className="h-6 w-6 pl-1" />
      </button>

      {tracks.length === 0 ? (
        <p className="text-neutral-400">Songs you like will appear here. Tap the heart icon on any track.</p>
      ) : (
        <div className="space-y-1">
          {tracks.map((t, i) => (
            <TrackRow key={t.id} track={t} index={i} queue={tracks} />
          ))}
        </div>
      )}
    </div>
  );
}
