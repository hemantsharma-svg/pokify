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

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "You must be logged in." }, { status: 401 });
  if (!(await assertOwner(id, user.id))) return NextResponse.json({ error: "Not found." }, { status: 404 });

  const body = await request.json().catch(() => null);
  const db = getDb();
  const fields: string[] = [];
  const values: unknown[] = [];
  if (typeof body?.name === "string") {
    fields.push("name = ?");
    values.push(body.name.trim() || "My Playlist");
  }
  if (typeof body?.description === "string") {
    fields.push("description = ?");
    values.push(body.description.trim());
  }
  if (fields.length > 0) {
    values.push(id);
    db.prepare(`UPDATE playlists SET ${fields.join(", ")} WHERE id = ?`).run(...values);
  }
  return NextResponse.json({ success: true });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "You must be logged in." }, { status: 401 });
  if (!(await assertOwner(id, user.id))) return NextResponse.json({ error: "Not found." }, { status: 404 });

  const db = getDb();
  db.prepare("DELETE FROM playlist_tracks WHERE playlist_id = ?").run(id);
  db.prepare("DELETE FROM playlists WHERE id = ?").run(id);
  return NextResponse.json({ success: true });
}
