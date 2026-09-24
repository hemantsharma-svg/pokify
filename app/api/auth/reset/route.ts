import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { hashPassword } from "@/lib/auth";

const RESET_TTL_MS = 15 * 60 * 1000; // 15 minutes

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const token = (body?.token ?? "").trim().toUpperCase();
  const password = body?.password ?? "";

  if (!token || !password) {
    return NextResponse.json({ error: "Reset code and new password are required." }, { status: 400 });
  }
  if (password.length < 6) {
    return NextResponse.json({ error: "Password must be at least 6 characters." }, { status: 400 });
  }

  const db = getDb();
  const row = db
    .prepare("SELECT token, user_id, created_at, used FROM password_resets WHERE token = ?")
    .get(token) as { token: string; user_id: string; created_at: string; used: number } | undefined;

  if (!row || row.used) {
    return NextResponse.json({ error: "That reset code is invalid or already used." }, { status: 400 });
  }
  if (Date.now() - new Date(row.created_at).getTime() > RESET_TTL_MS) {
    return NextResponse.json({ error: "That reset code has expired. Request a new one." }, { status: 400 });
  }

  const passwordHash = await hashPassword(password);
  db.prepare("UPDATE users SET password_hash = ? WHERE id = ?").run(passwordHash, row.user_id);
  db.prepare("UPDATE password_resets SET used = 1 WHERE token = ?").run(token);
  db.prepare("DELETE FROM sessions WHERE user_id = ?").run(row.user_id);

  return NextResponse.json({ success: true });
}
