import React, { useState } from 'react';
import { Layout } from './components/layout/Layout';
import { RipaLightViewer } from './components/ripa/RipaLightViewer';
import { IalaBuoyViewer } from './components/iala/IalaBuoyViewer';
import { KnotsViewer } from './components/knots/KnotsViewer';
import { Compass, Ship, Anchor, Award } from 'lucide-react';

type ModuleType = 'RIPA' | 'IALA' | 'NUDOS';

function App() {
  const [activeModule, setActiveModule] = useState<ModuleType>('RIPA');

  // Muestra de preguntas mock para el quiz de nudos
  const mockQuestions = [
    {
      id: 'k1',
      category: 'NOMENCLATURA' as const,
      question: '¿Qué nudo debe usarse para encapillar una gaza a una bita sin que se corra bajo tensión?',
      options: [
        { id: 'a', text: 'Nudo Llano', isCorrect: false },
        { id: 'b', text: 'As de Guía', isCorrect: true },
        { id: 'c', text: 'Ballestrinque', isCorrect: false },
        { id: 'd', text: 'Nudo de Ocho', isCorrect: false }
      ],
      explanation: 'El As de Guía es el nudo por excelencia para formar gazas fijas que no se azocan bajo carga.'
    }
  ];

  return (
    <Layout>
      <div className="h-full flex flex-col gap-2 overflow-hidden">
        
        {/* Selector de Módulo Principal (Top Navigation Bar) */}
        <div className="flex items-center justify-between bg-slate-900 border border-slate-800 p-1.5 rounded-2xl shrink-0">
          <div className="flex items-center gap-2 px-3 py-1">
            <Compass className="w-5 h-5 text-cyan-400 animate-spin-slow" />
            <span className="text-xs font-black tracking-wider text-slate-200 uppercase hidden sm:inline-block">
              Módulos de Estudio
            </span>
          </div>

          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveModule('RIPA')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeModule === 'RIPA'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-900/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Ship className="w-3.5 h-3.5" />
              RIPA (Luces)
            </button>

            <button
              onClick={() => setActiveModule('IALA')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeModule === 'IALA'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-900/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Anchor className="w-3.5 h-3.5" />
              IALA (Boyas)
            </button>

            <button
              onClick={() => setActiveModule('NUDOS')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeModule === 'NUDOS'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-900/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              Nudos Náuticos
            </button>
          </div>
        </div>

        {/* Contenido del Módulo Activo (Ocupa 100% de la altura restante) */}
        <div className="flex-1 min-h-0 overflow-hidden py-1">
          {activeModule === 'RIPA' && <RipaLightViewer />}
          {activeModule === 'IALA' && <IalaBuoyViewer />}
          {activeModule === 'NUDOS' && <KnotsViewer questions={mockQuestions} />}
        </div>

      </div>
    </Layout>
  );
}

export default App;
