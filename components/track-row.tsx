"use client";

import { Track } from "@/types";
import { CoverArt } from "@/components/cover-art";
import { usePlayer } from "@/lib/player-context";
import { useApp } from "@/lib/store";
import { formatDuration } from "@/lib/catalog";
import { Play, Pause, Heart, Plus, ListPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

interface TrackRowProps {
  track: Track;
  index: number;
  queue: Track[];
  showAlbum?: boolean;
  onRemove?: () => void;
}

export function TrackRow({ track, index, queue, showAlbum = true, onRemove }: TrackRowProps) {
  const { currentTrack, isPlaying, playTrack, togglePlay, addToQueue } = usePlayer();
  const { isLiked, toggleLike, playlists, addTrackToPlaylist, user } = useApp();
  const active = currentTrack?.id === track.id;
  const liked = isLiked(track.id);

  const handlePlay = () => {
    if (active) {
      togglePlay();
    } else {
      playTrack(track, queue);
    }
  };

  return (
    <div className="group grid grid-cols-[2rem_1fr_auto] items-center gap-4 rounded-md px-3 py-2 hover:bg-white/10">
      <button onClick={handlePlay} className="flex h-8 w-8 items-center justify-center text-muted-foreground">
        <span className="group-hover:hidden">
          {active && isPlaying ? (
            <Pause className="h-4 w-4 text-green-500" />
          ) : (
            <span className={active ? "text-green-500" : ""}>{index + 1}</span>
          )}
        </span>
        <span className="hidden group-hover:flex">
          {active && isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </span>
      </button>

      <div className="flex min-w-0 items-center gap-3">
        <CoverArt gradient={track.cover} size="sm" />
        <div className="min-w-0">
          <p className={`truncate text-sm font-medium ${active ? "text-green-500" : "text-white"}`}>{track.title}</p>
          <div className="truncate text-xs text-muted-foreground">
            <Link href={`/artist/${track.artistId}`} className="hover:underline">
              {track.artistName}
            </Link>
            {showAlbum && (
              <>
                {" · "}
                <Link href={`/album/${track.albumId}`} className="hover:underline">
                  {track.albumName}
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => user && toggleLike(track.id)}
          disabled={!user}
          className="opacity-0 transition group-hover:opacity-100 disabled:cursor-not-allowed"
          aria-label="Like"
          title={user ? undefined : "Log in to like songs"}
        >
          <Heart className={`h-4 w-4 ${liked ? "fill-green-500 text-green-500 opacity-100" : "text-muted-foreground"}`} />
        </button>
        <span className="w-10 text-right text-xs text-muted-foreground">{formatDuration(track.duration)}</span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100">
              <Plus className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => addToQueue(track)}>
              <ListPlus className="mr-2 h-4 w-4" /> Add to queue
            </DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger disabled={!user}>Add to playlist</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                {!user && <DropdownMenuItem disabled>Log in to add to playlists</DropdownMenuItem>}
                {user && playlists.length === 0 && <DropdownMenuItem disabled>No playlists yet</DropdownMenuItem>}
                {user &&
                  playlists.map((p) => (
                    <DropdownMenuItem key={p.id} onClick={() => addTrackToPlaylist(p.id, track.id)}>
                      {p.name}
                    </DropdownMenuItem>
                  ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            {onRemove && (
              <DropdownMenuItem onClick={onRemove} className="text-red-400">
                Remove from playlist
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
