"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  Volume2,
  Volume1,
  VolumeX,
  Heart,
  ListMusic,
} from "lucide-react";
import { usePlayer } from "@/lib/player-context";
import { useApp } from "@/lib/store";
import { CoverArt } from "@/components/cover-art";
import { formatDuration } from "@/lib/catalog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { TrackRow } from "@/components/track-row";

export function NowPlayingBar() {
  const player = usePlayer();
  const { isLiked, toggleLike, user } = useApp();
  const { currentTrack, isPlaying, progress, duration, volume, shuffle, repeat } = player;
  const [queueOpen, setQueueOpen] = useState(false);

  const VolumeIcon = volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;
  const RepeatIcon = repeat === "one" ? Repeat1 : Repeat;

  return (
    <div className="grid h-24 grid-cols-3 items-center border-t border-neutral-800 bg-neutral-950 px-4">
      <div className="flex min-w-0 items-center gap-3">
        {currentTrack ? (
          <>
            <CoverArt gradient={currentTrack.cover} size="sm" />
            <div className="min-w-0">
              <Link href={`/album/${currentTrack.albumId}`} className="block truncate text-sm font-medium text-white hover:underline">
                {currentTrack.title}
              </Link>
              <Link href={`/artist/${currentTrack.artistId}`} className="block truncate text-xs text-neutral-400 hover:underline">
                {currentTrack.artistName}
              </Link>
            </div>
            <button
              onClick={() => user && toggleLike(currentTrack.id)}
              disabled={!user}
              aria-label="Like"
              title={user ? undefined : "Log in to like songs"}
            >
              <Heart
                className={`h-4 w-4 ${isLiked(currentTrack.id) ? "fill-green-500 text-green-500" : "text-neutral-400"}`}
              />
            </button>
          </>
        ) : (
          <span className="text-sm text-neutral-500">Nothing playing</span>
        )}
      </div>

      <div className="flex flex-col items-center gap-1">
        <div className="flex items-center gap-4">
          <button
            onClick={player.toggleShuffle}
            className={shuffle ? "text-green-500" : "text-neutral-400 hover:text-white"}
            aria-label="Shuffle"
          >
            <Shuffle className="h-4 w-4" />
          </button>
          <button onClick={player.prev} className="text-neutral-300 hover:text-white" aria-label="Previous">
            <SkipBack className="h-5 w-5" />
          </button>
          <button
            onClick={player.togglePlay}
            disabled={!currentTrack}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-black disabled:opacity-40"
            aria-label="Play/Pause"
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 pl-0.5" />}
          </button>
          <button onClick={player.next} className="text-neutral-300 hover:text-white" aria-label="Next">
            <SkipForward className="h-5 w-5" />
          </button>
          <button
            onClick={player.cycleRepeat}
            className={repeat !== "off" ? "text-green-500" : "text-neutral-400 hover:text-white"}
            aria-label="Repeat"
          >
            <RepeatIcon className="h-4 w-4" />
          </button>
        </div>
        <div className="flex w-full max-w-md items-center gap-2 text-xs text-neutral-400">
          <span className="w-9 text-right">{formatDuration(progress)}</span>
          <input
            type="range"
            min={0}
            max={duration || 0}
            value={Math.min(progress, duration || 0)}
            onChange={(e) => player.seek(Number(e.target.value))}
            className="h-1 w-full cursor-pointer appearance-none rounded-full bg-neutral-700 accent-white"
          />
          <span className="w-9">{formatDuration(duration || 0)}</span>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3">
        <button onClick={() => setQueueOpen(true)} className="text-neutral-400 hover:text-white" aria-label="Queue">
          <ListMusic className="h-4 w-4" />
        </button>
        <VolumeIcon className="h-4 w-4 text-neutral-400" />
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={(e) => player.setVolume(Number(e.target.value))}
          className="h-1 w-24 cursor-pointer appearance-none rounded-full bg-neutral-700 accent-white"
        />
      </div>

      <Sheet open={queueOpen} onOpenChange={setQueueOpen}>
        <SheetContent className="w-96 border-neutral-800 bg-neutral-950 text-white">
          <SheetHeader>
            <SheetTitle className="text-white">Queue</SheetTitle>
          </SheetHeader>
          <div className="mt-4 space-y-1 overflow-y-auto pokify-scroll pr-2">
            {player.queue.length === 0 && <p className="text-sm text-neutral-400">Queue is empty.</p>}
            {player.queue.map((t, i) => (
              <TrackRow key={`${t.id}-${i}`} track={t} index={i} queue={player.queue} />
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
