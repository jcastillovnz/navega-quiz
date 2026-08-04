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

  // Shuffled questions memo
  const shuffledQuestions = useMemo(() => [...questions].sort(() => Math.random() - 0.5), [questions]);

  return (
    <div className="flex flex-col gap-6 w-full">
      
      {/* Selector de Modo / Tabs Náuticas */}
      <div className="flex flex-wrap bg-slate-900 p-1.5 rounded-2xl border border-slate-800 max-w-xl mx-auto w-full shadow-lg">
        <button
          onClick={() => setTab('ESTUDIO')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            tab === 'ESTUDIO' ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-900/30' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Guía Técnica (3D)
        </button>
        <button
          onClick={() => setTab('SIMULADOR_ARMADO')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            tab === 'SIMULADOR_ARMADO' ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-900/30' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Gamepad2 className="w-4 h-4" />
          Desafío de Armado
        </button>
        <button
          onClick={() => setTab('QUIZ')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            tab === 'QUIZ' ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-900/30' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <BrainCircuit className="w-4 h-4" />
          Examen Teórico
        </button>
      </div>

      {/* Selector de Nudo Activo (Sidebar Horizontal) */}
      {(tab === 'ESTUDIO' || tab === 'SIMULADOR_ARMADO') && (
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-2 px-2">
          {MASTER_KNOTS_DATA.map((k, idx) => (
            <button
              key={k.id}
              onClick={() => setActiveKnotIdx(idx)}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold border transition-all whitespace-nowrap cursor-pointer ${
                activeKnotIdx === idx
                  ? 'bg-slate-800 border-cyan-400 text-cyan-300 shadow-md shadow-cyan-950'
                  : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300'
              }`}
            >
              {idx + 1}. {k.name}
            </button>
          ))}
        </div>
      )}

      {/* VISTA 1: GUÍA DE ESTUDIO TÉCNICA E INTERACTIVA */}
      {tab === 'ESTUDIO' && (
        <div className="animate-fade-in">
          <InteractiveKnotViewer knot={activeKnot} />
        </div>
      )}

      {/* VISTA 2: DESAFÍO DE SECUENCIA DE ARMADO */}
      {tab === 'SIMULADOR_ARMADO' && (
        <div className="animate-fade-in py-4">
          <KnotSequenceSimulator
            knotName={activeKnot.name}
            correctSteps={activeKnot.sequenceChallenge.correctOrder}
            onSuccess={handleChallengeSuccess}
          />
        </div>
      )}

      {/* VISTA 3: QUIZ DE EVALUACIÓN TEÓRICA */}
      {tab === 'QUIZ' && !finished && questions.length > 0 && (
        <div className="animate-fade-in">
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

      {/* RESULTADOS DEL QUIZ */}
      {tab === 'QUIZ' && finished && result && (
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-3xl p-8 max-w-2xl mx-auto w-full text-center shadow-2xl animate-fade-in">
          {passed ? (
            <>
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-amber-500/20 border-2 border-amber-500 mb-4 shadow-lg shadow-amber-500/20">
                <Trophy className="w-10 h-10 text-amber-400" />
              </div>
              <h3 className="text-2xl font-extrabold text-amber-300 mb-2">¡Maestro de Cabuyería Náutica!</h3>
              <p className="text-slate-300 text-sm mb-6 font-medium">Demostraste conocimiento práctico para las exigencias de Prefectura.</p>
            </>
          ) : (
            <>
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-cyan-500/20 border-2 border-cyan-500 mb-4">
                <Lightbulb className="w-10 h-10 text-cyan-400" />
              </div>
              <h3 className="text-2xl font-extrabold text-cyan-300 mb-2">Reforzá la Técnica</h3>
              <p className="text-slate-300 text-sm mb-6">Se requiere 70% para aprobar. Repasá las advertencias y volvé a intentar.</p>
            </>
          )}

          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-slate-950/60 rounded-2xl p-4 border border-slate-800">
              <p className="text-2xl font-black text-cyan-400">{accuracy.toFixed(0)}%</p>
              <p className="text-xs text-slate-400 mt-1 font-semibold">Precisión</p>
            </div>
            <div className="bg-slate-950/60 rounded-2xl p-4 border border-slate-800">
              <p className="text-2xl font-black text-emerald-400">{result.correct}/{result.total}</p>
              <p className="text-xs text-slate-400 mt-1 font-semibold">Aciertos</p>
            </div>
            <div className="bg-slate-950/60 rounded-2xl p-4 border border-slate-800">
              <p className="text-2xl font-black text-amber-400">+{result.xpEarned}</p>
              <p className="text-xs text-slate-400 mt-1 font-semibold">XP</p>
            </div>
          </div>

          <button
            onClick={handleRestart}
            className="flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-3 px-6 rounded-xl transition-all duration-300 mx-auto shadow-lg shadow-cyan-900/40 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            Reintentar Quiz
          </button>
        </div>
      )}
    </div>
  );
};
