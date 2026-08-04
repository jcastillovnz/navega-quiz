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
  { id: 'proa', label: 'Proa', description: 'Parte delantera del casco. Termina en la roda inclinada hacia adelante, diseñada para cortar el agua con la menor resistencia posible.', x: 88, y: 50, category: 'orientacion', color: '#22d3ee' },
  { id: 'popa', label: 'Popa', description: 'Parte trasera del casco, donde se ubica el timón. En el plano aparece a la IZQUIERDA.', x: 12, y: 55, category: 'orientacion', color: '#22d3ee' },
  // Bandas (las ponemos en el perfil, claramente señaladas)
  { id: 'babor', label: 'Babor', description: 'Costado IZQUIERDO del buque mirando hacia proa. En este perfil mirando a estribor, queda al FONDO del plano (detrás del casco).', x: 50, y: 92, category: 'orientacion', color: '#ef4444' },
  { id: 'estribor', label: 'Estribor', description: 'Costado DERECHO del buque mirando hacia proa. Es la banda VISIBLE en este perfil.', x: 50, y: 8, category: 'orientacion', color: '#22c55e' },
  // Medidas longitudinales / verticales
  { id: 'eslora', label: 'Eslora', description: 'Distancia longitudinal total del casco, medida de proa a popa. Es el LARGO del barco.', x: 50, y: 75, category: 'medidas', color: '#f59e0b' },
  { id: 'manga', label: 'Manga', description: 'Ancho MÁXIMO del casco, medido de babor a estribor. En perfil se ve como el ancho vertical del casco.', x: 95, y: 55, category: 'medidas', color: '#a855f7' },
  { id: 'calado', label: 'Calado', description: 'Distancia vertical desde la LÍNEA DE FLOTACIÓN hasta la parte más baja de la quilla (bulbo). Indica cuánto se "hunde" el barco.', x: 5, y: 75, category: 'medidas', color: '#06b6d4' },
  { id: 'francobordo', label: 'Francobordo', description: 'Distancia vertical entre la LÍNEA DE FLOTACIÓN y la CUBIERTA principal. Es la RESERVA DE FLOTABILIDAD (lo que evita que se inunde).', x: 97, y: 32, category: 'medidas', color: '#ec4899' },
  // Estructura
  { id: 'obra_viva', label: 'Obra Viva', description: 'Parte del casco que está PERMANENTEMENTE debajo de la línea de flotación. Está siempre en contacto con el agua.', x: 50, y: 86, category: 'obra_viva', color: '#3b82f6' },
  { id: 'obra_muerta', label: 'Obra Muerta', description: 'Parte del casco que se encuentra SOBRE la línea de flotación. Es la "parte seca" del casco en navegación normal.', x: 50, y: 22, category: 'obra_muerta', color: '#eab308' },
  { id: 'quilla', label: 'Quilla', description: 'Pieza longitudinal que recorre el FONDO del casco de proa a popa. Aporta estabilidad y lastre. Es la "espina dorsal" del barco.', x: 50, y: 95, category: 'estructura', color: '#64748b' }
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
            <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid meet">
              <defs>
                <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#155e75" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#0c4a6e" stopOpacity="0.9" />
                </linearGradient>
                <linearGradient id="hullTop" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#64748b" />
                  <stop offset="100%" stopColor="#334155" />
                </linearGradient>
                <linearGradient id="hullBottom" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1e293b" />
                  <stop offset="100%" stopColor="#020617" />
                </linearGradient>
                <linearGradient id="sailGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#f8fafc" />
                  <stop offset="100%" stopColor="#cbd5e1" />
                </linearGradient>
                <pattern id="dotgrid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <circle cx="10" cy="10" r="0.6" fill="#1e293b" />
                </pattern>
              </defs>

              {/* Fondo con grilla sutil */}
              <rect width="200" height="200" fill="url(#dotgrid)" />

              {/* ====== AGUA (debajo de la línea de flotación y=120) ====== */}
              <rect x="0" y="120" width="200" height="80" fill="url(#waterGrad)" />
              {/* Olas */}
              <path d="M0 128 Q 10 124 20 128 T 40 128 T 60 128 T 80 128 T 100 128 T 120 128 T 140 128 T 160 128 T 180 128 T 200 128" stroke="#22d3ee" strokeWidth="0.6" fill="none" opacity="0.5" />
              <path d="M0 142 Q 10 138 20 142 T 40 142 T 60 142 T 80 142 T 100 142 T 120 142 T 140 142 T 160 142 T 180 142 T 200 142" stroke="#22d3ee" strokeWidth="0.5" fill="none" opacity="0.35" />
              <path d="M0 158 Q 10 154 20 158 T 40 158 T 60 158 T 80 158 T 100 158 T 120 158 T 140 158 T 160 158 T 180 158 T 200 158" stroke="#22d3ee" strokeWidth="0.4" fill="none" opacity="0.25" />

              {/* ====== CASCO COMPLETO (forma anatómica de velero) ====== */}
              {/* Obra MUERTA (sobre la flotación) - gris más claro */}
              <path
                d="M 175 60
                   L 188 80
                   L 188 116
                   L 184 122
                   L 35 122
                   L 28 118
                   L 28 100
                   L 30 85
                   L 40 70
                   L 50 60
                   Z"
                fill="url(#hullTop)"
                stroke="#94a3b8"
                strokeWidth="0.7"
              />
              {/* Obra VIVA (bajo la flotación) - más oscura, forma de V */}
              <path
                d="M 184 122
                   L 188 116
                   L 188 125
                   Q 184 145 165 158
                   L 50 158
                   Q 30 145 25 125
                   L 25 118
                   L 28 122
                   L 184 122
                   Z"
                fill="url(#hullBottom)"
                stroke="#475569"
                strokeWidth="0.7"
              />

              {/* Línea de flotación destacada */}
              <line x1="30" y1="120" x2="184" y2="120" stroke="#22d3ee" strokeWidth="0.8" strokeDasharray="4,2" opacity="0.9" />
              <text x="100" y="117" fontSize="5" fill="#22d3ee" textAnchor="middle" opacity="0.85" fontStyle="italic">línea de flotación</text>

              {/* Cubierta (línea horizontal superior del casco) */}
              <line x1="50" y1="60" x2="175" y2="60" stroke="#cbd5e1" strokeWidth="0.8" />

              {/* Línea de la cubierta/acomodación (banda de estribor) */}
              <line x1="32" y1="68" x2="180" y2="68" stroke="#94a3b8" strokeWidth="0.4" strokeDasharray="2,1" opacity="0.6" />

              {/* Pequeña caseta/cabina sobre la cubierta */}
              <rect x="90" y="50" width="50" height="12" fill="#475569" stroke="#94a3b8" strokeWidth="0.5" rx="1" />
              {/* Ventanas de la caseta */}
              <rect x="100" y="54" width="6" height="4" fill="#0ea5e9" opacity="0.7" />
              <rect x="112" y="54" width="6" height="4" fill="#0ea5e9" opacity="0.7" />
              <rect x="124" y="54" width="6" height="4" fill="#0ea5e9" opacity="0.7" />

              {/* ====== QUILLA (sale del fondo del casco) ====== */}
              <path
                d="M 60 158 L 155 158 L 145 175 L 70 175 Z"
                fill="#020617"
                stroke="#475569"
                strokeWidth="0.5"
              />
              {/* Bulbo de quilla (lastre) */}
              <ellipse cx="107" cy="180" rx="22" ry="6" fill="#020617" stroke="#475569" strokeWidth="0.5" />

              {/* ====== TIMÓN (en la popa) ====== */}
              <rect x="20" y="100" width="5" height="30" fill="#475569" rx="0.5" />
              {/* Caña del timón (saliendo hacia atrás-arriba) */}
              <line x1="22" y1="100" x2="8" y2="88" stroke="#475569" strokeWidth="1" />
              <circle cx="8" cy="88" r="2.5" fill="#94a3b8" stroke="#475569" strokeWidth="0.5" />

              {/* ====== ARBOLADURA (mástil y jarcia) ====== */}
              {/* Mástil */}
              <line x1="100" y1="12" x2="100" y2="62" stroke="#a8a29e" strokeWidth="1.5" />
              {/* Perilla (tope del mástil) */}
              <circle cx="100" cy="12" r="1.8" fill="#f59e0b" />
              {/* Botavara (spar horizontal al pie del mástil) */}
              <line x1="35" y1="62" x2="100" y2="62" stroke="#a8a29e" strokeWidth="1" />

              {/* Estay proel (del tope hacia proa) */}
              <line x1="100" y1="14" x2="175" y2="60" stroke="#94a3b8" strokeWidth="0.5" strokeDasharray="1.5,1" />
              {/* Estay popel / backstay (del tope hacia popa) */}
              <line x1="100" y1="14" x2="40" y2="60" stroke="#94a3b8" strokeWidth="0.5" strokeDasharray="1.5,1" />
              {/* Obenques (del mástil hacia las bandas) */}
              <line x1="100" y1="28" x2="40" y2="60" stroke="#94a3b8" strokeWidth="0.5" strokeDasharray="1.5,1" />
              <line x1="100" y1="28" x2="175" y2="60" stroke="#94a3b8" strokeWidth="0.5" strokeDasharray="1.5,1" />

              {/* ====== VELAS ====== */}
              {/* Vela mayor (entre el mástil y la botavara) */}
              <polygon points="100,16 100,62 40,62" fill="url(#sailGrad)" opacity="0.93" stroke="#94a3b8" strokeWidth="0.5" />
              {/* Línea de baluma de la mayor */}
              <line x1="100" y1="16" x2="40" y2="62" stroke="#94a3b8" strokeWidth="0.3" opacity="0.5" />

              {/* Foque (vela entre proa y mástil) */}
              <polygon points="100,22 175,60 100,60" fill="url(#sailGrad)" opacity="0.8" stroke="#94a3b8" strokeWidth="0.5" />
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
