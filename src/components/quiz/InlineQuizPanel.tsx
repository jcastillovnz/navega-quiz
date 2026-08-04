import React, { useState, useCallback } from 'react';
import { Check, X, Star, ChevronRight, RotateCcw, Sparkles, Lightbulb } from 'lucide-react';
import type { QuizQuestion } from '../../types/quiz';
import { addXP, addManyToReview } from '../../utils/storage';

interface InlineQuizPanelProps {
  question: QuizQuestion;
  questionNumber: number;
  totalQuestions: number;
  xpPerCorrect?: number;
  onNext: () => void;
}

const playTone = (type: 'success' | 'error') => {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    if (type === 'success') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(659.25, ctx.currentTime);
      osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.35);
    } else {
      osc.type = 'square';
      osc.frequency.setValueAtTime(120, ctx.currentTime);
      gain.gain.setValueAtTime(0.07, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.25);
    }
  } catch { /* silenciar autoplay block */ }
};

type AnswerState = 'IDLE' | 'CORRECT' | 'INCORRECT';

/**
 * Panel de quiz inline — se muestra junto al visor teórico.
 * Compacto, sin barra de progreso, diseñado para encajar en el panel lateral.
 */
export const InlineQuizPanel: React.FC<InlineQuizPanelProps> = ({
  question,
  questionNumber,
  totalQuestions,
  xpPerCorrect = 10,
  onNext,
}) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [state, setState] = useState<AnswerState>('IDLE');
  const [showXP, setShowXP] = useState(false);

  const handleSelect = useCallback((optionId: string) => {
    if (state !== 'IDLE') return;
    const option = question.options.find(o => o.id === optionId);
    if (!option) return;
    setSelectedId(optionId);
    if (option.isCorrect) {
      setState('CORRECT');
      playTone('success');
      addXP(xpPerCorrect);
      setShowXP(true);
      setTimeout(() => setShowXP(false), 1100);
    } else {
      setState('INCORRECT');
      playTone('error');
      addManyToReview([question.id]);
    }
  }, [state, question, xpPerCorrect]);

  const handleNext = () => {
    setSelectedId(null);
    setState('IDLE');
    setShowXP(false);
    onNext();
  };

  const getOptionCls = (optionId: string) => {
    const base = 'w-full text-left px-2.5 py-2 rounded-lg border transition-all duration-200 flex items-center gap-2 text-xs cursor-pointer';
    if (state === 'IDLE') return `${base} bg-slate-800/60 border-slate-700 hover:border-cyan-500 hover:bg-slate-800`;
    const opt = question.options.find(o => o.id === optionId);
    const isSelected = selectedId === optionId;
    if (opt?.isCorrect) return `${base} bg-emerald-500/20 border-emerald-500 text-emerald-100`;
    if (isSelected && !opt?.isCorrect) return `${base} bg-rose-500/20 border-rose-500 text-rose-100 animate-[shake_0.4s_ease-in-out]`;
    return `${base} bg-slate-800/20 border-slate-800 text-slate-600 opacity-50`;
  };

  return (
    <div className="relative flex flex-col gap-2 h-full overflow-hidden">
      {/* XP Floater */}
      {showXP && (
        <div className="absolute top-0 right-2 z-20 pointer-events-none animate-[float-up_1.1s_ease-out_forwards]">
          <div className="flex items-center gap-1 bg-amber-500 text-slate-950 font-extrabold px-2.5 py-1 rounded-full text-xs shadow-lg shadow-amber-500/40">
            <Sparkles className="w-3 h-3" />+{xpPerCorrect} XP
          </div>
        </div>
      )}

      {/* Barra de progreso + conteo */}
      <div className="shrink-0">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] text-slate-500 font-bold tracking-wider uppercase">
            Pregunta {questionNumber}/{totalQuestions}
          </span>
          <span className="flex items-center gap-1 text-[10px] text-amber-400 font-bold">
            <Star className="w-3 h-3 fill-amber-400" />{xpPerCorrect} XP
          </span>
        </div>
        <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-cyan-300 transition-all duration-500 rounded-full"
            style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      {/* Pregunta */}
      <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-2.5 shrink-0">
        <div className="flex items-start gap-1.5 mb-1">
          <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
          <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Quiz de este contenido</span>
        </div>
        <p className="text-xs text-slate-100 font-medium leading-snug">{question.question}</p>
      </div>

      {/* Opciones */}
      <div className="flex flex-col gap-1.5 shrink-0">
        {question.options.map(opt => {
          const isSelected = selectedId === opt.id;
          const isCorrect = opt.isCorrect;
          return (
            <button
              key={opt.id}
              onClick={() => handleSelect(opt.id)}
              disabled={state !== 'IDLE'}
              className={getOptionCls(opt.id)}
            >
              <span className={`shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-extrabold border ${
                state === 'IDLE'
                  ? 'border-slate-600 text-slate-400'
                  : isCorrect
                  ? 'border-emerald-400 bg-emerald-500 text-white'
                  : isSelected && !isCorrect
                  ? 'border-rose-400 bg-rose-500 text-white'
                  : 'border-slate-700 text-slate-600'
              }`}>
                {state !== 'IDLE' && isCorrect ? <Check className="w-3 h-3" />
                  : state !== 'IDLE' && isSelected && !isCorrect ? <X className="w-3 h-3" />
                  : opt.id}
              </span>
              <span className="leading-snug">{opt.text}</span>
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      {state !== 'IDLE' && (
        <div className={`rounded-xl p-2.5 border-l-4 shrink-0 animate-[fade-in_0.3s_ease-out] ${
          state === 'CORRECT'
            ? 'bg-emerald-500/10 border-emerald-500'
            : 'bg-rose-500/10 border-rose-500'
        }`}>
          <p className={`text-[11px] font-extrabold mb-0.5 ${state === 'CORRECT' ? 'text-emerald-300' : 'text-rose-300'}`}>
            {state === 'CORRECT' ? '¡Correcto! ⚓' : 'Incorrecto'}
          </p>
          <p className="text-[11px] text-slate-300 leading-relaxed">{question.explanation}</p>
        </div>
      )}

      {/* Siguiente */}
      {state !== 'IDLE' && (
        <button
          onClick={handleNext}
          className="w-full flex items-center justify-center gap-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold py-2 rounded-xl text-xs transition-all shadow-lg shadow-cyan-900/30 shrink-0 cursor-pointer"
        >
          Siguiente <ChevronRight className="w-4 h-4" />
        </button>
      )}

      {/* Estado IDLE — sugerencia */}
      {state === 'IDLE' && (
        <div className="text-center text-[10px] text-slate-600 italic mt-auto">
          ↑ Respondé para continuar
        </div>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────────
   Panel de resultados finales del módulo
───────────────────────────────────────────── */
interface ModuleResultPanelProps {
  correct: number;
  total: number;
  xpEarned: number;
  moduleTitle: string;
  onRestart: () => void;
}

export const ModuleResultPanel: React.FC<ModuleResultPanelProps> = ({
  correct, total, xpEarned, moduleTitle, onRestart
}) => {
  const accuracy = total > 0 ? (correct / total) * 100 : 0;
  const passed = accuracy >= 70;

  return (
    <div className="flex items-center justify-center h-full">
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl">
        <div className={`inline-flex items-center justify-center w-14 h-14 rounded-full mb-3 ${
          passed ? 'bg-amber-500/20 border border-amber-500' : 'bg-cyan-500/20 border border-cyan-500'
        }`}>
          {passed ? '🏆' : <RotateCcw className="w-6 h-6 text-cyan-400" />}
        </div>
        <h3 className={`text-lg font-extrabold mb-1 ${passed ? 'text-amber-300' : 'text-cyan-300'}`}>
          {passed ? '¡Módulo Dominado!' : 'Seguí practicando'}
        </h3>
        <p className="text-slate-400 text-xs mb-4">
          {passed ? `Excelente dominio de ${moduleTitle}.` : 'Repasá los conceptos y volvé a intentarlo.'}
        </p>

        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-slate-950 rounded-xl p-2.5 border border-slate-800">
            <p className="text-lg font-black text-cyan-400">{accuracy.toFixed(0)}%</p>
            <p className="text-[10px] text-slate-500">Precisión</p>
          </div>
          <div className="bg-slate-950 rounded-xl p-2.5 border border-slate-800">
            <p className="text-lg font-black text-emerald-400">{correct}/{total}</p>
            <p className="text-[10px] text-slate-500">Aciertos</p>
          </div>
          <div className="bg-slate-950 rounded-xl p-2.5 border border-slate-800">
            <p className="text-lg font-black text-amber-400">+{xpEarned}</p>
            <p className="text-[10px] text-slate-500">XP</p>
          </div>
        </div>

        <button
          onClick={onRestart}
          className="flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold py-2 px-5 rounded-xl text-xs transition-all mx-auto shadow-md cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Repetir Módulo
        </button>
      </div>
    </div>
  );
};
