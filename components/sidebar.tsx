"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Library, Plus, Heart, Music } from "lucide-react";
import { cn } from "@/lib/utils";
import { useApp } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { CoverArt } from "@/components/cover-art";
import { FEATURED_PLAYLISTS_SEED } from "@/lib/catalog";

export function Sidebar({ onCreatePlaylist }: { onCreatePlaylist: () => void }) {
  const pathname = usePathname();
  const { playlists, user, authLoading } = useApp();

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/search", label: "Search", icon: Search },
    { href: "/library", label: "Your Library", icon: Library },
  ];

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col gap-2 bg-black p-2 text-sm">
      <div className="rounded-lg bg-neutral-900 p-4">
        <Link href="/" className="mb-4 flex items-center gap-2 px-1 text-xl font-bold text-white">
          <Music className="h-6 w-6 text-green-500" />
          Pokify
        </Link>
        <nav className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-4 rounded-md px-2 py-2 font-semibold text-neutral-400 transition hover:text-white",
                pathname === item.href && "text-white"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="flex min-h-0 flex-1 flex-col rounded-lg bg-neutral-900 p-2">
        <div className="flex items-center justify-between px-2 py-2">
          <span className="flex items-center gap-2 font-semibold text-neutral-400">
            <Library className="h-5 w-5" /> Your Library
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-neutral-400 hover:text-white"
            onClick={onCreatePlaylist}
            disabled={!user}
            title={user ? "Create playlist" : "Log in to create playlists"}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {user && (
          <Link href="/liked" className="flex items-center gap-3 rounded-md px-2 py-2 hover:bg-white/10">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-gradient-to-br from-indigo-600 to-purple-400">
              <Heart className="h-5 w-5 fill-white text-white" />
            </div>
            <div>
              <p className="font-medium text-white">Liked Songs</p>
              <p className="text-xs text-neutral-400">Playlist</p>
            </div>
          </Link>
        )}

        <div className="mt-1 min-h-0 flex-1 space-y-1 overflow-y-auto pokify-scroll pr-1">
          <p className="px-2 pb-1 pt-2 text-xs font-semibold uppercase tracking-wide text-neutral-500">Featured</p>
          {FEATURED_PLAYLISTS_SEED.map((p) => (
            <Link key={p.id} href={`/playlist/${p.id}`} className="flex items-center gap-3 rounded-md px-2 py-2 hover:bg-white/10">
              <CoverArt gradient={p.cover} size="sm" />
              <div className="min-w-0">
                <p className="truncate font-medium text-white">{p.name}</p>
                <p className="truncate text-xs text-neutral-400">Playlist · {p.trackIds.length} songs</p>
              </div>
            </Link>
          ))}

          {!authLoading && user && playlists.length > 0 && (
            <>
              <p className="px-2 pb-1 pt-3 text-xs font-semibold uppercase tracking-wide text-neutral-500">Your playlists</p>
              {playlists.map((p) => (
                <Link key={p.id} href={`/playlist/${p.id}`} className="flex items-center gap-3 rounded-md px-2 py-2 hover:bg-white/10">
                  <CoverArt gradient={p.cover} size="sm" />
                  <div className="min-w-0">
                    <p className="truncate font-medium text-white">{p.name}</p>
                    <p className="truncate text-xs text-neutral-400">Playlist · {p.trackIds.length} songs</p>
                  </div>
                </Link>
              ))}
            </>
          )}

          {!authLoading && !user && (
            <p className="px-2 pt-3 text-xs text-neutral-500">Log in to create your own playlists and like songs.</p>
          )}
        </div>
      </div>
    </aside>
  );
}
