import React, { useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import ripaBowImg from '../../assets/ripa_lights_bow.png';

type Perspective = 'PROA' | 'POPA' | 'BABOR' | 'ESTRIBOR';
type ShipType = 'MOTOR' | 'VELA';

const PERSPECTIVE_INFO: Record<Perspective, {
  label: string;
  lights: { emoji: string; color: string; name: string; rule: string }[];
  tip: string;
}> = {
  PROA: {
    label: 'Vista de Proa',
    lights: [
      { emoji: '⚪', color: 'text-white', name: 'Luz de Tope (Blanca)', rule: 'Visible 225° hacia proa. Solo en buques a motor.' },
      { emoji: '🔴', color: 'text-red-400', name: 'Babor (Roja)', rule: 'Banda izquierda, visible 112.5°. "Rojo = Babor".' },
      { emoji: '🟢', color: 'text-emerald-400', name: 'Estribor (Verde)', rule: 'Banda derecha, visible 112.5°. "Verde = Estribor".' },
    ],
    tip: '⚠️ Ver rojo y verde de frente = situación de cruce. El que tiene verde por estribor CEDE el paso.',
  },
  POPA: {
    label: 'Vista de Popa',
    lights: [
      { emoji: '⚪', color: 'text-white', name: 'Luz de Alcance (Blanca)', rule: 'Visible 135° desde la popa. Indica que el barco te adelanta.' },
    ],
    tip: '💡 Solo ves blanco de popa = el barco se aleja de vos. No hay cruce: no hay regla de paso.',
  },
  BABOR: {
    label: 'Vista de Babor',
    lights: [
      { emoji: '🔴', color: 'text-red-400', name: 'Luz Roja de Babor', rule: 'Visible desde el sector de babor (0°–112.5°). Otro barco te ve la banda izquierda.' },
      { emoji: '⚪', color: 'text-white', name: 'Tope (Blanca)', rule: 'Visible si el barco es a motor. Indica propulsión mecánica activa.' },
    ],
    tip: '🚨 Si ves luz roja de otro barco = estás en su sector de babor. Vos tenés prioridad de paso.',
  },
  ESTRIBOR: {
    label: 'Vista de Estribor',
    lights: [
      { emoji: '🟢', color: 'text-emerald-400', name: 'Luz Verde de Estribor', rule: 'Visible desde el sector de estribor (0°–112.5°). Otro barco te ve la banda derecha.' },
      { emoji: '⚪', color: 'text-white', name: 'Tope (Blanca)', rule: 'Visible si el barco es a motor.' },
    ],
    tip: '⚠️ Si ves luz verde de otro barco = estás en su sector de estribor. Él tiene prioridad, VOS cedés.',
  },
};

export const RipaLightViewer: React.FC = () => {
  const [isNight, setIsNight] = useState(true);
  const [perspective, setPerspective] = useState<Perspective>('PROA');
  const [shipType, setShipType] = useState<ShipType>('MOTOR');

  const info = PERSPECTIVE_INFO[perspective];

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

        <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
          {(['MOTOR', 'VELA'] as ShipType[]).map(t => (
            <button
              key={t}
              onClick={() => setShipType(t)}
              className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                shipType === t ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {t === 'MOTOR' ? '⚙️ A Motor' : '⛵ A Vela'}
            </button>
          ))}
        </div>

        <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
          {(['PROA', 'BABOR', 'ESTRIBOR', 'POPA'] as Perspective[]).map(p => (
            <button
              key={p}
              onClick={() => setPerspective(p)}
              className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                perspective === p ? 'bg-slate-700 text-cyan-300 border border-slate-600' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {p.charAt(0) + p.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Grid 2 cols */}
      <div className="grid md:grid-cols-12 gap-3 flex-1 min-h-0 overflow-hidden">

        {/* Canvas Visual (7 cols) */}
        <div className={`md:col-span-7 rounded-2xl overflow-hidden border h-full flex flex-col items-center justify-center relative transition-all duration-500 ${
          isNight ? 'bg-slate-950 border-slate-800' : 'bg-gradient-to-b from-sky-300 to-sky-500 border-sky-400'
        }`}>
          {/* Fondo nocturno con estrellas */}
          {isNight && (
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(40)].map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded-full bg-white opacity-60"
                  style={{
                    width: `${1 + Math.random() * 2}px`,
                    height: `${1 + Math.random() * 2}px`,
                    top: `${Math.random() * 60}%`,
                    left: `${Math.random() * 100}%`,
                  }}
                />
              ))}
            </div>
          )}

          {/* Imagen hiperrealista o ilustración de día */}
          <div className="relative z-10 w-full h-full flex items-center justify-center p-2">
            {isNight ? (
              <div className="relative w-full h-full">
                <img
                  src={ripaBowImg}
                  alt={`Buque visto desde ${perspective} con luces de navegación RIPA encendidas`}
                  className="w-full h-full object-contain rounded-xl"
                  style={{
                    filter: perspective === 'POPA'
                      ? 'hue-rotate(180deg) brightness(0.85)'
                      : perspective === 'BABOR'
                      ? 'hue-rotate(330deg) brightness(0.9)'
                      : perspective === 'ESTRIBOR'
                      ? 'hue-rotate(120deg) brightness(0.9)'
                      : 'none',
                  }}
                />
                <div className="absolute bottom-2 left-2 bg-slate-950/80 backdrop-blur px-2 py-1 rounded-lg border border-indigo-900 text-[10px] font-bold text-indigo-300">
                  🌙 {info.label} — {shipType === 'MOTOR' ? 'Buque a Motor' : 'Velero'}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-4 text-center p-6">
                <div className="text-7xl">⛵</div>
                <div className="bg-white/80 rounded-xl px-4 py-2 text-slate-800 text-sm font-bold shadow-md">
                  Vista Diurna — {shipType === 'MOTOR' ? 'Buque a Motor' : 'Velero'}<br />
                  <span className="text-xs font-normal">De día: identifica por silueta y marcas visuales</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Panel explicativo (5 cols) */}
        <div className="md:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col gap-3 overflow-y-auto h-full">
          <div>
            <h3 className="text-base font-extrabold text-white mb-0.5">
              {info.label}
            </h3>
            <p className="text-xs text-slate-400 font-medium">
              {shipType === 'VELA' ? '⛵ Velero — Sin luz de tope cuando navega a vela' : '⚙️ Buque a motor'}
            </p>
          </div>

          <div className="space-y-2">
            {info.lights
              .filter(l => shipType === 'VELA' && l.name.includes('Tope') ? false : true)
              .map((l, i) => (
                <div key={i} className="bg-slate-950 border border-slate-800 rounded-xl p-3">
                  <p className={`text-xs font-extrabold ${l.color} mb-1`}>
                    {l.emoji} {l.name}
                  </p>
                  <p className="text-[11px] text-slate-300 leading-relaxed">{l.rule}</p>
                </div>
              ))}
          </div>

          <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-3 text-[11px] text-cyan-300 font-medium leading-relaxed mt-auto">
            {info.tip}
          </div>
        </div>
      </div>
    </div>
  );
};
