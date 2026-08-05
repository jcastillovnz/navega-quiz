import React from 'react';
import { Route } from 'lucide-react';
import { IntegratedLearningView } from '../learning/IntegratedLearningView';
import type { QuizQuestion } from '../../types/quiz';
import { getVisualSpec } from '../../data/visualManifest';
import { RopeCoilingViewer } from './RopeCoilingViewer';
import { KnotTechnicalViewer, type KnotFamily } from './KnotTechnicalViewer';
import { RopeKnowledgeViewer, type RopeKnowledgeFamily } from './RopeKnowledgeViewer';

const KNOT_FAMILIES = new Set<string>(['KNOT_BOWLINE','KNOT_REEF','KNOT_CLOVE','KNOT_SHEET_BEND','KNOT_FIGURE_EIGHT','KNOT_ANCHOR_BEND']);
const ROPE_FAMILIES = new Set<string>(['ROPE_KINK','ROPE_CONSTRUCTION','ROPE_SAIL_PART','ROPE_RIGGING','ROPE_DINGHY','ROPE_END']);

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
          if (family === 'KNOT_COILING') return <RopeCoilingViewer context={`${question.question} ${question.explanation}`.toLowerCase()} />;
          if (family && KNOT_FAMILIES.has(family)) return <KnotTechnicalViewer family={family as KnotFamily} questionId={question.id} />;
          return <RopeKnowledgeViewer family={family && ROPE_FAMILIES.has(family) ? family as RopeKnowledgeFamily : undefined} />;
        }}
      />
    </div>
  </div>
);
