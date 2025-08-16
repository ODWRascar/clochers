// lib/auth.ts
import crypto from "crypto";

const SECRET = process.env.APP_SECRET || "CHANGE_ME";

function base64url(input: Buffer | string) {
  return Buffer.from(input).toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

export function signSession(payload: Record<string, any>, maxAgeSec = 60 * 60 * 24 * 7) {
  const header = { alg: "HS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);
  const body = { iat: now, exp: now + maxAgeSec, ...payload };
  const unsigned = `${base64url(JSON.stringify(header))}.${base64url(JSON.stringify(body))}`;
  const sig = crypto.createHmac("sha256", SECRET).update(unsigned).digest("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
  return `${unsigned}.${sig}`;
}

export function verifySession(token?: string): null | any {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [h, b, s] = parts;
  const expected = crypto.createHmac("sha256", SECRET).update(`${h}.${b}`).digest("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
  if (expected !== s) return null;
  try {
    const body = JSON.parse(Buffer.from(b, "base64").toString("utf8"));
    if (body.exp && Date.now() / 1000 > body.exp) return null;
    return body;
  } catch {
    return null;
  }
}
