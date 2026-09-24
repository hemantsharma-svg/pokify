"use client";

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import { Playlist, User } from "@/types";

interface AuthResult {
  success: boolean;
  error?: string;
}

interface AppState {
  user: User | null;
  authLoading: boolean;
  playlists: Playlist[];
  likedIds: string[];
  recentIds: string[];
  signup: (username: string, password: string, displayName?: string) => Promise<AuthResult>;
  login: (username: string, password: string) => Promise<AuthResult>;
  logout: () => Promise<void>;
  createPlaylist: (name: string, description?: string) => Promise<Playlist | null>;
  deletePlaylist: (id: string) => Promise<void>;
  renamePlaylist: (id: string, name: string, description?: string) => Promise<void>;
  addTrackToPlaylist: (playlistId: string, trackId: string) => Promise<void>;
  removeTrackFromPlaylist: (playlistId: string, trackId: string) => Promise<void>;
  toggleLike: (trackId: string) => Promise<void>;
  isLiked: (trackId: string) => boolean;
  pushRecent: (trackId: string) => void;
}

const AppContext = createContext<AppState | null>(null);

const RECENT_KEY = "pokify-recent-v1";

async function jsonOrError(res: Response) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || "Something went wrong.");
  return data;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [likedIds, setLikedIds] = useState<string[]>([]);
  const [recentIds, setRecentIds] = useState<string[]>([]);

  const refetchLibrary = useCallback(async () => {
    const [playlistsRes, likesRes] = await Promise.all([fetch("/api/playlists"), fetch("/api/likes")]);
    const playlistsData = await playlistsRes.json();
    const likesData = await likesRes.json();
    setPlaylists(playlistsData.playlists ?? []);
    setLikedIds(likesData.likedIds ?? []);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data.user) {
          setUser(data.user);
          await refetchLibrary();
        }
      } finally {
        setAuthLoading(false);
      }
    })();

    try {
      const raw = window.localStorage.getItem(RECENT_KEY);
      if (raw) setRecentIds(JSON.parse(raw));
    } catch {
      // ignore corrupt local cache
    }
  }, [refetchLibrary]);

  useEffect(() => {
    window.localStorage.setItem(RECENT_KEY, JSON.stringify(recentIds));
  }, [recentIds]);

  const signup = useCallback(
    async (username: string, password: string, displayName?: string): Promise<AuthResult> => {
      try {
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password, displayName }),
        });
        const data = await jsonOrError(res);
        setUser(data);
        setPlaylists([]);
        setLikedIds([]);
        return { success: true };
      } catch (e) {
        return { success: false, error: (e as Error).message };
      }
    },
    []
  );

  const login = useCallback(async (username: string, password: string): Promise<AuthResult> => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await jsonOrError(res);
      setUser(data);
      await refetchLibrary();
      return { success: true };
    } catch (e) {
      return { success: false, error: (e as Error).message };
    }
  }, [refetchLibrary]);

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setPlaylists([]);
    setLikedIds([]);
  }, []);

  const createPlaylist = useCallback(async (name: string, description = ""): Promise<Playlist | null> => {
    const res = await fetch("/api/playlists", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description }),
    });
    if (!res.ok) return null;
    const created = await res.json();
    setPlaylists((prev) => [created, ...prev]);
    return created;
  }, []);

  const deletePlaylist = useCallback(async (id: string) => {
    setPlaylists((prev) => prev.filter((p) => p.id !== id));
    await fetch(`/api/playlists/${id}`, { method: "DELETE" });
  }, []);

  const renamePlaylist = useCallback(async (id: string, name: string, description?: string) => {
    setPlaylists((prev) => prev.map((p) => (p.id === id ? { ...p, name, description: description ?? p.description } : p)));
    await fetch(`/api/playlists/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description }),
    });
  }, []);

  const addTrackToPlaylist = useCallback(async (playlistId: string, trackId: string) => {
    setPlaylists((prev) =>
      prev.map((p) => (p.id === playlistId && !p.trackIds.includes(trackId) ? { ...p, trackIds: [...p.trackIds, trackId] } : p))
    );
    await fetch(`/api/playlists/${playlistId}/tracks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ trackId }),
    });
  }, []);

  const removeTrackFromPlaylist = useCallback(async (playlistId: string, trackId: string) => {
    setPlaylists((prev) =>
      prev.map((p) => (p.id === playlistId ? { ...p, trackIds: p.trackIds.filter((t) => t !== trackId) } : p))
    );
    await fetch(`/api/playlists/${playlistId}/tracks?trackId=${encodeURIComponent(trackId)}`, { method: "DELETE" });
  }, []);

  const toggleLike = useCallback(
    async (trackId: string) => {
      if (!user) return;
      const wasLiked = likedIds.includes(trackId);
      setLikedIds((prev) => (wasLiked ? prev.filter((id) => id !== trackId) : [trackId, ...prev]));
      await fetch("/api/likes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trackId }),
      });
    },
    [user, likedIds]
  );

  const isLiked = useCallback((trackId: string) => likedIds.includes(trackId), [likedIds]);

  const pushRecent = useCallback((trackId: string) => {
    setRecentIds((prev) => [trackId, ...prev.filter((id) => id !== trackId)].slice(0, 20));
  }, []);

  return (
    <AppContext.Provider
      value={{
        user,
        authLoading,
        playlists,
        likedIds,
        recentIds,
        signup,
        login,
        logout,
        createPlaylist,
        deletePlaylist,
        renamePlaylist,
        addTrackToPlaylist,
        removeTrackFromPlaylist,
        toggleLike,
        isLiked,
        pushRecent,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
