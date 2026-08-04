import React, { useState } from 'react';
import { ArrowLeft, Scale, Shield, Sailboat, Wind, Calculator, GraduationCap, Cable } from 'lucide-react';
import { Layout } from './components/layout/Layout';
import { DashboardView, type ModuleId } from './components/dashboard/DashboardView';
import { ModuloRipaIalaView } from './components/modules/ModuloRipaIalaView';
import { ModuloTeoricoView } from './components/modules/ModuloTeoricoView';
import { NomenclaturaViewer } from './components/nomenclatura/NomenclaturaViewer';
import { SeguridadViewer } from './components/seguridad/SeguridadViewer';
import { MeteorologiaViewer } from './components/meteorologia/MeteorologiaViewer';
import { DeclinationCalculator } from './components/practico/DeclinationCalculator';
import { TideCalculator } from './components/practico/TideCalculator';
import { BearingsSimulator } from './components/practico/BearingsSimulator';
import { KnotsViewer } from './components/knots/KnotsViewer';
import { RealExamView } from './components/exam/RealExamView';
import { QuizCard } from './components/quiz/QuizCard';
import type { ModuleConfig } from './components/modules/ModuloTeoricoView';
import type { QuizCategory, QuizQuestion } from './types/quiz';
import { addXP, addManyToReview, registerStudy } from './utils/storage';
import { Shield as ShieldIcon, Sailboat as SailboatIcon, Wind as WindIcon } from 'lucide-react';
import practicosData from './data/practicos.json';
import nudosData from './data/nudos.json';

const MOD_SEGURIDAD: ModuleConfig = {
  id: 'SEGURIDAD',
  title: 'Seguridad y Fondeo',
  subtitle: 'Inventario PNA, Hombre al Agua y maniobra de fondeo.',
  category: 'SEGURIDAD' as QuizCategory,
  badge: 'MÓDULO 2',
  badgeColor: 'bg-rose-500/10 border-rose-500/30 text-rose-300',
  icon: ShieldIcon
};

const MOD_NOMENCLATURA: ModuleConfig = {
  id: 'NOMENCLATURA',
  title: 'Nomenclatura del Yate',
  subtitle: 'Casco, arboladura, jarcia fija y móvil.',
  category: 'NOMENCLATURA' as QuizCategory,
  badge: 'MÓDULO 3',
  badgeColor: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
  icon: SailboatIcon
};

const MOD_METEOROLOGIA: ModuleConfig = {
  id: 'METEOROLOGIA',
  title: 'Meteorología Náutica',
  subtitle: 'Escala Beaufort, Pampero, Sudestada y más.',
  category: 'METEOROLOGIA' as QuizCategory,
  badge: 'MÓDULO 4',
  badgeColor: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300',
  icon: WindIcon
};

interface ModuleShellProps {
  number: number;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  badgeColor: string;
  onBack: () => void;
  children: React.ReactNode;
}

const ModuleShell: React.FC<ModuleShellProps> = ({ number, title, icon: Icon, badgeColor, onBack, children }) => (
  <div className="flex-1 flex flex-col min-h-0">
    {/* Header fijo del módulo */}
    <div className="flex items-center justify-between mb-1.5 shrink-0">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-slate-400 hover:text-cyan-300 transition-colors group"
      >
        <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
        <span className="text-xs font-medium">Volver al inicio</span>
      </button>
      <div className={`flex items-center gap-1.5 ${badgeColor} border px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider`}>
        <Icon className="w-3 h-3" />
        MÓDULO {number}
      </div>
    </div>
    <h2 className="text-lg md:text-xl font-bold text-slate-50 mb-2 shrink-0">{title}</h2>
    {/* Contenido scrolleable */}
    <div className="flex-1 min-h-0 overflow-y-auto pr-1 -mr-1">
      {children}
    </div>
  </div>
);

const ModuloPracticosView: React.FC = () => {
  const [tab, setTab] = useState<'ESTUDIO' | 'QUIZ'>('ESTUDIO');
  const [tool, setTool] = useState<'DECLINACION' | 'MAREAS' | 'MARCACIONES'>('DECLINACION');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [result, setResult] = useState<{ correct: number; total: number; xpEarned: number } | null>(null);

  const questions: QuizQuestion[] = (practicosData as Array<{
    id: string; category: string; type: string;
    statement: string; expectedResult: string | number; explanationStepByStep: string;
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

  const handleAnswer = (isCorrect: boolean, qid: string) => {
    setResult(prev => {
      const base = prev ?? { correct: 0, total: 0, xpEarned: 0 };
      return {
        correct: base.correct + (isCorrect ? 1 : 0),
        total: base.total + 1,
        xpEarned: base.xpEarned + (isCorrect ? 15 : 0)
      };
    });
    if (isCorrect) addXP(15);
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
  const passed = result && result.total === questions.length && accuracy >= 70;
  const finished = result && result.total === questions.length;

  return (
    <div className="flex flex-col gap-4">
      <p className="text-slate-300 text-sm">Resuelve problemas reales: declinación, mareas y marcaciones.</p>
      <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-700 max-w-md">
        <button
          onClick={() => setTab('ESTUDIO')}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            tab === 'ESTUDIO' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Calculadoras
        </button>
        <button
          onClick={() => setTab('QUIZ')}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            tab === 'QUIZ' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Práctica
        </button>
      </div>

      {tab === 'ESTUDIO' && (
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap gap-2">
            {([
              { id: 'DECLINACION', label: 'Declinación' },
              { id: 'MAREAS', label: 'Mareas' },
              { id: 'MARCACIONES', label: 'Marcaciones' }
            ] as const).map(t => (
              <button
                key={t.id}
                onClick={() => setTool(t.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  tool === t.id ? 'bg-cyan-600 text-white shadow-md' : 'bg-slate-800 border border-slate-700 text-slate-400 hover:text-slate-200'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
          {tool === 'DECLINACION' && <DeclinationCalculator />}
          {tool === 'MAREAS' && <TideCalculator />}
          {tool === 'MARCACIONES' && <BearingsSimulator />}
        </div>
      )}

      {tab === 'QUIZ' && !finished && (
        <QuizCard
          question={questions[currentIdx]}
          questionNumber={currentIdx + 1}
          totalQuestions={questions.length}
          xpPerCorrect={15}
          onAnswer={handleAnswer}
          onNext={handleNext}
        />
      )}

      {tab === 'QUIZ' && finished && result && (
        <div className="bg-slate-800/70 border border-white/10 rounded-2xl p-6 text-center">
          <h3 className={`text-2xl font-bold mb-2 ${passed ? 'text-amber-300' : 'text-cyan-300'}`}>
            {passed ? '¡Aprobado!' : 'Vuelve a intentarlo'}
          </h3>
          <div className="grid grid-cols-3 gap-3 my-4">
            <div className="bg-slate-900/50 rounded-xl p-3 border border-slate-700">
              <p className="text-2xl font-bold text-cyan-400">{accuracy.toFixed(0)}%</p>
              <p className="text-xs text-slate-400">Precisión</p>
            </div>
            <div className="bg-slate-900/50 rounded-xl p-3 border border-slate-700">
              <p className="text-2xl font-bold text-emerald-400">{result.correct}/{result.total}</p>
              <p className="text-xs text-slate-400">Aciertos</p>
            </div>
            <div className="bg-slate-900/50 rounded-xl p-3 border border-slate-700">
              <p className="text-2xl font-bold text-amber-400">+{result.xpEarned}</p>
              <p className="text-xs text-slate-400">XP</p>
            </div>
          </div>
          <button
            onClick={handleRestart}
            className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-2 px-5 rounded-xl transition-all"
          >
            Reintentar
          </button>
        </div>
      )}
    </div>
  );
};

function App() {
  const [activeModule, setActiveModule] = useState<ModuleId | null>(null);

  const handleBack = () => setActiveModule(null);

  return (
    <Layout>
      {activeModule === null && <DashboardView onSelectModule={setActiveModule} />}

      {activeModule === 'RIPA' && (
        <ModuleShell
          number={1}
          title="Legislación, RIPA & IALA"
          icon={Scale}
          badgeColor="bg-cyan-500/10 border-cyan-500/30 text-cyan-300"
          onBack={handleBack}
        >
          <ModuloRipaIalaView />
        </ModuleShell>
      )}

      {activeModule === 'SEGURIDAD' && (
        <ModuleShell
          number={2}
          title="Seguridad y Fondeo"
          icon={Shield}
          badgeColor="bg-rose-500/10 border-rose-500/30 text-rose-300"
          onBack={handleBack}
        >
          <ModuloTeoricoView config={MOD_SEGURIDAD} viewer={<SeguridadViewer />} />
        </ModuleShell>
      )}

      {activeModule === 'NOMENCLATURA' && (
        <ModuleShell
          number={3}
          title="Nomenclatura del Yate"
          icon={Sailboat}
          badgeColor="bg-amber-500/10 border-amber-500/30 text-amber-300"
          onBack={handleBack}
        >
          <ModuloTeoricoView config={MOD_NOMENCLATURA} viewer={<NomenclaturaViewer />} />
        </ModuleShell>
      )}

      {activeModule === 'METEOROLOGIA' && (
        <ModuleShell
          number={4}
          title="Meteorología Náutica"
          icon={Wind}
          badgeColor="bg-sky-500/10 border-sky-500/30 text-sky-300"
          onBack={handleBack}
        >
          <ModuloTeoricoView config={MOD_METEOROLOGIA} viewer={<MeteorologiaViewer />} />
        </ModuleShell>
      )}

      {activeModule === 'PRACTICOS' && (
        <ModuleShell
          number={5}
          title="Ejercicios Prácticos de Navegación"
          icon={Calculator}
          badgeColor="bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
          onBack={handleBack}
        >
          <ModuloPracticosView />
        </ModuleShell>
      )}

      {activeModule === 'NUDOS' && (
        <ModuleShell
          number={6}
          title="Nudos Náuticos Esenciales"
          icon={Cable}
          badgeColor="bg-pink-500/10 border-pink-500/30 text-pink-300"
          onBack={handleBack}
        >
          <KnotsViewer questions={nudosData as unknown as QuizQuestion[]} />
        </ModuleShell>
      )}

      {activeModule === 'EXAMEN' && (
        <ModuleShell
          number={7}
          title="Simulador de Examen Real PNA"
          icon={GraduationCap}
          badgeColor="bg-amber-500/10 border-amber-500/30 text-amber-300"
          onBack={handleBack}
        >
          <RealExamView />
        </ModuleShell>
      )}
    </Layout>
  );
}

export default App;
