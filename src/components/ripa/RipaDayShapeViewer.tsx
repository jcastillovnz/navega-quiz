import React from 'react';

type ShapeKind = 'tow' | 'motorSailing' | 'nuc' | 'ram' | 'dredge' | 'draft';

const identify = (text: string): ShapeKind => {
  if (/remolque|200 m/.test(text)) return 'tow';
  if (/vela.*motor|propulsi[oó]n mec[aá]nica/.test(text)) return 'motorSailing';
  if (/sin gobierno/.test(text)) return 'nuc';
  if (/draga|obstrucci[oó]n/.test(text)) return 'dredge';
  if (/calado|cilindro/.test(text)) return 'draft';
  return 'ram';
};

const COPY: Record<ShapeKind, { title: string; detail: string }> = {
  tow: { title: 'Remolque mayor de 200 m', detail: 'Rombo negro donde mejor pueda verse' },
  motorSailing: { title: 'Velero navegando también a motor', detail: 'Cono negro con el vértice hacia abajo' },
  nuc: { title: 'Buque sin gobierno', detail: 'Dos bolas negras en línea vertical' },
  ram: { title: 'Capacidad de maniobra restringida', detail: 'Bola · rombo · bola en línea vertical' },
  dredge: { title: 'Draga con obstrucción', detail: 'Dos bolas: lado obstruido · dos rombos: lado libre' },
  draft: { title: 'Buque restringido por su calado', detail: 'Un cilindro negro donde mejor pueda verse' }
};

export const RipaDayShapeViewer: React.FC<{ context: string }> = ({ context }) => {
  const kind = identify(context);
  const ball = (x: number, y: number) => <circle cx={x} cy={y} r="29" fill="#09090b" stroke="#94a3b8" strokeWidth="3" />;
  const diamond = (x: number, y: number) => <path d={`M${x} ${y - 38} L${x + 29} ${y} L${x} ${y + 38} L${x - 29} ${y}Z`} fill="#09090b" stroke="#94a3b8" strokeWidth="3" />;
  return <figure className="h-full flex flex-col bg-slate-950 overflow-hidden">
    <svg viewBox="0 0 1200 430" className="min-h-0 flex-1 w-full" role="img" aria-label={COPY[kind].title}>
      <defs><linearGradient id="daySea" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#38bdf8"/><stop offset=".52" stopColor="#bae6fd"/><stop offset=".53" stopColor="#155e75"/><stop offset="1" stopColor="#082f49"/></linearGradient></defs>
      <rect width="1200" height="430" fill="url(#daySea)"/><path d="M250 315 H935 L850 380 H330Z" fill="#e2e8f0" stroke="#fff" strokeWidth="5"/><path d="M365 315 L430 236 H730 L815 315Z" fill="#334155" stroke="#cbd5e1" strokeWidth="4"/><path d="M600 236 V52" stroke="#cbd5e1" strokeWidth="12"/><path d="M600 58 H690" stroke="#cbd5e1" strokeWidth="7"/>
      {kind === 'tow' && diamond(690, 112)}
      {kind === 'motorSailing' && <path d="M690 72 L728 145 H652Z" fill="#09090b" stroke="#94a3b8" strokeWidth="3"/>}
      {kind === 'nuc' && <>{ball(690,95)}{ball(690,170)}</>}
      {kind === 'ram' && <>{ball(690,72)}{diamond(690,145)}{ball(690,218)}</>}
      {kind === 'draft' && <rect x="658" y="73" width="64" height="126" rx="4" fill="#09090b" stroke="#94a3b8" strokeWidth="3"/>}
      {kind === 'dredge' && <><path d="M600 100 H445 M600 100 H755" stroke="#cbd5e1" strokeWidth="6"/>{ball(445,78)}{ball(445,150)}{diamond(755,78)}{diamond(755,160)}<text x="445" y="220" fill="#fecaca" fontSize="22" textAnchor="middle">OBSTRUCCIÓN</text><text x="755" y="230" fill="#bbf7d0" fontSize="22" textAnchor="middle">PASO LIBRE</text></>}
      <text x="70" y="65" fill="#0f172a" fontSize="25" fontWeight="800">MARCA DIURNA · SILUETA REGLAMENTARIA</text>
    </svg>
    <figcaption className="shrink-0 border-t border-amber-300/30 bg-slate-900 px-4 py-2"><p className="text-sm font-black text-amber-200">{COPY[kind].title}</p><p className="text-xs text-slate-300">{COPY[kind].detail}</p></figcaption>
  </figure>;
};
