import { NextResponse } from "next/server";

/** GET /api/lectures?date=YYYY-MM-DD&zone=romain */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date") || new Date().toISOString().slice(0, 10);
  const zone = searchParams.get("zone") || "romain";
  const url = `https://api.aelf.org/v1/messes/${date}/${zone}`;

  try {
    const res = await fetch(url, {
      headers: { accept: "application/json" },
      next: { revalidate: 3600 }, // cache CDN 1h
    });
    if (!res.ok) {
      return NextResponse.json({ ok: false, error: `AELF ${res.status}`, date, zone }, { status: 502 });
    }
    const data = await res.json();
    return NextResponse.json({ ok: true, date, zone, data }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: String(err), date, zone }, { status: 500 });
  }
}
