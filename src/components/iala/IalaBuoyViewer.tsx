import React, { useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import ialaBuoyImg from '../../assets/iala_buoy_babor.png';

type BuoyType = 'BABOR' | 'ESTRIBOR' | 'PELIGRO_AISLADO' | 'AGUAS_SEGURAS';

interface BuoyInfo {
  name: string;
  color: string;
  accentColor: string;
  topMark: string;
  lightPattern: string;
  lightColor: string;
  lightClass: string;
  description: string;
  rule: string;
  bgGradient: string;
}

const BUOY_DATA: Record<BuoyType, BuoyInfo> = {
  BABOR: {
    name: 'Boya de Babor (Región B)',
    color: 'text-red-400',
    accentColor: 'border-red-500/50',
    topMark: '🟥 Cilíndrica Roja',
    lightPattern: 'Fl R — Destello simple Rojo',
    lightColor: 'bg-red-500',
    lightClass: 'animate-[flash-single_2s_ease-in-out_infinite]',
    description: 'En IALA Región B (Sudamérica), al entrar a puerto dejes la boya ROJA a tu BABOR (izquierda). Esta boya marca el límite de la canal navegable por babor.',
    rule: '🇦🇷 Argentina usa IALA B: "ROJO a Babor al ENTRAR"',
    bgGradient: 'from-red-950/60 to-slate-950',
  },
  ESTRIBOR: {
    name: 'Boya de Estribor (Región B)',
    color: 'text-emerald-400',
    accentColor: 'border-emerald-500/50',
    topMark: '🔺 Cónica Verde',
    lightPattern: 'Fl G — Destello simple Verde',
    lightColor: 'bg-emerald-500',
    lightClass: 'animate-[flash-single_2s_ease-in-out_infinite]',
    description: 'En IALA Región B, al entrar a puerto dejes la boya VERDE a tu ESTRIBOR (derecha). Marca el límite de estribor del canal.',
    rule: '✅ Verde a Estribor al entrar. Lo opuesto a IALA A (Europa).',
    bgGradient: 'from-emerald-950/60 to-slate-950',
  },
  PELIGRO_AISLADO: {
    name: 'Peligro Aislado',
    color: 'text-white',
    accentColor: 'border-white/30',
    topMark: '⚫⚫ Dos Esferas Negras',
    lightPattern: 'Fl(2) W — Grupo de 2 destellos Blancos',
    lightColor: 'bg-white',
    lightClass: 'animate-[flash-double_3s_ease-in-out_infinite]',
    description: 'Señaliza un peligro aislado (bajo fondo, arrecife, pecio) rodeado de aguas navegables. Franjas horizontales negras y rojas alternadas.',
    rule: '⚠️ ESQUIVAR en todos los rumbos. Aguas libres alrededor pero peligro en el centro.',
    bgGradient: 'from-slate-800/60 to-slate-950',
  },
  AGUAS_SEGURAS: {
    name: 'Aguas Seguras (Midchannel)',
    color: 'text-cyan-400',
    accentColor: 'border-cyan-500/50',
    topMark: '🔴 Esfera Roja',
    lightPattern: 'Iso W — Isofásica Blanca',
    lightColor: 'bg-white',
    lightClass: 'animate-[flash-isophase_2s_ease-in-out_infinite]',
    description: 'Indica aguas navegables en los 360° alrededor. Franjas verticales rojas y blancas alternadas. Se coloca en el eje central del canal o en la entrada de un puerto.',
    rule: '✅ Seguro navegar en todos los rumbos. Puedes pasarla por cualquier costado.',
    bgGradient: 'from-cyan-950/60 to-slate-950',
  },
};


export const IalaBuoyViewer: React.FC = () => {
  const [isNight, setIsNight] = useState(true);
  const [selectedBuoy, setSelectedBuoy] = useState<BuoyType>('BABOR');

  const buoy = BUOY_DATA[selectedBuoy];

  return (
    <div className="h-full flex flex-col gap-2 overflow-hidden">
      {/* Controles Top */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 shrink-0">
        <button
          onClick={() => setIsNight(!isNight)}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            isNight ? 'bg-indigo-950 text-indigo-200 border border-indigo-800' : 'bg-sky-200 text-sky-900'
          }`}
        >
          {isNight ? <Moon size={13} /> : <Sun size={13} />}
          {isNight ? 'Modo Noche' : 'Modo Día'}
        </button>

        <div className="flex flex-wrap gap-1.5">
          {(Object.keys(BUOY_DATA) as BuoyType[]).map(type => (
            <button
              key={type}
              onClick={() => setSelectedBuoy(type)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
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

        {/* Visual Canvas (7 cols) */}
        <div className={`md:col-span-7 rounded-2xl overflow-hidden border h-full flex items-center justify-center relative transition-all duration-500 bg-gradient-to-b ${buoy.bgGradient} ${buoy.accentColor}`}>
          {isNight && (
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(30)].map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded-full bg-white"
                  style={{
                    width: `${1 + Math.random()}px`,
                    height: `${1 + Math.random()}px`,
                    top: `${Math.random() * 50}%`,
                    left: `${Math.random() * 100}%`,
                    opacity: 0.4 + Math.random() * 0.4,
                  }}
                />
              ))}
            </div>
          )}

          {/* Para Babor real: usar foto hiperrealista */}
          {selectedBuoy === 'BABOR' && (
            <div className="relative w-full h-full z-10">
              <img
                src={ialaBuoyImg}
                alt="Boya de babor IALA Región B — roja con marca de tope cilíndrica"
                className="w-full h-full object-contain p-2"
              />
              {isNight && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2">
                  <div className="w-4 h-4 rounded-full bg-red-500 shadow-[0_0_20px_8px_rgba(239,68,68,0.6)] animate-[flash-single_2s_ease-in-out_infinite]" />
                </div>
              )}
              <div className="absolute bottom-2 left-2 bg-slate-950/80 backdrop-blur px-2 py-1 rounded-lg border border-red-900/60 text-[10px] font-bold text-red-300">
                📷 Boya Real — Puerto Argentino
              </div>
            </div>
          )}

          {/* Para otras boyas: ilustración SVG compacta */}
          {selectedBuoy !== 'BABOR' && (
            <div className="relative z-10 flex flex-col items-center justify-center gap-3">
              {/* Luz nocturna */}
              {isNight && (
                <div className={`w-5 h-5 rounded-full ${buoy.lightColor} ${buoy.lightClass} shadow-[0_0_24px_10px_rgba(255,255,255,0.3)]`} />
              )}

              {/* Cuerpo de la boya SVG compacto */}
              <svg viewBox="0 0 80 120" className="w-28 h-36 drop-shadow-xl">
                {/* Tope de boya */}
                {selectedBuoy === 'ESTRIBOR' && (
                  <polygon points="40,5 20,25 60,25" fill="#16a34a" />
                )}
                {selectedBuoy === 'PELIGRO_AISLADO' && (
                  <>
                    <circle cx="30" cy="12" r="8" fill="#1e293b" />
                    <circle cx="50" cy="12" r="8" fill="#1e293b" />
                  </>
                )}
                {selectedBuoy === 'AGUAS_SEGURAS' && (
                  <circle cx="40" cy="12" r="10" fill="#dc2626" />
                )}
                {/* Palo */}
                <line x1="40" y1="25" x2="40" y2="50" stroke="#94a3b8" strokeWidth="2" />
                {/* Cuerpo de la boya */}
                {selectedBuoy === 'PELIGRO_AISLADO' && (
                  <>
                    <ellipse cx="40" cy="70" rx="22" ry="35" fill="#0f172a" />
                    <rect x="18" y="58" width="44" height="8" fill="#dc2626" rx="2" />
                    <rect x="18" y="74" width="44" height="8" fill="#dc2626" rx="2" />
                  </>
                )}
                {selectedBuoy === 'AGUAS_SEGURAS' && (
                  <>
                    <ellipse cx="40" cy="70" rx="22" ry="35" fill="#dc2626" />
                    {[...Array(4)].map((_, i) => (
                      <rect key={i} x={18 + i * 11} y="50" width="5" height="42" fill="white" rx="1" />
                    ))}
                  </>
                )}
                {selectedBuoy === 'ESTRIBOR' && (
                  <ellipse cx="40" cy="70" rx="22" ry="35" fill="#16a34a" />
                )}
                {/* Flotación */}
                <ellipse cx="40" cy="100" rx="26" ry="6" fill={
                  selectedBuoy === 'ESTRIBOR' ? '#166534' :
                  selectedBuoy === 'PELIGRO_AISLADO' ? '#1e293b' :
                  '#991b1b'
                } />
                {/* Agua */}
                <ellipse cx="40" cy="104" rx="30" ry="8" fill={isNight ? '#0c1a2e' : '#0ea5e9'} opacity="0.8" />
              </svg>

              <p className={`text-sm font-extrabold ${buoy.color} text-center px-4`}>
                {buoy.name}
              </p>
            </div>
          )}
        </div>

        {/* Panel Explicativo (5 cols) */}
        <div className="md:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col gap-3 overflow-y-auto h-full">
          <div>
            <h3 className={`text-base font-extrabold ${buoy.color} mb-0.5`}>{buoy.name}</h3>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Marca de Tope:</span>
              <span className="font-bold text-white">{buoy.topMark}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Ritmo Luminoso:</span>
              <span className="font-bold text-cyan-300">{buoy.lightPattern}</span>
            </div>
            {isNight && (
              <div className="flex items-center gap-2 pt-1 border-t border-slate-800">
                <div className={`w-3 h-3 rounded-full ${buoy.lightColor} animate-pulse`} />
                <span className="text-slate-300 text-[10px]">Luz activa — Modo noche</span>
              </div>
            )}
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-[11px] text-slate-200 leading-relaxed">
            {buoy.description}
          </div>

          <div className="bg-amber-500/10 border border-amber-500/25 rounded-xl p-3 text-[11px] text-amber-300 font-medium leading-relaxed mt-auto">
            {buoy.rule}
          </div>
        </div>
      </div>
    </div>
  );
};
