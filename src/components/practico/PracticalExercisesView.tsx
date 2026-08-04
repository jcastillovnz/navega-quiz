import React, { useMemo, useState } from 'react';
import { BookOpen, Check, ChevronLeft, ChevronRight, Eye, EyeOff, ListChecks } from 'lucide-react';
import practicosData from '../../data/practicos.json';
import type { PracticalExercise } from '../../types/quiz';

const TYPE_LABELS: Record<PracticalExercise['type'], string> = {
  DECLINACION: 'Declinación magnética',
  MAREAS: 'Mareas y paso crítico',
  MARCACIONES: 'Marcaciones y posición',
  RUMBO_VELOCIDAD: 'Rumbo, distancia y tiempo'
};

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
