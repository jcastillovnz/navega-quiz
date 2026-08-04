import React, { useState } from 'react';
import { Anchor, Sailboat, Ruler, Info, X, Wind } from 'lucide-react';

interface HullHotspot {
  id: string;
  label: string;
  description: string;
  // Posición en porcentaje sobre el SVG
  x: number;
  y: number;
  // Color del hotspot
  color: string;
}

const HULL_HOTSPOTS: HullHotspot[] = [
  { id: 'proa', label: 'Proa', description: 'Parte delantera del casco, diseñada para cortar el agua.', x: 85, y: 40, color: '#22d3ee' },
  { id: 'popa', label: 'Popa', description: 'Parte trasera del casco, donde se ubica el timón.', x: 15, y: 60, color: '#22d3ee' },
  { id: 'babor', label: 'Babor', description: 'Costado IZQUIERDO del buque mirando hacia proa.', x: 50, y: 78, color: '#ef4444' },
  { id: 'estribor', label: 'Estribor', description: 'Costado DERECHO del buque mirando hacia proa.', x: 50, y: 22, color: '#22c55e' },
  { id: 'eslora', label: 'Eslora', description: 'Distancia longitudinal total del casco: de proa a popa.', x: 50, y: 50, color: '#f59e0b' },
  { id: 'manga', label: 'Manga', description: 'Ancho máximo del casco (de babor a estribor).', x: 25, y: 95, color: '#a855f7' },
  { id: 'calado', label: 'Calado', description: 'Distancia vertical desde la línea de flotación hasta la quilla.', x: 5, y: 50, color: '#06b6d4' },
  { id: 'obra_viva', label: 'Obra Viva', description: 'Parte del casco que está permanentemente BAJO el agua.', x: 30, y: 80, color: '#3b82f6' },
  { id: 'obra_muerta', label: 'Obra Muerta', description: 'Parte del casco que se encuentra SOBRE la línea de flotación.', x: 70, y: 30, color: '#eab308' },
  { id: 'francobordo', label: 'Francobordo', description: 'Distancia vertical entre la línea de flotación y la cubierta principal. Da reserva de flotabilidad.', x: 90, y: 65, color: '#ec4899' },
  { id: 'quilla', label: 'Quilla', description: 'Pieza longitudinal en el fondo del casco que aporta estabilidad y lastre.', x: 5, y: 70, color: '#64748b' }
];

interface RiggItem {
  id: string;
  label: string;
  type: 'FIJA' | 'MOVIL';
  parent?: string;
  description: string;
}

const RIGGING: RiggItem[] = [
  // Jarcia Fija: obenques, estays, backstays
  { id: 'obenque_babor', label: 'Obenque Babor', type: 'FIJA', description: 'Cabo de acero que sujeta el mástil lateralmente hacia babor.' },
  { id: 'obenque_estribor', label: 'Obenque Estribor', type: 'FIJA', description: 'Cabo de acero que sujeta el mástil lateralmente hacia estribor.' },
  { id: 'estay_proel', label: 'Estay Proel', type: 'FIJA', description: 'Cabo longitudinal que sujeta el mástil HACIA PROA.' },
  { id: 'estay_popel', label: 'Estay Popel (Backstay)', type: 'FIJA', description: 'Cabo longitudinal que sujeta el mástil HACIA POPA. Suele ser tensable.' },
  { id: 'baudillos', label: 'Baudillos / Brandales', type: 'FIJA', description: 'Cables que evitan que los obenques se junten. Dan rigidez lateral al palo.' },
  // Jarcia Móvil: escotas, drizas, amantillos, cunningham, contra, car
  { id: 'driza_mayor', label: 'Driza Mayor', type: 'MOVIL', description: 'Cabo que sirve para IZAR la vela mayor por el mástil.' },
  { id: 'driza_foque', label: 'Driza Foque', type: 'MOVIL', description: 'Cabo para izar la vela de proa (foque).' },
  { id: 'escota_mayor', label: 'Escota Mayor', type: 'MOVIL', description: 'Cabo que CAZA (tensa) o FILA (afloja) la vela mayor, regulando su ángulo.' },
  { id: 'escota_foque', label: 'Escota Foque', type: 'MOVIL', description: 'Cabo que regula el ángulo del foque.' },
  { id: 'amantillo', label: 'Amantillo', type: 'MOVIL', description: 'Cabo para arriar (bajar) el mástil o la verga en veleros menores.' },
  { id: 'contra', label: 'Contra', type: 'MOVIL', description: 'Cabo que tensa el pujamen de la mayor hacia popa.' }
];

const RIGG_BY_TYPE = {
  FIJA: RIGGING.filter(r => r.type === 'FIJA'),
  MOVIL: RIGGING.filter(r => r.type === 'MOVIL')
};

export const NomenclaturaViewer: React.FC = () => {
  const [activeHull, setActiveHull] = useState<HullHotspot | null>(null);
  const [activeRigg, setActiveRigg] = useState<RiggItem | null>(null);
  const [riggFilter, setRiggFilter] = useState<'TODOS' | 'FIJA' | 'MOVIL'>('TODOS');

  const filteredRigg = riggFilter === 'TODOS' ? RIGGING : RIGGING.filter(r => r.type === riggFilter);

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto p-4">
      {/* --- Sección 1: Explorador del Casco --- */}
      <div className="bg-slate-800/40 border border-slate-700 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-1">
          <Sailboat className="w-5 h-5 text-cyan-400" />
          <h3 className="text-xl font-bold text-white">Partes del Casco</h3>
        </div>
        <p className="text-xs text-slate-400 mb-4">
          Toca cada punto del velero para descubrir la nomenclatura náutica.
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          {/* SVG del velero (vista lateral / perfil) */}
          <div className="relative bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-700 rounded-xl overflow-hidden h-80">
            <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid meet">
              {/* Mar (línea de agua) */}
              <defs>
                <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1e293b" />
                  <stop offset="100%" stopColor="#0f172a" />
                </linearGradient>
                <linearGradient id="hullGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1e293b" />
                  <stop offset="60%" stopColor="#0f172a" />
                  <stop offset="100%" stopColor="#020617" />
                </linearGradient>
              </defs>
              {/* Agua */}
              <rect x="0" y="60" width="100" height="40" fill="url(#waterGrad)" />
              {/* Olas decorativas */}
              <path d="M0 65 Q 10 63 20 65 T 40 65 T 60 65 T 80 65 T 100 65" stroke="#22d3ee" strokeWidth="0.3" fill="none" opacity="0.4" />
              <path d="M0 72 Q 10 70 20 72 T 40 72 T 60 72 T 80 72 T 100 72" stroke="#22d3ee" strokeWidth="0.3" fill="none" opacity="0.3" />

              {/* Casco (perfil del velero) */}
              <path
                d="M 88 38 L 95 50 L 90 62 L 10 62 L 5 50 L 15 38 Z"
                fill="url(#hullGrad)"
                stroke="#475569"
                strokeWidth="0.4"
              />
              {/* Línea de flotación (dentro del casco) */}
              <line x1="10" y1="58" x2="90" y2="58" stroke="#22d3ee" strokeWidth="0.4" strokeDasharray="2,1" opacity="0.8" />

              {/* Cubierta */}
              <line x1="15" y1="38" x2="88" y2="38" stroke="#64748b" strokeWidth="0.3" />

              {/* Mástil */}
              <line x1="50" y1="5" x2="50" y2="38" stroke="#a8a29e" strokeWidth="0.8" />
              {/* Perilla (tope del mástil) */}
              <circle cx="50" cy="5" r="0.8" fill="#f59e0b" />

              {/* Estay proel (proa) */}
              <line x1="50" y1="6" x2="88" y2="38" stroke="#94a3b8" strokeWidth="0.3" strokeDasharray="1,0.5" />
              {/* Estay popel (popa) */}
              <line x1="50" y1="6" x2="15" y2="38" stroke="#94a3b8" strokeWidth="0.3" strokeDasharray="1,0.5" />
              {/* Obenques */}
              <line x1="50" y1="15" x2="15" y2="38" stroke="#94a3b8" strokeWidth="0.3" strokeDasharray="1,0.5" />
              <line x1="50" y1="15" x2="88" y2="38" stroke="#94a3b8" strokeWidth="0.3" strokeDasharray="1,0.5" />

              {/* Vela mayor (triángulo) */}
              <polygon points="50,8 50,38 18,38" fill="#f8fafc" opacity="0.85" stroke="#cbd5e1" strokeWidth="0.3" />
              {/* Foque (sail) */}
              <polygon points="50,10 88,38 52,38" fill="#f8fafc" opacity="0.7" stroke="#cbd5e1" strokeWidth="0.3" />

              {/* Quilla */}
              <line x1="20" y1="62" x2="80" y2="62" stroke="#475569" strokeWidth="0.3" />
              <line x1="30" y1="62" x2="35" y2="68" stroke="#475569" strokeWidth="0.4" />
              <line x1="50" y1="62" x2="55" y2="70" stroke="#475569" strokeWidth="0.4" />
              <line x1="70" y1="62" x2="75" y2="68" stroke="#475569" strokeWidth="0.4" />

              {/* Timón en popa */}
              <rect x="3" y="50" width="3" height="8" fill="#475569" />
            </svg>

            {/* Hotspots superpuestos */}
            {HULL_HOTSPOTS.map(h => (
              <button
                key={h.id}
                onClick={() => setActiveHull(h)}
                className="absolute -translate-x-1/2 -translate-y-1/2 group focus:outline-none"
                style={{ left: `${h.x}%`, top: `${h.y}%` }}
                aria-label={h.label}
              >
                <span
                  className="block w-3.5 h-3.5 rounded-full border-2 border-white shadow-lg transition-all duration-200 group-hover:scale-150 group-active:scale-90"
                  style={{
                    backgroundColor: h.color,
                    boxShadow: `0 0 12px ${h.color}, 0 0 0 2px rgba(255,255,255,0.3)`
                  }}
                />
              </button>
            ))}
          </div>

          {/* Panel de detalle */}
          <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-4 min-h-80 flex flex-col">
            {activeHull ? (
              <div className="animate-[fade-in_0.3s_ease-out]">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Ruler className="w-5 h-5" style={{ color: activeHull.color }} />
                    <h4 className="text-lg font-bold text-white">{activeHull.label}</h4>
                  </div>
                  <button
                    onClick={() => setActiveHull(null)}
                    className="text-slate-500 hover:text-slate-300"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">{activeHull.description}</p>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-500">
                <Info className="w-8 h-8 mb-2 opacity-50" />
                <p className="text-sm">Selecciona un punto del velero para ver su descripción.</p>
              </div>
            )}

            {/* Mini leyenda de colores */}
            <div className="mt-auto pt-4 border-t border-slate-700">
              <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-2">Leyenda rápida</p>
              <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-cyan-400" /><span className="text-slate-300">Orientación</span></div>
                <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-400" /><span className="text-slate-300">Medidas</span></div>
                <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500" /><span className="text-slate-300">Obra viva</span></div>
                <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-yellow-500" /><span className="text-slate-300">Obra muerta</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- Sección 2: Jarcia Interactiva --- */}
      <div className="bg-slate-800/40 border border-slate-700 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-1">
          <Wind className="w-5 h-5 text-cyan-400" />
          <h3 className="text-xl font-bold text-white">Arboladura y Jarcia</h3>
        </div>
        <p className="text-xs text-slate-400 mb-4">
          Distingue los cabos de <strong className="text-amber-300">Jarcia Fija</strong> (estructural) de la <strong className="text-emerald-300">Jarcia Móvil</strong> (maniobra).
        </p>

        {/* Filtros */}
        <div className="flex gap-2 mb-4">
          {(['TODOS', 'FIJA', 'MOVIL'] as const).map(f => (
            <button
              key={f}
              onClick={() => setRiggFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                riggFilter === f
                  ? f === 'FIJA' ? 'bg-amber-500 text-slate-950' : f === 'MOVIL' ? 'bg-emerald-500 text-slate-950' : 'bg-cyan-500 text-slate-950'
                  : 'bg-slate-900 border border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
            >
              {f === 'TODOS' ? 'Todos' : f === 'FIJA' ? `Fija (${RIGG_BY_TYPE.FIJA.length})` : `Móvil (${RIGG_BY_TYPE.MOVIL.length})`}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Lista */}
          <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
            {filteredRigg.map(item => {
              const isActive = activeRigg?.id === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveRigg(item)}
                  className={`w-full text-left p-3 rounded-lg border transition-all duration-200 ${
                    isActive
                      ? item.type === 'FIJA'
                        ? 'bg-amber-500/20 border-amber-500'
                        : 'bg-emerald-500/20 border-emerald-500'
                      : 'bg-slate-900/50 border-slate-700 hover:border-slate-500'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-bold ${isActive ? 'text-white' : 'text-slate-200'}`}>
                      {item.label}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        item.type === 'FIJA' ? 'bg-amber-500/30 text-amber-200' : 'bg-emerald-500/30 text-emerald-200'
                      }`}
                    >
                      {item.type === 'FIJA' ? '⚓ FIJA' : '🪢 MÓVIL'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Detalle */}
          <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-4 min-h-60">
            {activeRigg ? (
              <div className="animate-[fade-in_0.3s_ease-out]">
                <div className="flex items-center gap-2 mb-3">
                  <Anchor className={`w-5 h-5 ${activeRigg.type === 'FIJA' ? 'text-amber-400' : 'text-emerald-400'}`} />
                  <h4 className="text-lg font-bold text-white">{activeRigg.label}</h4>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed mb-3">{activeRigg.description}</p>
                <div
                  className={`text-xs px-2 py-1 rounded inline-block ${
                    activeRigg.type === 'FIJA' ? 'bg-amber-500/20 text-amber-200' : 'bg-emerald-500/20 text-emerald-200'
                  }`}
                >
                  Jarcia {activeRigg.type === 'FIJA' ? 'Fija' : 'Móvil'}
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-500">
                <Wind className="w-8 h-8 mb-2 opacity-50" />
                <p className="text-sm">Selecciona un cabo de la lista.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
