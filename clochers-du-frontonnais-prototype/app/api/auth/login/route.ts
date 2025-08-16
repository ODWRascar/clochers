// app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import { signSession } from "../../../../lib/auth";

const roleEnv: Record<string, string | undefined> = {
  admin: process.env.ADMIN_PASSWORD,
  pretre: process.env.PRETRE_PASSWORD,
  benevole: process.env.BENEVOLE_PASSWORD
};

export async function POST(req: Request) {
  const { role, password } = await req.json();
  const expected = roleEnv[String(role)];
  if (!expected || String(password) !== String(expected)) {
    return NextResponse.json({ ok: false, error: "invalid_credentials" }, { status: 401 });
  }
  const token = signSession({ role });
  const res = NextResponse.json({ ok: true, role });
  res.cookies.set("session", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });
  return res;
}
