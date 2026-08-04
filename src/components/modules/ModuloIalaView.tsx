import React, { useMemo } from 'react';
import { Anchor, Route } from 'lucide-react';
import { IalaBuoyViewer } from '../iala/IalaBuoyViewer';
import { IntegratedLearningView } from '../learning/IntegratedLearningView';
import ripaIalaData from '../../data/ripa_iala.json';
import ialaAmpliadoData from '../../data/iala_ampliado.json';
import type { QuizQuestion } from '../../types/quiz';

export const ModuloIalaView: React.FC = () => {
  const questions = useMemo<QuizQuestion[]>(() => [
    ...(ripaIalaData as QuizQuestion[]).filter(question => question.category === 'IALA'),
    ...(ialaAmpliadoData as QuizQuestion[])
  ], []);

  return (
    <div className="h-full flex flex-col gap-2 overflow-hidden">
      <div className="flex items-center justify-between gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-extrabold px-2 py-0.5 bg-blue-500 text-slate-950 rounded-md">Módulo 2</span>
          <Anchor className="w-4 h-4 text-blue-300" />
          <h3 className="text-xs font-bold text-white">Sistema de balizamiento marítimo IALA</h3>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-blue-300">
          <Route className="w-3.5 h-3.5" />
          Ruta unificada · identificar, interpretar y decidir
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-hidden">
        <IntegratedLearningView
          moduleId="IALA"
          title="Balizamiento IALA"
          questions={questions}
          visual={<IalaBuoyViewer compact />}
          accentClass="bg-blue-500"
          visualForQuestion={question => {
            const text = `${question.id} ${question.question}`.toLowerCase();
            const focusType = text.includes('norte') || text.includes('card_n') ? 'CARDINAL_N'
              : text.includes('este') || text.includes('card_e') ? 'CARDINAL_E'
                : text.includes('sur') || text.includes('card_s') ? 'CARDINAL_S'
                  : text.includes('oeste') || text.includes('card_w') ? 'CARDINAL_W'
                    : text.includes('aislado') ? 'PELIGRO_AISLADO'
                      : text.includes('segura') || text.includes('safe') ? 'AGUAS_SEGURAS'
                        : text.includes('especial') ? 'ESPECIAL'
                          : text.includes('nuevo') || text.includes('naufragio') ? 'NUEVO_PELIGRO'
                            : text.includes('estribor') ? 'ESTRIBOR' : 'BABOR';
            return <IalaBuoyViewer compact focusType={focusType} />;
          }}
        />
      </div>
    </div>
  );
};
