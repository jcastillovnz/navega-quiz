// src/types/quiz.ts

/**
 * 1. Definición de Categorías de Estudio (Módulos)
 */
export type QuizCategory = 
  | 'RIPA'
  | 'IALA'
  | 'SEGURIDAD'
  | 'NOMENCLATURA'
  | 'METEOROLOGIA'
  | 'PRACTICO'
  | 'NUDOS';

/**
 * 2. Interfaces para las Preguntas y Banco de Preguntas
 */
export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface QuizQuestion {
  id: string;
  category: QuizCategory;
  concept: string; // Concepto teórico clave
  theory: string; // Explicación breve del concepto (antes de la pregunta)
  question: string;
  options: QuizOption[];
  explanation: string; // Explicación detallada después de responder
  imageUrl?: string; // URL opcional si la pregunta depende de un diagrama o imagen
}

export interface PracticalExercise {
  id: string;
  category: 'PRACTICO';
  type: 'DECLINACION' | 'MAREAS' | 'MARCACIONES' | 'RUMBO_VELOCIDAD';
  statement: string; // Enunciado del ejercicio
  expectedResult: number | string; // Resultado numérico o texto esperado
  explanationStepByStep: string; // Explicación resolutiva paso a paso
}

/**
 * 3. Interfaces para el Sistema de Repaso Espaciado (Spaced Repetition)
 */
export interface SpacedRepetitionItem {
  questionId: string;
  interval: number; // en días
  ease: number; // factor de facilidad (ej. 2.5)
  nextReviewDate: number; // timestamp
  consecutiveCorrects: number;
}

/**
 * 4. Interfaces para Gamificación y Perfil del Usuario
 */
export type UserRank = 'Grumete' | 'Marinero' | 'Contramaestre' | 'Timonel';

export interface UserProgress {
  xp: number;
  rank: UserRank;
  currentStreak: number; // Días consecutivos
  lastStudyDate: number; // Timestamp para calcular rachas
  highestStreak: number;
  badges: string[]; // IDs de insignias obtenidas
  spacedRepetitionQueue: SpacedRepetitionItem[];
}

/**
 * 5. Interfaces para el Simulador de Examen Real (Integral)
 */
export interface ExamResult {
  id: string;
  date: number; // Timestamp
  score: number; // 0 - 100
  passed: boolean; // >= 70%
  timeSpentSeconds: number;
  moduleScores: Record<QuizCategory, number>; // Porcentaje de aciertos por módulo
  incorrectQuestionIds: string[]; // Preguntas para enviar a la Caja de Repaso
}
