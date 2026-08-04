import ripaIalaData from '../data/ripa_iala.json';
import teoriaData from '../data/teoria.json';
import practicosData from '../data/practicos.json';
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
    options: opts.sort(() => Math.random() - 0.5),
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
  const theoreticalPool = [...(ripaIalaData as QuizQuestion[]), ...(teoriaData as QuizQuestion[])];
  const practicalPool = practicosData as PracticalExercise[];

  const theoreticalSelected = sample(theoreticalPool, config.theoreticalCount).map(q => ({
    id: q.id,
    question: q.question,
    options: q.options,
    explanation: q.explanation,
    category: q.category,
    type: 'THEORETICAL' as const,
    points: 1
  }));

  const practicalSelected = sample(practicalPool, config.practicalCount).map(practicalToQuestion);

  // Orden aleatorio final
  const allQuestions = [...theoreticalSelected, ...practicalSelected].sort(() => Math.random() - 0.5);

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
