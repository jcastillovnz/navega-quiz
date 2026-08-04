import React, { useState, useCallback } from 'react';
import { Check, X, Star, ChevronRight, Sparkles } from 'lucide-react';
import type { QuizQuestion } from '../../types/quiz';

interface QuizCardProps {
  question: QuizQuestion;
  questionNumber: number;
  totalQuestions: number;
  xpPerCorrect: number;
  onAnswer: (isCorrect: boolean, questionId: string) => void;
  onNext: () => void;
}

/**
 * Genera un tono corto usando Web Audio API (campana de barco o bip).
 * Frecuencias inspiradas en campanas náuticas.
 */
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
      // Campana aguda y breve (E5 -> G5)
      osc.type = 'sine';
      osc.frequency.setValueAtTime(659.25, ctx.currentTime);
      osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.4);
    } else {
      // Buzzer grave de error
      osc.type = 'square';
      osc.frequency.setValueAtTime(120, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.3);
    }
  } catch {
    // Silenciar si el navegador bloquea autoplay
  }
};

type AnswerState = 'IDLE' | 'CORRECT' | 'INCORRECT';

export const QuizCard: React.FC<QuizCardProps> = ({
  question,
  questionNumber,
  totalQuestions,
  xpPerCorrect,
  onAnswer,
  onNext
}) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [state, setState] = useState<AnswerState>('IDLE');
  const [showXPFloater, setShowXPFloater] = useState(false);

  const handleSelect = useCallback(
    (optionId: string) => {
      if (state !== 'IDLE') return;
      const option = question.options.find(o => o.id === optionId);
      if (!option) return;
      setSelectedId(optionId);
      if (option.isCorrect) {
        setState('CORRECT');
        playTone('success');
        setShowXPFloater(true);
        setTimeout(() => setShowXPFloater(false), 1200);
      } else {
        setState('INCORRECT');
        playTone('error');
      }
      onAnswer(option.isCorrect, question.id);
    },
    [state, question, onAnswer]
  );

  const handleNext = () => {
    setSelectedId(null);
    setState('IDLE');
    onNext();
  };

  const getOptionClasses = (optionId: string): string => {
    const base =
      'w-full text-left p-4 rounded-xl border-2 transition-all duration-300 flex items-start gap-3 group';

    if (state === 'IDLE') {
      return `${base} bg-slate-800/50 border-slate-700 hover:border-cyan-500 hover:bg-slate-800 cursor-pointer`;
    }

    const option = question.options.find(o => o.id === optionId);
    const isSelected = selectedId === optionId;

    if (option?.isCorrect) {
      return `${base} bg-emerald-500/20 border-emerald-500 text-emerald-50 animate-[pulse_0.5s_ease-in-out]`;
    }
    if (isSelected && !option?.isCorrect) {
      return `${base} bg-rose-500/20 border-rose-500 text-rose-50 animate-[shake_0.4s_ease-in-out]`;
    }
    return `${base} bg-slate-800/30 border-slate-800 text-slate-500 opacity-60`;
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4 relative">
      {/* XP Floater Animation */}
      {showXPFloater && (
        <div className="absolute top-4 right-8 z-20 pointer-events-none animate-[float-up_1.2s_ease-out_forwards]">
          <div className="flex items-center gap-1 bg-amber-500 text-slate-950 font-bold px-3 py-1.5 rounded-full shadow-lg shadow-amber-500/50">
            <Sparkles className="w-4 h-4" />+{xpPerCorrect} XP
          </div>
        </div>
      )}

      {/* Header con progreso */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs text-slate-400 font-medium tracking-wider uppercase">
          Pregunta {questionNumber} de {totalQuestions}
        </span>
        <span className="flex items-center gap-1 text-xs text-amber-400 font-medium">
          <Star className="w-3.5 h-3.5 fill-amber-400" />
          {xpPerCorrect} XP
        </span>
      </div>

      {/* Barra de progreso */}
      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-6">
        <div
          className="h-full bg-gradient-to-r from-cyan-500 to-cyan-300 transition-all duration-500"
          style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
        />
      </div>

      {/* Tarjeta de Pregunta */}
      <div className="bg-slate-800/70 backdrop-blur-md border border-white/10 rounded-2xl p-6 mb-5 shadow-2xl">
        <h3 className="text-lg md:text-xl font-semibold text-slate-50 leading-relaxed">
          {question.question}
        </h3>
      </div>

      {/* Opciones */}
      <div className="flex flex-col gap-3 mb-5">
        {question.options.map(option => {
          const isSelected = selectedId === option.id;
          const optionData = question.options.find(o => o.id === option.id);
          const isCorrect = optionData?.isCorrect;
          return (
            <button
              key={option.id}
              onClick={() => handleSelect(option.id)}
              disabled={state !== 'IDLE'}
              className={getOptionClasses(option.id)}
            >
              <span
                className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold border-2 ${
                  state === 'IDLE'
                    ? 'border-slate-600 text-slate-400 group-hover:border-cyan-400 group-hover:text-cyan-300'
                    : isSelected && isCorrect
                    ? 'border-emerald-300 bg-emerald-500 text-white'
                    : isSelected && !isCorrect
                    ? 'border-rose-300 bg-rose-500 text-white'
                    : isCorrect
                    ? 'border-emerald-300 bg-emerald-500/30 text-emerald-200'
                    : 'border-slate-700 text-slate-600'
                }`}
              >
                {state !== 'IDLE' && isCorrect ? (
                  <Check className="w-4 h-4" />
                ) : state !== 'IDLE' && isSelected && !isCorrect ? (
                  <X className="w-4 h-4" />
                ) : (
                  option.id
                )}
              </span>
              <span className="text-sm md:text-base">{option.text}</span>
            </button>
          );
        })}
      </div>

      {/* Feedback / Explicación (post-respuesta) */}
      {state !== 'IDLE' && (
        <div
          className={`rounded-xl p-4 mb-5 border-l-4 animate-[fade-in_0.4s_ease-out] ${
            state === 'CORRECT'
              ? 'bg-emerald-500/10 border-emerald-500'
              : 'bg-rose-500/10 border-rose-500'
          }`}
        >
          <p
            className={`text-sm font-bold mb-1 ${
              state === 'CORRECT' ? 'text-emerald-300' : 'text-rose-300'
            }`}
          >
            {state === 'CORRECT' ? '¡Correcto! ⚓' : 'Incorrecto'}
          </p>
          <p className="text-sm text-slate-300 leading-relaxed">{question.explanation}</p>
        </div>
      )}

      {/* Botón Siguiente */}
      {state !== 'IDLE' && (
        <button
          onClick={handleNext}
          className="w-full flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-3 rounded-xl transition-all duration-300 shadow-lg shadow-cyan-900/40"
        >
          Siguiente Pregunta
          <ChevronRight className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};
