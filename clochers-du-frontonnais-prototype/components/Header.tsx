'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Header() {
  const [role, setRole] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // On tente de récupérer la session; si non connecté, 401 => role null
    fetch('/api/auth/me')
      .then(async (r) => {
        setChecking(false);
        if (!r.ok) return;
        const j = await r.json();
        setRole(j.role || null);
      })
      .catch(() => setChecking(false));
  }, []);

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    // simple refresh pour remettre l'UI à zéro
    window.location.href = '/';
  }

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b" style={{ borderColor: '#E8E5DF' }}>
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo + nom */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl">🏰</span>
          <span className="font-semibold">Clochers du Frontonnais</span>
        </Link>

        {/* Navigation principale (quelques liens) */}
        <nav className="hidden md:flex items-center gap-5 text-sm">
          <Link href="/events" className="hover:underline">Événements</Link>
          <Link href="/decouvrir-la-messe" className="hover:underline">Découvrir la messe</Link>
        </nav>

        {/* Espace à droite : Connexion / Espace / Déconnexion */}
        <div className="flex items-center gap-2">
          {!checking && role && (
            <>
              <span className="hidden sm:inline-flex text-xs px-2 py-1 rounded-full border" style={{ borderColor: '#E5E2DC' }}>
                Connecté&nbsp;: {role}
              </span>
              <Link href="/admin" className="btn btn-outline rounded-xl text-sm">Mon espace</Link>
              <button onClick={logout} className="btn btn-primary rounded-xl text-sm">Déconnexion</button>
            </>
          )}

          {!checking && !role && (
            <Link
              href="/login"
              className="text-sm opacity-80 hover:opacity-100 underline underline-offset-4"
              title="Se connecter"
            >
              Connexion
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
