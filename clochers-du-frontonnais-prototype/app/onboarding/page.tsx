'use client';
import { useRouter } from 'next/navigation';
import { clochers } from '@/data/clochers';

export default function Onboarding() {
  const router = useRouter();
  function save(e: any) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const c = String(form.get('clocher'));
    if (clochers.includes(c)) {
      localStorage.setItem('clocher', c);
      router.push('/');
    } else {
      alert('Choisissez un clocher dans la liste.');
    }
  }
  return (
    <div className="min-h-screen bg-paper">
      <div className="max-w-md mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold">Choisir mon clocher</h1>
        <p className="mt-2 opacity-80">Cela permettra de personnaliser l’agenda et les notifications.</p>
        <form className="mt-6 space-y-3" onSubmit={save}>
          <div>
            <label className="text-sm mb-2 block">Mon clocher</label>
            <select name="clocher" className="w-full appearance-none rounded-2xl border px-4 py-2" style={{ borderColor: "#E5E2DC" }}>
              <option value="">—</option>
              {clochers.map((c: string) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <button className="btn btn-primary rounded-2xl w-full">Valider</button>
        </form>
      </div>
    </div>
  );
}
