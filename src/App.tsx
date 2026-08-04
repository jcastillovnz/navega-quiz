import { useState } from 'react';
import { Layout } from './components/layout/Layout';
import { DashboardView } from './components/dashboard/DashboardView';
import type { ModuleId } from './components/dashboard/DashboardView';
import { ModuloRipaIalaView } from './components/modules/ModuloRipaIalaView';
import { ModuloIalaView } from './components/modules/ModuloIalaView';
import { ModuloTeoricoView } from './components/modules/ModuloTeoricoView';
import { SeguridadViewer } from './components/seguridad/SeguridadViewer';
import { NomenclaturaViewer } from './components/nomenclatura/NomenclaturaViewer';
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

type ActiveView = 'HOME' | ModuleId;

function App() {
  const [activeView, setActiveView] = useState<ActiveView>('HOME');

  // Banco específico de cabuyería: evita mezclar preguntas de Seguridad.
  const knotsQuestions = nudosData as QuizQuestion[];

  return (
    <Layout>
      <div className="h-full flex flex-col gap-2 overflow-hidden">
        
        {/* Barra Superior de Navegación Unificada */}
        <div className="flex items-center justify-between bg-slate-900 border border-slate-800 p-1.5 rounded-2xl shrink-0">
          <div className="flex items-center gap-2 px-2">
            <button
              onClick={() => setActiveView('HOME')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-black transition-all cursor-pointer ${
                activeView === 'HOME'
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
                activeView === 'HOME' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              Inicio (Cards)
            </button>

            <button
              onClick={() => setActiveView('RIPA')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeView === 'RIPA' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              1. RIPA
            </button>

            <button
              onClick={() => setActiveView('IALA')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeView === 'IALA' ? 'bg-blue-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Anchor className="w-3.5 h-3.5" />
              2. IALA
            </button>

            <button
              onClick={() => setActiveView('SEGURIDAD')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeView === 'SEGURIDAD' ? 'bg-rose-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              3. Seguridad
            </button>

            <button
              onClick={() => setActiveView('NOMENCLATURA')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeView === 'NOMENCLATURA' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sailboat className="w-3.5 h-3.5" />
              4. Nomenclatura
            </button>

            <button
              onClick={() => setActiveView('METEOROLOGIA')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeView === 'METEOROLOGIA' ? 'bg-sky-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Wind className="w-3.5 h-3.5" />
              5. Meteo
            </button>

            <button
              onClick={() => setActiveView('NUDOS')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeView === 'NUDOS' ? 'bg-pink-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Cable className="w-3.5 h-3.5" />
              6. Nudos
            </button>

            <button
              onClick={() => setActiveView('PRACTICOS')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeView === 'PRACTICOS' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Calculator className="w-3.5 h-3.5" />
              7. Prácticos
            </button>

            <button
              onClick={() => setActiveView('EXAMEN')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeView === 'EXAMEN' ? 'bg-amber-400 text-slate-950 font-black shadow-md' : 'text-amber-400 hover:text-amber-300'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              Examen Real
            </button>
          </div>
        </div>

        {/* CONTENIDO DEL MÓDULO ACTIVO */}
        <div className="flex-1 min-h-0 overflow-hidden py-1">
          
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
              viewer={<SeguridadViewer />}
              visualForQuestion={question => {
                const text = `${question.id} ${question.question}`.toLowerCase();
                if (/fire|fuego|incend|matafuego|extint|combust/.test(text)) return <SeguridadViewer focusSection="INCENDIO" />;
                if (/temporal|mal tiempo|capear|correr|sotavento|ancla de capa/.test(text)) return <SeguridadViewer focusSection="TEMPORAL" />;
                if (/averia|avería|vía de agua|via de agua|varada|abordaje|remolque|abandono|timón de fortuna/.test(text)) return <SeguridadViewer focusSection="AVERIAS" />;
                if (/hombre al agua|haa|náufrago|naufrago/.test(text)) return <SeguridadViewer focusSection="HAA" />;
                if (/fondeo|ancla|cadena|garreo/.test(text)) return <SeguridadViewer focusSection="FONDEO" />;
                return <SeguridadViewer focusSection="INVENTARIO" />;
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
                const text = `${question.question} ${question.explanation}`.toLowerCase();
                const focusSection = /jarcia|vela|mástil|mastil|obenque|estay|driza|escota|botavara/.test(text) ? 'JARCIA' : 'CASCO';
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
              viewer={<MeteorologiaViewer />}
              visualForQuestion={question => {
                const text = `${question.id} ${question.question}`.toLowerCase();
                if (/forecast|pronóstico|meteorológica/.test(text)) return <MeteorologyConceptViewer focus="PRONOSTICO" />;
                if (/pressure|presión|barómetro|isobara|humedad/.test(text)) return <MeteorologyConceptViewer focus="PRESION" />;
                if (/breeze|brisa/.test(text)) return <MeteorologyConceptViewer focus="BRISAS" />;
                if (/wave|oleaje|douglas|fetch/.test(text)) return <MeteorologyConceptViewer focus="OLEAJE" />;
                if (/wind|viento|anemómetro|veleta/.test(text)) return <MeteorologyConceptViewer focus="VIENTO" />;
                if (/pampero/.test(text)) return <MeteorologiaViewer focusPhenomenon="PAMPERO" />;
                if (/sudestada/.test(text)) return <MeteorologiaViewer focusPhenomenon="SUDESTADA" />;
                if (/beaufort|fuerza del viento|nudos/.test(text)) return <MeteorologiaViewer focusBeaufort={6} />;
                return <MeteorologiaViewer focusBeaufort={3} />;
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
