import React, { useMemo, useState } from 'react';
import { BookOpen, BrainCircuit, Trophy, RotateCcw, Lightbulb } from 'lucide-react';
import { QuizCard } from '../quiz/QuizCard';
import { IntegratedLearningView } from '../learning/IntegratedLearningView';
import { addXP, addManyToReview, registerStudy } from '../../utils/storage';
import teoriaData from '../../data/teoria.json';
import nomenclaturaData from '../../data/nomenclatura.json';
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
  const [tab, setTab] = useState<'APRENDER' | 'ESTUDIO' | 'QUIZ'>('APRENDER');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [result, setResult] = useState<{ correct: number; total: number; xpEarned: number } | null>(null);

  // Filtrar y mezclar preguntas de la categoría
  const questions = useMemo<QuizQuestion[]>(() => {
    const pool = [
      ...(teoriaData as QuizQuestion[]),
      ...(nomenclaturaData as QuizQuestion[])
    ];
    const arr = pool.filter(q => q.category === config.category);
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

  if (questions.length === 0 && tab === 'QUIZ') {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-8 max-w-2xl mx-auto text-center h-full">
        <Icon className="w-10 h-10 text-slate-600" />
        <p className="text-slate-300 text-xs">Aún no hay preguntas cargadas para {config.title}.</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col gap-2 overflow-hidden">
      
      {/* Mini Bar de Navegación del Módulo Teórico */}
      <div className="flex items-center justify-between bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl shrink-0">
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-extrabold px-2 py-0.5 ${config.badgeColor} text-slate-950 rounded-md`}>
            {config.badge}
          </span>
          <h3 className="text-xs font-bold text-white tracking-tight hidden sm:inline-block">
            {config.title}
          </h3>
        </div>

        {/* Tabs Estudio / Práctica */}
        <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setTab('APRENDER')}
            className={`flex items-center gap-1 px-3 py-1 rounded-md text-xs font-bold transition-all ${
              tab === 'APRENDER' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5" />
            Aprender
          </button>
          <button
            onClick={() => setTab('ESTUDIO')}
            className={`flex items-center gap-1 px-3 py-1 rounded-md text-xs font-bold transition-all ${
              tab === 'ESTUDIO' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Explorar
          </button>
          <button
            onClick={() => setTab('QUIZ')}
            className={`flex items-center gap-1 px-3 py-1 rounded-md text-xs font-bold transition-all ${
              tab === 'QUIZ' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BrainCircuit className="w-3.5 h-3.5" />
            Practicar
          </button>
        </div>
      </div>

      {/* Contenido (Flex-1 sin scroll global) */}
      <div className="flex-1 min-h-0 overflow-hidden">
        {tab === 'APRENDER' && (
          <IntegratedLearningView
            moduleId={config.id}
            title={config.title}
            questions={questions}
            visual={viewer}
            accentClass={config.badgeColor}
          />
        )}
        {tab === 'ESTUDIO' && (
          <div className="h-full overflow-hidden">
            {viewer}
          </div>
        )}

        {tab === 'QUIZ' && !finished && questions.length > 0 && (
          <div className="h-full overflow-y-auto">
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
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 max-w-xl mx-auto w-full text-center my-auto shadow-2xl">
            {passed ? (
              <>
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-500/20 border border-amber-500 mb-3">
                  <Trophy className="w-8 h-8 text-amber-400" />
                </div>
                <h3 className="text-xl font-extrabold text-amber-300 mb-1">¡Módulo Aprobado!</h3>
                <p className="text-slate-300 text-xs mb-4">Excelente trabajo. Dominas {config.title}.</p>
              </>
            ) : (
              <>
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-cyan-500/20 border border-cyan-500 mb-3">
                  <RotateCcw className="w-8 h-8 text-cyan-400" />
                </div>
                <h3 className="text-xl font-extrabold text-cyan-300 mb-1">Sigue practicando</h3>
                <p className="text-slate-300 text-xs mb-4">Necesitas al menos un 70% para aprobar.</p>
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
                <p className="text-[10px] text-slate-400">XP ganada</p>
              </div>
            </div>

            <button
              onClick={handleRestart}
              className="flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-2.5 px-5 rounded-xl text-xs transition-all mx-auto shadow-md cursor-pointer"
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
