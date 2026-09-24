"use client";

import Link from "next/link";
import { Play } from "lucide-react";
import { CoverArt } from "@/components/cover-art";
import { usePlayer } from "@/lib/player-context";
import { Track } from "@/types";

interface PlaylistCardProps {
  href: string;
  cover: string;
  title: string;
  subtitle: string;
  tracks: Track[];
}

export function PlaylistCard({ href, cover, title, subtitle, tracks }: PlaylistCardProps) {
  const { playTrack } = usePlayer();

  return (
    <Link
      href={href}
      className="group relative rounded-md bg-neutral-900/60 p-4 transition hover:bg-neutral-800"
    >
      <CoverArt gradient={cover} size="lg" className="mb-4 w-full" />
      <p className="truncate font-semibold text-white">{title}</p>
      <p className="mt-1 line-clamp-2 text-sm text-neutral-400">{subtitle}</p>
      {tracks.length > 0 && (
        <button
          onClick={(e) => {
            e.preventDefault();
            playTrack(tracks[0], tracks);
          }}
          className="absolute bottom-20 right-6 flex h-12 w-12 translate-y-2 items-center justify-center rounded-full bg-green-500 text-black opacity-0 shadow-xl transition group-hover:translate-y-0 group-hover:opacity-100"
          aria-label={`Play ${title}`}
        >
          <Play className="h-5 w-5 pl-0.5" />
        </button>
      )}
    </Link>
  );
}
