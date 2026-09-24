"use client";

import { createContext, useContext, useEffect, useRef, useState, useCallback, ReactNode } from "react";
import { Track, RepeatMode } from "@/types";
import { useApp } from "@/lib/store";

interface PlayerState {
  queue: Track[];
  currentIndex: number;
  currentTrack: Track | null;
  isPlaying: boolean;
  progress: number;
  duration: number;
  volume: number;
  shuffle: boolean;
  repeat: RepeatMode;
  playTrack: (track: Track, queue?: Track[]) => void;
  togglePlay: () => void;
  next: () => void;
  prev: () => void;
  seek: (time: number) => void;
  setVolume: (v: number) => void;
  toggleShuffle: () => void;
  cycleRepeat: () => void;
  addToQueue: (track: Track) => void;
}

const PlayerContext = createContext<PlayerState | null>(null);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [queue, setQueue] = useState<Track[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.8);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState<RepeatMode>("off");
  const { pushRecent } = useApp();

  const currentTrack = currentIndex >= 0 && currentIndex < queue.length ? queue[currentIndex] : null;

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    const audio = audioRef.current;
    audio.volume = volume;

    const onTime = () => setProgress(audio.currentTime);
    const onLoaded = () => setDuration(audio.duration || 0);
    const onEnded = () => handleEnded();

    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("ended", onEnded);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("ended", onEnded);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queue, currentIndex, repeat, shuffle]);

  useEffect(() => {
    if (!audioRef.current || !currentTrack) return;
    const audio = audioRef.current;
    if (audio.src !== currentTrack.src) {
      audio.src = currentTrack.src;
      audio.load();
    }
    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false));
      pushRecent(currentTrack.id);
    } else {
      audio.pause();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrack, isPlaying]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  const handleEnded = useCallback(() => {
    if (repeat === "one") {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
      return;
    }
    setCurrentIndex((idx) => {
      const q = queue;
      if (q.length === 0) return idx;
      if (shuffle) {
        return Math.floor(Math.random() * q.length);
      }
      if (idx + 1 < q.length) return idx + 1;
      if (repeat === "all") return 0;
      setIsPlaying(false);
      return idx;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [repeat, shuffle, queue]);

  const playTrack = useCallback((track: Track, newQueue?: Track[]) => {
    const q = newQueue && newQueue.length > 0 ? newQueue : [track];
    const idx = q.findIndex((t) => t.id === track.id);
    setQueue(q);
    setCurrentIndex(idx >= 0 ? idx : 0);
    setIsPlaying(true);
    setProgress(0);
  }, []);

  const togglePlay = useCallback(() => {
    if (!currentTrack) return;
    setIsPlaying((p) => !p);
  }, [currentTrack]);

  const next = useCallback(() => {
    if (queue.length === 0) return;
    if (shuffle) {
      setCurrentIndex(Math.floor(Math.random() * queue.length));
    } else {
      setCurrentIndex((idx) => (idx + 1 < queue.length ? idx + 1 : repeat === "all" ? 0 : idx));
    }
    setIsPlaying(true);
  }, [queue, shuffle, repeat]);

  const prev = useCallback(() => {
    if (!audioRef.current) return;
    if (audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
      return;
    }
    setCurrentIndex((idx) => (idx - 1 >= 0 ? idx - 1 : 0));
    setIsPlaying(true);
  }, []);

  const seek = useCallback((time: number) => {
    if (audioRef.current) audioRef.current.currentTime = time;
    setProgress(time);
  }, []);

  const setVolume = useCallback((v: number) => setVolumeState(v), []);

  const toggleShuffle = useCallback(() => setShuffle((s) => !s), []);

  const cycleRepeat = useCallback(() => {
    setRepeat((r) => (r === "off" ? "all" : r === "all" ? "one" : "off"));
  }, []);

  const addToQueue = useCallback((track: Track) => {
    setQueue((prev) => [...prev, track]);
  }, []);

  return (
    <PlayerContext.Provider
      value={{
        queue,
        currentIndex,
        currentTrack,
        isPlaying,
        progress,
        duration,
        volume,
        shuffle,
        repeat,
        playTrack,
        togglePlay,
        next,
        prev,
        seek,
        setVolume,
        toggleShuffle,
        cycleRepeat,
        addToQueue,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be used within PlayerProvider");
  return ctx;
}
