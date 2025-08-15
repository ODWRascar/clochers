'use client';
import { useEffect, useState } from 'react';

type HomeData = {
  heroTitle?: string;
  heroSubtitle?: string;
  heroText?: string;
  images?: string[];
};

export default function AdminPage() {
  const [pwd, setPwd] = useState('');
  const [data, setData] = useState<HomeData>({ images: [] });
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<string | null>(null);

  // Charge le contenu actuel (lecture publique)
  useEffect(() => {
    fetch('/api/home')
      .then(r => r.json())
      .then(j => setData(j.data || { images: [] }))
      .finally(()=> setLoading(false));
  }, []);

  function updateImage(i: number, url: string) {
    const arr = [...(data.images || [])];
    arr[i] = url;
    setData({ ...data, images: arr });
  }
  function addImage() {
    setData({ ...data, images: [ ...(data.images || []), '' ]});
  }
  function removeImage(i: number) {
    const arr = [...(data.images || [])];
    arr.splice(i,1);
    setData({ ...data, images: arr });
  }

  async function save(e: any) {
    e.preventDefault();
    setMsg(null);
    const res = await fetch('/api/admin/home', {
      method: 'PUT',
      headers: {
        'content-type': 'application/json',
        'authorization': `Bearer ${pwd}`
      },
      body: JSON.stringify(data)
    });
    if (res.ok) setMsg('Contenu enregistré ✅');
    else setMsg('Échec : mot de passe invalide ou erreur serveur.');
  }

  if (loading) return <div className="p-6">Chargement…</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Administration — Accueil</h1>
      <form className="space-y-4" onSubmit={save}>
        <div>
          <label className="block text-sm mb-1">Mot de passe (ADMIN_SECRET)</label>
          <input
            type="password"
            className="w-full border rounded-2xl px-4 py-2"
            value={pwd}
            onChange={e=>setPwd(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Titre (heroTitle)</label>
          <input
            className="w-full border rounded-2xl px-4 py-2"
            value={data.heroTitle || ''}
            onChange={e=>setData({...data, heroTitle:e.target.value})}
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Sous-titre (heroSubtitle)</label>
          <input
            className="w-full border rounded-2xl px-4 py-2"
            value={data.heroSubtitle || ''}
            onChange={e=>setData({...data, heroSubtitle:e.target.value})}
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Texte (heroText)</label>
          <textarea
            className="w-full border rounded-2xl px-4 py-2 min-h-[120px]"
            value={data.heroText || ''}
            onChange={e=>setData({...data, heroText:e.target.value})}
          />
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label className="block text-sm mb-1">Images (URLs publiques)</label>
            <button type="button" className="btn btn-outline rounded-2xl" onClick={addImage}>+ Ajouter</button>
          </div>
          <div className="space-y-2 mt-2">
            {(data.images || []).map((u, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  className="flex-1 border rounded-2xl px-3 py-2"
                  placeholder="https://…"
                  value={u}
                  onChange={e=>updateImage(i, e.target.value)}
                />
                <button type="button" className="btn btn-outline rounded-2xl" onClick={()=>removeImage(i)}>Supprimer</button>
              </div>
            ))}
          </div>
          <p className="text-xs opacity-70 mt-2">
            Astuce : héberge tes images sur un service public (Cloudinary, Imgur, etc.) et colle l’URL ici.
          </p>
        </div>

        <button className="btn btn-primary rounded-2xl">Enregistrer</button>
        {msg && <p className="mt-2 text-sm">{msg}</p>}
      </form>
    </div>
  );
}
