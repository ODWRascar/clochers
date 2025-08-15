'use client';

import { useEffect, useMemo, useState } from 'react';
import { BookOpenText, CalendarDays, MapPin, MessageSquare, Pencil, Save, X, Shield } from 'lucide-react';

import Header from '../components/Header';
import SectionTitle from '../components/SectionTitle';
import EventCard from '../components/EventCard';
import LecturesDuJour from '../components/LecturesDuJour';

import { lecturesDuJour as lecturesMock } from '../data/lectures';
import { evenements } from '../data/events';
import { clochers } from '../data/clochers';

// --- Types
type HomeData = {
  heroTitle?: string;
  heroText?: string;
  images?: string[];
};

// --- Sanitize ultra-simple (évite script tags)
function sanitize(html: string) {
  return html.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '');
}

export default function HomePage() {
  // --- Contenu d'accueil (KV)
  const [home, setHome] = useState<HomeData | null>(null);
  const [loadingHome, setLoadingHome] = useState(true);

  useEffect(() => {
    fetch('/api/home')
      .then(r => r.json())
      .then(j => setHome(j.data || null))
      .finally(() => setLoadingHome(false));
  }, []);

  // --- Lectures du jour (AELF)
  const [lecturesData, setLecturesData] = useState<any>(null);
  const [lecturesError, setLecturesError] = useState<string | null>(null);
  const [loadingLectures, setLoadingLectures] = useState(true);

  useEffect(() => {
    const d = new Date();
    const date = d.toISOString().slice(0, 10);
    fetch(`/api/lectures?date=${date}&zone=romain`)
      .then((r) => r.json())
      .then((json) => {
        setLecturesData(json);
        setLoadingLectures(false);
      })
      .catch((e) => {
        setLecturesError(String(e));
        setLoadingLectures(false);
      });
  }, []);

  // --- Recherche événements
  const [search, setSearch] = useState('');
  const filtered = useMemo(
    () => evenements.filter((e) => e.titre.toLowerCase().includes(search.toLowerCase())),
    [search]
  );

  // ---------------------------
  // MODE ADMIN (édition en place)
  // ---------------------------
  const [adminOpen, setAdminOpen] = useState(false);     // panneau admin visible ?
  const [adminEnabled, setAdminEnabled] = useState(false); // édition activée ?
  const [token, setToken] = useState<string>(() => (typeof window !== 'undefined' ? localStorage.getItem('adminToken') || '' : ''));
  const [draft, setDraft] = useState<HomeData>({ images: [] });
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);

  useEffect(() => {
    if (home) {
      setDraft({
        heroTitle: home.heroTitle || '',
        heroText: home.heroText || '',
        images: Array.isArray(home.images) ? [...home.images] : []
      });
    }
  }, [home]);

  function addImage() {
    setDraft(d => ({ ...d, images: [...(d.images || []), '' ] }));
  }
  function updateImage(i: number, url: string) {
    const arr = [...(draft.images || [])];
    arr[i] = url;
    setDraft({ ...draft, images: arr });
  }
  function removeImage(i: number) {
    const arr = [...(draft.images || [])];
    arr.splice(i, 1);
    setDraft({ ...draft, images: arr });
  }

  async function saveDraft() {
    setSaving(true);
    setSaveMsg(null);
    try {
      const res = await fetch('/api/admin/home', {
        method: 'PUT',
        headers: {
          'content-type': 'application/json',
          'authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          heroTitle: draft.heroTitle || '',
          heroText: draft.heroText || '',
          images: (draft.images || []).filter(Boolean)
        })
      });
      if (!res.ok) {
        setSaveMsg("Échec : mot de passe invalide (ADMIN_SECRET) ou erreur serveur.");
      } else {
        setSaveMsg('Contenu enregistré ✅');
        // persiste le token si ok
        localStorage.setItem('adminToken', token);
        // maj de l’affichage
        setHome({ ...draft, images: (draft.images || []).filter(Boolean) });
        setAdminEnabled(false);
      }
    } catch {
      setSaveMsg("Erreur réseau pendant l'enregistrement.");
    } finally {
      setSaving(false);
    }
  }

  function cancelEdit() {
    // revenir aux données actuelles
    setDraft({
      heroTitle: home?.heroTitle || '',
      heroText: home?.heroText || '',
      images: Array.isArray(home?.images) ? [...(home?.images || [])] : []
    });
    setAdminEnabled(false);
    setSaveMsg(null);
  }

  // ---------------------------

  return (
    <div className="min-h-screen bg-paper relative">
      <Header />

      {/* ---- Panneau Admin (toggle + token + actions) ---- */}
      <AdminBar
        open={adminOpen}
        setOpen={setAdminOpen}
        adminEnabled={adminEnabled}
        setAdminEnabled={setAdminEnabled}
        token={token}
        setToken={setToken}
        onSave={saveDraft}
        onCancel={cancelEdit}
        saving={saving}
        saveMsg={saveMsg}
      />

      {/* HERO + Lectures */}
      <section className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 py-10 md:py-16 grid md:grid-cols-2 gap-10">
          <div className="flex flex-col justify-center">
            {/* Titre (éditable si admin) */}
            {!adminEnabled ? (
              <h2 className="text-3xl md:text-5xl font-extrabold leading-tight">
                {home?.heroTitle && home.heroTitle.trim().length
                  ? home.heroTitle
                  : <>Vivre la paroisse,<br/>à portée de main</>}
              </h2>
            ) : (
              <div className="space-y-2">
                <label className="text-sm opacity-70">Titre (heroTitle)</label>
                <input
                  className="w-full rounded-2xl border px-4 py-2"
                  style={{ borderColor: '#E5E2DC' }}
                  value={draft.heroTitle || ''}
                  onChange={(e) => setDraft({ ...draft, heroTitle: e.target.value })}
                />
              </div>
            )}

            {/* Texte (éditable si admin) */}
            {!adminEnabled ? (
              <p className="mt-4 text-base md:text-lg">
                {home?.heroText && home.heroText.trim().length ? (
                  <span dangerouslySetInnerHTML={{ __html: sanitize(home.heroText) }} />
                ) : (
                  <>
                    Lectures du jour, horaires des messes, <em>mot du prêtre</em>, événements des clochers
                    et carte interactive. Une app douce et lisible, pour tous les âges.
                  </>
                )}
              </p>
            ) : (
              <div className="mt-4">
                <label className="text-sm opacity-70">Texte (heroText)</label>
                <textarea
                  className="w-full rounded-2xl border px-4 py-2 min-h-[120px]"
                  style={{ borderColor: '#E5E2DC' }}
                  value={draft.heroText || ''}
                  onChange={(e) => setDraft({ ...draft, heroText: e.target.value })}
                />
              </div>
            )}

            {/* Galerie images (édition inline) */}
            {!adminEnabled ? (
              home?.images?.length ? (
                <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {home.images.map((src: string, i: number) => (
                    <img key={i} src={src} alt={`Accueil ${i+1}`} className="rounded-2xl object-cover w-full h-28 md:h-36" />
                  ))}
                </div>
              ) : null
            ) : (
              <div className="mt-6">
                <div className="flex items-center justify-between">
                  <label className="text-sm opacity-70">Images (URLs publiques)</label>
                  <button type="button" onClick={addImage} className="btn btn-outline rounded-2xl">+ Ajouter</button>
                </div>
                <div className="space-y-2 mt-2">
                  {(draft.images || []).map((u, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input
                        className="flex-1 border rounded-2xl px-3 py-2"
                        placeholder="https://…"
                        value={u}
                        onChange={(e) => updateImage(i, e.target.value)}
                      />
                      <button type="button" className="btn btn-outline rounded-2xl" onClick={() => removeImage(i)}>Supprimer</button>
                    </div>
                  ))}
                </div>
                <p className="text-xs opacity-70 mt-2">
                  Astuce : héberge tes images sur un service public (Cloudinary, Imgur, etc.) et colle l’URL ici.
                </p>
              </div>
            )}

            <div className="mt-6 flex items-center gap-3">
              <a className="btn btn-primary rounded-2xl" href="#lectures">
                Voir les lectures du jour
              </a>
              <a className="btn btn-outline rounded-2xl" href="#events">
                Voir les événements
              </a>
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
                  {loadingLectures && <p>Chargement…</p>}
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
                  {!loadingLectures && !lecturesError && lecturesData && (
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

// --------- Petit composant de barre admin ----------
function AdminBar(props: {
  open: boolean;
  setOpen: (v: boolean) => void;
  adminEnabled: boolean;
  setAdminEnabled: (v: boolean) => void;
  token: string;
  setToken: (v: string) => void;
  onSave: () => void;
  onCancel: () => void;
  saving: boolean;
  saveMsg: string | null;
}) {
  const { open, setOpen, adminEnabled, setAdminEnabled, token, setToken, onSave, onCancel, saving, saveMsg } = props;

  return (
    <div className="fixed right-4 bottom-4 z-50">
      {!open ? (
        <button
          className="btn btn-primary rounded-full shadow-xl flex items-center gap-2"
          onClick={() => setOpen(true)}
          title="Admin"
        >
          <Shield className="h-4 w-4" /> Admin
        </button>
      ) : (
        <div className="rounded-2xl border bg-white/90 backdrop-blur p-4 w-[320px] shadow-2xl" style={{ borderColor: '#E5E2DC' }}>
          <div className="flex items-center justify-between mb-2">
            <div className="font-semibold flex items-center gap-2"><Shield className="h-4 w-4" /> Mode admin</div>
            <button className="opacity-60 hover:opacity-100" onClick={() => setOpen(false)} title="Fermer"><X className="h-4 w-4" /></button>
          </div>

          <label className="text-xs opacity-70">Mot de passe (ADMIN_SECRET)</label>
          <input
            type="password"
            className="w-full border rounded-xl px-3 py-2 mb-2"
            style={{ borderColor: '#E5E2DC' }}
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />

          <div className="flex items-center gap-2 mb-2">
            {!adminEnabled ? (
              <button className="btn btn-outline rounded-xl flex-1 flex items-center justify-center gap-2" onClick={() => setAdminEnabled(true)}>
                <Pencil className="h-4 w-4" /> Activer l’édition
              </button>
            ) : (
              <>
                <button
                  className="btn btn-primary rounded-xl flex-1 flex items-center justify-center gap-2 disabled:opacity-50"
                  onClick={onSave}
                  disabled={saving}
                >
                  <Save className="h-4 w-4" /> {saving ? 'Enregistrement…' : 'Enregistrer'}
                </button>
                <button className="btn btn-outline rounded-xl" onClick={onCancel}><X className="h-4 w-4" /></button>
              </>
            )}
          </div>

          {saveMsg && <p className="text-xs mt-1">{saveMsg}</p>}
          <p className="text-[10px] opacity-60 mt-1">Astuce : ton mot de passe est stocké localement pour éviter de le retaper.</p>
        </div>
      )}
    </div>
  );
}
