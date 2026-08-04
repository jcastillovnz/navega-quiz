import { useState } from 'react';
import { Layout } from './components/layout/Layout';
import { ModuloRipaIalaView } from './components/modules/ModuloRipaIalaView';
import { ModuloTeoricoView } from './components/modules/ModuloTeoricoView';
import { NomenclaturaViewer } from './components/nomenclatura/NomenclaturaViewer';
import { SeguridadViewer } from './components/seguridad/SeguridadViewer';
import { MeteorologiaViewer } from './components/meteorologia/MeteorologiaViewer';
import { DeclinationCalculator } from './components/practico/DeclinationCalculator';
import { TideCalculator } from './components/practico/TideCalculator';
import { BearingsSimulator } from './components/practico/BearingsSimulator';
import { RealExamView } from './components/exam/RealExamView';
import { QuizCard } from './components/quiz/QuizCard';
import { Shield, Sailboat, Wind, Calculator, Compass, Waves, BookOpen, BrainCircuit, Trophy, RotateCcw, GraduationCap } from 'lucide-react';
import type { ModuleConfig } from './components/modules/ModuloTeoricoView';
import type { QuizCategory, QuizQuestion } from './types/quiz';
import practicosData from './data/practicos.json';

const MOD_SEGURIDAD: ModuleConfig = {
  id: 'SEGURIDAD',
  title: 'Seguridad y Fondeo',
  subtitle: 'Inventario PNA, Hombre al Agua y maniobra de fondeo.',
  category: 'SEGURIDAD' as QuizCategory,
  badge: 'MÓDULO 2',
  badgeColor: 'bg-rose-500/10 border-rose-500/30 text-rose-300',
  icon: Shield
};

const MOD_NOMENCLATURA: ModuleConfig = {
  id: 'NOMENCLATURA',
  title: 'Nomenclatura del Yate',
  subtitle: 'Casco, arboladura, jarcia fija y móvil.',
  category: 'NOMENCLATURA' as QuizCategory,
  badge: 'MÓDULO 3',
  badgeColor: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
  icon: Sailboat
};

const MOD_METEOROLOGIA: ModuleConfig = {
  id: 'METEOROLOGIA',
  title: 'Meteorología Náutica',
  subtitle: 'Escala Beaufort, Pampero, Sudestada y más.',
  category: 'METEOROLOGIA' as QuizCategory,
  badge: 'MÓDULO 4',
  badgeColor: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300',
  icon: Wind
};

const XP_PER_CORRECT = 15;

const ModuloPracticosView: React.FC = () => {
  const [tab, setTab] = useState<'ESTUDIO' | 'QUIZ'>('ESTUDIO');
  const [tool, setTool] = useState<'DECLINACION' | 'MAREAS' | 'MARCACIONES'>('DECLINACION');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [result, setResult] = useState<{ correct: number; total: number; xpEarned: number } | null>(null);

  // Convertir practicos.json a formato QuizQuestion-like para usar QuizCard
  const questions: QuizQuestion[] = (practicosData as Array<{
    id: string;
    category: string;
    type: string;
    statement: string;
    expectedResult: string | number;
    explanationStepByStep: string;
  }>).map(p => ({
    id: p.id,
    category: 'PRACTICO' as QuizCategory,
    question: p.statement,
    options: [
      { id: 'A', text: String(p.expectedResult), isCorrect: true },
      { id: 'B', text: 'Resultado incorrecto 1', isCorrect: false },
      { id: 'C', text: 'Resultado incorrecto 2', isCorrect: false },
      { id: 'D', text: 'Resultado incorrecto 3', isCorrect: false }
    ],
    explanation: p.explanationStepByStep
  }));

  const handleAnswer = (isCorrect: boolean) => {
    setResult(prev => {
      const base = prev ?? { correct: 0, total: 0, xpEarned: 0 };
      return {
        correct: base.correct + (isCorrect ? 1 : 0),
        total: base.total + 1,
        xpEarned: base.xpEarned + (isCorrect ? XP_PER_CORRECT : 0)
      };
    });
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(c => c + 1);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setResult(null);
  };

  const accuracy = result ? (result.correct / result.total) * 100 : 0;
  const passed = result && result.total === questions.length && accuracy >= 70;
  const finished = result && result.total === questions.length;

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 px-3 py-1 rounded-full text-xs font-bold tracking-wider mb-3">
          <Calculator className="w-3.5 h-3.5" />
          MÓDULO 5
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-slate-50 mb-2">Ejercicios Prácticos de Navegación</h2>
        <p className="text-slate-300 max-w-2xl mx-auto text-sm">
          Resuelve problemas reales: declinación, mareas y marcaciones.
        </p>
      </div>

      <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-700 max-w-md mx-auto w-full">
        <button
          onClick={() => setTab('ESTUDIO')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
            tab === 'ESTUDIO' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Calculadoras
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

      {tab === 'ESTUDIO' && (
        <div className="flex flex-col gap-4 animate-[fade-in_0.4s_ease-out]">
          <div className="flex flex-wrap gap-2 justify-center">
            {([
              { id: 'DECLINACION', label: 'Declinación', icon: Compass },
              { id: 'MAREAS', label: 'Mareas', icon: Waves },
              { id: 'MARCACIONES', label: 'Marcaciones', icon: Calculator }
            ] as const).map(t => {
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  onClick={() => setTool(t.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    tool === t.id
                      ? 'bg-cyan-600 text-white shadow-md'
                      : 'bg-slate-800 border border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {t.label}
                </button>
              );
            })}
          </div>

          {tool === 'DECLINACION' && <DeclinationCalculator />}
          {tool === 'MAREAS' && <TideCalculator />}
          {tool === 'MARCACIONES' && <BearingsSimulator />}
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

      {tab === 'QUIZ' && finished && result && (
        <div className="bg-slate-800/70 backdrop-blur-md border border-white/10 rounded-2xl p-8 max-w-2xl mx-auto w-full text-center animate-[fade-in_0.5s_ease-out]">
          {passed ? (
            <>
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-amber-500/20 border-2 border-amber-500 mb-4">
                <Trophy className="w-10 h-10 text-amber-400" />
              </div>
              <h3 className="text-2xl font-bold text-amber-300 mb-2">¡Ejercicios Aprobados!</h3>
              <p className="text-slate-300 text-sm mb-6">Dominas los cálculos de navegación.</p>
            </>
          ) : (
            <>
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-cyan-500/20 border-2 border-cyan-500 mb-4">
                <RotateCcw className="w-10 h-10 text-cyan-400" />
              </div>
              <h3 className="text-2xl font-bold text-cyan-300 mb-2">Vuelve a intentarlo</h3>
              <p className="text-slate-300 text-sm mb-6">Necesitas al menos un 70% para aprobar.</p>
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
            Reintentar
          </button>
        </div>
      )}
    </div>
  );
};

function App() {
  return (
    <Layout>
      <div className="flex flex-col items-center gap-16 py-8">
        <ModuloRipaIalaView />

        <div className="w-32 h-px bg-slate-800" />

        <ModuloTeoricoView config={MOD_SEGURIDAD} viewer={<SeguridadViewer />} />

        <div className="w-32 h-px bg-slate-800" />

        <ModuloTeoricoView config={MOD_NOMENCLATURA} viewer={<NomenclaturaViewer />} />

        <div className="w-32 h-px bg-slate-800" />

        <ModuloTeoricoView config={MOD_METEOROLOGIA} viewer={<MeteorologiaViewer />} />

        <div className="w-32 h-px bg-slate-800" />

        <ModuloPracticosView />

        <div className="w-32 h-px bg-amber-500/30" />

        <div className="w-full max-w-5xl mx-auto flex flex-col gap-6">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-300 px-3 py-1 rounded-full text-xs font-bold tracking-wider mb-3">
              <GraduationCap className="w-3.5 h-3.5" />
              DESAFÍO FINAL
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-50 mb-2">Simulador de Examen Real PNA</h2>
            <p className="text-slate-300 max-w-2xl mx-auto text-sm">
              40 puntos • 60 minutos • Sin ayudas. Cronómetro estricto. ¿Te animás?
            </p>
          </div>
          <RealExamView />
        </div>
      </div>
    </Layout>
  );
}

export default App;
