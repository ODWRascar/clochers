'use client';
import Link from 'next/link';

export default function EventCard({ evt }: { evt: any }) {
  return (
    <div className="card p-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold">{evt.titre}</h3>
          <p className="text-sm opacity-80">{evt.date} — {evt.lieu}</p>
          <div className="mt-2 text-xs badge">{evt.clocher} • {evt.type}</div>
        </div>
        <div className="flex gap-2">
          <Link className="btn btn-outline rounded-xl" href={`/events/${evt.id}`}>Détails</Link>
        </div>
      </div>
    </div>
  );
}
