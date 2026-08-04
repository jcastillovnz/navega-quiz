import React, { useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import ialaBuoyImg from '../../assets/iala_buoy_babor.png';

type BuoyType =
  | 'BABOR' | 'ESTRIBOR'
  | 'CARDINAL_N' | 'CARDINAL_E' | 'CARDINAL_S' | 'CARDINAL_W'
  | 'PELIGRO_AISLADO' | 'AGUAS_SEGURAS' | 'ESPECIAL' | 'NUEVO_PELIGRO';

interface BuoyInfo {
  name: string;
  color: string;
  accentColor: string;
  topMark: string;
  lightPattern: string;
  lightColorClass: string;
  lightAnimClass: string;
  lightRgb: string;
  description: string;
  rule: string;
  bodyColor: string;
  stripeColors?: string[];
  stripeDir?: 'horizontal' | 'vertical';
  topShape: 'cylinder' | 'cone' | 'two-spheres' | 'sphere' | 'x' | 'cross' | 'north' | 'east' | 'south' | 'west';
  topColor: string;
  bands?: string[];
}

const BUOY_DATA: Record<BuoyType, BuoyInfo> = {
  BABOR: {
    name: 'Boya de Babor (Región B)',
    color: 'text-red-400', accentColor: 'border-red-500/50',
    topMark: '🟥 Cilíndrica Roja',
    lightPattern: 'Fl R — Destello simple Rojo cada 2.5s',
    lightColorClass: 'bg-red-500', lightAnimClass: 'animate-flash-rapid animate-glow-red',
    lightRgb: '239,68,68',
    description: 'En IALA B (Sudamérica), al entrar a puerto dejás la boya ROJA a tu BABOR. Marca el límite de babor del canal navegable.',
    rule: '🇦🇷 Argentina IALA B: "ROJO a Babor al ENTRAR"',
    bodyColor: '#dc2626', topShape: 'cylinder', topColor: '#dc2626',
  },
  ESTRIBOR: {
    name: 'Boya de Estribor (Región B)',
    color: 'text-emerald-400', accentColor: 'border-emerald-500/50',
    topMark: '🔺 Cónica Verde',
    lightPattern: 'Fl G — Destello simple Verde cada 2.5s',
    lightColorClass: 'bg-emerald-500', lightAnimClass: 'animate-flash-rapid animate-glow-green',
    lightRgb: '34,197,94',
    description: 'En IALA B, al entrar a puerto dejás la boya VERDE a tu ESTRIBOR. Marca el límite de estribor del canal.',
    rule: '✅ Verde a Estribor al entrar. Opuesto a IALA A (Europa).',
    bodyColor: '#16a34a', topShape: 'cone', topColor: '#16a34a',
  },
  CARDINAL_N: {
    name: 'Cardinal Norte', color: 'text-amber-300', accentColor: 'border-amber-400/50',
    topMark: '▲ ▲ Dos conos hacia arriba', lightPattern: 'Q W o VQ W — Blanco continuo rápido',
    lightColorClass: 'bg-white', lightAnimClass: 'animate-flash-rapid animate-glow-white', lightRgb: '255,255,255',
    description: 'Las aguas seguras están al NORTE de la marca. Cuerpo negro sobre amarillo.',
    rule: 'Norte: conos arriba; pasá al norte. Ritmo continuo, como las 12 en punto.',
    bodyColor: '#facc15', topShape: 'north', topColor: '#0f172a', bands: ['#0f172a', '#facc15']
  },
  CARDINAL_E: {
    name: 'Cardinal Este', color: 'text-amber-300', accentColor: 'border-amber-400/50',
    topMark: '▼ ▲ Conos con bases enfrentadas', lightPattern: 'Q(3) W 10s o VQ(3) W 5s',
    lightColorClass: 'bg-white', lightAnimClass: 'animate-flash-rapid animate-glow-white', lightRgb: '255,255,255',
    description: 'Las aguas seguras están al ESTE. Bandas negro-amarillo-negro.',
    rule: 'Este = 3 destellos, como las 3 en el reloj.',
    bodyColor: '#0f172a', topShape: 'east', topColor: '#0f172a', bands: ['#0f172a', '#facc15', '#0f172a']
  },
  CARDINAL_S: {
    name: 'Cardinal Sur', color: 'text-amber-300', accentColor: 'border-amber-400/50',
    topMark: '▼ ▼ Dos conos hacia abajo', lightPattern: 'Q(6)+LFl W 15s o VQ(6)+LFl W 10s',
    lightColorClass: 'bg-white', lightAnimClass: 'animate-flash-rapid-double animate-glow-white', lightRgb: '255,255,255',
    description: 'Las aguas seguras están al SUR. Cuerpo amarillo sobre negro.',
    rule: 'Sur = 6 destellos más uno largo, como las 6 en el reloj.',
    bodyColor: '#0f172a', topShape: 'south', topColor: '#0f172a', bands: ['#facc15', '#0f172a']
  },
  CARDINAL_W: {
    name: 'Cardinal Oeste', color: 'text-amber-300', accentColor: 'border-amber-400/50',
    topMark: '▲ ▼ Conos con puntas enfrentadas', lightPattern: 'Q(9) W 15s o VQ(9) W 10s',
    lightColorClass: 'bg-white', lightAnimClass: 'animate-flash-rapid-double animate-glow-white', lightRgb: '255,255,255',
    description: 'Las aguas seguras están al OESTE. Bandas amarillo-negro-amarillo.',
    rule: 'Oeste = 9 destellos, como las 9 en el reloj.',
    bodyColor: '#facc15', topShape: 'west', topColor: '#0f172a', bands: ['#facc15', '#0f172a', '#facc15']
  },
  PELIGRO_AISLADO: {
    name: 'Peligro Aislado',
    color: 'text-white', accentColor: 'border-white/30',
    topMark: '⚫⚫ Dos Esferas Negras',
    lightPattern: 'Fl(2) W — Grupo 2 destellos Blancos cada 4s',
    lightColorClass: 'bg-white', lightAnimClass: 'animate-flash-rapid-double animate-glow-white',
    lightRgb: '255,255,255',
    description: 'Señaliza un peligro aislado (bajo, arrecife, pecio) rodeado de aguas navegables. Franjas horizontales negras y rojas.',
    rule: '⚠️ ESQUIVAR en todos los rumbos. Aguas libres alrededor, peligro en el punto central.',
    bodyColor: '#0f172a', stripeColors: ['#dc2626'], stripeDir: 'horizontal',
    topShape: 'two-spheres', topColor: '#0f172a',
  },
  AGUAS_SEGURAS: {
    name: 'Aguas Seguras (Canal Central)',
    color: 'text-cyan-400', accentColor: 'border-cyan-500/50',
    topMark: '🔴 Esfera Roja',
    lightPattern: 'Iso W — Isofásica Blanca (igual tiempo ON/OFF)',
    lightColorClass: 'bg-white', lightAnimClass: 'animate-flash-iso animate-glow-white',
    lightRgb: '255,255,255',
    description: 'Aguas navegables en 360° alrededor. Franjas VERTICALES rojas y blancas. Se coloca en el eje del canal o en entradas de puerto.',
    rule: '✅ Seguro en todos los rumbos. Podés pasarla por cualquier costado.',
    bodyColor: '#dc2626', stripeColors: ['#ffffff'], stripeDir: 'vertical',
    topShape: 'sphere', topColor: '#dc2626',
  },
  ESPECIAL: {
    name: 'Marca Especial', color: 'text-yellow-300', accentColor: 'border-yellow-400/50',
    topMark: '✕ Aspa amarilla', lightPattern: 'Fl Y — Cualquier ritmo amarillo que no se confunda',
    lightColorClass: 'bg-yellow-300', lightAnimClass: 'animate-flash-rapid animate-glow-white', lightRgb: '253,224,71',
    description: 'Señala zonas o configuraciones especiales: cables, recreación, dragado, emisarios o separación de tráfico. No marca por sí sola un peligro a la navegación.',
    rule: 'Amarilla + aspa: consultá la carta para conocer el propósito.',
    bodyColor: '#facc15', topShape: 'x', topColor: '#facc15'
  },
  NUEVO_PELIGRO: {
    name: 'Nuevo Peligro / Naufragio', color: 'text-blue-300', accentColor: 'border-blue-400/50',
    topMark: '✚ Cruz amarilla vertical', lightPattern: 'Al B/Y 1s — Azul y amarilla alternadas',
    lightColorClass: 'bg-blue-400', lightAnimClass: 'animate-flash-iso animate-glow-white', lightRgb: '96,165,250',
    description: 'Marca de emergencia para un naufragio o peligro nuevo que todavía no figura adecuadamente en publicaciones. Franjas verticales azules y amarillas.',
    rule: 'Extremá precauciones, mantenete apartado y verificá Avisos a los Navegantes.',
    bodyColor: '#2563eb', stripeColors: ['#facc15'], stripeDir: 'vertical', topShape: 'cross', topColor: '#facc15'
  }
};

function BuoyTopMark({ shape, color }: { shape: string; color: string }) {
  if (shape === 'cylinder') return <rect x="26" y="4" width="28" height="18" rx="4" fill={color} />;
  if (shape === 'cone') return <polygon points="40,4 20,22 60,22" fill={color} />;
  if (shape === 'two-spheres') return (
    <>
      <circle cx="30" cy="10" r="9" fill="#0f172a" stroke="#475569" strokeWidth="1" />
      <circle cx="50" cy="10" r="9" fill="#0f172a" stroke="#475569" strokeWidth="1" />
    </>
  );
  if (shape === 'sphere') return <circle cx="40" cy="11" r="10" fill={color} />;
  if (shape === 'x') return <g stroke={color} strokeWidth="6"><line x1="25" y1="2" x2="55" y2="22"/><line x1="55" y1="2" x2="25" y2="22"/></g>;
  if (shape === 'cross') return <g stroke={color} strokeWidth="6"><line x1="40" y1="0" x2="40" y2="24"/><line x1="26" y1="12" x2="54" y2="12"/></g>;
  if (shape === 'north') return <g fill={color}><polygon points="40,0 25,15 55,15"/><polygon points="40,13 25,28 55,28"/></g>;
  if (shape === 'south') return <g fill={color}><polygon points="25,0 55,0 40,15"/><polygon points="25,13 55,13 40,28"/></g>;
  if (shape === 'east') return <g fill={color}><polygon points="25,0 55,0 40,15"/><polygon points="40,13 25,28 55,28"/></g>;
  if (shape === 'west') return <g fill={color}><polygon points="40,0 25,15 55,15"/><polygon points="25,13 55,13 40,28"/></g>;
  return null;
}

function BuoyBody({ bodyColor, stripeColors, stripeDir }: {
  bodyColor: string;
  stripeColors?: string[]; stripeDir?: 'horizontal' | 'vertical';
}) {
  return (
    <g>
      {/* Cuerpo principal */}
      <ellipse cx="40" cy="72" rx="24" ry="36" fill={bodyColor} />
      {/* Franjas */}
      {stripeDir === 'horizontal' && stripeColors?.map((c, i) => (
        <rect key={i} x="17" y={57 + i * 20} width="46" height="10" fill={c} rx="1" />
      ))}
      {stripeDir === 'vertical' && (
        <>
          <rect x="22" y="40" width="8" height="62" fill="#ffffff" rx="1" />
          <rect x="36" y="40" width="8" height="62" fill="#ffffff" rx="1" />
          <rect x="50" y="40" width="8" height="62" fill="#ffffff" rx="1" />
          {/* clip al cuerpo de la boya */}
          <ellipse cx="40" cy="72" rx="24" ry="36" fill="none" stroke={bodyColor} strokeWidth="2" />
        </>
      )}
      {/* Aro flotador */}
      <ellipse cx="40" cy="104" rx="28" ry="8" fill={bodyColor} opacity="0.7" />
      {/* Reflejo metálico */}
      <ellipse cx="32" cy="56" rx="6" ry="14" fill="white" opacity="0.07" />
    </g>
  );
}

function CardinalBands({ bands }: { bands: string[] }) {
  const height = 64 / bands.length;
  return (
    <g clipPath="url(#buoy-body-clip)">
      <defs><clipPath id="buoy-body-clip"><ellipse cx="40" cy="72" rx="24" ry="36" /></clipPath></defs>
      {bands.map((color, index) => <rect key={`${color}-${index}`} x="16" y={36 + index * height} width="48" height={height + 1} fill={color} />)}
      <ellipse cx="32" cy="56" rx="6" ry="14" fill="white" opacity="0.08" />
    </g>
  );
}

export const IalaBuoyViewer: React.FC = () => {
  const [isNight, setIsNight] = useState(true);
  const [selectedBuoy, setSelectedBuoy] = useState<BuoyType>('BABOR');
  const buoy = BUOY_DATA[selectedBuoy];

  return (
    <div className="h-full flex flex-col gap-2 overflow-hidden">
      {/* Controles */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 shrink-0">
        <button
          onClick={() => setIsNight(!isNight)}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            isNight ? 'bg-indigo-950 text-indigo-200 border border-indigo-800' : 'bg-sky-200 text-sky-900'
          }`}
        >
          {isNight ? <Moon size={13} /> : <Sun size={13} />}
          {isNight ? 'Modo Noche 🌙' : 'Modo Día ☀️'}
        </button>

        <div className="flex flex-wrap gap-1 max-w-[78%] justify-end">
          {(Object.keys(BUOY_DATA) as BuoyType[]).map(type => (
            <button
              key={type}
              onClick={() => setSelectedBuoy(type)}
              className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                selectedBuoy === type
                  ? 'bg-cyan-500 text-slate-950 shadow-md'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              {BUOY_DATA[type].name.split(' (')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Grid 2 cols */}
      <div className="grid md:grid-cols-12 gap-3 flex-1 min-h-0 overflow-hidden">

        {/* Canvas visual animado (7 cols) */}
        <div className={`md:col-span-7 rounded-2xl overflow-hidden border-2 h-full flex items-center justify-center relative transition-all duration-700 ${buoy.accentColor} ${
          isNight
            ? 'bg-gradient-to-b from-slate-950 via-blue-950/30 to-slate-900'
            : 'bg-gradient-to-b from-sky-300 via-sky-400 to-sky-500'
        }`}>

          {/* Estrellas (solo noche) */}
          {isNight && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[...Array(35)].map((_, i) => (
                <div
                  key={i}
                  className="star absolute rounded-full bg-white"
                  style={{
                    width: `${1 + (i % 3) * 0.8}px`,
                    height: `${1 + (i % 3) * 0.8}px`,
                    top: `${5 + (i * 17 % 50)}%`,
                    left: `${(i * 13 % 100)}%`,
                    '--dur': `${2 + (i % 4)}s`,
                    '--delay': `${(i % 6) * 0.5}s`,
                  } as React.CSSProperties}
                />
              ))}
            </div>
          )}

          {/* Agua */}
          <div className={`absolute bottom-0 w-full h-1/3 ${
            isNight ? 'bg-gradient-to-t from-slate-900 to-blue-950/60' : 'bg-gradient-to-t from-sky-600 to-sky-400/40'
          }`} />

          {/* Reflejo de luz en el agua (noche) */}
          {isNight && (
            <div
              className="absolute bottom-0 w-8 opacity-20 pointer-events-none"
              style={{
                height: '35%',
                left: 'calc(50% - 16px)',
                background: `radial-gradient(ellipse at top, rgba(${buoy.lightRgb}, 0.8) 0%, transparent 70%)`,
              }}
            />
          )}

          {/* BABOR: usa foto real */}
          {selectedBuoy === 'BABOR' ? (
            <div className="relative z-10 w-full h-full flex items-center justify-center p-2">
              <div className="animate-buoy-sway relative">
                <img
                  src={ialaBuoyImg}
                  alt="Boya de babor IALA Región B — roja"
                  className="h-56 md:h-72 object-contain drop-shadow-2xl"
                />
                {isNight && (
                  <div
                    className={`absolute -top-3 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full ${buoy.lightColorClass} ${buoy.lightAnimClass}`}
                  />
                )}
              </div>
            </div>
          ) : (
            /* Otras boyas: SVG animado */
            <div className="relative z-10 flex flex-col items-center justify-center gap-2">
              {/* Luz pulsante nocturna */}
              {isNight && (
                <div className={`w-5 h-5 rounded-full ${buoy.lightColorClass} ${buoy.lightAnimClass} mb-1`} />
              )}

              {/* Boya SVG con balanceo */}
              <div className="animate-buoy-sway">
                <svg viewBox="0 0 80 130" className="w-28 h-44 drop-shadow-2xl filter">
                  {/* Tope */}
                  <BuoyTopMark shape={buoy.topShape} color={buoy.topColor} />
                  {/* Varilla */}
                  <line x1="40" y1="23" x2="40" y2="38" stroke="#94a3b8" strokeWidth="2.5" />
                  {/* Cuerpo */}
                  <BuoyBody
                    bodyColor={buoy.bodyColor}
                    stripeColors={buoy.stripeColors}
                    stripeDir={buoy.stripeDir}
                  />
                  {buoy.bands && <CardinalBands bands={buoy.bands} />}
                  {/* Cadena de fondeo */}
                  <path d="M40,112 Q38,120 36,128" stroke="#64748b" strokeWidth="2" strokeDasharray="3,2" fill="none" />
                </svg>
              </div>

              {/* Ondas en el agua */}
              <div className="flex gap-1 opacity-40">
                {[0, 1, 2].map(i => (
                  <div
                    key={i}
                    className="border border-slate-400 rounded-full"
                    style={{
                      width: `${28 + i * 18}px`,
                      height: `${10 + i * 5}px`,
                      animation: `wave-calm ${2 + i * 0.4}s ease-in-out infinite ${i * 0.3}s`,
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Etiqueta de modo */}
          <div className={`absolute bottom-2 left-2 px-2 py-1 rounded-lg border text-[10px] font-bold backdrop-blur ${
            isNight
              ? 'bg-slate-950/80 border-indigo-900/60 text-indigo-300'
              : 'bg-white/70 border-sky-300 text-sky-800'
          }`}>
            {isNight ? '🌙 Vista Nocturna — Luz animada' : '☀️ Vista Diurna — Identificación visual'}
          </div>
        </div>

        {/* Panel explicativo (5 cols) */}
        <div className="md:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col gap-3 overflow-y-auto h-full">
          <div>
            <h3 className={`text-base font-extrabold ${buoy.color} mb-0.5`}>{buoy.name}</h3>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-2 text-xs">
            <div className="flex justify-between items-start gap-2">
              <span className="text-slate-400 shrink-0">Marca de Tope:</span>
              <span className="font-bold text-white text-right">{buoy.topMark}</span>
            </div>
            <div className="flex justify-between items-start gap-2 border-t border-slate-800 pt-2">
              <span className="text-slate-400 shrink-0">Ritmo Luminoso:</span>
              <span className="font-bold text-cyan-300 text-right text-[11px]">{buoy.lightPattern}</span>
            </div>
            {isNight && (
              <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                <div className={`w-3 h-3 rounded-full ${buoy.lightColorClass} ${buoy.lightAnimClass} shrink-0`} />
                <span className="text-slate-300 text-[10px]">Animación en tiempo real — patrón {buoy.lightPattern.split('—')[0].trim()}</span>
              </div>
            )}
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-[11px] text-slate-200 leading-relaxed">
            {buoy.description}
          </div>

          {/* Diferencia IALA A vs B */}
          {(selectedBuoy === 'BABOR' || selectedBuoy === 'ESTRIBOR') && (
            <div className="bg-slate-950 border border-slate-700 rounded-xl p-3 text-[11px]">
              <p className="font-bold text-slate-300 mb-2">🌍 IALA A (Europa) vs IALA B (América):</p>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-blue-950/60 rounded-lg p-2 text-center">
                  <p className="text-[9px] text-blue-400 font-bold uppercase">IALA A (Europa)</p>
                  <p className="text-[10px] text-slate-300 mt-1">🔴 Rojo → <strong>Estribor</strong> al entrar</p>
                  <p className="text-[10px] text-slate-300">🟢 Verde → <strong>Babor</strong> al entrar</p>
                </div>
                <div className="bg-emerald-950/60 rounded-lg p-2 text-center">
                  <p className="text-[9px] text-emerald-400 font-bold uppercase">IALA B (Arg 🇦🇷)</p>
                  <p className="text-[10px] text-slate-300 mt-1">🔴 Rojo → <strong>Babor</strong> al entrar</p>
                  <p className="text-[10px] text-slate-300">🟢 Verde → <strong>Estribor</strong> al entrar</p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-amber-500/10 border border-amber-500/25 rounded-xl p-3 text-[11px] text-amber-300 font-medium leading-relaxed mt-auto">
            {buoy.rule}
          </div>
        </div>
      </div>
    </div>
  );
};
