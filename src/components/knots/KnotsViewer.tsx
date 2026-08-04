import React from 'react';
import { Route } from 'lucide-react';
import { IntegratedLearningView } from '../learning/IntegratedLearningView';
import type { QuizQuestion } from '../../types/quiz';
import bowlineSteps from '../../assets/knot_bowline_steps.png';
import reefSteps from '../../assets/knot_reef_steps.png';
import cloveSteps from '../../assets/knot_clove_steps.png';
import sheetBendSteps from '../../assets/knot_sheet_bend_steps.png';
import figure8Steps from '../../assets/knot_figure8_steps.png';
import { getVisualSpec } from '../../data/visualManifest';

const KNOTS = [
  { names: ['as de guía', 'bowline'], name: 'As de Guía', use: 'Gaza fija que no se corre bajo carga', image: bowlineSteps },
  { names: ['llano', 'rizo', 'reef'], name: 'Nudo Llano', use: 'Unir cabos del mismo diámetro', image: reefSteps },
  { names: ['ballestrinque', 'clove'], name: 'Ballestrinque', use: 'Afirmar rápidamente un cabo a un objeto', image: cloveSteps },
  { names: ['vuelta de escota', 'sheet bend'], name: 'Vuelta de Escota', use: 'Unir cabos de diferente diámetro', image: sheetBendSteps },
  { names: ['ocho', 'figure eight'], name: 'Nudo de Ocho', use: 'Tope para evitar que un chicote escape', image: figure8Steps }
];

interface KnotsViewerProps {
  questions: QuizQuestion[];
}

export const KnotsViewer: React.FC<KnotsViewerProps> = ({ questions }) => (
  <div className="h-full flex flex-col gap-2 overflow-hidden">
    <div className="flex items-center justify-between gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl shrink-0">
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-extrabold px-2 py-0.5 bg-pink-500 text-slate-950 rounded-md">Módulo 6</span>
        <h3 className="text-xs font-bold text-white">Cabuyería y nudos náuticos</h3>
      </div>
      <div className="flex items-center gap-1.5 text-[10px] font-bold text-pink-300">
        <Route className="w-3.5 h-3.5" />
        Ruta unificada · observar, ejecutar y responder
      </div>
    </div>

    <div className="flex-1 min-h-0 overflow-hidden">
      <IntegratedLearningView
        moduleId="NUDOS"
        title="Nudos Náuticos"
        questions={questions}
        visual={null}
        accentClass="bg-pink-500"
        visualForQuestion={question => {
          const family = getVisualSpec(question.id)?.family;
          const knotIndex = family === 'KNOT_REEF' ? 1 : family === 'KNOT_CLOVE' ? 2
            : family === 'KNOT_SHEET_BEND' ? 3 : family === 'KNOT_FIGURE_EIGHT' ? 4 : 0;
          const knot = KNOTS[knotIndex];
          return (
            <div className="h-full min-h-0 flex flex-col bg-slate-950 p-2 overflow-hidden">
              <img src={knot.image} alt={`Secuencia detallada para realizar ${knot.name}`} className="flex-1 min-h-0 w-full object-contain rounded-xl" />
              <div className="shrink-0 p-2 text-center">
                <p className="text-sm font-black text-white">{knot.name}</p>
                <p className="text-[10px] text-slate-400">{knot.use}</p>
              </div>
            </div>
          );
        }}
      />
    </div>
  </div>
);
