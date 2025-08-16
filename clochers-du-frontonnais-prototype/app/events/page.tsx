// app/events/page.tsx
'use client';
import Header from '../../components/Header';
import EventCard from '../../components/EventCard';
import { useEffect, useState } from 'react';

type Evt = {
  id: string;
  titre: string;
  date: string | null;
  fin?: string | null;
  lieu: string;
  description: string;
  clocher: string;
};

export default function EventsPage() {
  const [events, setEvents] = useState<Evt[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/events').then(async r => {
      setLoading(false);
      if (!r.ok) { setErr('Erreur de chargement des événements'); return; }
      const j = await r.json();
      setEvents(j.events || []);
    }).catch(() => { setLoading(false); setErr('Erreur réseau'); });
  }, []);

  return (
    <div className="min-h-screen bg-paper">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Tous les événements</h1>
        {loading && <p>Chargement…</p>}
        {err && <p className="text-red-600">{err}</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {events.map(evt => <EventCard key={evt.id} evt={evt as any} />)}
        </div>
      </main>
    </div>
  );
}
