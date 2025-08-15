'use client';
import React, { useMemo } from "react";

type Verset = { texte?: string; ref?: string };
type Lecture = {
  titre?: string;     // "1ère lecture", "Psaume", etc. (parfois pas présent)
  ref?: string;       // "Ap 11, 19a; 12, 1-6a.10ab" ...
  texte?: string;     // HTML complet (quand présent)
  contenu?: string;   // parfois utilisé à la place de "texte"
  intro?: string | null;
  type?: string;      // "lecture_1" | "psaume" | "lecture_2" | "evangile" | ...
  refrain?: string;   // pour le psaume (souvent présent)
  versets?: Verset[]; // liste de versets (parfois présent)
};

type Messe = {
  nom?: string;       // "Messe du jour" / "Solennité ..." etc.
  lectures?: Lecture[];
};

function labelFromType(t?: string) {
  switch (t) {
    case "lecture_1": return "1ère lecture";
    case "psaume":    return "Psaume";
    case "lecture_2": return "2ème lecture";
    case "evangile":  return "Évangile";
    default:          return "Lecture";
  }
}

function toHTML(l: Lecture) {
  // 1) si le texte HTML complet est déjà fourni
  const html = l.texte || l.contenu;
  if (html && html.trim()) return html;

  // 2) sinon, reconstruire à partir des versets + refrain (cas très fréquent pour le psaume)
  const parts: string[] = [];

  if (l.type === "psaume" && l.refrain) {
    parts.push(`<p><em>R/ ${escapeHtml(l.refrain)}</em></p>`);
  }

  if (Array.isArray(l.versets) && l.versets.length) {
    for (const v of l.versets) {
      // certains jours, le verset est déjà HTML ; sinon on échappe
      if (v?.texte?.includes("<")) {
        parts.push(`<p>${v.texte}</p>`);
      } else if (v?.texte) {
        parts.push(`<p>${escapeHtml(v.texte)}</p>`);
      }
    }
  }

  // 3) fallback minimal : rien d’autre à afficher
  if (!parts.length) return "";

  return parts.join("\n");
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function dangerously(html?: string) {
  if (!html) return null;
  return (
    <div
      className="prose max-w-none prose-p:my-2 prose-blockquote:my-2"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export default function LecturesDuJour({ payload }: { payload: any }) {
  // L’API peut renvoyer plusieurs "messes" (vigiles, choix, etc.)
  const messe: Messe | undefined = useMemo(() => {
    const list: Messe[] =
      payload?.data?.messes ??
      (payload?.data?.messe ? [payload.data.messe] : []);
    if (!Array.isArray(list) || !list.length) return undefined;

    // priorité à la messe marquée "Messe du jour"
    const idx = list.findIndex(m => (m?.nom || "").toLowerCase().includes("messe du jour"));
    return list[idx >= 0 ? idx : 0];
  }, [payload]);

  const lectures: Lecture[] = useMemo(() => {
    const arr = messe?.lectures ?? [];
    const order = ["lecture_1", "psaume", "lecture_2", "evangile"];
    return [...arr].sort(
      (a, b) => order.indexOf(a.type || "") - order.indexOf(b.type || "")
    );
  }, [messe]);

  if (!messe || !lectures.length) {
    return <p className="text-sm opacity-70">Aucune lecture reçue pour aujourd’hui.</p>;
  }

  return (
    <div className="space-y-6">
      {messe?.nom && <h3 className="text-lg font-semibold">{messe.nom}</h3>}

      {lectures.map((l, i) => {
        const titre = l.titre?.trim() || labelFromType(l.type);
        const builtHtml = toHTML(l);

        return (
          <article key={i} className="rounded-2xl border p-4 bg-white" style={{ borderColor: "#ECE9E3" }}>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="pill">{titre}</span>
              {l.ref && <span className="text-sm opacity-80">{l.ref}</span>}
            </div>

            {l.intro && <p className="opacity-80 text-sm mb-2">{l.intro}</p>}
            {builtHtml
              ? dangerously(builtHtml)
              : <p className="opacity-70 text-sm">Texte non disponible.</p>}
          </article>
        );
      })}

      <p className="text-xs opacity-70">
        Textes © AELF — Association Épiscopale Liturgique pour les pays Francophones.
      </p>
    </div>
  );
}
