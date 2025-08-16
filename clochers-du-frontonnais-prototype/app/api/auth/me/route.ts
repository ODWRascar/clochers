// app/api/auth/me/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySession } from "../../../../lib/auth";

export async function GET() {
  const token = cookies().get("session")?.value;
  const session = verifySession(token);
  if (!session) return NextResponse.json({ ok: false }, { status: 401 });
  return NextResponse.json({ ok: true, role: session.role }, { status: 200 });
}
