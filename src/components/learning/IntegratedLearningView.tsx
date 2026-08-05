import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { BookOpen, Check, ChevronRight, Lightbulb, RotateCcw, X } from 'lucide-react';
import type { QuizQuestion } from '../../types/quiz';
import * as storage from '../../utils/storage';
import { getVisualSpec } from '../../data/visualManifest';

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

const playSuccessChime = () => {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const context = new AudioCtx();
    const gain = context.createGain();
    gain.connect(context.destination);
    gain.gain.setValueAtTime(0.0001, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.09, context.currentTime + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.48);

    [523.25, 659.25, 783.99].forEach((frequency, index) => {
      const oscillator = context.createOscillator();
      oscillator.type = 'sine';
      oscillator.frequency.value = frequency;
      oscillator.connect(gain);
      oscillator.start(context.currentTime + index * 0.07);
      oscillator.stop(context.currentTime + 0.42 + index * 0.03);
    });
    window.setTimeout(() => void context.close(), 650);
  } catch {
    // El aprendizaje continúa sin audio si el navegador no habilita Web Audio.
  }
};

const playErrorTone = () => {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const context = new AudioCtx();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(196, context.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(146.83, context.currentTime + 0.22);
    gain.gain.setValueAtTime(0.0001, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.07, context.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.3);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.31);
    window.setTimeout(() => void context.close(), 450);
  } catch {
    // El aprendizaje continúa sin audio si el navegador no habilita Web Audio.
  }
};

export const IntegratedLearningView: React.FC<IntegratedLearningViewProps> = ({
  moduleId,
  title,
  questions,
  visual,
  visualForQuestion,
  accentClass = 'bg-cyan-500'
}) => {
  const ordered = useMemo(() => {
    const byId = new Map(questions.map(question => [question.id, question]));
    return storage.prioritizeLearningQuestionIds(moduleId, questions.map(question => question.id))
      .map(id => byId.get(id))
      .filter((question): question is QuizQuestion => Boolean(question));
  }, [moduleId, questions]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
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
      playSuccessChime();
    } else {
      playErrorTone();
    }
    storage.addToReview(question.id);
    storage.reviewResult(question.id, correct);
    storage.registerStudy();
    storage.registerLearningAnswer(moduleId, question.id, correct);
  };

  const next = () => {
    if (index === ordered.length - 1) {
      setIsComplete(true);
      return;
    }
    setSelected(null);
    setIsCorrect(null);
    setIndex(value => value + 1);
  };

  const restart = () => {
    setIndex(0);
    setSelected(null);
    setIsCorrect(null);
    setCorrectCount(0);
    setIsComplete(false);
  };

  const progress = ((index + (selected ? 1 : 0)) / ordered.length) * 100;
  const selectedOption = question.options.find(option => option.id === selected);
  const correctOption = question.options.find(option => option.isCorrect);
  const visualSpec = getVisualSpec(question.id);
  return (
    <div className="integrated-learning h-full min-h-0 flex flex-col gap-2 overflow-hidden">
      <section className="learning-visual basis-[48%] min-h-0 overflow-hidden rounded-xl sm:rounded-2xl border border-slate-800 bg-slate-950 relative">
        <div
          key={visualSpec?.variantKey ?? question.id}
          data-visual-variant={visualSpec?.variantKey ?? question.id}
          className="static-question-visual h-full min-h-0 overflow-hidden relative"
          aria-label={`Ilustración única para: ${question.question}`}
        >
          {visualForQuestion ? visualForQuestion(question) : visual}
        </div>
      </section>

      <section className="learning-panel basis-[52%] min-h-0 overflow-hidden rounded-xl sm:rounded-2xl border border-white/10 bg-slate-900/95 backdrop-blur-md flex flex-col">
        <div className="learning-progress px-3 py-1.5 border-b border-slate-800 shrink-0">
          <div className="flex items-center justify-between gap-3 mb-1">
            <div className="flex items-baseline gap-2 min-w-0">
              <p className="text-[9px] uppercase tracking-widest text-slate-500 font-black shrink-0">Aprender · {title}</p>
              <p className="text-xs font-extrabold text-white truncate">Concepto {index + 1} de {ordered.length}</p>
            </div>
            <span className="text-[10px] font-black text-amber-300 shrink-0">{correctCount} dominados</span>
          </div>
          <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <div className={`h-full ${accentClass} transition-all duration-300`} style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div ref={contentRef} className="flex-1 min-h-0 overflow-y-auto custom-scroll px-3 py-2 scroll-pt-2">
          {!selected ? (
            <div className="learning-question-layout min-h-0 grid md:grid-cols-[minmax(200px,.55fr)_minmax(0,1.45fr)] gap-3">
              <div className="learning-theory rounded-xl border border-cyan-500/25 bg-cyan-500/10 p-3 self-start">
                <div className="flex items-center gap-1.5 mb-1.5 text-cyan-300">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span className="text-[10px] uppercase tracking-wider font-black">Idea esencial</span>
                </div>
                <p className="text-xs leading-relaxed text-slate-200">{theoryFrom(question.explanation)}</p>
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5 mb-2 text-amber-300">
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span className="text-[10px] uppercase tracking-wider font-black">Comprobación inmediata</span>
                </div>
                <p className="text-sm leading-snug font-bold text-white mb-2.5">{question.question}</p>
                <div className="learning-options grid sm:grid-cols-2 gap-1.5">
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
            <div className="learning-answer-layout grid md:grid-cols-[minmax(230px,.7fr)_minmax(0,1.3fr)] gap-2.5 animate-[fade-in_0.25s_ease-out]">
              <div className="space-y-2 min-w-0">
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
              </div>

              <div className="min-w-0 space-y-2">
                <div className="rounded-xl border-2 border-cyan-400/50 bg-gradient-to-br from-cyan-950/70 to-slate-950 p-3 shadow-[0_0_24px_rgba(34,211,238,0.08)]">
                  <div className="flex items-center gap-1.5 mb-1.5 text-cyan-200">
                    <BookOpen className="w-4 h-4 shrink-0" />
                    <span className="text-[11px] uppercase tracking-wider font-black">Por qué esta es la respuesta</span>
                  </div>
                  <p className="text-xs sm:text-[13px] leading-relaxed text-slate-100">{question.explanation}</p>
                </div>

                <div className="rounded-xl border border-amber-400/25 bg-amber-500/10 px-3 py-2">
                  <div className="flex gap-2">
                    <Lightbulb className="w-4 h-4 shrink-0 mt-0.5 text-amber-300" />
                    <p className="text-[10px] leading-relaxed text-slate-300"><strong className="text-amber-200">Fijá el concepto:</strong> localizá en la ilustración el elemento que determina la respuesta y explicá la regla con tus palabras.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="learning-actions px-3 py-1.5 border-t border-slate-800 shrink-0 flex gap-2">
          <button onClick={restart} className="p-2 rounded-lg border border-slate-700 text-slate-400 hover:text-white transition-all duration-300" title="Reiniciar ruta">
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={next}
            disabled={!selected || isComplete}
            className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-black transition-all duration-300 ${selected && !isComplete ? `${accentClass} text-slate-950` : isComplete ? 'border border-emerald-500/40 bg-emerald-500/10 text-emerald-200 cursor-default' : 'bg-slate-800 text-slate-600 cursor-not-allowed'}`}
          >
            {isComplete ? 'Ruta completada · sin repetir preguntas' : selected ? index === ordered.length - 1 ? 'Finalizar módulo' : 'Entendido · siguiente concepto' : 'Respondé para continuar'}
            {!isComplete && <ChevronRight className="w-4 h-4" />}
          </button>
        </div>
      </section>
    </div>
  );
};
