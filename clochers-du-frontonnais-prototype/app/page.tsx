// app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { BookOpenText, CalendarDays, MapPin, MessageSquare, Eye, EyeOff } from 'lucide-react';

import Header from '../components/Header';
import SectionTitle from '../components/SectionTitle';
import EventCard from '../components/EventCard';
import LecturesDuJour from '../components/LecturesDuJour';

import { lecturesDuJour as lecturesMock } from '../data/lectures';
import { evenements } from '../data/events';
import { clochers } from '../data/clochers';

export default function HomePage() {
  // --- Lectures du jour (AELF)
  const [lecturesData, setLecturesData] = useState<any>(null);
  const [lecturesError, setLecturesError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // toggle affichage lectures
  const [showLectures, setShowLectures] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('showLectures') === '1';
  });

  useEffect(() => {
    localStorage.setItem('showLectures', showLectures ? '1' : '0');
  }, [showLectures]);

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

  // --- Recherche événements (mock côté home, la page /events lit l’ICS)
  const [search, setSearch] = useState('');
  const filtered = evenements.filter((e) =>
    e.titre.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-paper">
      <Header />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 py-10 md:py-16 grid md:grid-cols-2 gap-10">
          <div className="flex flex-col justify-center">
            <h2 className="text-3xl md:text-5xl font-extrabold leading-tight">
              Vivre la paroisse,<br/>à portée de main
            </h2>
            <p className="mt-4 text-base md:text-lg">
              Lectures du jour, horaires des messes, <em>mot du prêtre</em>, événements des clochers
              et carte interactive. Une app douce et lisible, pour tous les âges.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <a className="btn btn-outline rounded-2xl" href="/decouvrir-la-messe">Découvrir la messe</a>
              <a className="btn btn-primary rounded-2xl" href="/events">Voir les événements</a>
            </div>
          </div>

          <div className="md:pl-8">
            <div className="card overflow-hidden">
              <div className="h-20 w-full hero-grad rounded-t-3xl" />
              <div className="p-6" id="lectures">
                <div className="flex items-center justify-between">
                  <SectionTitle
                    icon={<BookOpenText className="h-5 w-5 text-primary" />}
                    title="Lectures du jour"
                    subtitle={lecturesData?.data?.messes?.[0]?.nom || 'Textes intégraux — AELF'}
                  />
                  <button
                    className="btn btn-outline rounded-xl flex items-center gap-2"
                    onClick={() => setShowLectures(v => !v)}
                    title={showLectures ? "Masquer les lectures" : "Afficher les lectures"}
                  >
                    {showLectures ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    {showLectures ? 'Masquer' : 'Afficher'}
                  </button>
                </div>

                {showLectures ? (
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
                ) : (
                  <p className="mt-4 text-sm opacity-80">
                    Les lectures du jour sont disponibles. Cliquez sur <strong>Afficher</strong> pour les lire.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ÉVÉNEMENTS (teaser — la page /events lit l’ICS) */}
      <section className="py-8 md:py-12" id="events">
        <div className="max-w-6xl mx-auto px-4">
          <SectionTitle
            icon={<CalendarDays className="h-5 w-5 text-primary" />}
            title="Événements à venir"
            subtitle="Extraits — voir tout l’agenda"
          />
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="col-span-1">
              <label className="text-sm mb-2 block">Rechercher</label>
              <input
                className="w-full rounded-2xl border px-4 py-2" style={{ borderColor: "#E5E2DC" }}
                placeholder="Ex: veillée, concert…"
                value={search}
                onChange={e=>setSearch(e.target.value)}
              />
            </div>
            <div className="col-span-2 flex items-end gap-2">
              <a className="btn btn-primary rounded-2xl" href="/events">Voir l’agenda complet</a>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.slice(0,4).map(evt => <EventCard key={evt.id} evt={evt} />)}
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
              <a className="btn btn-primary rounded-xl" href="#">Partager</a>
              <a className="btn btn-outline rounded-xl" href="#">Voir les archives</a>
            </div>
          </div>
        </div>
      </section>

      {/* CARTE placeholder */}
      <section className="py-8 md:py-12">
        <div className="max-w-6xl mx-auto px-4">
          <SectionTitle
            icon={<MapPin className="h-5 w-5 text-primary" />}
            title="Carte des églises"
            subtitle="Trouver rapidement votre clocher"
          />
          <div className="card mt-4 overflow-hidden">
            <div className="aspect-[16/9] w-full grid place-items-center" style={{ background: "linear-gradient(135deg, #FFE7B8, #F8F7F3)" }}>
              <div className="text-center">
                <div className="text-4xl mb-2">📍</div>
                <p className="text-sm">Carte interactive (OpenStreetMap) — à intégrer au stade suivant</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mt-8 border-t" style={{ borderColor: '#E8E5DF' }}>
        <div className="max-w-6xl mx-auto px-4 py-8 grid md:grid-cols-3 gap-6 text-sm">
          <div>
            <div className="flex items-center gap-3 mb-2"><span>🏰</span><strong>Clochers du Frontonnais</strong></div>
            <p>Application paroissiale — lectures du jour, événements, annonces, intentions de prière.</p>
          </div>
          <div>
            <p className="font-semibold mb-2">Raccourcis</p>
            <ul className="space-y-1">
              <li><a href="/decouvrir-la-messe" className="text-primary">Découvrir la messe</a></li>
              <li><a href="/events" className="text-primary">Agenda des messes</a></li>
              <li>Mot du prêtre</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold mb-2">Sessions</p>
            <ul className="space-y-1">
              <li><a href="/login" className="text-primary">Connexion</a></li>
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
