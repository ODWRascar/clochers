'use client';
import LogoMark from './LogoMark';
import ThemeToggle from './ThemeToggle';
import Link from 'next/link';
import { useClocher } from './useClocher';

export default function Header() {
  const { clocher } = useClocher();
  return (
    <header className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-white/70 border-b" style={{ borderColor: "#E8E5DF" }}>
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <LogoMark />
          <div>
            <Link href="/" className="text-lg md:text-2xl font-bold tracking-tight">Clochers du Frontonnais</Link>
            <p className="text-xs md:text-sm text-primary">Ensemble paroissial Fronton – Villemur et environs</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-2">
          {clocher && <span className="pill">Mon clocher : {clocher}</span>}
          <Link className="btn btn-outline rounded-2xl" href="/onboarding">Choisir mon clocher</Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
