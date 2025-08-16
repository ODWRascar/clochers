// app/api/events/route.ts
import { NextResponse } from "next/server";
import ical from "node-ical";

export async function GET() {
  const url = process.env.ICS_URL;
  if (!url) {
    return NextResponse.json({ ok:false, error:"ICS_URL manquante" }, { status: 500 });
  }

  try {
    const resp = await fetch(url, { next: { revalidate: 900 } });
    if (!resp.ok) return NextResponse.json({ ok:false, error:`HTTP ${resp.status}` }, { status: 502 });
    const text = await resp.text();
    const parsed = ical.sync.parseICS(text);

    const items = Object.values(parsed)
      .filter((v: any) => v?.type === "VEVENT")
      .map((e: any) => ({
        id: e.uid || e.summary + String(e.start),
        titre: e.summary || "Événement",
        date: e.start?.toISOString?.() || null,
        fin: e.end?.toISOString?.() || null,
        lieu: e.location || "",
        description: e.description || "",
        clocher: guessClocher(e.location || e.summary || "")
      }))
      .sort((a: any, b: any) => (a.date || "").localeCompare(b.date || ""));

    return NextResponse.json({ ok:true, events: items }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ ok:false, error:String(err) }, { status: 500 });
  }
}

function guessClocher(s: string) {
  // Heuristique simple : à affiner selon tes clochers
  const map = ["Fronton","Villemur","Vacquiers","Bouloc","Castelnau","Buzet","Villeneuve-lès-Bouloc","Magnanac","Gargas","Bondigoux"];
  const hit = map.find(n => s.toLowerCase().includes(n.toLowerCase()));
  return hit || "Ensemble paroissial";
}
