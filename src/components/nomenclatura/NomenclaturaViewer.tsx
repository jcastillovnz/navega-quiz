import React, { useState } from 'react';
import sailboatAnatomy from '../../assets/sailboat_anatomy.png';
import sailboatRigging from '../../assets/sailboat_rigging.png';

const HULL_TERMS = [
  { term: 'Eslora', def: 'Longitud total del barco de proa a popa (ej: 10 m). La eslora en la línea de flotación (ELF) es la que va a la quilla.', color: 'text-amber-300' },
  { term: 'Manga', def: 'Anchura máxima del casco. Cuanto mayor la manga, más estable el barco.', color: 'text-amber-300' },
  { term: 'Calado', def: 'Profundidad máxima de la quilla bajo el agua. Determina los fondos mínimos donde puede navegar.', color: 'text-sky-300' },
  { term: 'Francobordo', def: 'Altura del costado del barco sobre la línea de flotación. Mayor francobordo = menor riesgo de embarcar agua.', color: 'text-emerald-300' },
  { term: 'Obra Viva', def: 'Parte del casco sumergida en agua (pintada de rojo/antifouling). Incluye la quilla y el timón.', color: 'text-red-400' },
  { term: 'Obra Muerta', def: 'Parte del casco sobre la línea de flotación (pintada de blanco/color). Soporta el viento y las olas.', color: 'text-slate-300' },
  { term: 'Proa', def: 'Parte delantera del barco. Parte que corta el agua al avanzar.', color: 'text-cyan-300' },
  { term: 'Popa', def: 'Parte trasera del barco. Donde está el timón y generalmente la bañera (cockpit).', color: 'text-cyan-300' },
];

const RIGGING_TERMS = [
  { term: 'Palo / Mástil', type: 'FIJA', def: 'Estructura vertical de aluminio o carbono que soporta las velas. Altura típica: 15-18 m.' },
  { term: 'Estay de Proa', type: 'FIJA', def: 'Cable estático que va del tope del palo a la proa. Soporta el foque y el génova.' },
  { term: 'Backstay (Estay Popero)', type: 'FIJA', def: 'Cable de popa que tensiona el palo hacia atrás, opuesto al estay de proa.' },
  { term: 'Obenques', type: 'FIJA', def: 'Cables laterales que sujetan el palo por los costados (babor y estribor). Jarcia fija lateral.' },
  { term: 'Botavara', type: 'MOVIL', def: 'Percha horizontal en la base del palo que sostiene el pie de la vela mayor. Es móvil: cuidado con las viradas.' },
  { term: 'Driza de Mayor', type: 'MOVIL', def: 'Cabo para izar y arriar la vela mayor. Corre por dentro del palo hasta el punto de pena.' },
  { term: 'Escota de Mayor', type: 'MOVIL', def: 'Cabo que controla la posición angular de la botavara (y la vela mayor) respecto al viento.' },
  { term: 'Driza de Foque', type: 'MOVIL', def: 'Cabo para izar el foque o génova por el estay de proa.' },
];

type Section = 'CASCO' | 'JARCIA';

export const NomenclaturaViewer: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const [section, setSection] = useState<Section>('CASCO');
  const [filter, setFilter] = useState<'TODOS' | 'FIJA' | 'MOVIL'>('TODOS');

  const filteredRigging = RIGGING_TERMS.filter(t =>
    filter === 'TODOS' ? true : t.type === filter
  );

  return (
    <div className="h-full flex flex-col gap-2 overflow-hidden">
      {/* Control Bar */}
      <div className="flex items-center justify-between bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 shrink-0">
        <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setSection('CASCO')}
            className={`px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
              section === 'CASCO' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            ⚓ Partes del Casco
          </button>
          <button
            onClick={() => setSection('JARCIA')}
            className={`px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
              section === 'JARCIA' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            ⛵ Arboladura y Jarcia
          </button>
        </div>

        {section === 'JARCIA' && (
          <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 gap-1">
            {(['TODOS', 'FIJA', 'MOVIL'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                  filter === f ? 'bg-slate-700 text-cyan-300' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {f === 'TODOS' ? 'Todos' : f === 'FIJA' ? '🔒 Fija' : '🔄 Móvil'}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* CASCO SECTION */}
      {section === 'CASCO' && (
        <div className="grid md:grid-cols-12 gap-3 flex-1 min-h-0 overflow-hidden">
          {/* Imagen hiperrealista del casco (7 cols) */}
          <div className={`${compact ? 'md:col-span-12' : 'md:col-span-7'} bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden flex items-center justify-center h-full relative`}>
            <img
              src={sailboatAnatomy}
              alt="Anatomía completa del velero con etiquetas: eslora, manga, calado, francobordo, obra viva, obra muerta, proa, popa, quilla, cubierta, bañera"
              className="w-full h-full object-contain p-1"
            />
            <div className="absolute bottom-2 left-2 bg-slate-950/80 backdrop-blur px-2 py-1 rounded-lg border border-slate-800 text-[10px] font-bold text-cyan-400">
              📐 Vista de Perfil — Babor
            </div>
          </div>

          {/* Panel de términos (5 cols) */}
          {!compact && <div className="md:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-3 flex flex-col gap-1.5 overflow-y-auto h-full">
            <h3 className="text-sm font-extrabold text-white shrink-0 mb-1">Términos del Casco</h3>
            {HULL_TERMS.map(t => (
              <div key={t.term} className="bg-slate-950 border border-slate-800 rounded-xl p-2.5">
                <p className={`text-xs font-extrabold ${t.color} mb-0.5`}>{t.term}</p>
                <p className="text-[11px] text-slate-300 leading-relaxed">{t.def}</p>
              </div>
            ))}
          </div>}
        </div>
      )}

      {/* JARCIA SECTION */}
      {section === 'JARCIA' && (
        <div className="grid md:grid-cols-12 gap-3 flex-1 min-h-0 overflow-hidden">
          {/* Imagen hiperrealista de la arboladura (7 cols) */}
          <div className={`${compact ? 'md:col-span-12' : 'md:col-span-7'} bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden flex items-center justify-center h-full relative`}>
            <img
              src={sailboatRigging}
              alt="Arboladura y jarcia del velero: palo, estay de proa, obenques, backstay, botavara, mayor, foque, driza, escota"
              className="w-full h-full object-contain p-1"
            />
            <div className="absolute bottom-2 left-2 bg-slate-950/80 backdrop-blur px-2 py-1 rounded-lg border border-slate-800 text-[10px] font-bold text-cyan-400">
              🔱 Arboladura Completa — Vista 3D
            </div>
          </div>

          {/* Panel de jarcia (5 cols) */}
          {!compact && <div className="md:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-3 flex flex-col gap-1.5 overflow-y-auto h-full">
            <div className="flex items-center gap-2 shrink-0 mb-1">
              <h3 className="text-sm font-extrabold text-white">Piezas de la Arboladura</h3>
              <div className="flex gap-1 ml-auto text-[10px]">
                <span className="px-1.5 py-0.5 bg-slate-700 text-slate-300 rounded font-bold">🔒 Fija: soporta el palo</span>
              </div>
            </div>
            {filteredRigging.map(t => (
              <div key={t.term} className="bg-slate-950 border border-slate-800 rounded-xl p-2.5">
                <div className="flex items-center justify-between mb-0.5">
                  <p className="text-xs font-extrabold text-white">{t.term}</p>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                    t.type === 'FIJA'
                      ? 'bg-slate-700 text-slate-300'
                      : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                  }`}>
                    {t.type === 'FIJA' ? '🔒 FIJA' : '🔄 MÓVIL'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">{t.def}</p>
              </div>
            ))}
          </div>}
        </div>
      )}
    </div>
  );
};
