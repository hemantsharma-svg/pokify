"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search as SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { TRACKS, ARTISTS, ALBUMS, GENRES } from "@/lib/catalog";
import { TrackRow } from "@/components/track-row";
import { CoverArt } from "@/components/cover-art";
import Link from "next/link";

function SearchInner() {
  const params = useSearchParams();
  const router = useRouter();
  const [query, setQuery] = useState(params.get("q") ?? "");

  const q = query.trim().toLowerCase();

  const tracks = useMemo(
    () => (q ? TRACKS.filter((t) => t.title.toLowerCase().includes(q) || t.artistName.toLowerCase().includes(q)) : []),
    [q]
  );
  const artists = useMemo(() => (q ? ARTISTS.filter((a) => a.name.toLowerCase().includes(q)) : []), [q]);
  const albums = useMemo(() => (q ? ALBUMS.filter((a) => a.name.toLowerCase().includes(q)) : []), [q]);

  return (
    <div className="space-y-8 pt-6">
      <div className="relative max-w-lg">
        <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
        <Input
          autoFocus
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            router.replace(`/search?q=${encodeURIComponent(e.target.value)}`);
          }}
          placeholder="What do you want to listen to?"
          className="rounded-full border-none bg-neutral-800 pl-9 text-white placeholder:text-neutral-400"
        />
      </div>

      {!q && (
        <div>
          <h2 className="mb-4 text-xl font-bold text-white">Browse all genres</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {GENRES.map((g, i) => (
              <div
                key={g}
                className={`flex h-24 items-end rounded-md bg-gradient-to-br p-4 font-bold text-white ${
                  ["from-pink-600 to-rose-400", "from-indigo-600 to-blue-400", "from-emerald-600 to-teal-400", "from-orange-600 to-amber-400"][i % 4]
                }`}
              >
                {g}
              </div>
            ))}
          </div>
        </div>
      )}

      {q && (
        <>
          {artists.length > 0 && (
            <section>
              <h2 className="mb-4 text-xl font-bold text-white">Artists</h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                {artists.map((a) => (
                  <Link key={a.id} href={`/artist/${a.id}`} className="rounded-md bg-neutral-900/60 p-4 text-center hover:bg-neutral-800">
                    <CoverArt gradient={a.cover} size="lg" rounded="full" className="mx-auto mb-4" />
                    <p className="truncate font-semibold text-white">{a.name}</p>
                    <p className="text-sm text-neutral-400">Artist</p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {albums.length > 0 && (
            <section>
              <h2 className="mb-4 text-xl font-bold text-white">Albums</h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                {albums.map((a) => (
                  <Link key={a.id} href={`/album/${a.id}`} className="rounded-md bg-neutral-900/60 p-4 hover:bg-neutral-800">
                    <CoverArt gradient={a.cover} size="lg" className="mb-4 w-full" />
                    <p className="truncate font-semibold text-white">{a.name}</p>
                    <p className="truncate text-sm text-neutral-400">{a.artistName}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          <section>
            <h2 className="mb-4 text-xl font-bold text-white">Songs</h2>
            {tracks.length === 0 ? (
              <p className="text-neutral-400">No results found for &quot;{query}&quot;.</p>
            ) : (
              <div className="space-y-1">
                {tracks.map((t, i) => (
                  <TrackRow key={t.id} track={t} index={i} queue={tracks} />
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="pt-6 text-neutral-400">Loading...</div>}>
      <SearchInner />
    </Suspense>
  );
}
