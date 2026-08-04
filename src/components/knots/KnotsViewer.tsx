import React, { useState, useMemo } from 'react';
import { RotateCcw, BookOpen, BrainCircuit, Trophy, Lightbulb, Gamepad2 } from 'lucide-react';
import { QuizCard } from '../quiz/QuizCard';
import { addXP, addManyToReview, registerStudy } from '../../utils/storage';
import type { QuizQuestion } from '../../types/quiz';
import { MASTER_KNOTS_DATA } from '../../data/knotsData';
import { InteractiveKnotViewer } from './InteractiveKnotViewer';
import { KnotSequenceSimulator } from './KnotSequenceSimulator';

const XP_PER_CORRECT = 10;
const PASS_THRESHOLD = 0.7;

interface KnotsViewerProps {
  questions: QuizQuestion[];
}

export const KnotsViewer: React.FC<KnotsViewerProps> = ({ questions }) => {
  const [tab, setTab] = useState<'ESTUDIO' | 'SIMULADOR_ARMADO' | 'QUIZ'>('ESTUDIO');
  const [activeKnotIdx, setActiveKnotIdx] = useState(0);

  // Quiz state
  const [currentIdx, setCurrentIdx] = useState(0);
  const [result, setResult] = useState<{ correct: number; total: number; xpEarned: number } | null>(null);

  const activeKnot = MASTER_KNOTS_DATA[activeKnotIdx];

  const handleAnswer = (isCorrect: boolean, qid: string) => {
    setResult(prev => {
      const base = prev ?? { correct: 0, total: 0, xpEarned: 0 };
      return {
        correct: base.correct + (isCorrect ? 1 : 0),
        total: base.total + 1,
        xpEarned: base.xpEarned + (isCorrect ? XP_PER_CORRECT : 0)
      };
    });
    if (isCorrect) addXP(XP_PER_CORRECT);
    else addManyToReview([qid]);
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) setCurrentIdx(c => c + 1);
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setResult(null);
    registerStudy();
  };

  const handleChallengeSuccess = (xpEarned: number) => {
    addXP(xpEarned);
  };

  const accuracy = result ? (result.correct / result.total) * 100 : 0;
  const passed = result && result.total === questions.length && accuracy >= PASS_THRESHOLD * 100;
  const finished = result && result.total === questions.length;

  const shuffledQuestions = useMemo(() => [...questions].sort(() => Math.random() - 0.5), [questions]);

  return (
    <div className="h-full flex flex-col gap-2 overflow-hidden">
      
      {/* Bar Unificada Compacta: Modo + Nudos en 1 sola fila */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 shrink-0">
        
        {/* Selector de Modo */}
        <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setTab('ESTUDIO')}
            className={`flex items-center gap-1 px-3 py-1 rounded-md text-xs font-bold transition-all ${
              tab === 'ESTUDIO' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Guía 3D
          </button>
          <button
            onClick={() => setTab('SIMULADOR_ARMADO')}
            className={`flex items-center gap-1 px-3 py-1 rounded-md text-xs font-bold transition-all ${
              tab === 'SIMULADOR_ARMADO' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Gamepad2 className="w-3.5 h-3.5" />
            Desafío
          </button>
          <button
            onClick={() => setTab('QUIZ')}
            className={`flex items-center gap-1 px-3 py-1 rounded-md text-xs font-bold transition-all ${
              tab === 'QUIZ' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BrainCircuit className="w-3.5 h-3.5" />
            Quiz
          </button>
        </div>

        {/* Selector de Nudo (Pills ultra-compactas) */}
        {(tab === 'ESTUDIO' || tab === 'SIMULADOR_ARMADO') && (
          <div className="flex items-center gap-1 overflow-x-auto">
            {MASTER_KNOTS_DATA.map((k, idx) => (
              <button
                key={k.id}
                onClick={() => setActiveKnotIdx(idx)}
                className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all whitespace-nowrap ${
                  activeKnotIdx === idx
                    ? 'bg-slate-800 border border-cyan-400 text-cyan-300'
                    : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
                }`}
              >
                {idx + 1}. {k.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Contenido Principal (Flex-1 sin scroll general) */}
      <div className="flex-1 min-h-0 overflow-hidden">
        {tab === 'ESTUDIO' && (
          <InteractiveKnotViewer knot={activeKnot} />
        )}

        {tab === 'SIMULADOR_ARMADO' && (
          <div className="h-full overflow-y-auto">
            <KnotSequenceSimulator
              knotName={activeKnot.name}
              correctSteps={activeKnot.sequenceChallenge.correctOrder}
              onSuccess={handleChallengeSuccess}
            />
          </div>
        )}

        {tab === 'QUIZ' && !finished && questions.length > 0 && (
          <div className="h-full overflow-y-auto">
            <QuizCard
              question={shuffledQuestions[currentIdx]}
              questionNumber={currentIdx + 1}
              totalQuestions={shuffledQuestions.length}
              xpPerCorrect={XP_PER_CORRECT}
              onAnswer={handleAnswer}
              onNext={handleNext}
            />
          </div>
        )}

        {tab === 'QUIZ' && finished && result && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 max-w-xl mx-auto w-full text-center my-auto shadow-2xl">
            {passed ? (
              <>
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-500/20 border border-amber-500 mb-3">
                  <Trophy className="w-8 h-8 text-amber-400" />
                </div>
                <h3 className="text-xl font-extrabold text-amber-300 mb-1">¡Maestro de Cabuyería!</h3>
                <p className="text-slate-300 text-xs mb-4 font-medium">Demostraste conocimiento práctico para las exigencias PNA.</p>
              </>
            ) : (
              <>
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-cyan-500/20 border border-cyan-500 mb-3">
                  <Lightbulb className="w-8 h-8 text-cyan-400" />
                </div>
                <h3 className="text-xl font-extrabold text-cyan-300 mb-1">Reforzá la Técnica</h3>
                <p className="text-slate-300 text-xs mb-4">Se requiere 70% para aprobar.</p>
              </>
            )}

            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <p className="text-xl font-black text-cyan-400">{accuracy.toFixed(0)}%</p>
                <p className="text-[10px] text-slate-400">Precisión</p>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <p className="text-xl font-black text-emerald-400">{result.correct}/{result.total}</p>
                <p className="text-[10px] text-slate-400">Aciertos</p>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <p className="text-xl font-black text-amber-400">+{result.xpEarned}</p>
                <p className="text-[10px] text-slate-400">XP</p>
              </div>
            </div>

            <button
              onClick={handleRestart}
              className="flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-2.5 px-5 rounded-xl text-xs transition-all mx-auto shadow-md"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reintentar Quiz
            </button>
          </div>
        )}
      </div>

    </div>
  );
};
