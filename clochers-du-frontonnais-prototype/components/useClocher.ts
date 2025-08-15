'use client';
import { useEffect, useState } from 'react';
import { clochers } from '@/data/clochers';

export function useClocher() {
  const [ready, setReady] = useState(false);
  const [clocher, setClocher] = useState<string | null>(null);

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('clocher') : null;
    setClocher(saved);
    setReady(true);
  }, []);

  function choose(c: string) {
    if (!clochers.includes(c)) return;
    localStorage.setItem('clocher', c);
    setClocher(c);
  }

  return { ready, clocher, choose };
}
