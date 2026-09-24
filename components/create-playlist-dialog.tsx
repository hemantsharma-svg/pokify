"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/store";
import { Loader2 } from "lucide-react";

interface CreatePlaylistDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreatePlaylistDialog({ open, onOpenChange }: CreatePlaylistDialogProps) {
  const { createPlaylist } = useApp();
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const playlist = await createPlaylist(name.trim() || "My Playlist", description.trim());
    setLoading(false);
    setName("");
    setDescription("");
    onOpenChange(false);
    if (playlist) router.push(`/playlist/${playlist.id}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-neutral-900 text-white">
        <DialogHeader>
          <DialogTitle>Create playlist</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="playlist-name">Name</Label>
            <Input
              id="playlist-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Playlist #1"
              className="bg-neutral-800"
              autoFocus
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="playlist-desc">Description (optional)</Label>
            <Textarea
              id="playlist-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add an optional description"
              className="bg-neutral-800"
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full rounded-full bg-green-500 font-semibold text-black hover:bg-green-400">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
