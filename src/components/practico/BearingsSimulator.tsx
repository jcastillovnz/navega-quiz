import React, { useState, useMemo } from 'react';
import { Compass, Crosshair, Move, Trash2, Lightbulb, Anchor } from 'lucide-react';

interface Beacon {
  id: string;
  name: string;
  // Posición en % sobre el canvas
  x: number;
  y: number;
  // Marcación (rumbo desde la embarcación hacia el beacon, en grados)
  bearing: number;
}

// Marcación (rumbo) → vector en SVG (heading 0 = N arriba, sentido horario → +x derecha, +y abajo)
const bearingToVector = (bearing: number) => {
  const rad = (bearing * Math.PI) / 180;
  return { dx: Math.sin(rad), dy: -Math.cos(rad) };
};

// Intersección de dos líneas definidas por punto y dirección (en %)
const lineIntersection = (
  p1: { x: number; y: number },
  d1: { dx: number; dy: number },
  p2: { x: number; y: number },
  d2: { dx: number; dy: number }
): { x: number; y: number } | null => {
  const denom = d1.dx * d2.dy - d1.dy * d2.dx;
  if (Math.abs(denom) < 1e-9) return null; // paralelas
  const t = ((p2.x - p1.x) * d2.dy - (p2.y - p1.y) * d2.dx) / denom;
  return { x: p1.x + t * d1.dx, y: p1.y + t * d1.dy };
};

export const BearingsSimulator: React.FC = () => {
  // Embarcación: posición fija al centro
  const [vesselX, setVesselX] = useState(50);
  const [vesselY, setVesselY] = useState(50);

  // Dos beacons con sus marcaciones desde la embarcación
  const [beacons, setBeacons] = useState<Beacon[]>([
    { id: 'Faro A', name: 'Faro A', x: 80, y: 20, bearing: 45 },
    { id: 'Faro B', name: 'Faro B', x: 20, y: 80, bearing: 135 }
  ]);

  const [activeBeacon, setActiveBeacon] = useState<string | null>(null);

  // Intersección de las dos marcaciones = posición estimada
  const fix = useMemo(() => {
    if (beacons.length < 2) return null;
    const a = beacons[0];
    const b = beacons[1];
    const va = bearingToVector(a.bearing);
    const vb = bearingToVector(b.bearing);
    // Posición del observador (vessel) como origen de las marcaciones
    return lineIntersection(
      { x: vesselX, y: vesselY },
      va,
      { x: vesselX, y: vesselY },
      vb
    );
  }, [beacons, vesselX, vesselY]);

  const updateBearing = (id: string, value: number) => {
    setBeacons(prev => prev.map(b => (b.id === id ? { ...b, bearing: value } : b)));
  };

  const resetVessel = () => {
    setVesselX(50);
    setVesselY(50);
  };

  const swapBeacons = () => {
    setBeacons(prev => [prev[1], prev[0]]);
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto p-4">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 mb-3">
          <Compass className="w-7 h-7 text-cyan-400" />
        </div>
        <h3 className="text-2xl font-bold text-white">Simulador de Marcaciones Simultáneas</h3>
        <p className="text-sm text-slate-400 mt-1">
          Dos marcaciones a puntos notables definen tu posición (fix) por intersección.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {/* Canvas de la carta */}
        <div className="md:col-span-2 bg-slate-800/60 border border-slate-700 rounded-2xl p-3">
          <div className="relative w-full aspect-square bg-gradient-to-br from-slate-900 to-slate-950 rounded-xl overflow-hidden border border-slate-700">
            {/* Grilla náutica */}
            <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <pattern id="navGrid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#22d3ee" strokeWidth="0.15" />
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#navGrid)" />
              <line x1="0" y1="50" x2="100" y2="50" stroke="#22d3ee" strokeWidth="0.2" strokeDasharray="2,2" />
              <line x1="50" y1="0" x2="50" y2="100" stroke="#22d3ee" strokeWidth="0.2" strokeDasharray="2,2" />
            </svg>

            {/* Rosa de los vientos en el centro */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
              {/* Rayos de la rosa cada 30° */}
              {Array.from({ length: 12 }).map((_, i) => {
                const angle = (i * 30 * Math.PI) / 180;
                const x2 = 50 + Math.sin(angle) * 50;
                const y2 = 50 - Math.cos(angle) * 50;
                return (
                  <line
                    key={i}
                    x1="50"
                    y1="50"
                    x2={x2}
                    y2={y2}
                    stroke={i % 3 === 0 ? '#22d3ee' : '#475569'}
                    strokeWidth={i % 3 === 0 ? 0.4 : 0.2}
                    opacity={i % 3 === 0 ? 0.4 : 0.25}
                  />
                );
              })}
              <text x="50" y="3" fill="#22d3ee" fontSize="3" textAnchor="middle" fontWeight="bold">N</text>
              <text x="97" y="51" fill="#22d3ee" fontSize="3" textAnchor="middle" fontWeight="bold">E</text>
              <text x="50" y="99" fill="#22d3ee" fontSize="3" textAnchor="middle" fontWeight="bold">S</text>
              <text x="3" y="51" fill="#22d3ee" fontSize="3" textAnchor="middle" fontWeight="bold">W</text>
            </svg>

            {/* Líneas de marcación (desde la embarcación hacia afuera en la dirección del bearing) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
              {beacons.map(b => {
                const v = bearingToVector(b.bearing);
                // Línea larga: arranca en la embarcación, sale en ambas direcciones (reverso)
                const x1 = vesselX - v.dx * 80;
                const y1 = vesselY - v.dy * 80;
                const x2 = vesselX + v.dx * 80;
                const y2 = vesselY + v.dy * 80;
                return (
                  <g key={`line-${b.id}`}>
                    <line
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke={b.id === 'Faro A' ? '#22d3ee' : '#f59e0b'}
                      strokeWidth="0.4"
                      strokeDasharray="2,1.5"
                      opacity="0.6"
                    />
                  </g>
                );
              })}
              {/* Línea del fix entre los beacons (en realidad no se traza, pero la intersección sí) */}
            </svg>

            {/* Beacons (faros) */}
            {beacons.map(b => (
              <button
                key={b.id}
                onClick={() => setActiveBeacon(activeBeacon === b.id ? null : b.id)}
                className="absolute -translate-x-1/2 -translate-y-1/2 group focus:outline-none"
                style={{ left: `${b.x}%`, top: `${b.y}%` }}
              >
                <div className="flex flex-col items-center">
                  <div
                    className={`relative w-6 h-6 rounded-full flex items-center justify-center shadow-lg transition-transform ${
                      activeBeacon === b.id ? 'scale-125' : 'group-hover:scale-110'
                    }`}
                    style={{
                      backgroundColor: b.id === 'Faro A' ? '#22d3ee' : '#f59e0b',
                      boxShadow: `0 0 12px ${b.id === 'Faro A' ? '#22d3ee' : '#f59e0b'}`
                    }}
                  >
                    <Anchor className="w-3 h-3 text-slate-950" />
                  </div>
                  <span
                    className={`text-[10px] font-bold mt-1 px-1.5 py-0.5 rounded ${
                      b.id === 'Faro A' ? 'bg-cyan-500 text-slate-950' : 'bg-amber-500 text-slate-950'
                    }`}
                  >
                    {b.name}
                  </span>
                </div>
              </button>
            ))}

            {/* Embarcación */}
            <div
              className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-500"
              style={{ left: `${vesselX}%`, top: `${vesselY}%` }}
            >
              <div className="relative">
                <div className="w-5 h-5 bg-emerald-500 border-2 border-white rounded-full shadow-lg shadow-emerald-500/50 animate-pulse" />
                <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[9px] bg-emerald-500 text-slate-950 px-1.5 rounded font-bold whitespace-nowrap">
                  BUQUE
                </span>
              </div>
            </div>

            {/* Posición Fix (intersección) */}
            {fix && (
              <div
                className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                style={{ left: `${fix.x}%`, top: `${fix.y}%` }}
              >
                <Crosshair className="w-6 h-6 text-rose-500 drop-shadow-lg" />
                <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] bg-rose-500 text-white px-1.5 rounded font-bold whitespace-nowrap">
                  FIX
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Controles */}
        <div className="flex flex-col gap-3">
          {/* Posición de la embarcación */}
          <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-2">
              <Move className="w-3.5 h-3.5 text-emerald-400" />
              Posición Buque
            </h4>
            <div className="space-y-2">
              <div>
                <label className="text-[10px] text-slate-400 flex justify-between">
                  <span>X (Este-Oeste)</span><span className="text-emerald-300">{vesselX.toFixed(0)}%</span>
                </label>
                <input
                  type="range"
                  min="20"
                  max="80"
                  value={vesselX}
                  onChange={e => setVesselX(parseInt(e.target.value))}
                  className="w-full accent-emerald-500"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 flex justify-between">
                  <span>Y (Norte-Sur)</span><span className="text-emerald-300">{vesselY.toFixed(0)}%</span>
                </label>
                <input
                  type="range"
                  min="20"
                  max="80"
                  value={vesselY}
                  onChange={e => setVesselY(parseInt(e.target.value))}
                  className="w-full accent-emerald-500"
                />
              </div>
              <button
                onClick={resetVessel}
                className="w-full text-[10px] text-slate-400 hover:text-slate-200 flex items-center justify-center gap-1"
              >
                <Trash2 className="w-3 h-3" /> Centrar
              </button>
            </div>
          </div>

          {/* Marcaciones */}
          {beacons.map((b, idx) => (
            <div
              key={b.id}
              className={`bg-slate-800/60 border rounded-xl p-3 ${
                idx === 0 ? 'border-cyan-500/40' : 'border-amber-500/40'
              }`}
            >
              <h4
                className={`text-xs font-bold uppercase tracking-wider mb-2 ${
                  idx === 0 ? 'text-cyan-300' : 'text-amber-300'
                }`}
              >
                Marcación {b.name}
              </h4>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-2xl font-bold text-white">{String(b.bearing).padStart(3, '0')}°</span>
              </div>
              <input
                type="range"
                min="0"
                max="359"
                value={b.bearing}
                onChange={e => updateBearing(b.id, parseInt(e.target.value))}
                className={`w-full ${idx === 0 ? 'accent-cyan-500' : 'accent-amber-500'}`}
              />
              <div className="flex justify-between text-[9px] text-slate-500 mt-1">
                <span>0° N</span><span>90° E</span><span>180° S</span><span>270° W</span>
              </div>
            </div>
          ))}

          <button
            onClick={swapBeacons}
            className="w-full bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-medium py-2 rounded-lg transition-all"
          >
            Intercambiar A ↔ B
          </button>
        </div>
      </div>

      {/* Panel explicativo */}
      <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 text-xs text-slate-300 flex items-start gap-2">
        <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <p className="mb-1"><strong className="text-white">¿Cómo funciona?</strong></p>
          <p className="leading-relaxed">
            Tomamos dos marcaciones simultáneas a puntos notables (faros, boyas, accidentes geográficos) que se
            encuentren en la carta. Al trazar las líneas inversas desde la embarcación en la dirección observada, su
            <strong className="text-rose-300"> intersección </strong>
            determina la <strong className="text-rose-300">posición observada (fix)</strong>. Cuanto mayor sea el
            ángulo entre las dos marcaciones (idealmente cercano a 90°), mayor será la precisión.
          </p>
        </div>
      </div>
    </div>
  );
};
