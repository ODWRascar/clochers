'use client';
import React from "react";

type Lecture = {
  titre?: string;             // ex: "Première lecture"
  ref?: string;               // ex: "Ap 11, 19a; 12, 1-6a.10ab"
  texte?: string;             // HTML (paragraphes, versets)
  intro?: string | null;      // parfois présent (antiennes/introductions)
  type?: string;              // "lecture_1", "psaume", "lecture_2", "evangile"
};

type Messe = {
  nom?: string;               // "Messe du jour", "Solennité..."
  lectures?: Lecture[];
};

function html(content?: string) {
  if (!content) return null;
  return <div className="prose max-w-none prose-p:my-2" dangerouslySetInnerHTML={{ __html: content }} />;
}

export default function LecturesDuJour({ payload }: { payload: any }) {
  // L’API AELF renvoie souvent un tableau de messes ; on prend la “messe du jour” par défaut
  const messe: Messe | undefined = payload?.data?.messes?.[0] ?? payload?.data?.messe ?? undefined;
  const lectures: Lecture[] = messe?.lectures ?? [];

  const ordre = ["lecture_1", "psaume", "lecture_2", "evangile"];
  const tri = (a: Lecture, b: Lecture) => ordre.indexOf(a.type || "") - ordre.indexOf(b.type || "");

  return (
    <div className="space-y-6">
      {messe?.nom && <h3 className="text-lg font-semibold">{messe.nom}</h3>}

      {lectures.sort(tri).map((l, i) => (
        <article key={i} className="rounded-2xl border p-4 bg-white" style={{ borderColor: "#ECE9E3" }}>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="pill">{l.titre || labelFromType(l.type)}</span>
            {l.ref && <span className="text-sm opacity-80">{l.ref}</span>}
          </div>

          {l.intro && <p className="opacity-80 text-sm mb-2">{l.intro}</p>}
          {html(l.texte)}
        </article>
      ))}

      <p className="text-xs opacity-70">
        Textes © AELF — Association Épiscopale Liturgique pour les pays Francophones (utilisés avec leur API).
      </p>
    </div>
  );
}

function labelFromType(t?: string) {
  switch (t) {
    case "lecture_1": return "1ère lecture";
    case "psaume": return "Psaume";
    case "lecture_2": return "2ème lecture";
    case "evangile": return "Évangile";
    default: return "Lecture";
  }
}
