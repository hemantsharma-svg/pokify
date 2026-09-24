import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

// Demo-mode password reset: this project has no email/SMTP backend, so instead
// of emailing a link we generate a real, server-persisted, single-use reset
// token and return it directly. In a production deployment this token would
// be emailed to the user instead of shown in the response.
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const username = (body?.username ?? "").trim().toLowerCase();

  if (!username) {
    return NextResponse.json({ error: "Enter your username." }, { status: 400 });
  }

  const db = getDb();
  const user = db.prepare("SELECT id FROM users WHERE username = ?").get(username) as { id: string } | undefined;

  if (!user) {
    return NextResponse.json({ error: "No account found with that username." }, { status: 404 });
  }

  const token = crypto.randomUUID().slice(0, 8).toUpperCase();
  db.prepare("INSERT INTO password_resets (token, user_id, created_at, used) VALUES (?, ?, ?, 0)").run(
    token,
    user.id,
    new Date().toISOString()
  );

  return NextResponse.json({ token });
}
