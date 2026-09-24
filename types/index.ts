export interface Track {
  id: string;
  title: string;
  artistId: string;
  artistName: string;
  albumId: string;
  albumName: string;
  duration: number; // seconds
  src: string; // audio url
  cover: string; // gradient class key
  genre: string;
}

export interface Album {
  id: string;
  name: string;
  artistId: string;
  artistName: string;
  cover: string;
  year: number;
  trackIds: string[];
}

export interface Artist {
  id: string;
  name: string;
  cover: string;
  bio: string;
  genre: string;
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  cover: string;
  trackIds: string[];
  createdAt: string;
  isSystem?: boolean;
}

export interface User {
  id: string;
  username: string;
  displayName: string;
  createdAt: string;
}

export type RepeatMode = "off" | "all" | "one";
