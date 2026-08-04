import React, { useMemo, useState } from 'react';
import { BookOpen, BrainCircuit, Trophy, RotateCcw, Lightbulb, Layers, Ship } from 'lucide-react';
import { RipaLightViewer } from '../ripa/RipaLightViewer';
import { RipaCrossingSimulator } from '../ripa/RipaCrossingSimulator';
import { IalaBuoyViewer } from '../iala/IalaBuoyViewer';
import { QuizCard } from '../quiz/QuizCard';
import { addXP, addManyToReview, registerStudy } from '../../utils/storage';
import ripaIalaData from '../../data/ripa_iala.json';
import type { QuizQuestion } from '../../types/quiz';

type TabId = 'ESTUDIO' | 'QUIZ';
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
  const [tab, setTab] = useState<TabId>('ESTUDIO');
  const [subTab, setSubTab] = useState<SubTabId>('LUCES');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [result, setResult] = useState<ModuleResult | null>(null);

  // Mezclar preguntas al inicio (memoizado) - solo categorías RIPA e IALA
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

  return (
    <div className="flex flex-col gap-2">
      <p className="text-slate-300 text-xs">
        Aprende las reglas de paso, las luces de navegación y el sistema de balizamiento. Después, pon a prueba tu conocimiento.
      </p>

      {/* Tabs principales: Estudio vs Quiz */}
      <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-700 max-w-md mx-auto w-full">
        <button
          onClick={() => setTab('ESTUDIO')}
          className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            tab === 'ESTUDIO' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Estudio
        </button>
        <button
          onClick={() => setTab('QUIZ')}
          className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            tab === 'QUIZ' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <BrainCircuit className="w-4 h-4" />
          Práctica
        </button>
      </div>

      {/* Contenido según tab */}
      {tab === 'ESTUDIO' && (
        <div className="flex flex-col gap-2 animate-[fade-in_0.4s_ease-out]">
          {/* Sub-tabs del contenido teórico */}
          <div className="flex flex-wrap gap-2 justify-center">
            {(
              [
                { id: 'LUCES', label: 'Luces de Navegación', icon: Lightbulb },
                { id: 'CRUCES', label: 'Reglas de Cruce', icon: Layers },
                { id: 'IALA', label: 'Balizamiento IALA', icon: Ship }
              ] as { id: SubTabId; label: string; icon: React.ComponentType<{ className?: string }> }[]
            ).map(s => {
              const Icon = s.icon;
              return (
                <button
                  key={s.id}
                  onClick={() => setSubTab(s.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    subTab === s.id
                      ? 'bg-slate-700 text-white'
                      : 'bg-slate-800/50 text-slate-400 border border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {s.label}
                </button>
              );
            })}
          </div>

          {subTab === 'LUCES' && <RipaLightViewer />}
          {subTab === 'CRUCES' && <RipaCrossingSimulator />}
          {subTab === 'IALA' && <IalaBuoyViewer />}
        </div>
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

      {/* Pantalla de Resultados */}
      {tab === 'QUIZ' && finished && result && (
        <div className="bg-slate-800/70 backdrop-blur-md border border-white/10 rounded-2xl p-8 max-w-2xl mx-auto w-full text-center animate-[fade-in_0.5s_ease-out]">
          {passed ? (
            <>
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-amber-500/20 border-2 border-amber-500 mb-4">
                <Trophy className="w-10 h-10 text-amber-400" />
              </div>
              <h3 className="text-2xl font-bold text-amber-300 mb-2">¡Módulo Aprobado!</h3>
              <p className="text-slate-300 text-sm mb-6">
                Has dominado las Reglas RIPA y el Balizamiento IALA. ¡A seguir navegando!
              </p>
            </>
          ) : (
            <>
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-cyan-500/20 border-2 border-cyan-500 mb-4">
                <RotateCcw className="w-10 h-10 text-cyan-400" />
              </div>
              <h3 className="text-2xl font-bold text-cyan-300 mb-2">Buen intento, marinero</h3>
              <p className="text-slate-300 text-sm mb-6">
                Necesitas al menos un 70% para aprobar. Repasa el estudio y vuelve a intentarlo.
              </p>
            </>
          )}

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700">
              <p className="text-2xl font-bold text-cyan-400">{accuracy.toFixed(0)}%</p>
              <p className="text-xs text-slate-400 mt-1">Precisión</p>
            </div>
            <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700">
              <p className="text-2xl font-bold text-emerald-400">
                {result.correct}/{result.total}
              </p>
              <p className="text-xs text-slate-400 mt-1">Aciertos</p>
            </div>
            <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700">
              <p className="text-2xl font-bold text-amber-400">+{result.xpEarned}</p>
              <p className="text-xs text-slate-400 mt-1">XP ganada</p>
            </div>
          </div>

          {result.incorrectIds.length > 0 && (
            <p className="text-xs text-slate-400 mb-4">
              {result.incorrectIds.length} pregunta(s) se enviarán a tu Caja de Repaso.
            </p>
          )}

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
