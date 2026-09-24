import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ likedIds: [] });

  const db = getDb();
  const rows = db
    .prepare("SELECT track_id FROM liked_songs WHERE user_id = ? ORDER BY created_at DESC")
    .all(user.id) as { track_id: string }[];

  return NextResponse.json({ likedIds: rows.map((r) => r.track_id) });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "You must be logged in." }, { status: 401 });

  const body = await request.json().catch(() => null);
  const trackId = body?.trackId;
  if (!trackId) return NextResponse.json({ error: "trackId is required." }, { status: 400 });

  const db = getDb();
  const existing = db
    .prepare("SELECT 1 FROM liked_songs WHERE user_id = ? AND track_id = ?")
    .get(user.id, trackId);

  if (existing) {
    db.prepare("DELETE FROM liked_songs WHERE user_id = ? AND track_id = ?").run(user.id, trackId);
    return NextResponse.json({ liked: false });
  }

  db.prepare("INSERT INTO liked_songs (user_id, track_id, created_at) VALUES (?, ?, ?)").run(
    user.id,
    trackId,
    new Date().toISOString()
  );
  return NextResponse.json({ liked: true });
}
