import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getDb } from "@/lib/db";
import { hashPassword, createSession, SESSION_COOKIE } from "@/lib/auth";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const username = (body?.username ?? "").trim();
  const password = body?.password ?? "";
  const displayName = (body?.displayName ?? username).trim();

  if (!username || username.length < 3) {
    return NextResponse.json({ error: "Username must be at least 3 characters." }, { status: 400 });
  }
  if (!password || password.length < 6) {
    return NextResponse.json({ error: "Password must be at least 6 characters." }, { status: 400 });
  }

  const db = getDb();
  const existing = db.prepare("SELECT id FROM users WHERE username = ?").get(username.toLowerCase());
  if (existing) {
    return NextResponse.json({ error: "That username is already taken." }, { status: 409 });
  }

  const id = crypto.randomUUID();
  const passwordHash = await hashPassword(password);
  const createdAt = new Date().toISOString();

  db.prepare(
    "INSERT INTO users (id, username, display_name, password_hash, created_at) VALUES (?, ?, ?, ?, ?)"
  ).run(id, username.toLowerCase(), displayName || username, passwordHash, createdAt);

  const token = createSession(id);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 30 });

  return NextResponse.json({ id, username: username.toLowerCase(), displayName: displayName || username, createdAt });
}
