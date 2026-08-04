import React, { useMemo, useState } from 'react';
import { BookOpen, BrainCircuit, Trophy, RotateCcw } from 'lucide-react';
import { QuizCard } from '../quiz/QuizCard';
import { addXP, addManyToReview, registerStudy } from '../../utils/storage';
import teoriaData from '../../data/teoria.json';
import type { QuizQuestion, QuizCategory } from '../../types/quiz';

interface ModuleConfig {
  id: string;
  title: string;
  subtitle: string;
  category: QuizCategory;
  badge: string;
  badgeColor: string;
  icon: React.ComponentType<{ className?: string }>;
}

export type { ModuleConfig };

const XP_PER_CORRECT = 10;
const PASS_THRESHOLD = 0.7;

export interface ModuloTeoricoViewProps {
  config: ModuleConfig;
  viewer: React.ReactNode;
}

export const ModuloTeoricoView: React.FC<ModuloTeoricoViewProps> = ({ config, viewer }) => {
  const [tab, setTab] = useState<'ESTUDIO' | 'QUIZ'>('ESTUDIO');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [result, setResult] = useState<{ correct: number; total: number; xpEarned: number } | null>(null);

  // Filtrar y mezclar preguntas de la categoría
  const questions = useMemo<QuizQuestion[]>(() => {
    const arr = (teoriaData as QuizQuestion[]).filter(q => q.category === config.category);
    return arr.sort(() => Math.random() - 0.5);
  }, [config.category]);

  const handleAnswer = (isCorrect: boolean, qid: string) => {
    setResult(prev => {
      const base = prev ?? { correct: 0, total: 0, xpEarned: 0 };
      return {
        correct: base.correct + (isCorrect ? 1 : 0),
        total: base.total + 1,
        xpEarned: base.xpEarned + (isCorrect ? XP_PER_CORRECT : 0)
      };
    });
    if (isCorrect) {
      addXP(XP_PER_CORRECT);
    } else {
      addManyToReview([qid]);
    }
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(c => c + 1);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setResult(null);
    registerStudy();
  };

  const accuracy = result ? (result.correct / result.total) * 100 : 0;
  const passed = result && result.total === questions.length && accuracy >= PASS_THRESHOLD * 100;
  const finished = result && result.total === questions.length;
  const Icon = config.icon;

  // Si no hay preguntas, mostrar mensaje
  if (questions.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-8 max-w-2xl mx-auto text-center">
        <Icon className="w-12 h-12 text-slate-600" />
        <p className="text-slate-300 text-sm">Aún no hay preguntas cargadas para {config.title}.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center">
        <div className={`inline-flex items-center gap-2 ${config.badgeColor} border px-3 py-1 rounded-full text-xs font-bold tracking-wider mb-3`}>
          <Icon className="w-3.5 h-3.5" />
          {config.badge}
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-slate-50 mb-2">{config.title}</h2>
        <p className="text-slate-300 max-w-2xl mx-auto text-sm">{config.subtitle}</p>
      </div>

      {/* Tabs Estudio / Práctica */}
      <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-700 max-w-md mx-auto w-full">
        <button
          onClick={() => setTab('ESTUDIO')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
            tab === 'ESTUDIO' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Estudio
        </button>
        <button
          onClick={() => setTab('QUIZ')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
            tab === 'QUIZ' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <BrainCircuit className="w-4 h-4" />
          Práctica
        </button>
      </div>

      {/* Contenido */}
      {tab === 'ESTUDIO' && (
        <div className="animate-[fade-in_0.4s_ease-out]">{viewer}</div>
      )}

      {tab === 'QUIZ' && !finished && (
        <div className="animate-[fade-in_0.4s_ease-out]">
          <QuizCard
            question={questions[currentIdx]}
            questionNumber={currentIdx + 1}
            totalQuestions={questions.length}
            xpPerCorrect={XP_PER_CORRECT}
            onAnswer={handleAnswer}
            onNext={handleNext}
          />
        </div>
      )}

      {tab === 'QUIZ' && finished && result && (
        <div className="bg-slate-800/70 backdrop-blur-md border border-white/10 rounded-2xl p-8 max-w-2xl mx-auto w-full text-center animate-[fade-in_0.5s_ease-out]">
          {passed ? (
            <>
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-amber-500/20 border-2 border-amber-500 mb-4">
                <Trophy className="w-10 h-10 text-amber-400" />
              </div>
              <h3 className="text-2xl font-bold text-amber-300 mb-2">¡Módulo Aprobado!</h3>
              <p className="text-slate-300 text-sm mb-6">Excelente trabajo. Dominas {config.title}.</p>
            </>
          ) : (
            <>
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-cyan-500/20 border-2 border-cyan-500 mb-4">
                <RotateCcw className="w-10 h-10 text-cyan-400" />
              </div>
              <h3 className="text-2xl font-bold text-cyan-300 mb-2">Sigue practicando</h3>
              <p className="text-slate-300 text-sm mb-6">Necesitas al menos un 70% para aprobar. Vuelve a intentarlo.</p>
            </>
          )}

          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700">
              <p className="text-2xl font-bold text-cyan-400">{accuracy.toFixed(0)}%</p>
              <p className="text-xs text-slate-400 mt-1">Precisión</p>
            </div>
            <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700">
              <p className="text-2xl font-bold text-emerald-400">{result.correct}/{result.total}</p>
              <p className="text-xs text-slate-400 mt-1">Aciertos</p>
            </div>
            <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700">
              <p className="text-2xl font-bold text-amber-400">+{result.xpEarned}</p>
              <p className="text-xs text-slate-400 mt-1">XP ganada</p>
            </div>
          </div>

          <button
            onClick={handleRestart}
            className="flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-3 px-6 rounded-xl transition-all duration-300 mx-auto shadow-lg shadow-cyan-900/40"
          >
            <RotateCcw className="w-4 h-4" />
            Reintentar Quiz
          </button>
        </div>
      )}
    </div>
  );
};
