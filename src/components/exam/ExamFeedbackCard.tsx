import React from 'react';
import { CheckCircle2, XCircle, ChevronRight, BookOpen, Lightbulb, Info } from 'lucide-react';

export interface ExamFeedbackCardProps {
  isCorrect: boolean;
  questionText: string;
  category: string;
  userAnswer: string;
  correctAnswer: string;
  userAnswerText: string;
  correctAnswerText: string;
  explanation: string;
  /** Regla o referencia oficial (ej: "RIPA Regla 14", "Beaufort F8") */
  rule?: string;
  /** Tip adicional pedagógico (opcional) */
  tip?: string;
  /** Número de pregunta actual */
  questionNumber: number;
  /** Total de preguntas */
  totalQuestions: number;
  /** Callback para avanzar a la siguiente */
  onNext: () => void;
  /** Es la última pregunta (cambia label) */
  isLast: boolean;
}

export const ExamFeedbackCard: React.FC<ExamFeedbackCardProps> = ({
  isCorrect,
  questionText: _questionText,
  category,
  userAnswer,
  correctAnswer,
  userAnswerText,
  correctAnswerText,
  explanation,
  rule,
  tip,
  questionNumber,
  totalQuestions,
  onNext,
  isLast
}) => {
  return (
    <div
      className={`relative w-full rounded-xl border-2 overflow-hidden animate-[fade-in_0.3s_ease-out] ${
        isCorrect
          ? 'bg-emerald-500/5 border-emerald-500/50'
          : 'bg-rose-500/5 border-rose-500/50'
      }`}
    >
      {/* Header con resultado grande */}
      <div
        className={`flex items-center gap-3 px-4 py-3 ${
          isCorrect ? 'bg-emerald-500/15' : 'bg-rose-500/15'
        }`}
      >
        <div
          className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
            isCorrect
              ? 'bg-emerald-500 text-white'
              : 'bg-rose-500 text-white'
          } ${isCorrect ? 'animate-[pulse_0.5s_ease-in-out]' : 'animate-[shake_0.4s_ease-in-out]'}`}
        >
          {isCorrect ? (
            <CheckCircle2 className="w-6 h-6" strokeWidth={3} />
          ) : (
            <XCircle className="w-6 h-6" strokeWidth={3} />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p
            className={`text-base font-bold ${
              isCorrect ? 'text-emerald-300' : 'text-rose-300'
            }`}
          >
            {isCorrect ? '¡Correcto!' : 'Incorrecto'}
          </p>
          <p className="text-[10px] text-slate-400 uppercase tracking-wider">
            {category} · Pregunta {questionNumber} de {totalQuestions}
          </p>
        </div>
      </div>

      {/* Cuerpo: comparación de respuestas + explicación */}
      <div className="px-4 py-3 space-y-3">
        {/* Comparación de respuestas */}
        <div className="space-y-1.5">
          <div
            className={`flex items-start gap-2 p-2 rounded-lg border ${
              isCorrect
                ? 'bg-emerald-500/10 border-emerald-500/30'
                : 'bg-rose-500/10 border-rose-500/30'
            }`}
          >
            <span
              className={`shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${
                isCorrect ? 'bg-emerald-500' : 'bg-rose-500'
              }`}
            >
              {userAnswer}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-[9px] uppercase tracking-wider text-slate-400">
                Tu respuesta
              </p>
              <p className="text-xs text-slate-200 leading-snug">{userAnswerText}</p>
            </div>
          </div>

          {!isCorrect && (
            <div className="flex items-start gap-2 p-2 rounded-lg border bg-emerald-500/10 border-emerald-500/30">
              <span className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white bg-emerald-500">
                {correctAnswer}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-[9px] uppercase tracking-wider text-emerald-300 font-bold">
                  Respuesta correcta
                </p>
                <p className="text-xs text-slate-200 leading-snug">{correctAnswerText}</p>
              </div>
            </div>
          )}
        </div>

        {/* Explicación didáctica */}
        <div className="bg-slate-900/60 rounded-lg p-3 border border-slate-700/50">
          <div className="flex items-center gap-1.5 mb-1.5">
            <Info className="w-3.5 h-3.5 text-cyan-400" />
            <p className="text-[10px] uppercase tracking-wider text-cyan-300 font-bold">
              Explicación
            </p>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed">{explanation}</p>
        </div>

        {/* Regla oficial / referencia */}
        {rule && (
          <div className="flex items-start gap-2 p-2 rounded-lg bg-amber-500/10 border border-amber-500/30">
            <BookOpen className="shrink-0 w-3.5 h-3.5 text-amber-400 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-[9px] uppercase tracking-wider text-amber-300 font-bold">
                Referencia oficial
              </p>
              <p className="text-xs text-amber-100 leading-snug">{rule}</p>
            </div>
          </div>
        )}

        {/* Tip pedagógico */}
        {tip && (
          <div className="flex items-start gap-2 p-2 rounded-lg bg-purple-500/10 border border-purple-500/30">
            <Lightbulb className="shrink-0 w-3.5 h-3.5 text-purple-400 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-[9px] uppercase tracking-wider text-purple-300 font-bold">
                Para recordar
              </p>
              <p className="text-xs text-purple-100 leading-snug">{tip}</p>
            </div>
          </div>
        )}
      </div>

      {/* Footer con botón siguiente */}
      <div className="px-4 py-3 bg-slate-900/40 border-t border-slate-700/50">
        <button
          onClick={onNext}
          className={`w-full flex items-center justify-center gap-2 font-bold py-2.5 rounded-lg transition-all shadow-lg text-sm ${
            isLast
              ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-900/40'
              : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-900/40'
          }`}
        >
          {isLast ? (
            <>Finalizar Examen</>
          ) : (
            <>
              Siguiente pregunta
              <ChevronRight className="w-4 h-4" />
            </>
          )}
        </button>
        {!isLast && (
          <p className="text-[10px] text-slate-500 text-center mt-1.5">
            {questionNumber} / {totalQuestions}
          </p>
        )}
      </div>
    </div>
  );
};
