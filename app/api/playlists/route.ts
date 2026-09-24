import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

interface PlaylistRow {
  id: string;
  name: string;
  description: string;
  cover: string;
  created_at: string;
}

function serialize(db: ReturnType<typeof getDb>, row: PlaylistRow) {
  const trackRows = db
    .prepare("SELECT track_id FROM playlist_tracks WHERE playlist_id = ? ORDER BY position ASC")
    .all(row.id) as { track_id: string }[];
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    cover: row.cover,
    createdAt: row.created_at,
    trackIds: trackRows.map((t) => t.track_id),
  };
}

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ playlists: [] });

  const db = getDb();
  const rows = db
    .prepare("SELECT * FROM playlists WHERE user_id = ? ORDER BY created_at DESC")
    .all(user.id) as PlaylistRow[];

  return NextResponse.json({ playlists: rows.map((r) => serialize(db, r)) });
}

const COVERS = [
  "from-pink-500 to-orange-400",
  "from-purple-600 to-blue-400",
  "from-emerald-500 to-teal-300",
  "from-rose-500 to-fuchsia-500",
];

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "You must be logged in." }, { status: 401 });

  const body = await request.json().catch(() => null);
  const name = (body?.name ?? "My Playlist").trim() || "My Playlist";
  const description = (body?.description ?? "").trim();

  const db = getDb();
  const id = crypto.randomUUID();
  const cover = COVERS[Math.floor(Math.random() * COVERS.length)];
  const createdAt = new Date().toISOString();

  db.prepare(
    "INSERT INTO playlists (id, user_id, name, description, cover, created_at) VALUES (?, ?, ?, ?, ?, ?)"
  ).run(id, user.id, name, description, cover, createdAt);

  return NextResponse.json({ id, name, description, cover, createdAt, trackIds: [] }, { status: 201 });
}
