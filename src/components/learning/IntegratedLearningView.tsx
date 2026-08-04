import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { BookOpen, Check, ChevronRight, Lightbulb, RotateCcw, X } from 'lucide-react';
import type { QuizQuestion } from '../../types/quiz';
import * as storage from '../../utils/storage';

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
  const contentRef = useRef<HTMLDivElement>(null);
  const question = ordered[index];

  useLayoutEffect(() => {
    contentRef.current?.scrollTo({ top: 0, behavior: 'instant' });
  }, [index, selected]);

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
      storage.addXP(10);
    } else {
      storage.addToReview(question.id);
    }
    storage.registerStudy();
    storage.registerLearningAnswer(moduleId, question.id, correct);
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
  const selectedOption = question.options.find(option => option.id === selected);
  const correctOption = question.options.find(option => option.isCorrect);

  return (
    <div className="h-full min-h-0 grid grid-cols-1 md:grid-cols-12 gap-2 overflow-hidden">
      <section className="order-2 md:col-span-7 min-h-0 overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 relative">
        <div className="absolute left-2 top-2 z-20 rounded-lg border border-white/20 bg-slate-950/80 backdrop-blur-md px-2 py-1">
          <p className="text-[9px] uppercase tracking-widest text-cyan-300 font-black">Ilustración contextual</p>
          <p className="text-[10px] text-slate-300">Observá la lámina antes de responder</p>
        </div>
        <div className="static-question-visual h-full min-h-0 overflow-hidden pt-10" aria-hidden="true">
          {visualForQuestion ? visualForQuestion(question) : visual}
        </div>
      </section>

      <section className="order-1 md:col-span-5 min-h-0 overflow-hidden rounded-2xl border border-white/10 bg-slate-900/95 backdrop-blur-md flex flex-col">
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

        <div ref={contentRef} className="flex-1 min-h-0 overflow-y-auto custom-scroll p-3 scroll-pt-3">
          {!selected ? (
            <div className="space-y-3">
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
                  {question.options.map(option => (
                    <button
                      key={option.id}
                      onClick={() => answer(option.id)}
                      className="w-full text-left rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-semibold text-slate-200 transition-all duration-300 hover:border-cyan-500/60 hover:bg-slate-800"
                    >
                      <span className="inline-flex w-5 h-5 mr-2 items-center justify-center rounded-md bg-slate-800 text-[10px]">{option.id}</span>
                      {option.text}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2 animate-[fade-in_0.25s_ease-out]">
              <div className={`rounded-xl border px-3 py-2 ${isCorrect ? 'border-emerald-400/50 bg-emerald-500/15' : 'border-rose-400/50 bg-rose-500/15'}`}>
                <div className={`flex items-center gap-2 text-sm font-black ${isCorrect ? 'text-emerald-200' : 'text-rose-200'}`}>
                  {isCorrect ? <Check className="w-5 h-5 shrink-0" /> : <X className="w-5 h-5 shrink-0" />}
                  {isCorrect ? 'Respuesta correcta' : 'Respuesta a revisar'}
                </div>
                <p className="mt-1 text-[11px] leading-snug text-slate-100">{question.question}</p>
              </div>

              <div className="grid gap-1.5 text-[11px] leading-relaxed">
                <div className={`rounded-lg border px-3 py-2 ${isCorrect ? 'border-emerald-500/30 bg-emerald-950/30' : 'border-rose-500/30 bg-rose-950/25'}`}>
                  <span className="font-black text-slate-100">Elegiste:</span>{' '}
                  <span className="text-slate-300">{selectedOption?.text}.</span>
                </div>
                {!isCorrect && correctOption && (
                  <div className="rounded-lg border border-emerald-500/35 bg-emerald-950/35 px-3 py-2 text-emerald-100">
                    <span className="font-black">La respuesta correcta es:</span> {correctOption.text}.
                  </div>
                )}
              </div>

              <div className="rounded-xl border-2 border-cyan-400/50 bg-gradient-to-br from-cyan-950/70 to-slate-950 p-3 shadow-[0_0_24px_rgba(34,211,238,0.08)]">
                <div className="flex items-center gap-1.5 mb-2 text-cyan-200">
                  <BookOpen className="w-4 h-4 shrink-0" />
                  <span className="text-[11px] uppercase tracking-wider font-black">Por qué esta es la respuesta</span>
                </div>
                <p className="text-xs sm:text-[13px] leading-relaxed text-slate-100">{question.explanation}</p>
              </div>

              <div className="rounded-xl border border-amber-400/25 bg-amber-500/10 px-3 py-2">
                <div className="flex gap-2">
                  <Lightbulb className="w-4 h-4 shrink-0 mt-0.5 text-amber-300" />
                  <p className="text-[11px] leading-relaxed text-slate-300">
                    <strong className="text-amber-200">Fijá el concepto:</strong> localizá en la ilustración la luz, marca, embarcación o condición que decide la respuesta. Luego explicá la regla con tus propias palabras antes de avanzar.
                  </p>
                </div>
              </div>
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
            {selected ? 'Entendido · siguiente concepto' : 'Respondé para continuar'} <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
};
