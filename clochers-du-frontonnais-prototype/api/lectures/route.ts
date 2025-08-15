// app/api/lectures/route.ts
import { NextResponse } from "next/server";

/**
 * Proxy AELF → évite CORS et permet un peu de mise en cache côté Vercel.
 * Appel : /api/lectures?date=YYYY-MM-DD&zone=romain
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date") || new Date().toISOString().slice(0, 10);
  const zone = searchParams.get("zone") || "romain";

  // Endpoints AELF courants :
  // - Informations du jour : /v1/informations/{date}/{zone}
  // - Messes (lectures complètes) : /v1/messes/{date}/{zone}
  // NB : on consomme "messes" pour récupérer les textes intégralement.
  const url = `https://api.aelf.org/v1/messes/${date}/${zone}`;

  try {
    const res = await fetch(url, {
      headers: { "accept": "application/json" },
      // Cache 1h côté Vercel/CDN (suffisant pour un “texte du jour”)
      next: { revalidate: 3600 }
    });

    if (!res.ok) {
      return NextResponse.json({ error: `AELF error ${res.status}` }, { status: 502 });
    }

    const data = await res.json();
    return NextResponse.json({ date, zone, data }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "fetch_failed" }, { status: 500 });
  }
}
