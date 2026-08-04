import React, { useState } from 'react';
import { Anchor, Sailboat, Ruler, Info, X, Wind } from 'lucide-react';

interface HullHotspot {
  id: string;
  label: string;
  description: string;
  // Posición en porcentaje (x, y) sobre el contenedor del SVG
  x: number;
  y: number;
  // Categoría para la leyenda
  category: 'orientacion' | 'medidas' | 'obra_viva' | 'obra_muerta' | 'estructura';
  color: string;
}

/*
 * Vista de perfil (lateral) del velero, mirando hacia estribor.
 * Convención náutica: mirando hacia proa, BABOR = izquierda, ESTRIBOR = derecha.
 * En perfil mirando a estribor, vemos la banda de estribor (derecha del barco)
 * y el casco se "abre" hacia babor (no visible desde este lado, pero está al fondo).
 *
 * Sin embargo, la forma estándar de representar babor/estribor en un plano lateral
 * es por las etiquetas de cada banda del casco. En el perfil, el agua está ABAJO
 * y el aire ARRIBA; izquierda/derecha del plano se mapea a popa/proa.
 *
 * Para los hotspots de banda usamos una vista de planta alternativa:
 * mostramos la banda de estribor y marcamos babor como "el lado opuesto".
 */
const HULL_HOTSPOTS: HullHotspot[] = [
  // Orientación (popa/proa)
  { id: 'proa', label: 'Proa', description: 'Parte delantera del casco. Termina en la roda, diseñada para cortar el agua con la menor resistencia posible.', x: 86, y: 50, category: 'orientacion', color: '#22d3ee' },
  { id: 'popa', label: 'Popa', description: 'Parte trasera del casco, donde se ubica el timón. En la foto/el plano aparece a la IZQUIERDA.', x: 14, y: 50, category: 'orientacion', color: '#22d3ee' },
  // Bandas (las ponemos en el perfil, claramente señaladas)
  { id: 'babor', label: 'Babor', description: 'Costado IZQUIERDO del buque mirando hacia proa. En este perfil mirando a estribor, queda al FONDO del plano (detrás del casco).', x: 50, y: 90, category: 'orientacion', color: '#ef4444' },
  { id: 'estribor', label: 'Estribor', description: 'Costado DERECHO del buque mirando hacia proa. Es la banda VISIBLE en este perfil.', x: 50, y: 12, category: 'orientacion', color: '#22c55e' },
  // Medidas longitudinales / verticales (líneas de medición, no puntos)
  { id: 'eslora', label: 'Eslora', description: 'Distancia longitudinal total del casco, medida de proa a popa. Es el LARGO del barco.', x: 50, y: 68, category: 'medidas', color: '#f59e0b' },
  { id: 'manga', label: 'Manga', description: 'Ancho MÁXIMO del casco, medido de babor a estribor. En perfil se ve como el ancho vertical del casco.', x: 92, y: 50, category: 'medidas', color: '#a855f7' },
  { id: 'calado', label: 'Calado', description: 'Distancia vertical desde la LÍNEA DE FLOTACIÓN hasta la parte más baja de la quilla. Indica cuánto "se hunde" el barco.', x: 7, y: 78, category: 'medidas', color: '#06b6d4' },
  { id: 'francobordo', label: 'Francobordo', description: 'Distancia vertical entre la LÍNEA DE FLOTACIÓN y la CUBIERTA principal. Es la RESERVA DE FLOTABILIDAD (lo que evita que se inunde).', x: 93, y: 32, category: 'medidas', color: '#ec4899' },
  // Estructura
  { id: 'obra_viva', label: 'Obra Viva', description: 'Parte del casco que está PERMANENTEMENTE debajo de la línea de flotación. Está siempre en contacto con el agua.', x: 50, y: 82, category: 'obra_viva', color: '#3b82f6' },
  { id: 'obra_muerta', label: 'Obra Muerta', description: 'Parte del casco que se encuentra SOBRE la línea de flotación. Es la "parte seca" del casco en navegación normal.', x: 50, y: 28, category: 'obra_muerta', color: '#eab308' },
  { id: 'quilla', label: 'Quilla', description: 'Pieza longitudinal que recorre el FONDO del casco de proa a popa. Aporta estabilidad y hace de lastre. Es la "espina dorsal" del barco.', x: 50, y: 93, category: 'estructura', color: '#64748b' }
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
          Vista de PERFIL (mirando a estribor). Toca cada punto del velero para descubrir la nomenclatura náutica.
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          {/* SVG del velero (vista de perfil mejorada) */}
          <div className="relative bg-gradient-to-b from-sky-900/30 via-slate-900 to-slate-950 border border-slate-700 rounded-xl overflow-hidden h-64 sm:h-72">
            <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid meet">
              <defs>
                {/* Agua (degradado inferior) */}
                <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#155e75" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#0c4a6e" stopOpacity="0.9" />
                </linearGradient>
                {/* Casco: obra muerta (arriba) y obra viva (abajo) */}
                <linearGradient id="hullTop" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#475569" />
                  <stop offset="100%" stopColor="#334155" />
                </linearGradient>
                <linearGradient id="hullBottom" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1e293b" />
                  <stop offset="100%" stopColor="#020617" />
                </linearGradient>
                {/* Vela */}
                <linearGradient id="sailGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#f8fafc" />
                  <stop offset="100%" stopColor="#cbd5e1" />
                </linearGradient>
              </defs>

              {/* ====== AGUA (debajo de la línea de flotación y=58) ====== */}
              <rect x="0" y="58" width="100" height="42" fill="url(#waterGrad)" />
              {/* Olas */}
              <path d="M0 62 Q 5 60 10 62 T 20 62 T 30 62 T 40 62 T 50 62 T 60 62 T 70 62 T 80 62 T 90 62 T 100 62" stroke="#22d3ee" strokeWidth="0.3" fill="none" opacity="0.5" />
              <path d="M0 70 Q 5 68 10 70 T 20 70 T 30 70 T 40 70 T 50 70 T 60 70 T 70 70 T 80 70 T 90 70 T 100 70" stroke="#22d3ee" strokeWidth="0.3" fill="none" opacity="0.35" />
              <path d="M0 80 Q 5 78 10 80 T 20 80 T 30 80 T 40 80 T 50 80 T 60 80 T 70 80 T 80 80 T 90 80 T 100 80" stroke="#22d3ee" strokeWidth="0.3" fill="none" opacity="0.2" />

              {/* ====== CASCO (forma de velero real) ====== */}
              {/* Obra muerta (parte de arriba, sobre la flotación) */}
              {/* Proa: roda inclinada hacia la derecha (donde apunta el barco) */}
              <path
                d="M 86 30
                   Q 92 38 92 45
                   L 92 56
                   L 88 58
                   L 14 58
                   L 10 56
                   L 10 45
                   Q 10 38 14 32
                   L 18 30
                   Z"
                fill="url(#hullTop)"
                stroke="#64748b"
                strokeWidth="0.4"
              />
              {/* Obra viva (parte inferior, bajo la flotación) - más oscura */}
              <path
                d="M 88 58
                   L 92 56
                   L 92 60
                   Q 90 70 80 76
                   L 20 76
                   Q 10 70 8 60
                   L 8 56
                   L 12 58
                   L 88 58
                   Z"
                fill="url(#hullBottom)"
                stroke="#475569"
                strokeWidth="0.4"
              />
              {/* Línea de flotación destacada */}
              <line x1="10" y1="58" x2="90" y2="58" stroke="#22d3ee" strokeWidth="0.5" strokeDasharray="2,1" opacity="0.9" />
              <text x="50" y="56" fontSize="2.5" fill="#22d3ee" textAnchor="middle" opacity="0.7" fontStyle="italic">línea de flotación</text>

              {/* Cubierta (línea horizontal arriba del casco) */}
              <line x1="14" y1="30" x2="86" y2="30" stroke="#94a3b8" strokeWidth="0.4" />
              {/* Banda de estribor (lateral visible superior) */}
              <line x1="10" y1="32" x2="90" y2="32" stroke="#94a3b8" strokeWidth="0.2" strokeDasharray="1,1" opacity="0.5" />

              {/* ====== QUILLA (sale de la obra viva) ====== */}
              <path
                d="M 25 76 L 75 76 L 70 84 L 30 84 Z"
                fill="#0f172a"
                stroke="#475569"
                strokeWidth="0.3"
              />
              {/* Bulbo de quilla (lastre) */}
              <ellipse cx="50" cy="87" rx="8" ry="2.5" fill="#020617" stroke="#475569" strokeWidth="0.3" />

              {/* ====== TIMÓN (en la popa) ====== */}
              <rect x="6" y="50" width="2" height="14" fill="#475569" rx="0.3" />
              {/* Caña del timón (perpendicular saliendo del casco) */}
              <line x1="7" y1="50" x2="2" y2="44" stroke="#475569" strokeWidth="0.5" />
              <circle cx="2" cy="44" r="1" fill="#94a3b8" />

              {/* ====== ARBOLADURA (mástil y jarcia) ====== */}
              {/* Mástil */}
              <line x1="50" y1="6" x2="50" y2="30" stroke="#a8a29e" strokeWidth="0.9" />
              {/* Perilla (tope) */}
              <circle cx="50" cy="6" r="0.9" fill="#f59e0b" />
              {/* Botavara (spar horizontal al pie del mástil) */}
              <line x1="14" y1="30" x2="50" y2="30" stroke="#a8a29e" strokeWidth="0.6" />

              {/* Estay proel (del tope del mástil hacia la proa) */}
              <line x1="50" y1="7" x2="86" y2="30" stroke="#94a3b8" strokeWidth="0.3" strokeDasharray="1,0.5" />
              {/* Estay popel / backstay (del tope hacia popa) */}
              <line x1="50" y1="7" x2="14" y2="30" stroke="#94a3b8" strokeWidth="0.3" strokeDasharray="1,0.5" />
              {/* Obenques (del mástil hacia las bandas) */}
              <line x1="50" y1="14" x2="14" y2="30" stroke="#94a3b8" strokeWidth="0.3" strokeDasharray="1,0.5" />
              <line x1="50" y1="14" x2="86" y2="30" stroke="#94a3b8" strokeWidth="0.3" strokeDasharray="1,0.5" />

              {/* ====== VELAS ====== */}
              {/* Vela mayor (entre el mástil y la botavara) */}
              <polygon points="50,8 50,30 18,30" fill="url(#sailGrad)" opacity="0.92" stroke="#94a3b8" strokeWidth="0.3" />
              {/* Línea de baluma/grátil de la mayor */}
              <line x1="50" y1="8" x2="18" y2="30" stroke="#94a3b8" strokeWidth="0.2" opacity="0.5" />

              {/* Foque (sail entre proa y mástil) */}
              <polygon points="50,12 86,30 50,30" fill="url(#sailGrad)" opacity="0.8" stroke="#94a3b8" strokeWidth="0.3" />

              {/* ====== INDICADORES DE REFERENCIA (sin label) ====== */}
              {/* Flecha indicadora del sentido "hacia proa" */}
              <g opacity="0.4">
                <line x1="75" y1="20" x2="88" y2="20" stroke="#fbbf24" strokeWidth="0.2" markerEnd="url(#arrow)" />
                <text x="78" y="18" fontSize="2" fill="#fbbf24">→ proa</text>
              </g>
              <defs>
                <marker id="arrow" markerWidth="3" markerHeight="3" refX="2" refY="1.5" orient="auto">
                  <polygon points="0 0, 3 1.5, 0 3" fill="#fbbf24" />
                </marker>
              </defs>
            </svg>

            {/* Etiquetas fijas: "Babor" (abajo) y "Estribor" (arriba) - referencia constante */}
            <div className="absolute left-2 top-2 text-[10px] font-bold text-emerald-300 bg-slate-900/70 px-1.5 py-0.5 rounded border border-emerald-500/40">
              ↑ ESTRIBOR (banda visible)
            </div>
            <div className="absolute left-2 bottom-2 text-[10px] font-bold text-rose-300 bg-slate-900/70 px-1.5 py-0.5 rounded border border-rose-500/40">
              ↓ BABOR (banda opuesta)
            </div>
            <div className="absolute right-2 top-2 text-[10px] font-bold text-amber-300 bg-slate-900/70 px-1.5 py-0.5 rounded border border-amber-500/40">
              → PROA
            </div>
            <div className="absolute right-2 bottom-2 text-[10px] font-bold text-amber-300 bg-slate-900/70 px-1.5 py-0.5 rounded border border-amber-500/40">
              ← POPA
            </div>

            {/* Hotspots superpuestos */}
            {HULL_HOTSPOTS.map(h => (
              <button
                key={h.id}
                onClick={() => setActiveHull(h)}
                className="absolute -translate-x-1/2 -translate-y-1/2 group focus:outline-none z-10"
                style={{ left: `${h.x}%`, top: `${h.y}%` }}
                aria-label={h.label}
                title={h.label}
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
          <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-3 min-h-64 flex flex-col">
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

                {/* Mini-diagrama según el hotspot seleccionado */}
                <div className="mt-4 bg-slate-950/50 rounded-lg p-3 border border-slate-800">
                  <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">Ubicación</p>
                  {activeHull.id === 'proa' && <p className="text-xs text-slate-300">Extremo DERECHO del casco (donde "termina" la proa con la roda).</p>}
                  {activeHull.id === 'popa' && <p className="text-xs text-slate-300">Extremo IZQUIERDO del casco (donde se monta el timón).</p>}
                  {activeHull.id === 'babor' && <p className="text-xs text-slate-300">Banda IZQUIERDA del barco (mirando a proa). En este perfil queda "detrás" del casco.</p>}
                  {activeHull.id === 'estribor' && <p className="text-xs text-slate-300">Banda DERECHA del barco (mirando a proa). Es la banda VISIBLE en este perfil.</p>}
                  {activeHull.id === 'eslora' && <p className="text-xs text-slate-300">Línea horizontal imaginaria de proa a popa. Es el LARGO total del barco.</p>}
                  {activeHull.id === 'manga' && <p className="text-xs text-slate-300">Distancia transversal de babor a estribor (en perfil, se ve como el ancho del casco).</p>}
                  {activeHull.id === 'calado' && <p className="text-xs text-slate-300">Línea vertical desde la flotación hasta la quilla. Define cuánto se hunde el barco.</p>}
                  {activeHull.id === 'francobordo' && <p className="text-xs text-slate-300">Distancia vertical entre la flotación y la cubierta. RESERVA de flotabilidad.</p>}
                  {activeHull.id === 'obra_viva' && <p className="text-xs text-slate-300">Casco BAJO el agua (la parte oscura). En contacto permanente con el mar.</p>}
                  {activeHull.id === 'obra_muerta' && <p className="text-xs text-slate-300">Casco SOBRE el agua (la parte más clara). Es la "obra" expuesta al aire.</p>}
                  {activeHull.id === 'quilla' && <p className="text-xs text-slate-300">Pieza en el fondo, debajo de la obra viva, con bulbo de lastre. Da estabilidad.</p>}
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-500">
                <Info className="w-8 h-8 mb-2 opacity-50" />
                <p className="text-sm">Selecciona un punto del velero para ver su descripción.</p>
              </div>
            )}

            {/* Mini leyenda de colores */}
            <div className="mt-auto pt-4 border-t border-slate-700">
              <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-2">Leyenda de colores</p>
              <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#22d3ee' }} /><span className="text-slate-300">Orientación (proa/popa)</span></div>
                <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-400" /><span className="text-slate-300">Medidas (eslora, manga)</span></div>
                <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500" /><span className="text-slate-300">Obra viva (bajo agua)</span></div>
                <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-yellow-500" /><span className="text-slate-300">Obra muerta (sobre agua)</span></div>
                <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-rose-500" /><span className="text-slate-300">Babor</span></div>
                <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" /><span className="text-slate-300">Estribor</span></div>
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
          <div className="space-y-2 max-h-72 overflow-y-auto pr-2">
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
          <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-3 min-h-48">
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
