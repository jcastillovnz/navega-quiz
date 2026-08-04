import React, { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import portBuoy from '../../assets/iala_region_b_port_realistic.png';
import starboardBuoy from '../../assets/iala_region_b_starboard_realistic.png';
import cardinalNorth from '../../assets/iala_cardinal_n_realistic.png';
import cardinalEast from '../../assets/iala_cardinal_e_realistic.png';
import cardinalSouth from '../../assets/iala_cardinal_s_realistic.png';
import cardinalWest from '../../assets/iala_cardinal_w_realistic.png';
import isolatedDanger from '../../assets/iala_isolated_danger_realistic.png';
import safeWater from '../../assets/iala_safe_water_realistic.png';
import specialMark from '../../assets/iala_special_mark_realistic.png';
import newDanger from '../../assets/iala_new_danger_realistic.png';

type BuoyType =
  | 'BABOR' | 'ESTRIBOR'
  | 'CARDINAL_N' | 'CARDINAL_E' | 'CARDINAL_S' | 'CARDINAL_W'
  | 'PELIGRO_AISLADO' | 'AGUAS_SEGURAS' | 'ESPECIAL' | 'NUEVO_PELIGRO';

interface BuoyInfo {
  image: string;
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
    image: portBuoy,
    name: 'Boya de Babor (Región B)',
    color: 'text-emerald-400', accentColor: 'border-emerald-500/50',
    topMark: '🟩 Cilíndrica Verde',
    lightPattern: 'Fl G — Destello simple Verde',
    lightColorClass: 'bg-emerald-500', lightAnimClass: 'animate-flash-rapid animate-glow-green',
    lightRgb: '34,197,94',
    description: 'En IALA B, entrando desde el mar, la marca VERDE cilíndrica delimita el lado de BABOR del canal.',
    rule: '🇦🇷 Argentina · IALA B: VERDE a BABOR entrando',
    bodyColor: '#16a34a', topShape: 'cylinder', topColor: '#16a34a',
  },
  ESTRIBOR: {
    image: starboardBuoy,
    name: 'Boya de Estribor (Región B)',
    color: 'text-red-400', accentColor: 'border-red-500/50',
    topMark: '🔺 Cónica Roja',
    lightPattern: 'Fl R — Destello simple Rojo',
    lightColorClass: 'bg-red-500', lightAnimClass: 'animate-flash-rapid animate-glow-red',
    lightRgb: '239,68,68',
    description: 'En IALA B, entrando desde el mar, la marca ROJA cónica delimita el lado de ESTRIBOR del canal.',
    rule: '🇦🇷 Argentina · IALA B: ROJO a ESTRIBOR entrando',
    bodyColor: '#dc2626', topShape: 'cone', topColor: '#dc2626',
  },
  CARDINAL_N: {
    image: cardinalNorth,
    name: 'Cardinal Norte', color: 'text-amber-300', accentColor: 'border-amber-400/50',
    topMark: '▲ ▲ Dos conos hacia arriba', lightPattern: 'Q W o VQ W — Blanco continuo rápido',
    lightColorClass: 'bg-white', lightAnimClass: 'animate-iala-continuous animate-glow-white', lightRgb: '255,255,255',
    description: 'Las aguas seguras están al NORTE de la marca. Cuerpo negro sobre amarillo.',
    rule: 'Norte: conos arriba; pasá al norte. Ritmo continuo, como las 12 en punto.',
    bodyColor: '#facc15', topShape: 'north', topColor: '#0f172a', bands: ['#0f172a', '#facc15']
  },
  CARDINAL_E: {
    image: cardinalEast,
    name: 'Cardinal Este', color: 'text-amber-300', accentColor: 'border-amber-400/50',
    topMark: '▼ ▲ Conos con bases enfrentadas', lightPattern: 'Q(3) W 10s o VQ(3) W 5s',
    lightColorClass: 'bg-white', lightAnimClass: 'animate-iala-triple animate-glow-white', lightRgb: '255,255,255',
    description: 'Las aguas seguras están al ESTE. Bandas negro-amarillo-negro.',
    rule: 'Este = 3 destellos, como las 3 en el reloj.',
    bodyColor: '#0f172a', topShape: 'east', topColor: '#0f172a', bands: ['#0f172a', '#facc15', '#0f172a']
  },
  CARDINAL_S: {
    image: cardinalSouth,
    name: 'Cardinal Sur', color: 'text-amber-300', accentColor: 'border-amber-400/50',
    topMark: '▼ ▼ Dos conos hacia abajo', lightPattern: 'Q(6)+LFl W 15s o VQ(6)+LFl W 10s',
    lightColorClass: 'bg-white', lightAnimClass: 'animate-iala-six-long animate-glow-white', lightRgb: '255,255,255',
    description: 'Las aguas seguras están al SUR. Cuerpo amarillo sobre negro.',
    rule: 'Sur = 6 destellos más uno largo, como las 6 en el reloj.',
    bodyColor: '#0f172a', topShape: 'south', topColor: '#0f172a', bands: ['#facc15', '#0f172a']
  },
  CARDINAL_W: {
    image: cardinalWest,
    name: 'Cardinal Oeste', color: 'text-amber-300', accentColor: 'border-amber-400/50',
    topMark: '▲ ▼ Conos con puntas enfrentadas', lightPattern: 'Q(9) W 15s o VQ(9) W 10s',
    lightColorClass: 'bg-white', lightAnimClass: 'animate-iala-nine animate-glow-white', lightRgb: '255,255,255',
    description: 'Las aguas seguras están al OESTE. Bandas amarillo-negro-amarillo.',
    rule: 'Oeste = 9 destellos, como las 9 en el reloj.',
    bodyColor: '#facc15', topShape: 'west', topColor: '#0f172a', bands: ['#facc15', '#0f172a', '#facc15']
  },
  PELIGRO_AISLADO: {
    image: isolatedDanger,
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
    image: safeWater,
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
    image: specialMark,
    name: 'Marca Especial', color: 'text-yellow-300', accentColor: 'border-yellow-400/50',
    topMark: '✕ Aspa amarilla', lightPattern: 'Fl Y — Cualquier ritmo amarillo que no se confunda',
    lightColorClass: 'bg-yellow-300', lightAnimClass: 'animate-flash-rapid animate-glow-white', lightRgb: '253,224,71',
    description: 'Señala zonas o configuraciones especiales: cables, recreación, dragado, emisarios o separación de tráfico. No marca por sí sola un peligro a la navegación.',
    rule: 'Amarilla + aspa: consultá la carta para conocer el propósito.',
    bodyColor: '#facc15', topShape: 'x', topColor: '#facc15'
  },
  NUEVO_PELIGRO: {
    image: newDanger,
    name: 'Nuevo Peligro / Naufragio', color: 'text-blue-300', accentColor: 'border-blue-400/50',
    topMark: '✚ Cruz amarilla vertical', lightPattern: 'Al B/Y 1s — Azul y amarilla alternadas',
    lightColorClass: 'bg-blue-400', lightAnimClass: 'animate-iala-alternate-blue-yellow animate-glow-white', lightRgb: '96,165,250',
    description: 'Marca de emergencia para un naufragio o peligro nuevo que todavía no figura adecuadamente en publicaciones. Franjas verticales azules y amarillas.',
    rule: 'Extremá precauciones, mantenete apartado y verificá Avisos a los Navegantes.',
    bodyColor: '#2563eb', stripeColors: ['#facc15'], stripeDir: 'vertical', topShape: 'cross', topColor: '#facc15'
  }
};

export const IalaBuoyViewer: React.FC<{ compact?: boolean; focusType?: BuoyType }> = ({ compact = false, focusType }) => {
  const [isNight, setIsNight] = useState(true);
  const [selectedBuoy, setSelectedBuoy] = useState<BuoyType>(focusType ?? 'BABOR');
  const buoy = BUOY_DATA[selectedBuoy];

  useEffect(() => {
    if (focusType) setSelectedBuoy(focusType);
  }, [focusType]);

  if (compact) {
    return (
      <figure className="h-full min-h-0 grid grid-cols-2 gap-1.5 bg-slate-950 overflow-hidden" aria-label={`${buoy.name}, comparación diurna y nocturna`}>
        {(['DAY', 'NIGHT'] as const).map(mode => {
          const night = mode === 'NIGHT';
          return <div key={mode} className={`relative min-h-0 overflow-hidden rounded-xl border ${night ? 'border-indigo-500/40 bg-gradient-to-b from-slate-950 via-indigo-950 to-blue-950' : 'border-sky-300/50 bg-gradient-to-b from-sky-200 via-sky-400 to-sky-700'}`}>
            {night && <div className="absolute inset-0 opacity-70">{[...Array(18)].map((_,i)=><i key={i} className="star absolute rounded-full bg-white" style={{width:2,height:2,top:`${8+(i*23)%58}%`,left:`${5+(i*31)%90}%`}} />)}</div>}
            <div className={`absolute bottom-0 inset-x-0 h-[30%] ${night ? 'bg-blue-950/80' : 'bg-cyan-700/70'}`} />
            <div className="absolute inset-0 p-5 flex items-center justify-center">
              <div className="relative h-full w-full flex items-center justify-center animate-buoy-sway">
                <img src={buoy.image} alt={`${buoy.name}, vista ${night?'nocturna':'diurna'}`} className={`h-full w-full object-contain drop-shadow-2xl ${night?'brightness-[.28] saturate-[.7] contrast-125':''}`} />
                {night && <div className={`question-light-animation absolute top-[13%] left-1/2 -translate-x-1/2 w-5 h-5 rounded-full ${buoy.lightColorClass} ${buoy.lightAnimClass}`} aria-label={buoy.lightPattern} />}
              </div>
            </div>
            <div className={`absolute left-2 right-2 bottom-2 rounded-lg px-2 py-1.5 backdrop-blur ${night?'bg-slate-950/85':'bg-white/85'}`}>
              <p className={`text-[10px] font-black ${night?'text-indigo-200':'text-sky-950'}`}>{night?'NOCHE · LUZ ANIMADA':'DÍA · FORMA Y COLORES'}</p>
              <p className={`truncate text-[9px] ${night?'text-slate-200':'text-slate-800'}`}>{night?buoy.lightPattern:buoy.topMark}</p>
            </div>
          </div>;
        })}
      </figure>
    );
  }

  return (
    <div className="h-full flex flex-col gap-2 overflow-hidden">
      {/* Controles */}
      {!compact && <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 shrink-0">
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
      </div>}

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

          <div className="relative z-10 w-full h-full flex items-center justify-center p-2">
            <div className="animate-buoy-sway relative h-full w-full flex items-center justify-center">
              <img
                src={buoy.image}
                alt={`${buoy.name}: ${buoy.description}`}
                className={`max-h-full max-w-full object-contain rounded-xl drop-shadow-2xl transition-[filter] duration-500 ${isNight ? 'brightness-[.32] saturate-[.75] contrast-125' : ''}`}
              />
              {isNight && <div className="absolute inset-0 rounded-xl bg-indigo-950/25 pointer-events-none" />}
              {isNight && (
                <div
                  className={`question-light-animation absolute top-[13%] left-1/2 -translate-x-1/2 w-5 h-5 rounded-full ${buoy.lightColorClass} ${buoy.lightAnimClass}`}
                  aria-label={`Luz: ${buoy.lightPattern}`}
                />
              )}
            </div>
          </div>

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
        {!compact && <div className="md:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col gap-3 overflow-y-auto h-full">
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
                <div className={`question-light-animation w-3 h-3 rounded-full ${buoy.lightColorClass} ${buoy.lightAnimClass} shrink-0`} />
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
                  <p className="text-[10px] text-slate-300 mt-1">🟢 Verde → <strong>Estribor</strong> al entrar</p>
                  <p className="text-[10px] text-slate-300">🔴 Rojo → <strong>Babor</strong> al entrar</p>
                </div>
                <div className="bg-emerald-950/60 rounded-lg p-2 text-center">
                  <p className="text-[9px] text-emerald-400 font-bold uppercase">IALA B (Arg 🇦🇷)</p>
                  <p className="text-[10px] text-slate-300 mt-1">🟢 Verde → <strong>Babor</strong> al entrar</p>
                  <p className="text-[10px] text-slate-300">🔴 Rojo → <strong>Estribor</strong> al entrar</p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-amber-500/10 border border-amber-500/25 rounded-xl p-3 text-[11px] text-amber-300 font-medium leading-relaxed mt-auto">
            {buoy.rule}
          </div>
        </div>}
      </div>
    </div>
  );
};
