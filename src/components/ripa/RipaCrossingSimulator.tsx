import React, { useEffect, useState } from 'react';
import { Play, RotateCcw, Info, Ship, Anchor } from 'lucide-react';

type ScenarioId = 'VUELTA_ENCONTRADA' | 'CRUCE' | 'ALCANCE' | 'VELEROS' | 'VELERO_VS_MOTOR';

interface Vessel {
  id: 'A' | 'B';
  label: string;
  type: 'MOTOR' | 'VELA';
  // Posición inicial en porcentaje (0-100) sobre el canvas
  x: number;
  y: number;
  // Ángulo en grados (0 = proa al norte, sentido horario)
  heading: number;
  // Color identificador
  color: 'cyan' | 'amber';
  // Es el prioritario (mantiene rumbo y velocidad)
  isStandOn: boolean;
  // Maniobra sugerida (texto RIPA)
  action: string;
  maneuver: 'KEEP' | 'STARBOARD';
}

interface Scenario {
  id: ScenarioId;
  title: string;
  rule: string;
  description: string;
  vessels: Vessel[];
  illustration?: string;
}

const SCENARIOS: Record<ScenarioId, Scenario> = {
  VUELTA_ENCONTRADA: {
    id: 'VUELTA_ENCONTRADA',
    title: 'Vuelta Encontrada (Regla 14)',
    rule: 'RIPA Regla 14',
    description:
      'Dos buques de propulsión mecánica navegando de vuelta encontrada (rumbo opuesto) con riesgo de abordaje. Ambos deben caer a ESTRIBOR para pasar por babor del otro.',
    vessels: [
      { id: 'A', label: 'A', type: 'MOTOR', x: 28, y: 50, heading: 90, color: 'cyan', isStandOn: false, action: 'Caer a estribor', maneuver: 'STARBOARD' },
      { id: 'B', label: 'B', type: 'MOTOR', x: 72, y: 50, heading: 270, color: 'amber', isStandOn: false, action: 'Caer a estribor', maneuver: 'STARBOARD' }
    ]
  },
  CRUCE: {
    id: 'CRUCE',
    title: 'Cruce (Regla 15)',
    rule: 'RIPA Regla 15',
    description:
      'Dos buques de propulsión mecánica se cruzan con riesgo de abordaje. El buque que tenga al otro por su costado de ESTRIBOR se mantiene apartado (cede el paso).',
    vessels: [
      { id: 'A', label: 'A', type: 'MOTOR', x: 50, y: 85, heading: 0, color: 'cyan', isStandOn: true, action: 'Mantener rumbo y velocidad', maneuver: 'KEEP' },
      { id: 'B', label: 'B', type: 'MOTOR', x: 15, y: 35, heading: 90, color: 'amber', isStandOn: false, action: 'Caer a estribor (ceder paso)', maneuver: 'STARBOARD' }
    ]
  },
  ALCANCE: {
    id: 'ALCANCE',
    title: 'Alcance (Regla 13)',
    rule: 'RIPA Regla 13',
    description:
      'Un buque alcanza a otro (viene de un sector de más de 22.5° a popa del través). El buque que ALCANZA debe mantenerse apartado; el alcanzado mantiene rumbo y velocidad.',
    vessels: [
      { id: 'A', label: 'A', type: 'MOTOR', x: 30, y: 50, heading: 90, color: 'cyan', isStandOn: true, action: 'Mantener rumbo y velocidad', maneuver: 'KEEP' },
      { id: 'B', label: 'B', type: 'MOTOR', x: 15, y: 30, heading: 120, color: 'amber', isStandOn: false, action: 'Mantenerse apartado del alcanzado', maneuver: 'STARBOARD' }
    ]
  },
  VELEROS: {
    id: 'VELEROS',
    title: 'Dos Veleros (Regla 12)',
    rule: 'RIPA Regla 12',
    description: 'Dos veleros se aproximan con riesgo de abordaje. La prioridad depende de la banda por la que reciben el viento y, si es la misma, de cuál está a barlovento.',
    vessels: [
      { id: 'A', label: 'B', type: 'VELA', x: 20, y: 70, heading: 35, color: 'amber', isStandOn: false, action: 'Recibe viento por babor: ceder', maneuver: 'STARBOARD' },
      { id: 'B', label: 'E', type: 'VELA', x: 72, y: 65, heading: 325, color: 'cyan', isStandOn: true, action: 'Recibe viento por estribor: mantener', maneuver: 'KEEP' }
    ]
  },
  VELERO_VS_MOTOR: {
    id: 'VELERO_VS_MOTOR',
    title: 'Vela vs. Motor (Regla 18)',
    rule: 'RIPA Regla 18',
    description:
      'Buque de propulsión mecánica vs. velero. El buque a motor SIEMPRE debe mantenerse apartado del velero (prioridad del velero).',
    vessels: [
      { id: 'A', label: 'V', type: 'VELA', x: 20, y: 50, heading: 90, color: 'cyan', isStandOn: true, action: 'Mantener rumbo (prioridad)', maneuver: 'KEEP' },
      { id: 'B', label: 'M', type: 'MOTOR', x: 15, y: 80, heading: 30, color: 'amber', isStandOn: false, action: 'Caer a estribor (ceder paso)', maneuver: 'STARBOARD' }
    ]
  }
};

// Convierte heading (0=N, 90=E) a un vector unitario (x, y) sobre el canvas
// En SVG, +x es derecha, +y es ABAJO. Por lo que un heading de 90° (Este) es (1, 0)
const headingToVector = (heading: number): { dx: number; dy: number } => {
  const rad = ((heading - 90) * Math.PI) / 180;
  return { dx: Math.cos(rad), dy: Math.sin(rad) };
};

// Renderiza un barco (triángulo apuntando hacia proa) rotado según el heading
const ShipSVG: React.FC<{ vessel: Vessel; size?: number }> = ({ vessel, size = 40 }) => {
  const isSail = vessel.type === 'VELA';
  const hullColor = vessel.color === 'cyan' ? '#22d3ee' : '#f59e0b';
  const hullShadow = vessel.color === 'cyan' ? 'rgba(34,211,238,0.5)' : 'rgba(245,158,11,0.5)';

  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 ease-linear"
      style={{ left: `${vessel.x}%`, top: `${vessel.y}%` }}
    >
      <div
        className="relative"
        style={{ transform: `rotate(${vessel.heading}deg)` }}
      >
        <div
          className="relative"
          style={{ width: size, height: size, filter: `drop-shadow(0 0 6px ${hullShadow})` }}
        >
          {/* Casco (triángulo apuntando hacia proa = arriba en SVG) */}
          <svg viewBox="0 0 40 40" className="absolute inset-0 w-full h-full">
            <polygon
              points="20,2 36,36 20,30 4,36"
              fill={hullColor}
              stroke="#0f172a"
              strokeWidth="1.5"
            />
            {/* Línea de crujía */}
            <line x1="20" y1="2" x2="20" y2="30" stroke="#0f172a" strokeWidth="0.5" opacity="0.4" />
          </svg>
          {/* Vela para veleros */}
          {isSail && (
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <div
                className="bg-white/90 border border-slate-700"
                style={{ width: 0, height: 0, borderLeft: '8px solid transparent', borderRight: '8px solid transparent', borderBottom: '20px solid rgba(255,255,255,0.9)' }}
              />
            </div>
          )}
        </div>
        {/* Etiqueta del buque */}
        <div
          className={`absolute -top-2 left-1/2 -translate-x-1/2 -translate-y-full px-1.5 py-0.5 rounded text-[10px] font-bold shadow-md ${
            vessel.color === 'cyan' ? 'bg-cyan-500 text-slate-950' : 'bg-amber-500 text-slate-950'
          }`}
          style={{ transform: `rotate(${-vessel.heading}deg) translateY(-4px)` }}
        >
          {vessel.label}
        </div>
      </div>
    </div>
  );
};

export const RipaCrossingSimulator: React.FC<{ focusScenario?: ScenarioId }> = ({ focusScenario }) => {
  const [scenarioId, setScenarioId] = useState<ScenarioId>(focusScenario ?? 'VUELTA_ENCONTRADA');
  const [isPlaying, setIsPlaying] = useState(false);
  const [vessels, setVessels] = useState<Vessel[]>(SCENARIOS.VUELTA_ENCONTRADA.vessels);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (focusScenario) setScenarioId(focusScenario);
  }, [focusScenario]);

  // Cargar el escenario cuando cambia el id
  useEffect(() => {
    setVessels(SCENARIOS[scenarioId].vessels.map(v => ({ ...v })));
    setIsPlaying(false);
    setTick(0);
  }, [scenarioId]);

  // Animación: avanza los barcos según su vector de rumbo.
  // Si el barco NO es prioritario, maniobra: aplica un offset al heading.
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setTick(t => t + 1);
      setVessels(prev =>
        prev.map(v => {
          // La caída se ejecuta de forma gradual una sola vez (30° en total).
          // En vuelta encontrada maniobran ambos; en los demás casos, solo quien cede.
          const shouldTurn = v.maneuver === 'STARBOARD' && tick >= 10 && tick < 20;
          const adjustedHeading = shouldTurn ? (v.heading + 3) % 360 : v.heading;
          const { dx, dy } = headingToVector(adjustedHeading);
          const speed = 0.6; // % por frame
          return {
            ...v,
            heading: adjustedHeading,
            x: v.x + dx * speed,
            y: v.y + dy * speed
          };
        })
      );
    }, 60);
    return () => clearInterval(interval);
  }, [isPlaying, tick]);

  const handleReset = () => {
    setVessels(SCENARIOS[scenarioId].vessels.map(v => ({ ...v })));
    setIsPlaying(false);
    setTick(0);
  };

  const currentScenario = SCENARIOS[scenarioId];

  return (
    <div className="flex flex-col gap-3 w-full max-w-full mx-auto p-1">
      {/* Selector de Escenarios */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
        {(Object.keys(SCENARIOS) as ScenarioId[]).map(id => (
          <button
            key={id}
            onClick={() => setScenarioId(id)}
            className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-300 ${
              scenarioId === id
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-900/40'
                : 'bg-slate-800 text-slate-400 border border-slate-700 hover:text-slate-200 hover:border-slate-600'
            }`}
          >
            {SCENARIOS[id].title.split(' (')[0]}
          </button>
        ))}
      </div>

      {/* Canvas de Simulación */}
      <div className="relative w-full h-64 sm:h-72 rounded-2xl overflow-hidden border border-slate-700 bg-gradient-to-b from-slate-900 to-slate-950">
        {/* Grilla náutica sutil (rosa de los vientos) */}
        <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#22d3ee" strokeWidth="0.2" />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#grid)" />
          {/* Cruz central (N-S, E-O) */}
          <line x1="0" y1="50" x2="100" y2="50" stroke="#22d3ee" strokeWidth="0.3" strokeDasharray="2,2" />
          <line x1="50" y1="0" x2="50" y2="100" stroke="#22d3ee" strokeWidth="0.3" strokeDasharray="2,2" />
        </svg>

        {/* Rosa de los vientos (N) */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 text-cyan-500/60 text-[10px] font-bold tracking-widest">N</div>
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-cyan-500/60 text-[10px] font-bold tracking-widest">S</div>
        <div className="absolute left-2 top-1/2 -translate-y-1/2 text-cyan-500/60 text-[10px] font-bold tracking-widest">W</div>
        <div className="absolute right-2 top-1/2 -translate-y-1/2 text-cyan-500/60 text-[10px] font-bold tracking-widest">E</div>

        {currentScenario.illustration && !isPlaying ? (
          <img
            src={currentScenario.illustration}
            alt="Dos embarcaciones a motor de vuelta encontrada, ambas iniciando caída a estribor para pasar babor con babor"
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : vessels.map(v => (
          <ShipSVG key={v.id} vessel={v} />
        ))}

        {/* Indicador de "Prioridad" cuando está en play */}
        {isPlaying && tick > 10 && vessels.filter(v => v.isStandOn).length === 1 && (
          <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur border border-cyan-500/30 rounded-lg px-2 py-1 text-[10px] text-cyan-300 flex items-center gap-1">
            <Anchor className="w-3 h-3" />
            {vessels.find(v => v.isStandOn)?.label} prioriza
          </div>
        )}
      </div>

      {/* Controles */}
      <div className="flex flex-wrap gap-3 items-center justify-center">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all duration-300 ${
            isPlaying
              ? 'bg-rose-500 text-white shadow-lg shadow-rose-900/40'
              : 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-900/40 hover:bg-cyan-400'
          }`}
        >
          {isPlaying ? (
            <>
              <span className="w-3 h-3 bg-white rounded-sm" />
              Detener
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              Iniciar Maniobra
            </>
          )}
        </button>
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 transition-all duration-300"
        >
          <RotateCcw className="w-4 h-4" />
          Reiniciar
        </button>
      </div>

      {/* Tarjeta de Explicación */}
      <div className="bg-slate-800/70 backdrop-blur-md border border-white/10 p-5 rounded-xl">
        <div className="flex items-start gap-3 mb-3">
          <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-2">
            <Info className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{currentScenario.title}</h3>
            <p className="text-xs text-cyan-400 font-medium tracking-wide">{currentScenario.rule}</p>
          </div>
        </div>
        <p className="text-sm text-slate-300 mb-4 leading-relaxed">{currentScenario.description}</p>

        {/* Acciones de los buques */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {currentScenario.vessels.map(v => (
            <div
              key={v.id}
              className={`rounded-lg p-3 border ${
                v.isStandOn
                  ? 'bg-cyan-500/5 border-cyan-500/30'
                  : 'bg-amber-500/5 border-amber-500/30'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Ship className={`w-4 h-4 ${v.color === 'cyan' ? 'text-cyan-400' : 'text-amber-400'}`} />
                <span className={`text-sm font-bold ${v.color === 'cyan' ? 'text-cyan-300' : 'text-amber-300'}`}>
                  Buque {v.label} ({v.type === 'MOTOR' ? 'Motor' : 'Vela'})
                </span>
                {v.isStandOn && (
                  <span className="ml-auto text-[10px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 px-2 py-0.5 rounded-full font-bold">
                    PRIORIDAD
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300">
                <strong className="text-slate-100">Acción:</strong> {v.action}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
