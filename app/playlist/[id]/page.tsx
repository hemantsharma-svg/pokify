"use client";

import { use, useMemo, useState } from "react";
import { notFound, useRouter } from "next/navigation";
import { Play, Pencil, Trash2 } from "lucide-react";
import { getTrack, formatDuration, FEATURED_PLAYLISTS_SEED } from "@/lib/catalog";
import { CoverArt } from "@/components/cover-art";
import { TrackRow } from "@/components/track-row";
import { usePlayer } from "@/lib/player-context";
import { useApp } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function PlaylistPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { playlists, removeTrackFromPlaylist, renamePlaylist, deletePlaylist, authLoading } = useApp();
  const { playTrack } = usePlayer();
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const systemPlaylist = FEATURED_PLAYLISTS_SEED.find((p) => p.id === id);
  const userPlaylist = playlists.find((p) => p.id === id);
  const playlist = systemPlaylist ?? userPlaylist;
  const isSystem = Boolean(systemPlaylist);

  const tracks = useMemo(
    () => (playlist ? (playlist.trackIds.map((tid) => getTrack(tid)).filter(Boolean) as NonNullable<ReturnType<typeof getTrack>>[]) : []),
    [playlist]
  );

  if (!playlist) {
    if (authLoading) return <div className="pt-6 text-neutral-400">Loading...</div>;
    return notFound();
  }

  const totalSeconds = tracks.reduce((sum, t) => sum + t.duration, 0);

  const openEdit = () => {
    setName(playlist.name);
    setDescription(playlist.description);
    setEditOpen(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    renamePlaylist(playlist.id, name.trim() || playlist.name, description);
    setEditOpen(false);
  };

  const handleDelete = async () => {
    await deletePlaylist(playlist.id);
    router.push("/library");
  };

  return (
    <div className="space-y-6">
      <div className="-mx-6 flex items-end gap-6 bg-gradient-to-b from-neutral-700 to-transparent p-6 pb-8">
        <CoverArt gradient={playlist.cover} size="xl" />
        <div>
          <p className="text-sm font-semibold text-white">{isSystem ? "Featured Playlist" : "Playlist"}</p>
          <h1 className="text-5xl font-black text-white drop-shadow">{playlist.name}</h1>
          {playlist.description && <p className="mt-2 text-sm text-white/80">{playlist.description}</p>}
          <p className="mt-2 text-sm text-white/70">
            {tracks.length} songs{tracks.length > 0 ? `, ${formatDuration(totalSeconds)}` : ""}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={() => tracks.length > 0 && playTrack(tracks[0], tracks)}
          disabled={tracks.length === 0}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-black shadow-xl transition hover:scale-105 disabled:opacity-40"
          aria-label="Play playlist"
        >
          <Play className="h-6 w-6 pl-1" />
        </button>
        {!isSystem && (
          <>
            <Button variant="ghost" size="icon" onClick={openEdit} className="text-neutral-300 hover:text-white">
              <Pencil className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleDelete} className="text-neutral-300 hover:text-red-400">
              <Trash2 className="h-5 w-5" />
            </Button>
          </>
        )}
      </div>

      {tracks.length === 0 ? (
        <p className="text-neutral-400">This playlist is empty. Add songs from search or any album page.</p>
      ) : (
        <div className="space-y-1">
          {tracks.map((t, i) => (
            <TrackRow
              key={t.id}
              track={t}
              index={i}
              queue={tracks}
              onRemove={isSystem ? undefined : () => removeTrackFromPlaylist(playlist.id, t.id)}
            />
          ))}
        </div>
      )}

      {!isSystem && (
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent className="bg-neutral-900 text-white">
            <DialogHeader>
              <DialogTitle>Edit details</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Name</Label>
                <Input id="edit-name" value={name} onChange={(e) => setName(e.target.value)} className="bg-neutral-800" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-desc">Description</Label>
                <Textarea id="edit-desc" value={description} onChange={(e) => setDescription(e.target.value)} className="bg-neutral-800" />
              </div>
              <Button type="submit" className="w-full rounded-full bg-green-500 font-semibold text-black hover:bg-green-400">
                Save
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
