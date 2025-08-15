'use client';

import { useEffect, useState } from 'react';
import { BookOpenText, CalendarDays, MapPin, MessageSquare } from 'lucide-react';

import Header from '../components/Header';
import SectionTitle from '../components/SectionTitle';
import EventCard from '../components/EventCard';
import LecturesDuJour from '../components/LecturesDuJour';

import { lecturesDuJour as lecturesMock } from '../data/lectures';
import { evenements } from '../data/events';
import { clochers } from '../data/clochers';

type AdminContent = {
  text?: string;
  image?: string; // URL publique optionnelle
};

export default function HomePage() {
  // --- Contenu admin (via /api/content)
  const [adminContent, setAdminContent] = useState<AdminContent | null>(null);

  useEffect(() => {
    fetch('/api/content')
      .then((r) => r.json())
      .then((j) => setAdminContent(j || null))
      .catch(() => setAdminContent(null));
  }, []);

  // --- Lectures du jour (AELF)
  const [lecturesData, setLecturesData] = useState<any>(null);
  const [lecturesError, setLecturesError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const d = new Date();
    const date = d.toISOString().slice(0, 10); // YYYY-MM-DD
    fetch(`/api/lectures?date=${date}&zone=romain`)
      .then((r) => r.json())
      .then((json) => {
        setLecturesData(json);
        setLoading(false);
      })
      .catch((e) => {
        setLecturesError(String(e));
        setLoading(false);
      });
  }, []);

  // --- Recherche événements
  const [search, setSearch] = useState('');
  const filtered = evenements.filter((e) =>
    e.titre.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-paper">
      <Header />

      {/* HERO + Lectures */}
      <section className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 py-10 md:py-16 grid md:grid-cols-2 gap-10">
          <div className="flex flex-col justify-center">
            <h2 className="text-3xl md:text-5xl font-extrabold leading-tight">
              Vivre la paroisse,<br />à portée de main
            </h2>

            {/* Texte piloté par l’admin si présent, sinon fallback par défaut */}
            <p className="mt-4 text-base md:text-lg">
              {adminContent?.text ? (
                <span dangerouslySetInnerHTML={{ __html: sanitize(adminContent.text) }} />
              ) : (
                <>
                  Lectures du jour, horaires des messes, <em>mot du prêtre</em>, événements des clochers
                  et carte interactive. Une app douce et lisible, pour tous les âges.
                </>
              )}
            </p>

            {/* Image admin optionnelle */}
            {adminContent?.image ? (
              <div className="mt-4">
                <img
                  src={adminContent.image}
                  alt="Accueil"
                  className="rounded-2xl w-full max-w-md object-cover"
                />
              </div>
            ) : null}

            <div className="mt-6 flex items-center gap-3">
              <a className="btn btn-primary rounded-2xl" href="#lectures">
                Activer les lectures du jour
              </a>
              <a className="btn btn-outline rounded-2xl" href="#events">
                Voir les événements
              </a>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <span className="pill">Choisir mon clocher</span>
              <span className="pill">Notifications (à venir)</span>
              <span className="pill">Mode hors-ligne (à venir)</span>
            </div>
          </div>

          <div className="md:pl-8">
            <div className="card overflow-hidden">
              <div className="h-20 w-full hero-grad rounded-t-3xl" />
              <div className="p-6" id="lectures">
                <SectionTitle
                  icon={<BookOpenText className="h-5 w-5 text-primary" />}
                  title="Lectures du jour"
                  subtitle={lecturesData?.data?.messes?.[0]?.nom || 'Textes intégraux — AELF'}
                />

                <div className="mt-4">
                  {loading && <p>Chargement…</p>}
                  {lecturesError && (
                    <>
                      <p className="text-red-600">
                        Erreur de chargement des lectures (AELF). Affichage du contenu de secours.
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {lecturesMock.lectures.map((l, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-3 p-3 rounded-xl border"
                            style={{ borderColor: '#ECE9E3', background: 'white' }}
                          >
                            <span className="pill">{l.type}</span>
                            <span className="text-sm">{l.ref}</span>
                          </div>
                        ))}
                      </div>
                      <blockquote className="quote mt-4">
                        « {lecturesMock.extraitEvangile} »
                      </blockquote>
                    </>
                  )}
                  {!loading && !lecturesError && lecturesData && (
                    <LecturesDuJour payload={lecturesData} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ÉVÉNEMENTS */}
      <section className="py-8 md:py-12" id="events">
        <div className="max-w-6xl mx-auto px-4">
          <SectionTitle
            icon={<CalendarDays className="h-5 w-5 text-primary" />}
            title="Événements à venir"
            subtitle="Par clocher et par date"
          />

        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="col-span-1">
              <label className="text-sm mb-2 block">Choisir un clocher</label>
              <div className="relative">
                <select
                  className="w-full appearance-none rounded-2xl border px-4 py-2 pr-10"
                  style={{ borderColor: '#E5E2DC' }}
                >
                  <option value="">Tous les clochers</option>
                  {clochers.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
                <span className="absolute right-3 top-2.5 opacity-70">⛪</span>
              </div>
            </div>

            <div className="col-span-1">
              <label className="text-sm mb-2 block">Rechercher</label>
              <input
                className="w-full rounded-2xl border px-4 py-2"
                style={{ borderColor: '#E5E2DC' }}
                placeholder="Ex: veillée, concert…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="col-span-1 flex items-end gap-2">
              <a className="btn btn-primary rounded-2xl" href="#">
                Filtrer
              </a>
              <a
                className="btn btn-outline rounded-2xl"
                href="#"
                onClick={() => setSearch('')}
              >
                Réinitialiser
              </a>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((evt) => (
              <EventCard key={evt.id} evt={evt} />
            ))}
          </div>
        </div>
      </section>

      {/* MOT DU PRÊTRE */}
      <section className="py-8 md:py-12" id="mot">
        <div className="max-w-6xl mx-auto px-4">
          <SectionTitle
            icon={<MessageSquare className="h-5 w-5 text-primary" />}
            title="Mot du prêtre"
            subtitle="Méditation courte du jour"
          />
          <div className="card mt-4 p-6">
            <article className="prose max-w-none">
              <h3>« Magnificat » : regarder Dieu à l'œuvre</h3>
              <p>
                Frères et sœurs, aujourd'hui l'Église chante la joie de Marie. Que nos cœurs s'ouvrent
                à l'action de Dieu dans nos familles et nos villages. Faisons place à sa paix.
              </p>
              <p className="opacity-80 text-sm">— Père N.</p>
            </article>
            <div className="mt-4 flex flex-wrap gap-3">
              <a className="btn btn-primary rounded-xl" href="#">
                Partager
              </a>
              <a className="btn btn-outline rounded-xl" href="#">
                Voir les archives
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CARTE (placeholder) */}
      <section className="py-8 md:py-12">
        <div className="max-w-6xl mx-auto px-4">
          <SectionTitle
            icon={<MapPin className="h-5 w-5 text-primary" />}
            title="Carte des églises"
            subtitle="Trouver rapidement votre clocher"
          />
          <div className="card mt-4 overflow-hidden">
            <div
              className="aspect-[16/9] w-full grid place-items-center"
              style={{ background: 'linear-gradient(135deg, #FFE7B8, #F8F7F3)' }}
            >
              <div className="text-center">
                <div className="text-4xl mb-2">📍</div>
                <p className="text-sm">
                  Carte interactive (OpenStreetMap) — à intégrer au stade suivant
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 p-4">
              {clochers.slice(0, 8).map((c, i) => (
                <span key={i} className="badge">
                  {c}
                </span>
              ))}
              <a className="ml-auto text-primary" href="#">
                Tout voir ›
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mt-8 border-t" style={{ borderColor: '#E8E5DF' }}>
        <div className="max-w-6xl mx-auto px-4 py-8 grid md:grid-cols-3 gap-6 text-sm">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span>🏰</span>
              <strong>Clochers du Frontonnais</strong>
            </div>
            <p>
              Application paroissiale — lectures du jour, événements, annonces, intentions de prière.
            </p>
          </div>
          <div>
            <p className="font-semibold mb-2">Raccourcis</p>
            <ul className="space-y-1">
              <li>Lectures du jour</li>
              <li>Agenda des messes</li>
              <li>Mot du prêtre</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold mb-2">Contacts</p>
            <ul className="space-y-1">
              <li>Site diocésain</li>
              <li>Presbytère de Fronton</li>
            </ul>
          </div>
        </div>
        <div className="text-center text-xs pb-6">
          © {new Date().getFullYear()} Ensemble paroissial Fronton – Villemur — RGPD : La Paroisse (responsable de traitement)
        </div>
      </footer>
    </div>
  );
}

/** Petite sanitation (évite des balises dangereuses si tu colles du HTML dans l’admin) */
function sanitize(html: string) {
  return html.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '');
}
