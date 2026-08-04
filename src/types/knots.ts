export type KnotCategory = 'AMARRE' | 'UNION' | 'GAZA' | 'TOPE' | 'DESLIZANTE';
export type KnotDifficulty = 'Principiante' | 'Intermedio' | 'Avanzado';

export interface SVGPathLayer {
  id: string;
  path: string;
  color: string; // Color base del cabo
  strokeWidth: number; // Mena del cabo (ej: 12 para grueso, 6 para fino)
  isChicote?: boolean; // Identifica si es el extremo activo
  isFirme?: boolean;   // Identifica el extremo estático bajo carga
  shadow?: boolean;    // Aplicar sombra de cruce 3D
  dashArray?: string;  // Para líneas de movimiento/tensión
}

export interface InteractiveKnotStep {
  stepNumber: number;
  title: string;
  instruction: string;
  keyConcept: 'SENO' | 'CHICOTE' | 'FIRME' | 'GAZA' | 'AZOCAR';
  svgLayers: SVGPathLayer[];
  wrongOptionsHint?: string[];
}

export interface SequenceStepOption {
  id: string;
  text: string;
}

export interface KnotData {
  id: string;
  name: string;
  spanishAlias: string;
  englishName: string;
  category: KnotCategory;
  difficulty: KnotDifficulty;
  pnaExamRelevance: string; // Por qué Prefectura exige este nudo
  realWorldUse: {
    title: string;
    description: string;
    onBoardLocation: string; // Ej: "Cornamusas, Bitas, Motones de escota"
    dangerWarning: string;   // Cuándo NUNCA usarlo
  };
  pros: string[];
  cons: string[];
  steps: InteractiveKnotStep[];
  sequenceChallenge: {
    correctOrder: SequenceStepOption[];
  };
}
