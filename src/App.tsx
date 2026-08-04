import { useState } from 'react';
import { Layout } from './components/layout/Layout';
import { DashboardView } from './components/dashboard/DashboardView';
import type { ModuleId } from './components/dashboard/DashboardView';
import { ModuloRipaIalaView } from './components/modules/ModuloRipaIalaView';
import { ModuloIalaView } from './components/modules/ModuloIalaView';
import { ModuloTeoricoView } from './components/modules/ModuloTeoricoView';
import { SeguridadViewer } from './components/seguridad/SeguridadViewer';
import { NomenclaturaViewer } from './components/nomenclatura/NomenclaturaViewer';
import { MarinePropulsionViewer } from './components/nomenclatura/MarinePropulsionViewer';
import { MeteorologiaViewer } from './components/meteorologia/MeteorologiaViewer';
import { MeteorologyConceptViewer } from './components/meteorologia/MeteorologyConceptViewer';
import { KnotsViewer } from './components/knots/KnotsViewer';
import { RealExamView } from './components/exam/RealExamView';
import { PracticalExercisesView } from './components/practico/PracticalExercisesView';
import { 
  Shield, 
  Sailboat, 
  Wind, 
  Calculator, 
  Scale, 
  Cable, 
  GraduationCap, 
  Home, 
  Compass,
  Anchor
} from 'lucide-react';
import nudosData from './data/nudos.json';
import type { QuizQuestion } from './types/quiz';
import { getVisualSpec } from './data/visualManifest';

type ActiveView = 'HOME' | ModuleId;

function App() {
  const [activeView, setActiveView] = useState<ActiveView>('HOME');

  // Banco específico de cabuyería: evita mezclar preguntas de Seguridad.
  const knotsQuestions = nudosData as QuizQuestion[];
  const isActiveView = (view: ActiveView) => activeView === view;

  return (
    <Layout>
      <div className="h-full flex flex-col gap-2 overflow-hidden">
        
        {/* La navegación completa solo aparece en el dashboard. */}
        {activeView === 'HOME' && <div className="flex items-center justify-between bg-slate-900 border border-slate-800 p-1.5 rounded-2xl shrink-0">
          <div className="flex items-center gap-2 px-2">
            <button
              onClick={() => setActiveView('HOME')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-black transition-all cursor-pointer ${
                isActiveView('HOME')
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-900/40'
                  : 'bg-slate-800 text-cyan-400 hover:bg-slate-700 border border-slate-700'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>Menú Principal</span>
            </button>
          </div>

          {/* Selector de Módulos (Incluyendo Inicio + 7 Módulos en Pills) */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 overflow-x-auto">
            <button
              onClick={() => setActiveView('HOME')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                isActiveView('HOME') ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              Inicio (Cards)
            </button>

            <button
              onClick={() => setActiveView('RIPA')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                isActiveView('RIPA') ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              1. RIPA
            </button>

            <button
              onClick={() => setActiveView('IALA')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                isActiveView('IALA') ? 'bg-blue-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Anchor className="w-3.5 h-3.5" />
              2. IALA
            </button>

            <button
              onClick={() => setActiveView('SEGURIDAD')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                isActiveView('SEGURIDAD') ? 'bg-rose-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              3. Seguridad
            </button>

            <button
              onClick={() => setActiveView('NOMENCLATURA')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                isActiveView('NOMENCLATURA') ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sailboat className="w-3.5 h-3.5" />
              4. Nomenclatura
            </button>

            <button
              onClick={() => setActiveView('METEOROLOGIA')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                isActiveView('METEOROLOGIA') ? 'bg-sky-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Wind className="w-3.5 h-3.5" />
              5. Meteo
            </button>

            <button
              onClick={() => setActiveView('NUDOS')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                isActiveView('NUDOS') ? 'bg-pink-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Cable className="w-3.5 h-3.5" />
              6. Nudos
            </button>

            <button
              onClick={() => setActiveView('PRACTICOS')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                isActiveView('PRACTICOS') ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Calculator className="w-3.5 h-3.5" />
              7. Prácticos
            </button>

            <button
              onClick={() => setActiveView('EXAMEN')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                isActiveView('EXAMEN') ? 'bg-amber-400 text-slate-950 font-black shadow-md' : 'text-amber-400 hover:text-amber-300'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              Examen Real
            </button>
          </div>
        </div>}

        {activeView !== 'HOME' && (
          <nav className="h-8 shrink-0 flex items-center rounded-xl border border-slate-800 bg-slate-900/95 px-1.5" aria-label="Navegación del módulo">
            <button
              onClick={() => setActiveView('HOME')}
              className="h-6 inline-flex items-center gap-1.5 rounded-lg border border-cyan-500/30 bg-slate-950 px-2.5 text-[11px] font-black text-cyan-300 transition-all duration-300 hover:bg-cyan-500 hover:text-slate-950"
              title="Volver al menú principal"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Menú Principal</span>
            </button>
          </nav>
        )}

        {/* CONTENIDO DEL MÓDULO ACTIVO */}
        <div className={`flex-1 min-h-0 overflow-hidden ${activeView === 'HOME' ? 'py-1' : ''}`}>
          
          {/* HOME: DASHBOARD COMPLETO (7 MÓDULOS) */}
          {activeView === 'HOME' && (
            <DashboardView onSelectModule={(id) => setActiveView(id)} />
          )}

          {/* MÓDULO 1: RIPA & IALA */}
          {activeView === 'RIPA' && (
            <ModuloRipaIalaView />
          )}

          {activeView === 'IALA' && (
            <ModuloIalaView />
          )}

          {/* MÓDULO 2: SEGURIDAD & FONDEO */}
          {activeView === 'SEGURIDAD' && (
            <ModuloTeoricoView 
              config={{
                id: 'SEGURIDAD',
                title: 'Seguridad Náutica y Fondeo',
                subtitle: 'Inventario PNA, salvamento, Hombre al Agua (HAA) y maniobras de fondeo.',
                category: 'SEGURIDAD',
                badge: 'Módulo 3',
                badgeColor: 'bg-rose-500',
                icon: Shield
              }}
              viewer={<SeguridadViewer compact />}
              visualForQuestion={question => {
                const family = getVisualSpec(question.id)?.family;
                if (family === 'NOM_ENGINE') return <MarinePropulsionViewer focus="ENGINE" context={question.question} />;
                if (family === 'NOM_PROPELLER') return <MarinePropulsionViewer focus="PROPELLER" context={question.question} />;
                if (family === 'SAFETY_FIRE') return <SeguridadViewer compact focusSection="INCENDIO" />;
                if (family === 'SAFETY_STORM') return <SeguridadViewer compact focusSection="TEMPORAL" />;
                if (family === 'SAFETY_DAMAGE') return <SeguridadViewer compact focusSection="AVERIAS" />;
                if (family === 'SAFETY_HAA') return <SeguridadViewer compact focusSection="HAA" />;
                if (family === 'SAFETY_ANCHOR') return <SeguridadViewer compact focusSection="FONDEO" />;
                return <SeguridadViewer compact focusSection="INVENTARIO" />;
              }}
            />
          )}

          {/* MÓDULO 3: NOMENCLATURA & ARBOLADURA */}
          {activeView === 'NOMENCLATURA' && (
            <ModuloTeoricoView 
              config={{
                id: 'NOMENCLATURA',
                title: 'Nomenclatura y Arboladura',
                subtitle: 'Anatomía del barco, casco, francobordo, jarcia fija y maniobra de velas.',
                category: 'NOMENCLATURA',
                badge: 'Módulo 4',
                badgeColor: 'bg-amber-500',
                icon: Sailboat
              }}
              viewer={<NomenclaturaViewer compact />}
              visualForQuestion={question => {
                const family = getVisualSpec(question.id)?.family;
                const focusSection = family === 'NOM_ANCHOR' ? 'FONDEO' : family === 'NOM_RIGGING' ? 'JARCIA' : 'CASCO';
                return <NomenclaturaViewer compact focusSection={focusSection} />;
              }}
            />
          )}

          {/* MÓDULO 4: METEOROLOGÍA NÁUTICA */}
          {activeView === 'METEOROLOGIA' && (
            <ModuloTeoricoView 
              config={{
                id: 'METEOROLOGIA',
                title: 'Meteorología Náutica',
                subtitle: 'Escala Beaufort, Pampero, Sudestada y tormentas Cumulonimbus (CB).',
                category: 'METEOROLOGIA',
                badge: 'Módulo 5',
                badgeColor: 'bg-sky-500',
                icon: Wind
              }}
              viewer={<MeteorologiaViewer compact />}
              visualForQuestion={question => {
                const family = getVisualSpec(question.id)?.family;
                if (family === 'MET_FORECAST') return <MeteorologyConceptViewer focus="PRONOSTICO" />;
                if (family === 'MET_PRESSURE') return <MeteorologyConceptViewer focus="PRESION" />;
                if (family === 'MET_BREEZE') return <MeteorologyConceptViewer focus="BRISAS" />;
                if (family === 'MET_WAVES') return <MeteorologyConceptViewer focus="OLEAJE" />;
                if (family === 'MET_WIND') return <MeteorologyConceptViewer focus="VIENTO" />;
                if (family === 'MET_PAMPERO') return <MeteorologiaViewer compact focusPhenomenon="PAMPERO" />;
                if (family === 'MET_SUDESTADA') return <MeteorologiaViewer compact focusPhenomenon="SUDESTADA" />;
                if (family === 'MET_BEAUFORT') return <MeteorologiaViewer compact focusBeaufort={6} />;
                return <MeteorologiaViewer compact focusBeaufort={3} />;
              }}
            />
          )}

          {/* MÓDULO 6: NUDOS NÁUTICOS */}
          {activeView === 'NUDOS' && (
            <KnotsViewer questions={knotsQuestions} />
          )}

          {/* MÓDULO 7: EJERCICIOS PRÁCTICOS DE NAVEGACIÓN */}
          {activeView === 'PRACTICOS' && (
            <PracticalExercisesView />
          )}

          {/* EVALUACIÓN FINAL: SIMULADOR DE EXAMEN REAL PNA */}
          {activeView === 'EXAMEN' && (
            <RealExamView onFinish={() => setActiveView('HOME')} />
          )}

        </div>

      </div>
    </Layout>
  );
}

export default App;
