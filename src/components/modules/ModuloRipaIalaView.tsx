import React, { useMemo } from 'react';
import { Route } from 'lucide-react';
import { RipaLightViewer } from '../ripa/RipaLightViewer';
import { RipaCrossingSimulator } from '../ripa/RipaCrossingSimulator';
import { RipaSoundSignalViewer } from '../ripa/RipaSoundSignalViewer';
import { IntegratedLearningView } from '../learning/IntegratedLearningView';
import ripaIalaData from '../../data/ripa_iala.json';
import ripaSoundData from '../../data/ripa_senales_auditivas.json';
import ripaExtendedData from '../../data/ripa_ampliado.json';
import { RipaRuleConceptViewer } from '../ripa/RipaRuleConceptViewer';
import { RipaDayShapeViewer } from '../ripa/RipaDayShapeViewer';
import anchoredDayShape from '../../assets/ripa_anchored_day_shape_illustrated.png';
import agroundDayShape from '../../assets/ripa_aground_day_shape_illustrated.png';
import trawlerDayShape from '../../assets/ripa_trawler_day_shape_illustrated.png';
import { getVisualSpec } from '../../data/visualManifest';
import type { QuizQuestion } from '../../types/quiz';

export const ModuloRipaIalaView: React.FC = () => {
  const questions = useMemo<QuizQuestion[]>(() => [
    ...(ripaIalaData as QuizQuestion[]).filter(question => question.category === 'RIPA'),
    ...(ripaSoundData as QuizQuestion[]),
    ...(ripaExtendedData as QuizQuestion[])
  ], []);

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
          visual={<RipaCrossingSimulator compact />}
          visualForQuestion={question => {
            const text = `${question.id} ${question.question} ${question.explanation}`.toLowerCase();
            const family = getVisualSpec(question.id)?.family;
            if (family === 'RIPA_DAY_ANCHORED' || family === 'RIPA_DAY_AGROUND' || family === 'RIPA_DAY_TRAWLING') {
              const dayShape = family === 'RIPA_DAY_AGROUND' ? {
                image: agroundDayShape,
                alt: 'Buque varado sobre un bajo con tres esferas negras en línea vertical',
                title: 'Marca diurna de buque varado',
                detail: 'Tres esferas negras en línea vertical. El casco apoyado en el bajo y la ausencia de estela refuerzan que el buque está varado.'
              } : family === 'RIPA_DAY_TRAWLING' ? {
                image: trawlerDayShape,
                alt: 'Pesquero de arrastre con dos conos negros unidos por sus vértices y redes trabajando',
                title: 'Marca diurna de pesca de arrastre',
                detail: 'Dos conos negros con los vértices unidos. Las redes extendidas a popa contextualizan que el pesquero está faenando.'
              } : {
                image: anchoredDayShape,
                alt: 'Buque fondeado de día con una esfera negra izada en la parte de proa',
                title: 'Marca diurna de fondeo',
                detail: 'Una esfera negra donde mejor se vea en la parte de proa. La cadena confirma que el buque está fondeado y sin arrancada.'
              };
              return (
                <div className="h-full relative overflow-hidden bg-slate-950">
                  <img src={dayShape.image} alt={dayShape.alt} className="w-full h-full object-contain bg-slate-950" />
                  <div className="absolute bottom-2 left-2 right-2 rounded-xl border border-amber-300/30 bg-slate-950/85 px-3 py-2">
                    <p className="text-xs font-black text-amber-200">{dayShape.title}</p>
                    <p className="text-[10px] text-slate-200">{dayShape.detail}</p>
                  </div>
                </div>
              );
            }
            if (family === 'RIPA_SOUND') {
              return <RipaSoundSignalViewer context={text} />;
            }
            if (family === 'RIPA_DAY_SHAPES') return <RipaDayShapeViewer context={text} />;
            if (family === 'RIPA_WATCH' || family === 'RIPA_COLLISION_RISK' || family === 'RIPA_AVOIDANCE' || family === 'RIPA_CHANNEL' || family === 'RIPA_TSS' || family === 'RIPA_RESTRICTED_VIS') {
              return <RipaRuleConceptViewer family={family} />;
            }
            if (family === 'RIPA_LIGHTS') {
              const focusShipType = /velero|vela/.test(text) ? 'VELA' : 'MOTOR';
              const focusPerspective = /alcance|popa/.test(text) ? 'POPA'
                : /babor/.test(text) && !/estribor/.test(text) ? 'BABOR'
                  : /estribor/.test(text) && !/babor/.test(text) ? 'ESTRIBOR' : 'PROA';
              return <RipaLightViewer compact focusShipType={focusShipType} focusPerspective={focusPerspective} />;
            }
            if (family === 'RIPA_RULE_13') return <RipaCrossingSimulator compact focusScenario="ALCANCE" />;
            if (family === 'RIPA_RULE_14') return <RipaCrossingSimulator compact focusScenario="VUELTA_ENCONTRADA" />;
            if (family === 'RIPA_RULE_15') return <RipaCrossingSimulator compact focusScenario="CRUCE" />;
            if (family === 'RIPA_RULE_12') return <RipaCrossingSimulator compact focusScenario="VELEROS" />;
            if (family === 'RIPA_RULE_18') return <RipaCrossingSimulator compact focusScenario="VELERO_VS_MOTOR" />;
            return <RipaCrossingSimulator compact focusScenario="CRUCE" />;
          }}
        />
      </div>
    </div>
  );
};
