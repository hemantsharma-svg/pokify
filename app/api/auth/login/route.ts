import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getDb } from "@/lib/db";
import { verifyPassword, createSession, SESSION_COOKIE } from "@/lib/auth";

interface UserRow {
  id: string;
  username: string;
  display_name: string;
  password_hash: string;
  created_at: string;
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const username = (body?.username ?? "").trim().toLowerCase();
  const password = body?.password ?? "";

  if (!username || !password) {
    return NextResponse.json({ error: "Username and password are required." }, { status: 400 });
  }

  const db = getDb();
  const user = db.prepare("SELECT * FROM users WHERE username = ?").get(username) as UserRow | undefined;
  if (!user) {
    return NextResponse.json({ error: "Invalid username or password." }, { status: 401 });
  }

  const valid = await verifyPassword(password, user.password_hash);
  if (!valid) {
    return NextResponse.json({ error: "Invalid username or password." }, { status: 401 });
  }

  const token = createSession(user.id);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 30 });

  return NextResponse.json({ id: user.id, username: user.username, displayName: user.display_name, createdAt: user.created_at });
}
