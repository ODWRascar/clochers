// app/admin/page.tsx
'use client';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminHome() {
  const [role, setRole] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/me").then(async r => {
      if (!r.ok) { router.push("/login"); return; }
      const j = await r.json();
      setRole(j.role);
    });
  }, [router]);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  }

  if (!role) return <div className="p-6">Vérification…</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Panneau — {role}</h1>
      <p className="mb-4">Bienvenue. Prochaine étape : gestion des événements, des annonces et des pages.</p>
      <div className="flex gap-2">
        <a className="btn btn-outline rounded-xl" href="/events">Voir les événements</a>
        <a className="btn btn-outline rounded-xl" href="/decouvrir-la-messe">Découvrir la messe</a>
        <button className="btn btn-primary rounded-xl" onClick={logout}>Se déconnecter</button>
      </div>
    </div>
  );
}
