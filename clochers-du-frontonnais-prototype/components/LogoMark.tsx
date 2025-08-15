'use client';
export default function LogoMark({ size = 44 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-label="Logo Clochers du Frontonnais">
      <circle cx="44" cy="18" r="12" fill="#F9B233" />
      <g fill="none" stroke="#19565E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 48 V28 l10 -6 v-8 l8 -6 v12 l8 6 v22 H10 Z" fill="#fff"/>
        <path d="M28 48 V26 l8 6 v16" />
        <path d="M20 32 h8" />
        <rect x="14" y="34" width="6" height="8" rx="1" fill="#F8F7F3" stroke="#19565E" />
        <rect x="24" y="34" width="6" height="8" rx="1" fill="#F8F7F3" stroke="#19565E" />
        <path d="M28 8 l4 -4 l4 4" />
      </g>
    </svg>
  );
}
