'use client';
import { ReactNode } from "react";

export default function SectionTitle({ icon, title, subtitle }: { icon: ReactNode; title: string; subtitle?: string }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 grid place-items-center rounded-2xl" style={{ background: '#FFE7B8' }}>
          {icon}
        </div>
        <div>
          <h2 className="text-xl md:text-2xl font-semibold">{title}</h2>
          {subtitle && <p className="text-sm opacity-80">{subtitle}</p>}
        </div>
      </div>
      <a className="hidden md:inline-flex items-center gap-2 text-primary" href="#">
        Voir plus <span>›</span>
      </a>
    </div>
  );
}
