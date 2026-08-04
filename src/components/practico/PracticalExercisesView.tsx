import React, { useMemo, useState } from 'react';
import { BookOpen, Check, ChevronLeft, ChevronRight, Eye, EyeOff, ListChecks } from 'lucide-react';
import practicosData from '../../data/practicos.json';
import type { PracticalExercise } from '../../types/quiz';

const TYPE_LABELS: Record<PracticalExercise['type'], string> = {
  CARTA_LAT_LONG: 'Latitud, longitud, millas y tiempo',
  DECLINACION: 'Declinación magnética',
  MAREAS: 'Mareas y paso crítico',
  MARCACIONES: 'Marcaciones y posición',
  RUMBO_VELOCIDAD: 'Rumbo, distancia y tiempo'
};

const ChartScaleGuide: React.FC = () => (
  <div className="mt-4 rounded-xl border border-cyan-500/30 bg-slate-950 p-3">
    <div className="grid grid-cols-[1fr_92px] gap-3 items-center">
      <svg viewBox="0 0 260 145" className="w-full rounded-lg border border-slate-700 bg-[#082f49]" role="img" aria-label="Carta con paralelos de latitud, meridianos de longitud y derrota entre A y B">
        <defs>
          <pattern id="chart-grid" width="52" height="36" patternUnits="userSpaceOnUse">
            <path d="M52 0H0V36" fill="none" stroke="#67e8f9" strokeOpacity=".28" strokeWidth="1" />
          </pattern>
          <marker id="route-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0 0L6 3L0 6Z" fill="#fbbf24" /></marker>
        </defs>
        <rect width="260" height="145" fill="url(#chart-grid)" />
        <path d="M48 108L203 34" stroke="#fbbf24" strokeWidth="4" strokeDasharray="7 4" markerEnd="url(#route-arrow)" />
        <circle cx="48" cy="108" r="7" fill="#22d3ee" stroke="white" strokeWidth="2" />
        <circle cx="203" cy="34" r="7" fill="#f59e0b" stroke="white" strokeWidth="2" />
        <text x="34" y="130" fill="white" fontSize="12" fontWeight="700">A</text>
        <text x="211" y="29" fill="white" fontSize="12" fontWeight="700">B</text>
        <text x="8" y="17" fill="#a5f3fc" fontSize="9">paralelos</text>
        <text x="178" y="138" fill="#a5f3fc" fontSize="9">meridianos</text>
      </svg>
      <div className="space-y-2 text-[10px] leading-snug">
        <div className="rounded-lg bg-cyan-500/10 border border-cyan-500/25 p-2 text-cyan-100"><strong>Escala lateral</strong><br />1′ latitud = 1 MN</div>
        <div className="rounded-lg bg-amber-500/10 border border-amber-500/25 p-2 text-amber-100"><strong>Tiempo</strong><br />T = D ÷ V</div>
      </div>
    </div>
    <p className="mt-2 text-[10px] leading-relaxed text-slate-400"><strong className="text-rose-300">No midas millas en la escala horizontal de longitud.</strong> Abrí el compás entre A y B y trasladá esa abertura a la escala de latitudes, a la altura media de la derrota.</p>
  </div>
);

export const PracticalExercisesView: React.FC = () => {
  const exercises = practicosData as PracticalExercise[];
  const [index, setIndex] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const exercise = exercises[index];
  const steps = useMemo(() => exercise.explanationStepByStep
    .split('\n')
    .map(step => step.replace(/^\s*\d+[.)-]?\s*/, '').trim())
    .filter(Boolean), [exercise]);

  const goTo = (nextIndex: number) => {
    setIndex(Math.min(exercises.length - 1, Math.max(0, nextIndex)));
    setShowSolution(false);
  };

  return (
    <div className="h-full min-h-0 grid grid-cols-1 md:grid-cols-12 gap-2 overflow-hidden">
      <section className="md:col-span-5 min-h-0 rounded-2xl border border-slate-800 bg-slate-900 flex flex-col overflow-hidden">
        <div className="shrink-0 p-3 border-b border-slate-800">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-[9px] uppercase tracking-widest text-emerald-400 font-black">Ejercicio {index + 1} de {exercises.length}</p>
              <h3 className="text-sm font-black text-white">{TYPE_LABELS[exercise.type]}</h3>
            </div>
            <ListChecks className="w-5 h-5 text-emerald-400" />
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto p-4">
          <div className="flex items-center gap-1.5 text-cyan-300 mb-2">
            <BookOpen className="w-4 h-4" />
            <span className="text-[10px] uppercase tracking-wider font-black">Enunciado</span>
          </div>
          <p className="text-sm text-slate-100 leading-relaxed font-semibold whitespace-pre-line">{exercise.statement}</p>
          {exercise.type === 'CARTA_LAT_LONG' && <ChartScaleGuide />}
        </div>

        <div className="shrink-0 p-3 border-t border-slate-800 space-y-2">
          <button
            onClick={() => setShowSolution(value => !value)}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 py-2.5 text-xs font-black transition-all duration-300"
          >
            {showSolution ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {showSolution ? 'Ocultar resolución' : 'Ver resolución paso a paso'}
          </button>
          <div className="flex gap-2">
            <button onClick={() => goTo(index - 1)} disabled={index === 0} className="flex-1 flex items-center justify-center gap-1 rounded-lg border border-slate-700 bg-slate-950 py-2 text-xs font-bold text-slate-300 disabled:opacity-30">
              <ChevronLeft className="w-4 h-4" /> Anterior
            </button>
            <button onClick={() => goTo(index + 1)} disabled={index === exercises.length - 1} className="flex-1 flex items-center justify-center gap-1 rounded-lg border border-slate-700 bg-slate-950 py-2 text-xs font-bold text-slate-300 disabled:opacity-30">
              Siguiente <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      <section className="md:col-span-7 min-h-0 rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden flex flex-col">
        <div className="shrink-0 p-3 border-b border-slate-800">
          <p className="text-[9px] uppercase tracking-widest text-amber-400 font-black">Resolución razonada</p>
          <h3 className="text-sm font-black text-white">Procedimiento completo</h3>
        </div>

        {!showSolution ? (
          <div className="flex-1 grid place-items-center p-6 text-center">
            <div>
              <Eye className="w-10 h-10 text-slate-700 mx-auto mb-3" />
              <p className="text-sm font-bold text-slate-300">Intentá resolver el enunciado primero</p>
              <p className="text-[11px] text-slate-500 mt-1">Cuando estés listo, revelá el procedimiento desde el panel izquierdo.</p>
            </div>
          </div>
        ) : (
          <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-2">
            {steps.map((step, stepIndex) => (
              <div key={`${exercise.id}-${stepIndex}`} className="grid grid-cols-[34px_1fr] gap-3 rounded-xl border border-slate-800 bg-slate-900 p-3">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 grid place-items-center text-xs font-black">{stepIndex + 1}</div>
                <p className="text-xs text-slate-200 leading-relaxed self-center whitespace-pre-line">{step}</p>
              </div>
            ))}
            <div className="grid grid-cols-[34px_1fr] gap-3 rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 text-slate-950 grid place-items-center"><Check className="w-4 h-4" /></div>
              <div><p className="text-[9px] uppercase tracking-wider text-emerald-400 font-black">Resultado</p><p className="text-sm font-black text-emerald-200">{String(exercise.expectedResult)}</p></div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
