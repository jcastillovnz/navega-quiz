import React from 'react';

const TOP_IDS = new Set(['nom_1', 'nom_2', 'nom_12', 'nom_13', 'nom_21', 'nom_26', 'nom_27', 'nom_30', 'nom_31', 'nom_32']);
const STRUCTURE_IDS = new Set(['nom_16', 'nom_17', 'nom_18', 'nom_19', 'nom_22', 'nom_29']);

const focusFor = (id: string) => {
  const profile: Record<string, { x: number; y: number; rx: number; ry: number }> = {
    nom_3: { x: 165, y: 205, rx: 45, ry: 95 }, nom_4: { x: 835, y: 230, rx: 42, ry: 85 },
    nom_5: { x: 500, y: 315, rx: 360, ry: 25 }, nom_6: { x: 500, y: 190, rx: 120, ry: 38 },
    nom_7: { x: 520, y: 270, rx: 55, ry: 90 }, nom_8: { x: 700, y: 205, rx: 35, ry: 65 },
    nom_9: { x: 420, y: 195, rx: 32, ry: 85 }, nom_10: { x: 500, y: 270, rx: 315, ry: 55 },
    nom_11: { x: 500, y: 190, rx: 320, ry: 55 }, nom_14: { x: 500, y: 235, rx: 340, ry: 18 },
    nom_15: { x: 520, y: 295, rx: 80, ry: 78 }, nom_20: { x: 500, y: 165, rx: 330, ry: 38 },
    nom_23: { x: 500, y: 155, rx: 330, ry: 30 }, nom_24: { x: 500, y: 175, rx: 340, ry: 45 },
    nom_28: { x: 500, y: 155, rx: 285, ry: 36 }, nom_33: { x: 500, y: 210, rx: 330, ry: 90 },
    nom_34: { x: 500, y: 220, rx: 345, ry: 90 }, nom_35: { x: 150, y: 245, rx: 65, ry: 45 },
    nom_36: { x: 500, y: 255, rx: 330, ry: 70 }, nom_37: { x: 520, y: 295, rx: 65, ry: 80 },
    nom_38: { x: 500, y: 245, rx: 340, ry: 72 }
  };
  return profile[id] ?? { x: 500, y: 215, rx: 320, ry: 95 };
};

const TopView = ({ id }: { id: string }) => {
  const isCenterline = id === 'nom_1';
  const portSide = ['nom_2', 'nom_12', 'nom_26', 'nom_30', 'nom_32'].includes(id);
  const aft = ['nom_13', 'nom_21', 'nom_31'].includes(id);
  return <svg viewBox="0 0 1000 360" className="h-full w-full" role="img" aria-label="Vista cenital ampliada del casco">
    <defs><linearGradient id={`topHull-${id}`} x1="0" x2="1"><stop stopColor="#f8fafc"/><stop offset=".5" stopColor="#cbd5e1"/><stop offset="1" stopColor="#f8fafc"/></linearGradient><filter id={`topShadow-${id}`}><feDropShadow dx="5" dy="8" stdDeviation="7" floodOpacity=".55"/></filter></defs>
    <rect width="1000" height="360" fill="#071525"/><path d="M0 75 Q130 55 260 75 T520 75 T780 75 T1040 75 M0 285 Q130 265 260 285 T520 285 T780 285 T1040 285" fill="none" stroke="#0e7490" strokeWidth="4" opacity=".35"/>
    <g filter={`url(#topShadow-${id})`}><path d="M105 180 Q190 72 520 60 Q810 72 895 180 Q810 288 520 300 Q190 288 105 180Z" fill={`url(#topHull-${id})`} stroke="#475569" strokeWidth="8"/><path d="M285 180 Q365 105 670 105 Q770 115 825 180 Q770 245 670 255 Q365 255 285 180Z" fill="#94a3b8" stroke="#334155" strokeWidth="6"/><rect x="510" y="75" width="12" height="210" rx="6" fill="#475569"/><path d="M520 180 H730" stroke="#64748b" strokeWidth="14"/></g>
    {isCenterline && <><path d="M90 180 H910" stroke="#22d3ee" strokeWidth="8" strokeDasharray="18 12"/><circle cx="105" cy="180" r="13" fill="#67e8f9"/><circle cx="895" cy="180" r="13" fill="#67e8f9"/></>}
    {!isCenterline && <path d={aft ? 'M690 85 Q855 105 895 180 Q855 255 690 275Z' : portSide ? 'M120 180 Q215 75 515 64 L515 180Z' : 'M120 180 Q215 285 515 296 L515 180Z'} fill="#f59e0b" opacity=".3" stroke="#fbbf24" strokeWidth="7"/>}
    <path d="M105 180 L145 160 M105 180 L145 200" stroke="#22d3ee" strokeWidth="7"/>
  </svg>;
};

const ProfileView = ({ id }: { id: string }) => { const focus=focusFor(id); return <svg viewBox="0 0 1000 360" className="h-full w-full" role="img" aria-label="Perfil ampliado del casco y su relación con el agua">
  <defs><linearGradient id={`sea-${id}`} x1="0" y1="0" x2="0" y2="1"><stop stopColor="#0284c7"/><stop offset="1" stopColor="#082f49"/></linearGradient><filter id={`profileShadow-${id}`}><feDropShadow dx="5" dy="7" stdDeviation="6" floodOpacity=".5"/></filter></defs>
  <rect width="1000" height="235" fill="#10243d"/><rect y="235" width="1000" height="125" fill={`url(#sea-${id})`}/><path d="M0 235 Q80 222 160 235 T320 235 T480 235 T640 235 T800 235 T960 235 T1120 235" fill="none" stroke="#a5f3fc" strokeWidth="6"/>
  <g filter={`url(#profileShadow-${id})`}><path d="M125 175 Q180 150 310 145 H790 Q850 150 875 185 L815 255 Q620 282 260 255 Q155 245 125 175Z" fill="#e2e8f0" stroke="#334155" strokeWidth="8"/><path d="M260 255 Q550 275 815 255 Q790 305 575 315 H365 Q285 298 260 255Z" fill="#b91c1c" stroke="#7f1d1d" strokeWidth="6"/><path d="M500 265 V345 Q545 335 580 305 L555 265Z" fill="#7f1d1d" stroke="#450a0a" strokeWidth="6"/><rect x="450" y="70" width="12" height="105" fill="#94a3b8"/><path d="M455 82 L700 170 H455Z" fill="#f8fafc" stroke="#94a3b8" strokeWidth="4"/><path d="M235 151 H760" stroke="#64748b" strokeWidth="8"/></g>
  <ellipse cx={focus.x} cy={focus.y} rx={focus.rx} ry={focus.ry} fill="#fbbf24" fillOpacity=".13" stroke="#fbbf24" strokeWidth="7" strokeDasharray="14 9"/>
  <circle cx={focus.x} cy={focus.y} r="10" fill="#fde68a"/>
  </svg>; };

const StructureView = ({ id }: { id: string }) => <svg viewBox="0 0 1000 360" className="h-full w-full" role="img" aria-label="Sección transversal ampliada de la estructura interior del casco">
  <rect width="1000" height="360" fill="#0b1b2d"/><path d="M170 65 Q500 325 830 65 L765 255 Q500 355 235 255Z" fill="#e2e8f0" stroke="#64748b" strokeWidth="10"/>
  <path d="M240 112 Q500 292 760 112 M300 165 Q500 288 700 165 M365 218 Q500 292 635 218" fill="none" stroke="#f59e0b" strokeWidth={id==='nom_18'?12:6} opacity={id==='nom_18'?1:.55}/>
  <path d="M260 105 H740 M335 165 H665" stroke="#67e8f9" strokeWidth={id==='nom_19'?13:7} opacity={id==='nom_19'?1:.6}/>
  <path d="M500 76 V310" stroke="#94a3b8" strokeWidth="10"/>
  <path d="M405 286 Q500 330 595 286Z" fill={id==='nom_17'?'#38bdf8':'#164e63'} stroke={id==='nom_17'?'#a5f3fc':'#0e7490'} strokeWidth="7"/>
  {id==='nom_16'&&<><path d="M500 72 V308" stroke="#fbbf24" strokeWidth="16"/><path d="M385 120 V275 M615 120 V275" stroke="#fbbf24" strokeWidth="12"/></>}
  {id==='nom_22'&&<path d="M170 65 Q500 325 830 65" fill="none" stroke="#fbbf24" strokeWidth="18"/>}
  {id==='nom_29'&&<path d="M265 250 Q500 340 735 250" fill="none" stroke="#fbbf24" strokeWidth="18"/>}
</svg>;

export const HullNomenclatureViewer: React.FC<{ questionId: string }> = ({ questionId }) => (
  <figure className="relative h-full overflow-hidden bg-slate-950">
    {TOP_IDS.has(questionId) ? <TopView id={questionId}/> : STRUCTURE_IDS.has(questionId) ? <StructureView id={questionId}/> : <ProfileView id={questionId}/>}
    <figcaption className="absolute bottom-2 left-2 rounded-lg border border-amber-300/30 bg-slate-950/88 px-2.5 py-1.5 text-[9px] text-slate-100 sm:text-[11px]">
      <strong className="text-amber-200">Vista técnica ampliada:</strong> reconocé posición, orientación y relación con el casco.
    </figcaption>
  </figure>
);
