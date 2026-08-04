import React, { useMemo, useState } from 'react';
import { BookOpen, Check, ChevronRight, Lightbulb, RotateCcw, X } from 'lucide-react';
import type { QuizQuestion } from '../../types/quiz';
import { addToReview, addXP, registerLearningAnswer, registerStudy } from '../../utils/storage';

interface IntegratedLearningViewProps {
  moduleId: string;
  title: string;
  questions: QuizQuestion[];
  visual: React.ReactNode;
  visualForQuestion?: (question: QuizQuestion) => React.ReactNode;
  accentClass?: string;
}

const theoryFrom = (explanation: string): string => {
  const clean = explanation.split('[REGLA:')[0].split('[TIP:')[0].trim();
  return clean || 'Observá con atención la ilustración y relacioná sus elementos antes de responder.';
};

export const IntegratedLearningView: React.FC<IntegratedLearningViewProps> = ({
  moduleId,
  title,
  questions,
  visual,
  visualForQuestion,
  accentClass = 'bg-cyan-500'
}) => {
  const ordered = useMemo(() => [...questions], [questions]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const question = ordered[index];

  if (!question) {
    return <div className="h-full grid place-items-center text-xs text-slate-400">No hay lecciones disponibles.</div>;
  }

  const answer = (optionId: string) => {
    if (selected) return;
    const option = question.options.find(item => item.id === optionId);
    const correct = Boolean(option?.isCorrect);
    setSelected(optionId);
    setIsCorrect(correct);
    if (correct) {
      setCorrectCount(value => value + 1);
      addXP(10);
    } else {
      addToReview(question.id);
    }
    registerStudy();
    registerLearningAnswer(moduleId, question.id, correct);
  };

  const next = () => {
    setSelected(null);
    setIsCorrect(null);
    setIndex(value => (value + 1) % ordered.length);
  };

  const restart = () => {
    setIndex(0);
    setSelected(null);
    setIsCorrect(null);
    setCorrectCount(0);
  };

  const progress = ((index + (selected ? 1 : 0)) / ordered.length) * 100;

  return (
    <div className="h-full min-h-0 grid grid-cols-1 md:grid-cols-12 gap-2 overflow-hidden">
      <section className="md:col-span-7 min-h-0 overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 relative">
        <div className="absolute left-2 top-2 z-20 rounded-lg border border-white/20 bg-slate-950/80 backdrop-blur-md px-2 py-1">
          <p className="text-[9px] uppercase tracking-widest text-cyan-300 font-black">Ilustración interactiva</p>
          <p className="text-[10px] text-slate-300">Explorá la escena antes de responder</p>
        </div>
        <div className="h-full min-h-0 overflow-hidden pt-10">{visualForQuestion ? visualForQuestion(question) : visual}</div>
      </section>

      <section className="md:col-span-5 min-h-0 overflow-hidden rounded-2xl border border-white/10 bg-slate-900/95 backdrop-blur-md flex flex-col">
        <div className="p-3 border-b border-slate-800 shrink-0">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div>
              <p className="text-[9px] uppercase tracking-widest text-slate-500 font-black">Aprender · {title}</p>
              <p className="text-xs font-extrabold text-white">Concepto {index + 1} de {ordered.length}</p>
            </div>
            <span className="text-[10px] font-black text-amber-300">{correctCount} dominados</span>
          </div>
          <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <div className={`h-full ${accentClass} transition-all duration-300`} style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto p-3 space-y-3">
          <div className="rounded-xl border border-cyan-500/25 bg-cyan-500/10 p-3">
            <div className="flex items-center gap-1.5 mb-1.5 text-cyan-300">
              <BookOpen className="w-3.5 h-3.5" />
              <span className="text-[10px] uppercase tracking-wider font-black">Idea esencial</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-200">{theoryFrom(question.explanation)}</p>
          </div>

          <div>
            <div className="flex items-center gap-1.5 mb-2 text-amber-300">
              <Lightbulb className="w-3.5 h-3.5" />
              <span className="text-[10px] uppercase tracking-wider font-black">Comprobación inmediata</span>
            </div>
            <p className="text-sm leading-snug font-bold text-white mb-2.5">{question.question}</p>
            <div className="space-y-1.5">
              {question.options.map(option => {
                const revealCorrect = selected && option.isCorrect;
                const revealWrong = selected === option.id && !option.isCorrect;
                return (
                  <button
                    key={option.id}
                    onClick={() => answer(option.id)}
                    disabled={Boolean(selected)}
                    className={`w-full text-left rounded-xl border px-3 py-2 text-xs font-semibold transition-all duration-300 ${
                      revealCorrect
                        ? 'border-emerald-400 bg-emerald-500/20 text-emerald-100'
                        : revealWrong
                          ? 'border-rose-400 bg-rose-500/20 text-rose-100 animate-[shake_0.35s_ease-in-out]'
                          : 'border-slate-700 bg-slate-950 text-slate-200 hover:border-cyan-500/60 hover:bg-slate-800'
                    }`}
                  >
                    <span className="inline-flex w-5 h-5 mr-2 items-center justify-center rounded-md bg-slate-800 text-[10px]">{option.id}</span>
                    {option.text}
                  </button>
                );
              })}
            </div>
          </div>

          {selected && (
            <div className={`rounded-xl border p-3 ${isCorrect ? 'border-emerald-500/40 bg-emerald-500/10' : 'border-rose-500/40 bg-rose-500/10'}`}>
              <div className={`flex items-center gap-1.5 text-xs font-black mb-1 ${isCorrect ? 'text-emerald-300' : 'text-rose-300'}`}>
                {isCorrect ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                {isCorrect ? 'Concepto comprendido' : 'Revisalo en la ilustración'}
              </div>
              <p className="text-[11px] leading-relaxed text-slate-300">{question.explanation}</p>
            </div>
          )}
        </div>

        <div className="p-2.5 border-t border-slate-800 shrink-0 flex gap-2">
          <button onClick={restart} className="p-2 rounded-lg border border-slate-700 text-slate-400 hover:text-white transition-all duration-300" title="Reiniciar ruta">
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={next}
            disabled={!selected}
            className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-black transition-all duration-300 ${selected ? `${accentClass} text-slate-950` : 'bg-slate-800 text-slate-600 cursor-not-allowed'}`}
          >
            Siguiente concepto <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
};
