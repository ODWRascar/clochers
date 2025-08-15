'use client';
import Header from '../../components/Header';
import EventCard from '../../components/EventCard';
import { evenements } from '../../data/events';

export default function EventsPage() {
  return (
    <div className="min-h-screen bg-paper">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Tous les événements</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {evenements.map(evt => <EventCard key={evt.id} evt={evt} />)}
        </div>
      </main>
    </div>
  );
}
