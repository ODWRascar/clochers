'use client';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(()=> setMounted(true), []);
  if (!mounted) return null;
  return (
    <button
      className="btn btn-outline rounded-2xl"
      onClick={()=> setTheme(theme === 'dark' ? 'light' : 'dark')}
      aria-label="Basculer le thème"
    >
      {theme === 'dark' ? 'Mode clair' : 'Mode sombre'}
    </button>
  );
}
