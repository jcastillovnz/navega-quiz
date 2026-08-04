import ripaIalaData from '../data/ripa_iala.json';
import teoriaData from '../data/teoria.json';
import practicosData from '../data/practicos.json';
import nudosData from '../data/nudos.json';
import nomenclaturaData from '../data/nomenclatura.json';
import ialaAmpliadoData from '../data/iala_ampliado.json';
import seguridadIncendiosData from '../data/seguridad_incendios.json';
import seguridadEmergenciasData from '../data/seguridad_emergencias.json';
import meteorologiaExtendidaData from '../data/meteorologia_extendida.json';
import ripaSoundData from '../data/ripa_senales_auditivas.json';
import ripaExtendedData from '../data/ripa_ampliado.json';
import type { QuizQuestion, QuizCategory, PracticalExercise } from '../types/quiz';

export interface ExamConfig {
  theoreticalCount: number; // 35 por defecto
  practicalCount: number; // 5 por defecto
  durationMinutes: number; // 60 por defecto
}

export interface ExamQuestion {
  id: string;
  question: string;
  options: { id: string; text: string; isCorrect: boolean }[];
  explanation: string;
  category: QuizCategory;
  type: 'THEORETICAL' | 'PRACTICAL';
  points: number;
}

export interface GeneratedExam {
  config: ExamConfig;
  questions: ExamQuestion[];
  totalPoints: number;
  generatedAt: number;
}

/** Convierte un PracticalExercise a ExamQuestion */
const practicalToQuestion = (p: PracticalExercise): ExamQuestion => {
  const distractors = generateDistractors(String(p.expectedResult));
  const opts = [
    { id: 'A', text: String(p.expectedResult), isCorrect: true },
    { id: 'B', text: distractors[0], isCorrect: false },
    { id: 'C', text: distractors[1], isCorrect: false },
    { id: 'D', text: distractors[2], isCorrect: false }
  ];
  // Mezclar
  return {
    id: p.id,
    question: p.statement,
    options: shuffle(opts),
    explanation: p.explanationStepByStep,
    category: 'PRACTICO',
    type: 'PRACTICAL',
    points: 1
  };
};

const generateDistractors = (correct: string): string[] => {
  // Detección simple de tipo
  const numericMatch = correct.match(/^([0-9]+(?:\.[0-9]+)?)/);
  if (numericMatch) {
    const num = parseFloat(numericMatch[1]);
    return [
      `${(num * 1.5).toFixed(2)}`,
      `${(num * 0.5).toFixed(2)}`,
      `${(num + 10).toFixed(2)}`
    ];
  }
  // Texto: respuestas genéricas plausibles
  const txt = correct.toLowerCase();
  if (txt.includes('suma') || txt.includes('resta')) {
    return ['Se restan los valores', 'No hay variación', 'Se duplica el valor'];
  }
  if (txt.includes('posición') || txt.includes('posicion') || txt.includes('fix')) {
    return ['La velocidad del buque', 'El rumbo verdadero', 'La distancia al próximo waypoint'];
  }
  return ['Resultado alternativo A', 'Resultado alternativo B', 'Resultado alternativo C'];
};

/**
 * Selecciona N preguntas aleatorias de una lista.
 */
const sample = <T,>(arr: T[], n: number): T[] => {
  const copy = [...arr];
  const out: T[] = [];
  for (let i = 0; i < n && copy.length > 0; i++) {
    const idx = Math.floor(Math.random() * copy.length);
    out.push(copy.splice(idx, 1)[0]);
  }
  return out;
};

/** Fisher-Yates sin mutar el banco original. */
const shuffle = <T,>(arr: T[]): T[] => {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const THEORETICAL_WEIGHTS: Partial<Record<QuizCategory, number>> = {
  RIPA: 7,
  IALA: 6,
  SEGURIDAD: 7,
  NOMENCLATURA: 7,
  METEOROLOGIA: 5,
  NUDOS: 3
};

export const DEFAULT_EXAM_CONFIG: ExamConfig = {
  theoreticalCount: 35,
  practicalCount: 5,
  durationMinutes: 60
};

/**
 * Genera un examen de 40 puntos combinando preguntas teóricas y prácticas
 * extraídas del banco general.
 */
export const generateExam = (config: ExamConfig = DEFAULT_EXAM_CONFIG): GeneratedExam => {
  const theoreticalPool = [
    ...(ripaIalaData as QuizQuestion[]),
    ...(ripaSoundData as QuizQuestion[]),
    ...(ripaExtendedData as QuizQuestion[]),
    ...(ialaAmpliadoData as QuizQuestion[]),
    ...(teoriaData as QuizQuestion[]),
    ...(seguridadIncendiosData as QuizQuestion[]),
    ...(seguridadEmergenciasData as QuizQuestion[]),
    ...(meteorologiaExtendidaData as QuizQuestion[]),
    ...(nomenclaturaData as QuizQuestion[]),
    ...(nudosData as QuizQuestion[])
  ];
  const practicalPool = practicosData as PracticalExercise[];

  const weighted = Object.entries(THEORETICAL_WEIGHTS).flatMap(([category, count]) =>
    sample(theoreticalPool.filter(q => q.category === category), count)
  );
  const selectedIds = new Set(weighted.map(q => q.id));
  const remainder = theoreticalPool.filter(q => !selectedIds.has(q.id));
  const theoreticalSelected = [
    ...weighted,
    ...sample(remainder, Math.max(0, config.theoreticalCount - weighted.length))
  ].slice(0, config.theoreticalCount).map(q => ({
    id: q.id,
    question: q.question,
    options: shuffle(q.options),
    explanation: q.explanation,
    category: q.category,
    type: 'THEORETICAL' as const,
    points: 1
  }));

  const practicalSelected = sample(practicalPool, config.practicalCount).map(practicalToQuestion);

  // Orden aleatorio final
  const allQuestions = shuffle([...theoreticalSelected, ...practicalSelected]);

  return {
    config,
    questions: allQuestions,
    totalPoints: allQuestions.length,
    generatedAt: Date.now()
  };
};

/**
 * Calcula el resultado de un examen a partir de las respuestas del usuario.
 */
export const gradeExam = (
  exam: GeneratedExam,
  answers: Record<string, string>
): {
  score: number; // 0-100
  passed: boolean;
  correctCount: number;
  totalCount: number;
  incorrectIds: string[];
  moduleScores: Partial<Record<QuizCategory, { correct: number; total: number }>>;
  timeSpentSeconds: number;
} => {
  let correct = 0;
  const incorrectIds: string[] = [];
  const moduleScores: Partial<Record<QuizCategory, { correct: number; total: number }>> = {};

  exam.questions.forEach(q => {
    const selected = answers[q.id];
    const opt = q.options.find(o => o.id === selected);
    const isCorrect = !!opt?.isCorrect;
    if (isCorrect) correct++;
    else incorrectIds.push(q.id);

    if (!moduleScores[q.category]) {
      moduleScores[q.category] = { correct: 0, total: 0 };
    }
    moduleScores[q.category]!.total += 1;
    if (isCorrect) moduleScores[q.category]!.correct += 1;
  });

  const score = Math.round((correct / exam.totalPoints) * 100);
  return {
    score,
    passed: score >= 70,
    correctCount: correct,
    totalCount: exam.totalPoints,
    incorrectIds,
    moduleScores,
    timeSpentSeconds: 0
  };
};
