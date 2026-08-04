import React from 'react';

export const MarinePropulsionViewer: React.FC<{focus:'ENGINE'|'PROPELLER'; context:string}> = ({focus,context}) => {
  const lower=context.toLowerCase();
  const highlight=lower.includes('refriger')?'TOMA DE AGUA':lower.includes('anticavit')?'PLACA ANTICAVITACIÓN':lower.includes('pinzas')?'PINZAS DE FIJACIÓN':lower.includes('pata')?'PATA / TRANSMISIÓN':lower.includes('núcleo')||lower.includes('cubo')?'CUBO':lower.includes('raíz')?'RAÍZ Y PUNTA':lower.includes('paso')?'PASO':lower.includes('dextr')?'GIRO DEXTRÓGIRO':lower.includes('cavit')?'CAVITACIÓN':'BORDE DE ATAQUE';
  return <figure className="h-full flex flex-col overflow-hidden bg-slate-950">
    <svg viewBox="0 0 1200 430" className="flex-1 min-h-0 w-full" role="img" aria-label={`${focus}: ${highlight}`}>
      <defs><linearGradient id="motorSea" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#bae6fd"/><stop offset=".48" stopColor="#38bdf8"/><stop offset=".49" stopColor="#075985"/><stop offset="1" stopColor="#082f49"/></linearGradient><radialGradient id="metal"><stop stopColor="#f8fafc"/><stop offset=".5" stopColor="#94a3b8"/><stop offset="1" stopColor="#334155"/></radialGradient></defs>
      <rect width="1200" height="430" fill="url(#motorSea)"/>
      {focus==='ENGINE'?<>
        <path d="M265 80 H650 V176 H600 V360 H520 V180 H265Z" fill="#e2e8f0" stroke="#0f172a" strokeWidth="7"/><rect x="300" y="102" width="300" height="122" rx="30" fill="#1e293b" stroke="#cbd5e1" strokeWidth="5"/><path d="M275 190 H190 V315 H275" fill="none" stroke="#475569" strokeWidth="22"/><rect x="272" y="210" width="38" height="82" rx="8" fill="#f59e0b"/><path d="M520 350 H760" stroke="#64748b" strokeWidth="25"/><path d="M610 320 H780" stroke="#cbd5e1" strokeWidth="18"/><circle cx="770" cy="350" r="58" fill="url(#metal)" stroke="#0f172a" strokeWidth="6"/><path d="M770 350 Q700 250 746 225 Q805 285 785 345Z M770 350 Q875 315 893 365 Q815 402 780 365Z M770 350 Q742 458 690 435 Q700 367 758 352Z" fill="#94a3b8" stroke="#1e293b" strokeWidth="5"/>
        <circle cx={highlight==='TOMA DE AGUA'?555:highlight==='PLACA ANTICAVITACIÓN'?650:highlight==='PINZAS DE FIJACIÓN'?290:540} cy={highlight==='TOMA DE AGUA'?315:highlight==='PLACA ANTICAVITACIÓN'?320:highlight==='PINZAS DE FIJACIÓN'?252:250} r="38" fill="none" stroke="#f43f5e" strokeWidth="9"/><path d="M820 90 L700 155" stroke="#f43f5e" strokeWidth="5"/><text x="835" y="92" fill="#fecdd3" fontSize="24" fontWeight="900">{highlight}</text>
      </>:<>
        <circle cx="600" cy="220" r="72" fill="url(#metal)" stroke="#0f172a" strokeWidth="8"/><circle cx="600" cy="220" r="25" fill="#1e293b"/>
        <path d="M570 180 Q410 40 330 105 Q405 238 552 230Z M640 198 Q835 115 860 215 Q740 305 635 250Z M590 270 Q555 435 455 385 Q450 270 575 235Z" fill="#94a3b8" stroke="#1e293b" strokeWidth="7"/>
        <path d="M600 68 A152 152 0 1 1 450 220" fill="none" stroke="#22d3ee" strokeWidth="10" strokeDasharray="18 12"/><path d="M445 220 L475 185 L485 230Z" fill="#22d3ee"/><path d="M870 80 L735 150" stroke="#f43f5e" strokeWidth="5"/><text x="880" y="82" fill="#fecdd3" fontSize="24" fontWeight="900">{highlight}</text>
        {highlight==='CAVITACIÓN'&&[0,1,2,3,4].map(i=><circle key={i} cx={820+i*28} cy={255+(i%2)*24} r={8+i*2} fill="#e0f2fe" stroke="#38bdf8" strokeWidth="3"/>)}
      </>}
      <text x="55" y="55" fill="#0f172a" fontSize="25" fontWeight="900">PROPULSIÓN MARINA · VISTA TÉCNICA</text>
    </svg>
    <figcaption className="shrink-0 border-t border-amber-400/30 bg-slate-900 px-4 py-2"><p className="text-sm font-black text-amber-200">{highlight}</p><p className="text-xs text-slate-300">Localizá la pieza, su relación con el conjunto y la dirección del flujo o movimiento.</p></figcaption>
  </figure>;
};
