'use client';

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

// Empêche le prerender statique strict sur cette page (CSR)
export const dynamic = 'force-dynamic';

export default function LoginPage() {
  return (
    <Suspense fallback={<Loader />}>
      <LoginForm />
    </Suspense>
  );
}

function Loader() {
  return (
    <div className="min-h-screen grid place-items-center bg-paper px-4">
      <div className="w-full max-w-sm rounded-2xl border p-6 bg-white" style={{borderColor:"#E5E2DC"}}>
        <div className="animate-pulse space-y-3">
          <div className="h-6 bg-gray-200 rounded w-1/3" />
          <div className="h-10 bg-gray-200 rounded" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
          <div className="h-10 bg-gray-200 rounded" />
          <div className="h-10 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
}

function LoginForm() {
  const [role, setRole] = useState("benevole");
  const [pwd, setPwd] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const sp = useSearchParams();
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {"content-type":"application/json"},
      body: JSON.stringify({ role, password: pwd })
    });
    if (!res.ok) {
      setErr("Rôle ou mot de passe incorrect.");
      return;
    }
    const nextParam = sp?.get("next") ?? "/admin";
    router.push(nextParam);
  }

  return (
    <div className="min-h-screen grid place-items-center bg-paper px-4">
      <form onSubmit={submit} className="w-full max-w-sm rounded-2xl border p-6 bg-white" style={{borderColor:"#E5E2DC"}}>
        <h1 className="text-xl font-bold mb-4">Connexion</h1>

        <label className="text-sm mb-1 block">Rôle</label>
        <select
          value={role}
          onChange={e=>setRole(e.target.value)}
          className="w-full rounded-xl border px-3 py-2 mb-3"
          style={{borderColor:"#E5E2DC"}}
        >
          <option value="admin">Admin</option>
          <option value="pretre">Prêtre</option>
          <option value="benevole">Bénévole</option>
        </select>

        <label className="text-sm mb-1 block">Mot de passe</label>
        <input
          type="password"
          value={pwd}
          onChange={e=>setPwd(e.target.value)}
          className="w-full rounded-xl border px-3 py-2 mb-3"
          style={{borderColor:"#E5E2DC"}}
        />

        {err && <p className="text-sm text-red-600 mb-2">{err}</p>}
        <button className="btn btn-primary rounded-xl w-full">Se connecter</button>
      </form>
    </div>
  );
}
