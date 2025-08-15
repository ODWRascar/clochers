'use client';
import { useParams } from 'next/navigation';
import Header from '@/components/Header';
import { evenements } from '@/data/events';

export default function EventDetailPage() {
  const params = useParams();
  const evt = evenements.find(e => String(e.id) === String(params?.id));
  if (!evt) {
    return <div className="min-h-screen"><Header /><main className="max-w-4xl mx-auto px-4 py-8">Événement introuvable.</main></div>;
  }
  return (
    <div className="min-h-screen bg-paper">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="card p-6">
          <h1 className="text-2xl font-bold">{evt.titre}</h1>
          <p className="opacity-80 mt-1">{evt.date} — {evt.lieu} — {evt.clocher}</p>
          <p className="mt-4">{evt.description}</p>
          <div className="mt-6 flex gap-2">
            <a className="btn btn-primary rounded-xl" href="#">Ajouter à mon agenda</a>
            <a className="btn btn-outline rounded-xl" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(evt.lieu + ' ' + evt.clocher)}`} target="_blank">Itinéraire</a>
          </div>
          <div className="mt-6">
            <h2 className="font-semibold mb-2">Album photo</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <div className="aspect-square bg-[#F0EDE6] rounded-xl grid place-items-center text-sm">Photo 1</div>
              <div className="aspect-square bg-[#F0EDE6] rounded-xl grid place-items-center text-sm">Photo 2</div>
              <div className="aspect-square bg-[#F0EDE6] rounded-xl grid place-items-center text-sm">Photo 3</div>
              <div className="aspect-square bg-[#F0EDE6] rounded-xl grid place-items-center text-sm">Photo 4</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
