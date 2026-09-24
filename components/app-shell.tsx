"use client";

import { useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";
import { NowPlayingBar } from "@/components/now-playing-bar";
import { AuthDialog } from "@/components/auth-dialog";
import { CreatePlaylistDialog } from "@/components/create-playlist-dialog";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [authOpen, setAuthOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <div className="flex h-screen flex-col bg-black text-white">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar onCreatePlaylist={() => setCreateOpen(true)} />
        <div className="flex flex-1 flex-col overflow-hidden rounded-lg bg-gradient-to-b from-neutral-900 to-black">
          <Topbar onAuthClick={() => setAuthOpen(true)} />
          <main className="flex-1 overflow-y-auto px-6 pb-6 pokify-scroll">{children}</main>
        </div>
      </div>
      <NowPlayingBar />
      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} />
      <CreatePlaylistDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}
