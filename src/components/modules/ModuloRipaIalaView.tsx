import React, { useMemo, useState } from 'react';
import { BookOpen, BrainCircuit, Trophy, RotateCcw, Lightbulb, Layers, Ship } from 'lucide-react';
import { RipaLightViewer } from '../ripa/RipaLightViewer';
import { RipaCrossingSimulator } from '../ripa/RipaCrossingSimulator';
import { IalaBuoyViewer } from '../iala/IalaBuoyViewer';
import { QuizCard } from '../quiz/QuizCard';
import { IntegratedLearningView } from '../learning/IntegratedLearningView';
import { addXP, addManyToReview, registerStudy } from '../../utils/storage';
import ripaIalaData from '../../data/ripa_iala.json';
import type { QuizQuestion } from '../../types/quiz';

type TabId = 'APRENDER' | 'ESTUDIO' | 'QUIZ';
type SubTabId = 'LUCES' | 'CRUCES' | 'IALA';

interface ModuleResult {
  correct: number;
  total: number;
  xpEarned: number;
  incorrectIds: string[];
}

const XP_PER_CORRECT = 10;
const PASS_THRESHOLD = 0.7;

export const ModuloRipaIalaView: React.FC = () => {
  const [tab, setTab] = useState<TabId>('APRENDER');
  const [subTab, setSubTab] = useState<SubTabId>('LUCES');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [result, setResult] = useState<ModuleResult | null>(null);

  const questions = useMemo<QuizQuestion[]>(() => {
    const arr = [...(ripaIalaData as QuizQuestion[])];
    return arr.sort(() => Math.random() - 0.5);
  }, []);

  const handleAnswer = (isCorrect: boolean, qid: string) => {
    setResult(prev => {
      const base: ModuleResult = prev ?? { correct: 0, total: 0, xpEarned: 0, incorrectIds: [] };
      return {
        ...base,
        correct: base.correct + (isCorrect ? 1 : 0),
        total: base.total + 1,
        xpEarned: base.xpEarned + (isCorrect ? XP_PER_CORRECT : 0),
        incorrectIds: isCorrect ? base.incorrectIds : [...base.incorrectIds, qid]
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

  const accuracy = result ? (result.correct / result.total) * 100 : 0;
  const passed = result && result.total === questions.length && accuracy >= PASS_THRESHOLD * 100;
  const finished = result && result.total === questions.length;

  const SUB_TABS: { id: SubTabId; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'LUCES', label: 'Luces de Navegación', icon: Lightbulb },
    { id: 'CRUCES', label: 'Reglas de Cruce', icon: Layers },
    { id: 'IALA', label: 'Balizamiento IALA', icon: Ship }
  ];

  return (
    <div className="h-full flex flex-col gap-2 overflow-hidden">
      {/* Barra de Control Superior: Modo + Sub-Tabs en una sola línea */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 shrink-0">
        {/* Toggle Estudio / Quiz */}
        <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setTab('APRENDER')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
              tab === 'APRENDER' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5" />
            Aprender
          </button>
          <button
            onClick={() => setTab('ESTUDIO')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
              tab === 'ESTUDIO' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Explorar
          </button>
          <button
            onClick={() => setTab('QUIZ')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
              tab === 'QUIZ' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BrainCircuit className="w-3.5 h-3.5" />
            Practicar
          </button>
        </div>

        {/* Sub-Tabs del Contenido Teórico (solo en ESTUDIO) */}
        {tab === 'ESTUDIO' && (
          <div className="flex gap-1.5">
            {SUB_TABS.map(s => {
              const Icon = s.icon;
              return (
                <button
                  key={s.id}
                  onClick={() => setSubTab(s.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    subTab === s.id
                      ? 'bg-slate-700 text-cyan-300 border border-slate-600'
                      : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {s.label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Área de Contenido (Flex-1, sin scroll global) */}
      <div className="flex-1 min-h-0 overflow-hidden">
        {tab === 'APRENDER' && (
          <IntegratedLearningView
            moduleId="RIPA_IALA"
            title="RIPA e IALA"
            questions={questions}
            visual={<RipaCrossingSimulator />}
            visualForQuestion={question => {
              if (question.category === 'IALA') return <IalaBuoyViewer />;
              if (/luz|luces|marca|noche/i.test(question.question)) return <RipaLightViewer />;
              return <RipaCrossingSimulator />;
            }}
          />
        )}
        {/* ESTUDIO: Pasa altura completa al viewer */}
        {tab === 'ESTUDIO' && (
          <div className="h-full overflow-hidden">
            {subTab === 'LUCES' && <RipaLightViewer />}
            {subTab === 'CRUCES' && <RipaCrossingSimulator />}
            {subTab === 'IALA' && <IalaBuoyViewer />}
          </div>
        )}

        {/* QUIZ: Preguntas */}
        {tab === 'QUIZ' && !finished && (
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

        {/* RESULTADOS */}
        {tab === 'QUIZ' && finished && result && (
          <div className="h-full flex items-center justify-center">
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 max-w-xl w-full text-center shadow-2xl">
              {passed ? (
                <>
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-500/20 border border-amber-500 mb-3">
                    <Trophy className="w-8 h-8 text-amber-400" />
                  </div>
                  <h3 className="text-xl font-extrabold text-amber-300 mb-1">¡Módulo Aprobado!</h3>
                  <p className="text-slate-300 text-xs mb-4">Has dominado las Reglas RIPA y el Balizamiento IALA.</p>
                </>
              ) : (
                <>
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-cyan-500/20 border border-cyan-500 mb-3">
                    <RotateCcw className="w-8 h-8 text-cyan-400" />
                  </div>
                  <h3 className="text-xl font-extrabold text-cyan-300 mb-1">Buen intento, marinero</h3>
                  <p className="text-slate-300 text-xs mb-4">Necesitas al menos un 70%. Repasá y volvé a intentarlo.</p>
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
                className="flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-2.5 px-5 rounded-xl text-xs transition-all mx-auto shadow-md cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reintentar Quiz
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
