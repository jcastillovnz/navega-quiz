import React from 'react';
import type { VisualFamily } from '../../data/visualManifest';

type ConceptFamily = Extract<VisualFamily,
  'RIPA_WATCH' | 'RIPA_COLLISION_RISK' | 'RIPA_AVOIDANCE' | 'RIPA_CHANNEL' | 'RIPA_TSS' | 'RIPA_RESTRICTED_VIS'>;

const COPY: Record<ConceptFamily, { title: string; detail: string }> = {
  RIPA_WATCH: { title: 'Vigilancia y velocidad segura', detail: 'Vista + oído + radar · la distancia de detención debe caber en el espacio disponible' },
  RIPA_COLLISION_RISK: { title: 'Riesgo de abordaje', detail: 'Marcación casi constante + distancia decreciente = actuar como si el riesgo existiera' },
  RIPA_AVOIDANCE: { title: 'Maniobra temprana y evidente', detail: 'El cambio amplio produce una separación clara; una suma de cambios mínimos resulta ambigua' },
  RIPA_CHANNEL: { title: 'Canal angosto', detail: 'Navegá próximo al límite exterior de estribor y no estorbes al buque limitado al canal' },
  RIPA_TSS: { title: 'Separación de tráfico', detail: 'Seguí el sentido de la vía; si debés cruzar, hacelo con la proa casi perpendicular al flujo' },
  RIPA_RESTRICTED_VIS: { title: 'Visibilidad reducida', detail: 'El radar reemplaza la escena visible, no la prudencia: evaluá sector, CPA y velocidad' }
};

export const RipaRuleConceptViewer: React.FC<{ family: ConceptFamily }> = ({ family }) => {
  const isFog = family === 'RIPA_RESTRICTED_VIS';
  const isChannel = family === 'RIPA_CHANNEL';
  const isTss = family === 'RIPA_TSS';
  const isRisk = family === 'RIPA_COLLISION_RISK';
  const isAvoidance = family === 'RIPA_AVOIDANCE';

  return (
    <figure className="h-full min-h-0 flex flex-col bg-slate-950 overflow-hidden" aria-label={COPY[family].title}>
      <svg viewBox="0 0 1200 430" className="min-h-0 flex-1 w-full" role="img">
        <defs>
          <linearGradient id="ripaSea" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#123d5a"/><stop offset="1" stopColor="#031525"/></linearGradient>
          <pattern id="ripaWaves" width="52" height="24" patternUnits="userSpaceOnUse"><path d="M0 12 Q13 3 26 12 T52 12" fill="none" stroke="#67e8f9" strokeOpacity=".16" strokeWidth="2"/></pattern>
          <filter id="ripaGlow"><feGaussianBlur stdDeviation="6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          <linearGradient id="fog" x1="0" x2="1"><stop stopColor="#cbd5e1" stopOpacity=".82"/><stop offset=".5" stopColor="#64748b" stopOpacity=".34"/><stop offset="1" stopColor="#cbd5e1" stopOpacity=".76"/></linearGradient>
          <marker id="trafficArrowCyan" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto"><path d="M0 0 L9 5 L0 10Z" fill="#67e8f9"/></marker>
          <marker id="trafficArrowAmber" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto"><path d="M0 0 L9 5 L0 10Z" fill="#fbbf24"/></marker>
        </defs>
        <rect width="1200" height="430" fill="url(#ripaSea)"/><rect width="1200" height="430" fill="url(#ripaWaves)"/>

        {isChannel && <><path d="M0 60 L360 150 L360 430 L0 430Z" fill="#9a6b39"/><path d="M1200 60 L840 150 L840 430 L1200 430Z" fill="#9a6b39"/><path d="M390 0 V430 M810 0 V430" stroke="#f8fafc" strokeDasharray="18 16" strokeOpacity=".55" strokeWidth="5"/><text x="600" y="54" fill="#a5f3fc" fontSize="28" textAnchor="middle">CANAL NAVEGABLE</text></>}
        {isTss && <>
          <rect x="70" y="45" width="1060" height="125" rx="18" fill="#0e7490" fillOpacity=".38" stroke="#38bdf8" strokeOpacity=".45" strokeWidth="4"/>
          <rect x="70" y="260" width="1060" height="125" rx="18" fill="#0e7490" fillOpacity=".38" stroke="#38bdf8" strokeOpacity=".45" strokeWidth="4"/>
          <rect x="70" y="185" width="1060" height="60" rx="12" fill="#831843" fillOpacity=".55" stroke="#f472b6" strokeWidth="4" strokeDasharray="16 10"/>
          <path d="M145 108 H405 M470 108 H730 M795 108 H1055" stroke="#67e8f9" strokeWidth="9" markerEnd="url(#trafficArrowCyan)"/>
          <path d="M1055 323 H795 M730 323 H470 M405 323 H145" stroke="#67e8f9" strokeWidth="9" markerEnd="url(#trafficArrowCyan)"/>
          <text x="600" y="221" fill="#fbcfe8" fontSize="20" fontWeight="800" textAnchor="middle">FRANJA DE SEPARACIÓN · NO NAVEGAR POR ELLA</text>
          <path d="M510 405 V22" stroke="#fbbf24" strokeWidth="10" strokeDasharray="18 10" markerEnd="url(#trafficArrowAmber)"/>
          <path d="M455 190 A55 55 0 0 1 510 135" fill="none" stroke="#fde68a" strokeWidth="5"/>
          <text x="412" y="178" fill="#fde68a" fontSize="20" fontWeight="800">≈ 90°</text>
          <g transform="translate(510 320) rotate(-90)"><path d="M-72 22 L50 22 L90 0 L50-22 L-72-22 L-94 0Z" fill="#f8fafc" stroke="#0f172a" strokeWidth="5"/><rect x="-35" y="-14" width="45" height="28" rx="6" fill="#164e63"/></g>
          <g transform="translate(875 108)"><path d="M-58 17 L40 17 L68 0 L40-17 L-58-17 L-76 0Z" fill="#cbd5e1" stroke="#0f172a" strokeWidth="4"/></g>
          <g transform="translate(285 323) rotate(180)"><path d="M-58 17 L40 17 L68 0 L40-17 L-58-17 L-76 0Z" fill="#cbd5e1" stroke="#0f172a" strokeWidth="4"/></g>
        </>}
        {!isChannel && !isTss && <circle cx="610" cy="225" r="150" fill="none" stroke="#38bdf8" strokeOpacity=".18" strokeWidth="3"/>}

        {!isTss && <g transform={isChannel ? 'translate(650 240)' : 'translate(500 270)'}>
          <path d="M-100 28 L76 28 L128 0 L76-28 L-100-28 L-128 0Z" fill="#e2e8f0" stroke="#fff" strokeWidth="5"/><rect x="-52" y="-18" width="67" height="36" rx="7" fill="#164e63"/><path d="M-116 0 H-210" stroke="#67e8f9" strokeWidth="7" strokeDasharray="12 12"/><circle cx="76" cy="-18" r="7" fill="#22c55e" filter="url(#ripaGlow)"/><circle cx="76" cy="18" r="7" fill="#ef4444" filter="url(#ripaGlow)"/></g>}

        {(isRisk || isAvoidance || isFog) && <g transform="translate(865 130) rotate(38)"><path d="M-72 22 L54 22 L94 0 L54-22 L-72-22 L-94 0Z" fill="#f59e0b" stroke="#fde68a" strokeWidth="4"/><path d="M-88 0 H-170" stroke="#fbbf24" strokeWidth="6" strokeDasharray="10 10"/></g>}
        {isRisk && <><path d="M610 235 L865 130" stroke="#fb7185" strokeWidth="5" strokeDasharray="14 11"/><path d="M610 235 L820 149" stroke="#fb7185" strokeWidth="3" opacity=".35"/><text x="745" y="165" fill="#fecdd3" fontSize="22">marcación constante</text><text x="740" y="300" fill="#e2e8f0" fontSize="20">distancia ↓</text></>}
        {isAvoidance && <><path d="M620 250 Q730 300 860 360" fill="none" stroke="#22c55e" strokeWidth="8"/><path d="M620 250 Q725 245 825 220" fill="none" stroke="#fb7185" strokeDasharray="10 10" strokeWidth="5"/><text x="825" y="390" fill="#86efac" fontSize="22">maniobra clara</text><text x="830" y="215" fill="#fda4af" fontSize="20">cambios mínimos</text></>}
        {family === 'RIPA_WATCH' && <><path d="M620 245 L970 75 M620 245 L1000 245 M620 245 L930 390" stroke="#67e8f9" strokeOpacity=".55" strokeWidth="4" strokeDasharray="12 10"/><circle cx="620" cy="245" r="118" fill="none" stroke="#22d3ee" strokeWidth="4" strokeDasharray="8 8"/><circle cx="620" cy="245" r="15" fill="#22d3ee"/><text x="930" y="65" fill="#a5f3fc" fontSize="22">vista</text><text x="1010" y="250" fill="#a5f3fc" fontSize="22">oído</text><text x="930" y="415" fill="#a5f3fc" fontSize="22">radar</text></>}
        {isFog && <><rect width="1200" height="430" fill="url(#fog)"/><circle cx="610" cy="225" r="125" fill="#052e3b" fillOpacity=".84" stroke="#67e8f9" strokeWidth="4"/><circle cx="610" cy="225" r="80" fill="none" stroke="#67e8f9" strokeOpacity=".45"/><path d="M610 225 L835 130" stroke="#22d3ee" strokeWidth="5"/><circle cx="835" cy="130" r="12" fill="#fbbf24" filter="url(#ripaGlow)"/><text x="610" y="390" fill="#f8fafc" fontSize="22" textAnchor="middle">Contacto detectado únicamente por radar</text></>}
      </svg>
      <figcaption className="shrink-0 border-t border-cyan-400/25 bg-slate-900 px-4 py-2">
        <p className="text-sm font-black text-cyan-200">{COPY[family].title}</p>
        <p className="text-xs text-slate-300">{COPY[family].detail}</p>
      </figcaption>
    </figure>
  );
};
