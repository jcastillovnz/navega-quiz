import type { UserProgress, SpacedRepetitionItem, UserRank, ExamResult, LearningMastery } from '../types/quiz';

const STORAGE_KEY = 'navega_quiz_v1';
const EXAMS_KEY = 'navega_quiz_exams_v1';
const MASTERY_KEY = 'navega_quiz_mastery_v1';

const DEFAULT_PROGRESS: UserProgress = {
  xp: 0,
  rank: 'Grumete',
  currentStreak: 0,
  lastStudyDate: 0,
  highestStreak: 0,
  badges: [],
  spacedRepetitionQueue: []
};

const XP_PER_RANK: Array<{ rank: UserRank; min: number }> = [
  { rank: 'Grumete', min: 0 },
  { rank: 'Marinero', min: 500 },
  { rank: 'Contramaestre', min: 1500 },
  { rank: 'Timonel', min: 3500 }
];

// ============ Lectura / escritura ============

export const loadProgress = (): UserProgress => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_PROGRESS };
    const parsed = JSON.parse(raw) as UserProgress;
    // Backfill campos faltantes
    return { ...DEFAULT_PROGRESS, ...parsed };
  } catch {
    return { ...DEFAULT_PROGRESS };
  }
};

const saveProgress = (progress: UserProgress): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // localStorage lleno o deshabilitado
  }
};

export const loadExams = (): ExamResult[] => {
  try {
    const raw = localStorage.getItem(EXAMS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as ExamResult[];
  } catch {
    return [];
  }
};

const saveExams = (exams: ExamResult[]): void => {
  try {
    localStorage.setItem(EXAMS_KEY, JSON.stringify(exams));
  } catch {
    // noop
  }
};

// ============ XP y Rangos ============

const calculateRank = (xp: number): UserRank => {
  let current: UserRank = 'Grumete';
  for (const r of XP_PER_RANK) {
    if (xp >= r.min) current = r.rank;
  }
  return current;
};

export const addXP = (amount: number): UserProgress => {
  const p = loadProgress();
  const newXP = p.xp + amount;
  const newRank = calculateRank(newXP);
  p.xp = newXP;
  p.rank = newRank;
  // Verificar badges por rank
  if (newRank === 'Marinero' && !p.badges.includes('rank_marinero')) {
    p.badges.push('rank_marinero');
  } else if (newRank === 'Contramaestre' && !p.badges.includes('rank_contramaestre')) {
    p.badges.push('rank_contramaestre');
  } else if (newRank === 'Timonel' && !p.badges.includes('rank_timonel')) {
    p.badges.push('rank_timonel');
  }
  saveProgress(p);
  return p;
};

// ============ Rachas (Streaks) ============

const MS_PER_DAY = 86_400_000;

const startOfDay = (ts: number): number => {
  const d = new Date(ts);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
};

export const registerStudy = (): UserProgress => {
  const p = loadProgress();
  const today = startOfDay(Date.now());
  const last = startOfDay(p.lastStudyDate);

  if (p.lastStudyDate === 0) {
    // Primer estudio
    p.currentStreak = 1;
  } else {
    const diffDays = Math.round((today - last) / MS_PER_DAY);
    if (diffDays === 0) {
      // Mismo día: no cambia
    } else if (diffDays === 1) {
      p.currentStreak += 1;
    } else {
      p.currentStreak = 1; // se rompió la racha
    }
  }

  p.lastStudyDate = Date.now();
  p.highestStreak = Math.max(p.highestStreak, p.currentStreak);

  // Badge de racha
  if (p.currentStreak >= 7 && !p.badges.includes('streak_7')) {
    p.badges.push('streak_7');
  }
  if (p.currentStreak >= 30 && !p.badges.includes('streak_30')) {
    p.badges.push('streak_30');
  }

  saveProgress(p);
  return p;
};

// ============ Repetición Espaciada (SM-2 simplificado) ============

/** Devuelve la cola de repaso de hoy (preguntas vencidas) */
export const getDueReviews = (): SpacedRepetitionItem[] => {
  const p = loadProgress();
  const now = Date.now();
  return p.spacedRepetitionQueue.filter(item => item.nextReviewDate <= now);
};

export const addToReview = (questionId: string): void => {
  const p = loadProgress();
  const existing = p.spacedRepetitionQueue.find(i => i.questionId === questionId);
  if (existing) return; // ya está
  p.spacedRepetitionQueue.push({
    questionId,
    interval: 1,
    ease: 2.5,
    nextReviewDate: Date.now() + MS_PER_DAY,
    consecutiveCorrects: 0
  });
  saveProgress(p);
};

export const addManyToReview = (questionIds: string[]): void => {
  questionIds.forEach(addToReview);
};

/** SM-2: acierto → interval *= ease, fallo → interval=1 y ease -= 0.2 (mín 1.3) */
export const reviewResult = (questionId: string, wasCorrect: boolean): void => {
  const p = loadProgress();
  const item = p.spacedRepetitionQueue.find(i => i.questionId === questionId);
  if (!item) return;
  if (wasCorrect) {
    item.consecutiveCorrects += 1;
    item.interval = Math.round(item.interval * item.ease);
    item.ease = Math.min(3.0, item.ease + 0.05);
  } else {
    item.interval = 1;
    item.ease = Math.max(1.3, item.ease - 0.2);
    item.consecutiveCorrects = 0;
  }
  item.nextReviewDate = Date.now() + item.interval * MS_PER_DAY;
  saveProgress(p);
};

export const removeFromReview = (questionId: string): void => {
  const p = loadProgress();
  p.spacedRepetitionQueue = p.spacedRepetitionQueue.filter(i => i.questionId !== questionId);
  saveProgress(p);
};

// ============ Examenes ============

export const saveExamResult = (result: ExamResult): void => {
  const list = loadExams();
  list.unshift(result);
  saveExams(list.slice(0, 50)); // mantener últimos 50
};

export const getBestScore = (): number => {
  const list = loadExams();
  if (list.length === 0) return 0;
  return Math.max(...list.map(e => e.score));
};

export const getAverageScore = (): number => {
  const list = loadExams();
  if (list.length === 0) return 0;
  return Math.round(list.reduce((acc, e) => acc + e.score, 0) / list.length);
};

// ============ Dominio por módulo ============

export const loadMastery = (): Record<string, LearningMastery> => {
  try {
    const raw = localStorage.getItem(MASTERY_KEY);
    return raw ? JSON.parse(raw) as Record<string, LearningMastery> : {};
  } catch {
    return {};
  }
};

export const registerLearningAnswer = (
  moduleId: string,
  questionId: string,
  wasCorrect: boolean
): LearningMastery => {
  const all = loadMastery();
  const current = all[moduleId] ?? {
    moduleId,
    answeredQuestionIds: [],
    correctQuestionIds: [],
    attempts: 0,
    updatedAt: 0
  };
  current.attempts += 1;
  current.updatedAt = Date.now();
  if (!current.answeredQuestionIds.includes(questionId)) current.answeredQuestionIds.push(questionId);
  if (wasCorrect && !current.correctQuestionIds.includes(questionId)) current.correctQuestionIds.push(questionId);
  all[moduleId] = current;
  try {
    localStorage.setItem(MASTERY_KEY, JSON.stringify(all));
  } catch {
    // localStorage lleno o deshabilitado
  }
  return current;
};

// ============ Reset ============

export const resetAll = (): void => {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(EXAMS_KEY);
  localStorage.removeItem(MASTERY_KEY);
};
