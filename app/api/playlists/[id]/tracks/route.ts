import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

async function assertOwner(playlistId: string, userId: string) {
  const db = getDb();
  const row = db.prepare("SELECT user_id FROM playlists WHERE id = ?").get(playlistId) as
    | { user_id: string }
    | undefined;
  return row?.user_id === userId;
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "You must be logged in." }, { status: 401 });
  if (!(await assertOwner(id, user.id))) return NextResponse.json({ error: "Not found." }, { status: 404 });

  const body = await request.json().catch(() => null);
  const trackId = body?.trackId;
  if (!trackId) return NextResponse.json({ error: "trackId is required." }, { status: 400 });

  const db = getDb();
  const countRow = db.prepare("SELECT COUNT(*) as c FROM playlist_tracks WHERE playlist_id = ?").get(id) as {
    c: number;
  };
  db.prepare(
    "INSERT OR IGNORE INTO playlist_tracks (playlist_id, track_id, position) VALUES (?, ?, ?)"
  ).run(id, trackId, countRow.c);

  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "You must be logged in." }, { status: 401 });
  if (!(await assertOwner(id, user.id))) return NextResponse.json({ error: "Not found." }, { status: 404 });

  const { searchParams } = new URL(request.url);
  const trackId = searchParams.get("trackId");
  if (!trackId) return NextResponse.json({ error: "trackId is required." }, { status: 400 });

  const db = getDb();
  db.prepare("DELETE FROM playlist_tracks WHERE playlist_id = ? AND track_id = ?").run(id, trackId);
  return NextResponse.json({ success: true });
}
