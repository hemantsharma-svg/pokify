"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, Plus, LogIn } from "lucide-react";
import { CoverArt } from "@/components/cover-art";
import { useApp } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { CreatePlaylistDialog } from "@/components/create-playlist-dialog";
import { AuthDialog } from "@/components/auth-dialog";
import { FEATURED_PLAYLISTS_SEED } from "@/lib/catalog";

export default function LibraryPage() {
  const { playlists, likedIds, user, authLoading } = useApp();
  const [createOpen, setCreateOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  return (
    <div className="space-y-6 pt-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Your Library</h1>
        {user ? (
          <Button onClick={() => setCreateOpen(true)} className="rounded-full bg-white font-semibold text-black hover:bg-neutral-200">
            <Plus className="mr-2 h-4 w-4" /> New playlist
          </Button>
        ) : (
          !authLoading && (
            <Button onClick={() => setAuthOpen(true)} className="rounded-full bg-white font-semibold text-black hover:bg-neutral-200">
              <LogIn className="mr-2 h-4 w-4" /> Log in
            </Button>
          )
        )}
      </div>

      {user && <p className="text-sm text-neutral-400">Signed in as {user.displayName} — your library is saved on the server.</p>}
      {!authLoading && !user && (
        <p className="text-sm text-neutral-400">Log in to create playlists and like songs. They&apos;ll follow you to any device.</p>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {user && (
          <Link href="/liked" className="rounded-md bg-neutral-900/60 p-4 transition hover:bg-neutral-800">
            <div className="mb-4 flex h-40 w-full items-center justify-center rounded-md bg-gradient-to-br from-indigo-600 to-purple-400">
              <Heart className="h-16 w-16 fill-white text-white" />
            </div>
            <p className="font-semibold text-white">Liked Songs</p>
            <p className="text-sm text-neutral-400">{likedIds.length} songs</p>
          </Link>
        )}

        {playlists.map((p) => (
          <Link key={p.id} href={`/playlist/${p.id}`} className="rounded-md bg-neutral-900/60 p-4 transition hover:bg-neutral-800">
            <CoverArt gradient={p.cover} size="lg" className="mb-4 w-full" />
            <p className="truncate font-semibold text-white">{p.name}</p>
            <p className="text-sm text-neutral-400">Playlist · {p.trackIds.length} songs</p>
          </Link>
        ))}

        {FEATURED_PLAYLISTS_SEED.map((p) => (
          <Link key={p.id} href={`/playlist/${p.id}`} className="rounded-md bg-neutral-900/60 p-4 transition hover:bg-neutral-800">
            <CoverArt gradient={p.cover} size="lg" className="mb-4 w-full" />
            <p className="truncate font-semibold text-white">{p.name}</p>
            <p className="text-sm text-neutral-400">Featured playlist · {p.trackIds.length} songs</p>
          </Link>
        ))}
      </div>

      <CreatePlaylistDialog open={createOpen} onOpenChange={setCreateOpen} />
      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} />
    </div>
  );
}
