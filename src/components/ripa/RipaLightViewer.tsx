import React, { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import ripaBowImg from '../../assets/ripa_lights_bow.png';

type Perspective = 'PROA' | 'POPA' | 'BABOR' | 'ESTRIBOR';
type ShipType = 'MOTOR' | 'VELA';

interface LightDot {
  color: string;
  glowClass: string;
  label: string;
  top: string;
  left: string;
  size?: string;
}

function getVisibleLights(perspective: Perspective, shipType: ShipType): LightDot[] {
  const lights: LightDot[] = [];
  const isMotor = shipType === 'MOTOR';

  if (perspective === 'PROA') {
    if (isMotor) lights.push({ color: 'bg-white', glowClass: 'animate-glow-white', label: 'Tope', top: '18%', left: '48%', size: 'w-4 h-4' });
    lights.push({ color: 'bg-red-500', glowClass: 'animate-glow-red', label: 'Babor', top: '52%', left: '22%' });
    lights.push({ color: 'bg-emerald-500', glowClass: 'animate-glow-green', label: 'Estribor', top: '52%', left: '74%' });
  }
  if (perspective === 'POPA') {
    lights.push({ color: 'bg-white', glowClass: 'animate-glow-white', label: 'Alcance', top: '40%', left: '48%', size: 'w-5 h-5' });
  }
  if (perspective === 'BABOR') {
    lights.push({ color: 'bg-red-500', glowClass: 'animate-glow-red', label: 'Babor', top: '50%', left: '72%' });
    if (isMotor) lights.push({ color: 'bg-white', glowClass: 'animate-glow-white', label: 'Tope', top: '18%', left: '55%' });
  }
  if (perspective === 'ESTRIBOR') {
    lights.push({ color: 'bg-emerald-500', glowClass: 'animate-glow-green', label: 'Estribor', top: '50%', left: '25%' });
    if (isMotor) lights.push({ color: 'bg-white', glowClass: 'animate-glow-white', label: 'Tope', top: '18%', left: '42%' });
  }
  return lights;
}

const PERSPECTIVE_INFO: Record<Perspective, {
  label: string;
  lights: { emoji: string; color: string; name: string; rule: string }[];
  tip: string;
}> = {
  PROA: {
    label: 'Vista de Proa (0°)',
    lights: [
      { emoji: '⚪', color: 'text-white', name: 'Tope (Blanca) — solo motor', rule: 'Visible 225° desde proa. Indica propulsión mecánica activa.' },
      { emoji: '🔴', color: 'text-red-400', name: 'Babor (Roja)', rule: 'Visible 112.5° en banda izquierda. "Si ves rojo = sos vos quien puede avanzar."' },
      { emoji: '🟢', color: 'text-emerald-400', name: 'Estribor (Verde)', rule: 'Visible 112.5° en banda derecha. "Si ves verde = cedés el paso."' },
    ],
    tip: '⚠️ Ver rojo Y verde juntos = crucé de frente. El que tiene el verde del otro por su estribor CEDE.',
  },
  POPA: {
    label: 'Vista de Popa (180°)',
    lights: [
      { emoji: '⚪', color: 'text-white', name: 'Alcance (Blanca)', rule: 'Visible 135° desde la popa. Solo se ve cuando el barco se aleja de vos.' },
    ],
    tip: '💡 Ver solo blanco de popa = el barco se aleja. No hay situación de cruce. No aplica regla de paso.',
  },
  BABOR: {
    label: 'Vista de Babor (izquierda)',
    lights: [
      { emoji: '🔴', color: 'text-red-400', name: 'Roja de Babor', rule: 'Estás viendo la banda izquierda del barco. Vos tenés prioridad de paso.' },
      { emoji: '⚪', color: 'text-white', name: 'Tope (Blanca) — motor', rule: 'Visible si el barco tiene propulsión mecánica activa.' },
    ],
    tip: '🚨 Ves luz roja del otro = estás en su babor. Vos tenés PASO PREFERENTE.',
  },
  ESTRIBOR: {
    label: 'Vista de Estribor (derecha)',
    lights: [
      { emoji: '🟢', color: 'text-emerald-400', name: 'Verde de Estribor', rule: 'Estás viendo la banda derecha del barco. Él tiene prioridad, VOS cedés.' },
      { emoji: '⚪', color: 'text-white', name: 'Tope (Blanca) — motor', rule: 'Visible si el barco tiene propulsión mecánica activa.' },
    ],
    tip: '⚠️ Ves luz verde del otro = estás en su estribor. Él tiene PASO PREFERENTE — VOS cedés.',
  },
};

export const RipaLightViewer: React.FC<{
  compact?: boolean;
  focusShipType?: ShipType;
  focusPerspective?: Perspective;
}> = ({ compact = false, focusShipType, focusPerspective }) => {
  const [isNight, setIsNight] = useState(true);
  const [perspective, setPerspective] = useState<Perspective>('PROA');
  const [shipType, setShipType] = useState<ShipType>('MOTOR');

  const info = PERSPECTIVE_INFO[perspective];
  const visibleLights = getVisibleLights(perspective, shipType);

  useEffect(() => {
    if (focusShipType) setShipType(focusShipType);
    if (focusPerspective) setPerspective(focusPerspective);
  }, [focusShipType, focusPerspective]);

  return (
    <div className="h-full flex flex-col gap-2 overflow-hidden">
      {/* Controles compactos */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 shrink-0">
        <button
          onClick={() => setIsNight(!isNight)}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            isNight ? 'bg-indigo-950 text-indigo-200 border border-indigo-800' : 'bg-sky-200 text-sky-900'
          }`}
        >
          {isNight ? <Moon size={13} /> : <Sun size={13} />}
          {isNight ? 'Noche 🌙' : 'Día ☀️'}
        </button>

        <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
          {(['MOTOR', 'VELA'] as ShipType[]).map(t => (
            <button key={t} onClick={() => setShipType(t)}
              className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                shipType === t ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
              }`}>
              {t === 'MOTOR' ? '⚙️ Motor' : '⛵ Vela'}
            </button>
          ))}
        </div>

        <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
          {(['PROA', 'BABOR', 'ESTRIBOR', 'POPA'] as Perspective[]).map(p => (
            <button key={p} onClick={() => setPerspective(p)}
              className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                perspective === p ? 'bg-slate-700 text-cyan-300 border border-slate-600' : 'text-slate-400 hover:text-slate-200'
              }`}>
              {p.charAt(0) + p.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Grid 2 cols */}
      <div className="grid md:grid-cols-12 gap-3 flex-1 min-h-0 overflow-hidden">

        {/* Canvas visual animado (7 cols) */}
        <div className={`${compact ? 'md:col-span-12' : 'md:col-span-7'} rounded-2xl overflow-hidden border h-full flex items-center justify-center relative transition-all duration-700 ${
          isNight
            ? 'bg-gradient-to-b from-slate-950 via-blue-950/20 to-slate-900 border-slate-800'
            : 'bg-gradient-to-b from-sky-200 to-sky-500 border-sky-400'
        }`}>

          {/* Estrellas nocturnas animadas */}
          {isNight && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[...Array(40)].map((_, i) => (
                <div key={i} className="star absolute rounded-full bg-white"
                  style={{
                    width: `${1 + (i % 3) * 0.7}px`, height: `${1 + (i % 3) * 0.7}px`,
                    top: `${(i * 17 % 60)}%`, left: `${(i * 13 % 100)}%`,
                    '--dur': `${2 + (i % 5)}s`, '--delay': `${(i % 7) * 0.4}s`,
                  } as React.CSSProperties}
                />
              ))}
            </div>
          )}

          {/* Agua con reflejo */}
          <div className={`absolute bottom-0 w-full h-1/3 ${
            isNight ? 'bg-gradient-to-t from-slate-900 to-blue-950/50' : 'bg-gradient-to-t from-sky-600/70 to-transparent'
          }`} />

          {/* PROA noche: usa la foto real con luces CSS superpuestas */}
          {perspective === 'PROA' && isNight ? (
            <div className="relative z-10 w-full h-full flex items-center justify-center p-2">
              <div className="animate-ship-bob relative">
                <img
                  src={ripaBowImg}
                  alt="Vista de proa con luces RIPA nocturnas"
                  className="h-64 md:h-80 object-contain rounded-xl"
                />
                {visibleLights.map((light, i) => (
                  <div
                    key={i}
                    className={`question-light-animation absolute rounded-full ${light.color} ${light.glowClass} ${light.size ?? 'w-3.5 h-3.5'}`}
                    style={{ top: light.top, left: light.left, transform: 'translate(-50%, -50%)' }}
                    title={light.label}
                  />
                ))}
              </div>
            </div>
          ) : (
            /* Otras perspectivas: silueta SVG con luces CSS animadas */
            <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">
              <div className="relative animate-ship-bob">
                {/* Silueta del buque SVG */}
                <svg
                  viewBox="0 0 200 160"
                  className="w-48 md:w-64 h-36 md:h-48"
                  style={{ transform: perspective === 'BABOR' ? 'scaleX(-1)' : 'none' }}
                >
                  {perspective === 'PROA' || perspective === 'POPA' ? (
                    /* Vista frontal/trasera */
                    <g>
                      <polygon points="100,20 60,100 140,100" fill={isNight ? '#1e293b' : '#475569'} />
                      <rect x="60" y="100" width="80" height="40" rx="4" fill={isNight ? '#0f172a' : '#334155'} />
                      <rect x="80" y="88" width="40" height="14" fill={isNight ? '#1e293b' : '#64748b'} />
                      {/* Palo */}
                      <line x1="100" y1="20" x2="100" y2="5" stroke={isNight ? '#334155' : '#64748b'} strokeWidth="3" />
                    </g>
                  ) : (
                    /* Vista lateral */
                    <g>
                      <polygon points="30,90 170,90 155,60 50,60 30,90" fill={isNight ? '#0f172a' : '#334155'} />
                      <rect x="60" y="40" width="80" height="22" rx="3" fill={isNight ? '#1e293b' : '#475569'} />
                      <line x1="90" y1="60" x2="90" y2="15" stroke={isNight ? '#334155' : '#64748b'} strokeWidth="3" />
                      <path d="M90,15 L130,30" stroke={isNight ? '#475569' : '#94a3b8'} strokeWidth="1.5" />
                      <path d="M90,15 L50,40" stroke={isNight ? '#475569' : '#94a3b8'} strokeWidth="1.5" />
                    </g>
                  )}
                </svg>

                {/* Luces CSS animadas superpuestas */}
                {isNight && visibleLights.map((light, i) => (
                  <div
                    key={i}
                    className={`question-light-animation absolute rounded-full ${light.color} ${light.glowClass} ${light.size ?? 'w-3.5 h-3.5'}`}
                    style={{ top: light.top, left: light.left, transform: 'translate(-50%, -50%)' }}
                    title={light.label}
                  />
                ))}

                {/* Modo día: etiqueta de identificación */}
                {!isNight && (
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white/90 text-slate-800 text-[10px] px-2.5 py-1 rounded-lg font-bold shadow-md whitespace-nowrap">
                    {shipType === 'VELA' ? '⛵ Velero — Identif. por velas' : '⚙️ A motor — Conos de señal'}
                  </div>
                )}
              </div>

              {/* Ondas en el agua */}
              {[0, 1, 2].map(i => (
                <div key={i} className={`absolute bottom-8 rounded-full border ${isNight ? 'border-blue-900/40' : 'border-sky-300/50'}`}
                  style={{
                    width: `${60 + i * 40}px`, height: `${20 + i * 12}px`,
                    left: '50%', transform: 'translateX(-50%)',
                    animation: `wave-calm ${2.5 + i * 0.5}s ease-in-out infinite ${i * 0.4}s`,
                  }}
                />
              ))}
            </div>
          )}

          {/* Indicador de perspectiva */}
          <div className={`absolute top-2 right-2 px-2 py-1 rounded-lg border text-[10px] font-bold backdrop-blur ${
            isNight ? 'bg-slate-950/80 border-indigo-900 text-indigo-300' : 'bg-white/70 border-sky-300 text-sky-800'
          }`}>
            {info.label}
          </div>
        </div>

        {/* Panel explicativo (5 cols) */}
        {!compact && <div className="md:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col gap-3 overflow-y-auto h-full">
          <div>
            <h3 className="text-base font-extrabold text-white mb-0.5">{info.label}</h3>
            <p className="text-[10px] text-slate-500">
              {shipType === 'VELA' ? '⛵ Sin luz de tope cuando navega solo a vela' : '⚙️ Buque a motor — Tope siempre encendida'}
            </p>
          </div>

          <div className="space-y-2">
            {info.lights
              .filter(l => !(shipType === 'VELA' && l.name.includes('motor')))
              .map((l, i) => (
                <div key={i} className="bg-slate-950 border border-slate-800 rounded-xl p-3">
                  <p className={`text-xs font-extrabold ${l.color} mb-1`}>{l.emoji} {l.name}</p>
                  <p className="text-[11px] text-slate-300 leading-relaxed">{l.rule}</p>
                </div>
              ))}
          </div>

          {/* Mini diagrama de sectores angulares */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Sectores de Visibilidad</p>
            <div className="relative w-32 h-32 mx-auto">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                {/* Verde Estribor 112.5° */}
                <path d="M50,50 L50,5 A45,45 0 0,1 92,69 Z" fill="#16a34a" opacity="0.3" />
                <path d="M50,50 L50,5 A45,45 0 0,1 92,69 Z" fill="none" stroke="#16a34a" strokeWidth="1" />
                {/* Rojo Babor 112.5° */}
                <path d="M50,50 L50,5 A45,45 0 0,0 8,69 Z" fill="#dc2626" opacity="0.3" />
                <path d="M50,50 L50,5 A45,45 0 0,0 8,69 Z" fill="none" stroke="#dc2626" strokeWidth="1" />
                {/* Blanco Alcance 135° */}
                <path d="M50,50 L8,69 A45,45 0 0,0 92,69 Z" fill="#ffffff" opacity="0.12" />
                <path d="M50,50 L8,69 A45,45 0 0,0 92,69 Z" fill="none" stroke="#ffffff" strokeWidth="1" />
                {/* Blanco Tope 225° */}
                {shipType === 'MOTOR' && (
                  <>
                    <path d="M50,50 L8,69 A45,45 0 1,1 92,69 Z" fill="#ffffff" opacity="0.06" />
                    <text x="50" y="30" textAnchor="middle" className="text-white" fontSize="8" fill="white">⚪ 225°</text>
                  </>
                )}
                <circle cx="50" cy="50" r="5" fill="#334155" />
                {/* Etiquetas */}
                <text x="75" y="45" fontSize="7" fill="#16a34a" fontWeight="bold">🟢</text>
                <text x="18" y="45" fontSize="7" fill="#dc2626" fontWeight="bold">🔴</text>
                <text x="42" y="85" fontSize="7" fill="#94a3b8">⚪ 135°</text>
              </svg>
            </div>
          </div>

          <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-3 text-[11px] text-cyan-300 font-medium leading-relaxed mt-auto">
            {info.tip}
          </div>
        </div>}
      </div>
    </div>
  );
};
