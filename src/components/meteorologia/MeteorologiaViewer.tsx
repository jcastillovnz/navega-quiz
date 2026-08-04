import React, { useState } from 'react';
import { Wind, Cloud, CloudRain, Zap, Sun, Waves } from 'lucide-react';

interface BeaufortStep {
  force: number;
  name: string;
  knotsRange: string;
  knotsMax: number;
  description: string;
  waveClass: string;
  icon: 'calm' | 'light' | 'moderate' | 'fresh' | 'strong' | 'gale' | 'storm' | 'hurricane';
}

const BEAUFORT: BeaufortStep[] = [
  { force: 0, name: 'Calma', knotsRange: '< 1', knotsMax: 1, description: 'Mar como espejo. Humo sube vertical.', waveClass: 'animate-[wave-calm_4s_ease-in-out_infinite]', icon: 'calm' },
  { force: 1, name: 'Ventolina', knotsRange: '1-3', knotsMax: 3, description: 'Pequeñas olas sin espuma.', waveClass: 'animate-[wave-calm_4s_ease-in-out_infinite]', icon: 'calm' },
  { force: 2, name: 'Brisa muy débil', knotsRange: '4-6', knotsMax: 6, description: 'Olas pequeñas, no rompen.', waveClass: 'animate-[wave-calm_3.5s_ease-in-out_infinite]', icon: 'light' },
  { force: 3, name: 'Brisa débil', knotsRange: '7-10', knotsMax: 10, description: 'Olas medianas, comienzan a romper.', waveClass: 'animate-[wave-moderate_3s_ease-in-out_infinite]', icon: 'light' },
  { force: 4, name: 'Brisa moderada', knotsRange: '11-16', knotsMax: 16, description: 'Olas moderadas, nombreux whitecaps.', waveClass: 'animate-[wave-moderate_2.5s_ease-in-out_infinite]', icon: 'moderate' },
  { force: 5, name: 'Brisa fresca', knotsRange: '17-21', knotsMax: 21, description: 'Olas alargadas, salpicaduras.', waveClass: 'animate-[wave-moderate_2s_ease-in-out_infinite]', icon: 'moderate' },
  { force: 6, name: 'Brisa fuerte', knotsRange: '22-27', knotsMax: 27, description: 'Mar gruesa, crestas blancas generalizadas.', waveClass: 'animate-[wave-strong_1.8s_ease-in-out_infinite]', icon: 'fresh' },
  { force: 7, name: 'Viento fuerte (Near Gale)', knotsRange: '28-33', knotsMax: 33, description: 'Mar muy gruesa, espuma arrastrada.', waveClass: 'animate-[wave-strong_1.5s_ease-in-out_infinite]', icon: 'strong' },
  { force: 8, name: 'Temporal (Gale)', knotsRange: '34-40', knotsMax: 40, description: 'Olas altas, rompientes en franjas.', waveClass: 'animate-[wave-strong_1.2s_ease-in-out_infinite]', icon: 'gale' },
  { force: 9, name: 'Temporal fuerte (Strong Gale)', knotsRange: '41-47', knotsMax: 47, description: 'Olas muy altas, visibilidad reducida por spray.', waveClass: 'animate-[wave-extreme_1.2s_ease-in-out_infinite]', icon: 'gale' },
  { force: 10, name: 'Tormenta (Storm)', knotsRange: '48-55', knotsMax: 55, description: 'Olas enormes, mar completamente blanca.', waveClass: 'animate-[wave-extreme_1s_ease-in-out_infinite]', icon: 'storm' },
  { force: 11, name: 'Tormenta violenta', knotsRange: '56-63', knotsMax: 63, description: 'Mar excepcionalmente alta, buques pequeños desaparecen.', waveClass: 'animate-[wave-extreme_0.8s_ease-in-out_infinite]', icon: 'storm' },
  { force: 12, name: 'Huracán', knotsRange: '> 64', knotsMax: 200, description: 'Aire lleno de espuma, mar completamente blanca.', waveClass: 'animate-[wave-extreme_0.5s_ease-in-out_infinite]', icon: 'hurricane' }
];

const BEAUFORT_ICONS: Record<BeaufortStep['icon'], React.ReactNode> = {
  calm: <Sun className="w-6 h-6" />,
  light: <Wind className="w-6 h-6" />,
  moderate: <Cloud className="w-6 h-6" />,
  fresh: <Cloud className="w-6 h-6" />,
  strong: <CloudRain className="w-6 h-6" />,
  gale: <CloudRain className="w-6 h-6" />,
  storm: <Zap className="w-6 h-6" />,
  hurricane: <Zap className="w-6 h-6" />
};

const BEAUFORT_COLORS: Record<BeaufortStep['icon'], string> = {
  calm: 'text-amber-300',
  light: 'text-cyan-300',
  moderate: 'text-cyan-400',
  fresh: 'text-blue-400',
  strong: 'text-blue-500',
  gale: 'text-indigo-400',
  storm: 'text-purple-400',
  hurricane: 'text-rose-500'
};

type Phenomenon = 'PAMPERO' | 'SUDESTADA';

const PHENOMENA: Record<Phenomenon, { title: string; color: string; description: string; visual: 'pampero' | 'sudestada' }> = {
  PAMPERO: {
    title: 'Pampero (Viento del SW)',
    color: 'from-blue-900 to-slate-900',
    description: 'Frente frío proveniente del Sudoeste. Fuerte, frío y seco. Produce marcado descenso de temperatura, baja humedad, aumento de presión y violentas ráfagas. Cuidado con Cumulonimbus y turbonadas.',
    visual: 'pampero'
  },
  SUDESTADA: {
    title: 'Sudestada (Viento del SE)',
    color: 'from-slate-700 to-slate-900',
    description: 'Viento persistente del Sudeste que REPRESA las aguas del Río de la Plata contra la costa argentina. Produce crecidas excepcionales, pleamares superiores y ausencia de bajamares. Peligro en zonas bajas.',
    visual: 'sudestada'
  }
};

export const MeteorologiaViewer: React.FC = () => {
  const [beaufort, setBeaufort] = useState(0);
  const [phenomenon, setPhenomenon] = useState<Phenomenon | null>(null);
  const step = BEAUFORT[beaufort];

  return (
    <div className="flex flex-col gap-3 w-full max-w-full mx-auto p-1">
      {/* Selector de fenómeno (Pampero / Sudestada) */}
      <div className="grid grid-cols-2 gap-3">
        {(['PAMPERO', 'SUDESTADA'] as Phenomenon[]).map(p => {
          const isActive = phenomenon === p;
          const ph = PHENOMENA[p];
          return (
            <button
              key={p}
              onClick={() => setPhenomenon(isActive ? null : p)}
              className={`text-left rounded-xl border-2 p-3 transition-all duration-300 bg-gradient-to-br ${ph.color} ${
                isActive ? 'border-cyan-400 shadow-lg shadow-cyan-900/40' : 'border-slate-700 hover:border-slate-500'
              }`}
            >
              <p className={`text-sm font-bold ${isActive ? 'text-cyan-300' : 'text-slate-200'}`}>{ph.title}</p>
              <p className="text-[10px] text-slate-300 mt-0.5">{isActive ? 'Toca para cerrar' : 'Toca para ver detalles'}</p>
            </button>
          );
        })}
      </div>

      {/* Panel del fenómeno activo */}
      {phenomenon && (
        <div className={`rounded-2xl border-2 p-5 bg-gradient-to-br ${PHENOMENA[phenomenon].color} border-cyan-500/40 animate-[fade-in_0.4s_ease-out]`}>
          <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            {phenomenon === 'PAMPERO' ? <CloudRain className="w-5 h-5 text-cyan-300" /> : <Waves className="w-5 h-5 text-cyan-300" />}
            {PHENOMENA[phenomenon].title}
          </h3>
          <p className="text-sm text-slate-200 leading-relaxed">{PHENOMENA[phenomenon].description}</p>

          {/* Visual del fenómeno */}
          {phenomenon === 'PAMPERO' && <PamperoVisual />}
          {phenomenon === 'SUDESTADA' && <SudestadaVisual />}
        </div>
      )}

      {/* --- Escala de Beaufort --- */}
      <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-1">
          <Wind className="w-5 h-5 text-cyan-400" />
          <h3 className="text-xl font-bold text-white">Escala de Beaufort Interactiva</h3>
        </div>
        <p className="text-xs text-slate-400 mb-5">Desliza para experimentar el estado del mar según la fuerza del viento.</p>

        {/* Visual del mar con olas animadas */}
        <div className="relative h-40 rounded-xl overflow-hidden border border-slate-700 bg-gradient-to-b from-slate-900 via-slate-800 to-cyan-950 mb-4">
          {/* Cielo (color según fuerza) */}
          <div
            className="absolute inset-0 transition-all duration-700"
            style={{
              background: `linear-gradient(to bottom, ${
                beaufort <= 3 ? '#1e3a8a' : beaufort <= 6 ? '#1e293b' : beaufort <= 9 ? '#0f172a' : '#020617'
              }, transparent)`
            }}
          />

          {/* Relámpagos para tormenta/huracán */}
          {beaufort >= 10 && (
            <div className="absolute inset-0 bg-white animate-[lightning_3s_infinite] pointer-events-none" />
          )}

          {/* Nubes según fuerza */}
          {beaufort >= 5 && (
            <>
              <div className="absolute top-2 left-10 text-slate-700 text-4xl opacity-60">☁</div>
              <div className="absolute top-4 right-20 text-slate-700 text-5xl opacity-50">☁</div>
            </>
          )}
          {beaufort >= 8 && (
            <>
              <div className="absolute top-1 left-32 text-slate-900 text-6xl opacity-80">☁</div>
              <div className="absolute top-2 right-1/3 text-slate-900 text-7xl opacity-70">☁</div>
            </>
          )}

          {/* Spray / lluvia para fuerzas altas */}
          {beaufort >= 7 && Array.from({ length: beaufort >= 10 ? 30 : 15 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-0.5 h-3 bg-cyan-200/60 animate-[rain-fall_1s_linear_infinite]"
              style={{
                left: `${(i * 7) % 100}%`,
                top: '-10px',
                animationDelay: `${(i * 0.05) % 1}s`
              }}
            />
          ))}

          {/* Olas animadas (SVG con clase dinámica) */}
          <svg
            viewBox="0 0 200 40"
            className={`absolute bottom-0 left-0 w-[200%] h-16 ${step.waveClass}`}
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="waveGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#0c4a6e" stopOpacity="0.9" />
              </linearGradient>
            </defs>
            <path
              d={`M 0 ${20 + (beaufort * 0.5)} Q 25 ${10 - beaufort}, 50 ${20 + (beaufort * 0.5)} T 100 ${20 + (beaufort * 0.5)} T 150 ${20 + (beaufort * 0.5)} T 200 ${20 + (beaufort * 0.5)} T 250 ${20 + (beaufort * 0.5)} T 300 ${20 + (beaufort * 0.5)} T 350 ${20 + (beaufort * 0.5)} T 400 ${20 + (beaufort * 0.5)}`}
              fill="url(#waveGrad)"
              opacity={Math.min(1, 0.5 + beaufort * 0.04)}
            />
          </svg>

          {/* Barco meciéndose */}
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${beaufort > 0 ? 'animate-[boat-rock_1.5s_ease-in-out_infinite]' : ''}`}>
            <div className="text-3xl" style={{ filter: beaufort > 6 ? 'blur(1px)' : 'none' }}>
              {beaufort >= 8 ? '⛵' : '⛵'}
            </div>
          </div>

          {/* Streaks de viento */}
          {beaufort >= 4 && Array.from({ length: Math.min(8, beaufort - 3) }).map((_, i) => (
            <div
              key={i}
              className="absolute h-0.5 bg-cyan-200/40 animate-[wind-streak_2s_linear_infinite]"
              style={{
                top: `${20 + i * 8}%`,
                width: `${30 + i * 5}px`,
                animationDelay: `${i * 0.2}s`
              }}
            />
          ))}
        </div>

        {/* Slider de Beaufort */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm font-medium text-slate-200 mb-2">
            <span>Fuerza {step.force} — {step.name}</span>
            <span className="text-cyan-300 font-bold">{step.knotsRange} nudos</span>
          </div>
          <input
            type="range"
            min="0"
            max="12"
            value={beaufort}
            onChange={e => setBeaufort(parseInt(e.target.value))}
            className="w-full accent-cyan-500"
          />
          <div className="flex justify-between text-[10px] text-slate-500 mt-1">
            {[0, 3, 6, 8, 10, 12].map(f => (
              <span key={f}>F{f}</span>
            ))}
          </div>
        </div>

        {/* Detalle */}
        <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700 flex items-start gap-3">
          <div className={`p-2 rounded-lg bg-slate-800 ${BEAUFORT_COLORS[step.icon]}`}>
            {BEAUFORT_ICONS[step.icon]}
          </div>
          <div>
            <p className="text-sm font-bold text-white">
              Fuerza {step.force} — {step.name}
            </p>
            <p className="text-xs text-slate-300 mt-1">{step.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Sub-componentes de fenómenos locales
const PamperoVisual: React.FC = () => (
  <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
    <div className="bg-slate-950/50 rounded-lg p-3 border border-slate-700">
      <p className="text-cyan-300 font-bold mb-1">🌡️ Temperatura</p>
      <p className="text-slate-300">Desciende abruptamente. Aire frío y seco.</p>
    </div>
    <div className="bg-slate-950/50 rounded-lg p-3 border border-slate-700">
      <p className="text-cyan-300 font-bold mb-1">📈 Presión</p>
      <p className="text-slate-300">Sube rápidamente. Indica paso del frente frío.</p>
    </div>
    <div className="bg-slate-950/50 rounded-lg p-3 border border-slate-700">
      <p className="text-cyan-300 font-bold mb-1">☁️ Cumulonimbus</p>
      <p className="text-slate-300">Nubes de gran desarrollo vertical, turbonadas, granizo.</p>
    </div>
  </div>
);

const SudestadaVisual: React.FC = () => (
  <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
    <div className="bg-slate-950/50 rounded-lg p-3 border border-slate-700">
      <p className="text-cyan-300 font-bold mb-1">🌊 Nivel del río</p>
      <p className="text-slate-300">Sube de forma sostenida. Crecidas en costas argentinas.</p>
    </div>
    <div className="bg-slate-950/50 rounded-lg p-3 border border-slate-700">
      <p className="text-cyan-300 font-bold mb-1">⏱️ Mareas</p>
      <p className="text-slate-300">Pleamares más altas. Bajamares casi inexistentes.</p>
    </div>
    <div className="bg-slate-950/50 rounded-lg p-3 border border-slate-700">
      <p className="text-cyan-300 font-bold mb-1">⚠️ Zonas bajas</p>
      <p className="text-slate-300">Inundaciones en La Boca, Quilmes, Tigre, San Fernando.</p>
    </div>
  </div>
);
