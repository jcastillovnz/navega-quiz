import React, { useMemo } from 'react';
import { Route } from 'lucide-react';
import { RipaLightViewer } from '../ripa/RipaLightViewer';
import { RipaCrossingSimulator } from '../ripa/RipaCrossingSimulator';
import { IntegratedLearningView } from '../learning/IntegratedLearningView';
import ripaIalaData from '../../data/ripa_iala.json';
import type { QuizQuestion } from '../../types/quiz';

export const ModuloRipaIalaView: React.FC = () => {
  const questions = useMemo<QuizQuestion[]>(() =>
    (ripaIalaData as QuizQuestion[]).filter(question => question.category === 'RIPA'), []);

  return (
    <div className="h-full flex flex-col gap-2 overflow-hidden">
      <div className="flex items-center justify-between gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-extrabold px-2 py-0.5 bg-cyan-500 text-slate-950 rounded-md">Módulo 1</span>
          <h3 className="text-xs font-bold text-white">Reglamento para prevenir abordajes</h3>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-cyan-300">
          <Route className="w-3.5 h-3.5" />
          Ruta unificada · escena, regla y decisión
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-hidden">
        <IntegratedLearningView
          moduleId="RIPA"
          title="RIPA"
          questions={questions}
          visual={<RipaCrossingSimulator />}
          visualForQuestion={question => {
            if (/luz|luces|marca|noche/i.test(question.question)) return <RipaLightViewer compact />;
            return <RipaCrossingSimulator />;
          }}
        />
      </div>
    </div>
  );
};
