import React, { useMemo } from 'react';
import { Route } from 'lucide-react';
import { IntegratedLearningView } from '../learning/IntegratedLearningView';
import teoriaData from '../../data/teoria.json';
import nomenclaturaData from '../../data/nomenclatura.json';
import seguridadIncendiosData from '../../data/seguridad_incendios.json';
import seguridadEmergenciasData from '../../data/seguridad_emergencias.json';
import meteorologiaExtendidaData from '../../data/meteorologia_extendida.json';
import meteorologiaApunteData from '../../data/meteorologia_apunte.json';
import seguridadApunteData from '../../data/seguridad_apunte.json';
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

export interface ModuloTeoricoViewProps {
  config: ModuleConfig;
  viewer?: React.ReactNode;
  visualForQuestion?: (question: QuizQuestion) => React.ReactNode;
}

export const ModuloTeoricoView: React.FC<ModuloTeoricoViewProps> = ({ config, viewer = null, visualForQuestion }) => {
  const questions = useMemo<QuizQuestion[]>(() => {
    const pool = [
      ...(teoriaData as QuizQuestion[]),
      ...(nomenclaturaData as QuizQuestion[]),
      ...(seguridadIncendiosData as QuizQuestion[]),
      ...(seguridadEmergenciasData as QuizQuestion[]),
      ...(meteorologiaExtendidaData as QuizQuestion[]),
      ...(meteorologiaApunteData as QuizQuestion[]),
      ...(seguridadApunteData as QuizQuestion[])
    ];
    return pool.filter(question => question.category === config.category);
  }, [config.category]);

  return (
    <div className="h-full flex flex-col gap-1.5 sm:gap-2 overflow-hidden">
      <div className="module-heading flex items-center justify-between gap-2 bg-slate-900 border border-slate-800 px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <span className={`text-[10px] font-extrabold px-2 py-0.5 ${config.badgeColor} text-slate-950 rounded-md shrink-0`}>
            {config.badge}
          </span>
          <h3 className="text-xs font-bold text-white truncate">{config.title}</h3>
        </div>
        <div className="module-route hidden sm:flex items-center gap-1.5 text-[10px] font-bold text-cyan-300">
          <Route className="w-3.5 h-3.5" />
          Ruta unificada · observar, comprender y responder
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-hidden">
        <IntegratedLearningView
          moduleId={config.id}
          title={config.title}
          questions={questions}
          visual={viewer}
          visualForQuestion={visualForQuestion}
          accentClass={config.badgeColor}
        />
      </div>
    </div>
  );
};
