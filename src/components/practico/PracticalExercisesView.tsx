import React, { useMemo, useState } from 'react';
import { BookOpen, Check, ChevronLeft, ChevronRight, Eye, EyeOff, ListChecks } from 'lucide-react';
import practicosData from '../../data/practicos.json';
import type { PracticalExercise } from '../../types/quiz';
import buenosAiresChart from '../../assets/buenos_aires_nautical_chart_training.png';

const TYPE_LABELS: Record<PracticalExercise['type'], string> = {
  CARTA_LAT_LONG: 'Latitud, longitud, millas y tiempo',
  DECLINACION: 'Declinación magnética',
  MAREAS: 'Mareas y paso crítico',
  MARCACIONES: 'Marcaciones y posición',
  RUMBO_VELOCIDAD: 'Rumbo, distancia y tiempo'
};

const ChartScaleGuide: React.FC = () => (
  <div className="mt-4 rounded-xl border border-cyan-500/30 bg-slate-950 p-3">
    <div className="relative overflow-hidden rounded-lg border border-slate-700 aspect-[5/4] bg-slate-800">
      <img src={buenosAiresChart} alt="Carta abierta del Río de la Plata frente a Buenos Aires con señales marítimas" className="absolute inset-0 h-full w-full object-cover" />
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" role="img" aria-label="Derrota entre las posiciones A y B sobre una carta del área de Buenos Aires">
        <defs>
          <marker id="ba-route-arrow" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto"><path d="M0 0L5 2.5L0 5Z" fill="#f59e0b" /></marker>
        </defs>
        <g stroke="#0891b2" strokeWidth=".35" strokeDasharray="1.5 1" opacity=".85">
          <line x1="0" y1="14" x2="100" y2="14" /><line x1="0" y1="43.4" x2="100" y2="43.4" /><line x1="0" y1="72.9" x2="100" y2="72.9" />
          <line x1="10" y1="0" x2="10" y2="100" /><line x1="38.4" y1="0" x2="38.4" y2="100" /><line x1="66.9" y1="0" x2="66.9" y2="100" />
        </g>
        <path d="M14.7 28.7L47.9 63.1" stroke="#f59e0b" strokeWidth="1.2" strokeDasharray="2 1" markerEnd="url(#ba-route-arrow)" />
        <circle cx="14.7" cy="28.7" r="2.2" fill="#06b6d4" stroke="white" strokeWidth=".7" />
        <circle cx="47.9" cy="63.1" r="2.2" fill="#f59e0b" stroke="white" strokeWidth=".7" />
      </svg>
      <div className="absolute left-[16%] top-[25%] rounded bg-cyan-600 px-1.5 py-0.5 text-[9px] font-black text-white shadow">A · 34°27′S / 58°29′W</div>
      <div className="absolute left-[50%] top-[60%] rounded bg-amber-500 px-1.5 py-0.5 text-[9px] font-black text-slate-950 shadow">B · 34°34′S / 58°22′W</div>
      <div className="absolute inset-y-0 right-0 w-14 border-l-2 border-cyan-500 bg-slate-950/80 flex flex-col justify-around py-3 text-center text-[8px] font-black text-cyan-200">
        <span>34°24′ S</span><span>34°30′ S</span><span>34°36′ S</span>
        <span className="rounded bg-cyan-500 px-1 py-1 text-slate-950">ESCALA<br />LATITUD</span>
      </div>
      <div className="absolute bottom-1 left-1 rounded bg-slate-950/80 px-1.5 py-1 text-[7px] text-slate-300">© OpenStreetMap · OpenSeaMap · CARTO</div>
    </div>
    <div className="mt-2 grid grid-cols-3 gap-1.5 text-[9px] leading-snug">
      <div className="rounded-lg border border-cyan-500/25 bg-cyan-500/10 p-2 text-cyan-100"><strong>1. Abrí el compás</strong><br />desde A hasta B.</div>
      <div className="rounded-lg border border-cyan-500/25 bg-cyan-500/10 p-2 text-cyan-100"><strong>2. Trasladalo</strong><br />a la escala lateral cercana.</div>
      <div className="rounded-lg border border-amber-500/25 bg-amber-500/10 p-2 text-amber-100"><strong>3. Leé minutos</strong><br />1′ de latitud = 1 MN.</div>
    </div>
    <p className="mt-2 text-[9px] leading-relaxed text-slate-400"><strong className="text-rose-300">Nunca midas millas sobre la escala horizontal de longitud.</strong> Esta lámina usa cartografía abierta real para aprendizaje y no reemplaza una carta oficial actualizada para navegar.</p>
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
              <p className="text-[9px] uppercase tracking-widest text-emerald-400 font-black">Módulo 7 · Ejercicio {index + 1} de {exercises.length}</p>
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
