import { Track, Album, Artist } from "@/types";

// Royalty-free demo audio tracks (public domain / creative-commons test streams)
// used as real playable audio so the player is genuinely functional.
const AUDIO = [
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3",
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3",
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3",
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3",
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3",
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3",
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3",
];

const COVERS = [
  "from-pink-500 to-orange-400",
  "from-purple-600 to-blue-400",
  "from-emerald-500 to-teal-300",
  "from-rose-500 to-fuchsia-500",
  "from-amber-400 to-red-500",
  "from-sky-500 to-indigo-500",
  "from-lime-400 to-emerald-600",
  "from-violet-600 to-pink-400",
  "from-cyan-400 to-blue-600",
  "from-orange-500 to-yellow-400",
  "from-fuchsia-500 to-purple-700",
  "from-teal-400 to-cyan-600",
  "from-red-500 to-pink-600",
  "from-blue-500 to-cyan-400",
  "from-yellow-400 to-orange-600",
  "from-indigo-500 to-purple-400",
];

function cover(i: number) {
  return COVERS[i % COVERS.length];
}
function audio(i: number) {
  return AUDIO[i % AUDIO.length];
}

interface ArtistSeed {
  id: string;
  name: string;
  genre: string;
  bio: string;
}

const ARTIST_SEEDS: ArtistSeed[] = [
  { id: "a1", name: "Nova Ember", genre: "Synthwave", bio: "Nova Ember blends retro synths with modern production, crafting nightscapes of sound since 2018." },
  { id: "a2", name: "Cascade Bloom", genre: "Indie Pop", bio: "A four-piece indie outfit known for shimmering guitars and anthemic choruses." },
  { id: "a3", name: "Midnight Runner", genre: "Electronic", bio: "Producer and DJ pushing the boundaries of dancefloor electronica." },
  { id: "a4", name: "Velvet Static", genre: "Alt Rock", bio: "Raw guitars and honest lyrics — Velvet Static writes for the late-night drivers." },
  { id: "a5", name: "Solar Drift", genre: "Chillwave", bio: "Ambient textures and warm basslines for slow mornings and long drives." },
  { id: "a6", name: "Iron Petal", genre: "Hip-Hop", bio: "Sharp bars over cinematic beats — Iron Petal tells stories from the block to the stars." },
  { id: "a7", name: "Glass Horizon", genre: "Synthwave", bio: "Cinematic synth duo scoring imaginary 80s films." },
  { id: "a8", name: "Paper Wolves", genre: "Indie Pop", bio: "Bedroom-pop project turned festival favorite, known for confessional lyrics." },
  { id: "a9", name: "Echo Basin", genre: "Electronic", bio: "Textural electronic soundscapes built from field recordings and modular synths." },
  { id: "a10", name: "Rusted Halo", genre: "Alt Rock", bio: "Three-piece rock band with a sound rooted in 90s grunge revival." },
  { id: "a11", name: "Amber Tide", genre: "Chillwave", bio: "Slow-motion grooves for sunset drives and quiet apartments." },
  { id: "a12", name: "Lowlight Kids", genre: "Hip-Hop", bio: "Duo known for introspective verses and jazz-inflected production." },
  { id: "a13", name: "Static Bloom", genre: "Pop", bio: "Chart-friendly hooks with a DIY edge." },
  { id: "a14", name: "Fever Atlas", genre: "Pop", bio: "High-energy pop project chasing arena-sized choruses." },
  { id: "a15", name: "Quiet Arcade", genre: "Lo-Fi", bio: "Lo-fi beats built for studying, sleeping, and staring out windows." },
  { id: "a16", name: "Marigold Static", genre: "Lo-Fi", bio: "Warm tape-saturated instrumentals with a nostalgic edge." },
  { id: "a17", name: "Crimson Fields", genre: "Country", bio: "Modern country storytelling with classic instrumentation." },
  { id: "a18", name: "Dust & Wire", genre: "Country", bio: "Americana roots duo blending folk and country traditions." },
  { id: "a19", name: "Neon Choir", genre: "Electronic", bio: "Vocal-driven electronic act blurring the line between pop and club music." },
  { id: "a20", name: "Hollow Moon", genre: "Alt Rock", bio: "Atmospheric rock built around reverb-heavy guitars and falsetto vocals." },
];

export const ARTISTS: Artist[] = ARTIST_SEEDS.map((a, i) => ({
  id: a.id,
  name: a.name,
  genre: a.genre,
  bio: a.bio,
  cover: cover(i),
}));

const ADJECTIVES = [
  "Electric", "Chrome", "Paper", "Golden", "Velvet", "Neon", "Silent", "Bruised",
  "Midnight", "Amber", "Static", "Hollow", "Faded", "Crimson", "Slow", "Restless",
  "Wandering", "Broken", "Distant", "Quiet", "Endless", "Fractured", "Glowing", "Wild",
];

const NOUNS = [
  "Horizon", "Bloomfield", "Nightfall", "Skyline", "Lantern", "Static", "Runner",
  "Pulse", "Bones", "Tide", "Petal", "Mirage", "Echo", "Halo", "Arcade", "Wire",
  "Kite", "Anthem", "Drive", "Fields", "Choir", "Moon", "Shore", "Ember",
];

function trackTitle(seed: number) {
  const adj = ADJECTIVES[seed % ADJECTIVES.length];
  const noun = NOUNS[(seed * 7 + 3) % NOUNS.length];
  return `${adj} ${noun}`;
}

const ALBUM_NAME_POOL = [
  "Neon Horizon", "Paper Skies", "After Hours Static", "Bruised Light", "Slow Tide",
  "Concrete Bloom", "Glass Season", "Wolf Hour", "Basin Sessions", "Rusted Gold",
  "Tidewater", "Basin Kids", "Static Bloom", "Fever Dreams", "Arcade Nights",
  "Marigold Tapes", "Crimson Roads", "Dust Roads", "Neon Chorus", "Hollow Ground",
  "Second Light", "Afterglow", "Low Orbit", "Better Days",
];

let albumCounter = 0;
let trackCounter = 0;

export const ALBUMS: Album[] = [];
export const TRACKS: Track[] = [];

ARTIST_SEEDS.forEach((artist, artistIdx) => {
  const albumsForArtist = 1 + (artistIdx % 2); // 1 or 2 albums per artist
  for (let n = 0; n < albumsForArtist; n++) {
    const albumId = `al${albumCounter + 1}`;
    const albumName = ALBUM_NAME_POOL[albumCounter % ALBUM_NAME_POOL.length];
    const year = 2019 + ((albumCounter * 3 + artistIdx) % 7);
    const trackCount = 3 + ((albumCounter + artistIdx) % 4); // 3-6 tracks
    const trackIds: string[] = [];

    for (let t = 0; t < trackCount; t++) {
      const trackId = `t${trackCounter + 1}`;
      trackIds.push(trackId);
      TRACKS.push({
        id: trackId,
        title: trackTitle(trackCounter + albumCounter * 5),
        artistId: artist.id,
        artistName: artist.name,
        albumId,
        albumName,
        duration: 150 + ((trackCounter * 17 + albumCounter * 11) % 150),
        src: audio(trackCounter),
        cover: cover(albumCounter),
        genre: artist.genre,
      });
      trackCounter++;
    }

    ALBUMS.push({
      id: albumId,
      name: albumName,
      artistId: artist.id,
      artistName: artist.name,
      cover: cover(albumCounter),
      year,
      trackIds,
    });
    albumCounter++;
  }
});

export const GENRES = Array.from(new Set(ARTIST_SEEDS.map((a) => a.genre)));

export function getTrack(id: string) { return TRACKS.find((t) => t.id === id); }
export function getAlbum(id: string) { return ALBUMS.find((a) => a.id === id); }
export function getArtist(id: string) { return ARTISTS.find((a) => a.id === id); }
export function getArtistAlbums(artistId: string) { return ALBUMS.filter((a) => a.artistId === artistId); }
export function getArtistTracks(artistId: string) { return TRACKS.filter((t) => t.artistId === artistId); }
export function getAlbumTracks(albumId: string) { return TRACKS.filter((t) => t.albumId === albumId); }
export function getGenreTracks(genre: string) { return TRACKS.filter((t) => t.genre === genre); }

export function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function tracksForIndexes(indexes: number[]) {
  return indexes.filter((i) => i < TRACKS.length).map((i) => TRACKS[i].id);
}

export const FEATURED_PLAYLISTS_SEED = [
  { id: "p-seed-1", name: "Synth Nights", description: "Retro synths for late drives", cover: cover(6), trackIds: tracksForIndexes([0, 1, 2, 3, 4, 5]) },
  { id: "p-seed-2", name: "Indie Mornings", description: "Bright indie pop to start the day", cover: cover(7), trackIds: tracksForIndexes([6, 7, 8, 9, 10]) },
  { id: "p-seed-3", name: "Chill Static", description: "Ambient and chillwave textures", cover: cover(8), trackIds: tracksForIndexes([11, 12, 13, 14]) },
  { id: "p-seed-4", name: "Bars & Beats", description: "Hip-hop cuts with cinematic beats", cover: cover(9), trackIds: tracksForIndexes([15, 16, 17, 18]) },
  { id: "p-seed-5", name: "Pop Rotation", description: "Today's biggest hooks", cover: cover(10), trackIds: TRACKS.filter((t) => t.genre === "Pop").slice(0, 6).map((t) => t.id) },
  { id: "p-seed-6", name: "Lo-Fi Focus", description: "Beats to study and relax to", cover: cover(11), trackIds: TRACKS.filter((t) => t.genre === "Lo-Fi").slice(0, 6).map((t) => t.id) },
  { id: "p-seed-7", name: "Country Roads", description: "Modern country and Americana", cover: cover(12), trackIds: TRACKS.filter((t) => t.genre === "Country").slice(0, 6).map((t) => t.id) },
  { id: "p-seed-8", name: "Rock Rotation", description: "Alt rock essentials", cover: cover(13), trackIds: TRACKS.filter((t) => t.genre === "Alt Rock").slice(0, 6).map((t) => t.id) },
];
