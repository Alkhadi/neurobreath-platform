// Dyslexia assessment localStorage store
// All data remains private on-device — nothing is sent to any server.

export type AgeGroup = 'preschool' | 'primary' | 'secondary' | 'adult' | 'senior';
export type ScoreLevel = 'low' | 'moderate' | 'high';
export type Answer = 'never' | 'sometimes' | 'often' | 'always';

export interface CategoryScore {
  category: string;
  pct: number; // 0–100
}

export interface DyslexiaAssessmentResult {
  ageGroup: AgeGroup;
  scoreLevel: ScoreLevel;
  answers: Record<string, Answer>;
  categoryBreakdown: CategoryScore[];
  completedAt: string; // ISO date string
  totalQuestions: number;
}

const STORAGE_KEY = 'dyslexia_assessment_result';

export function saveAssessmentResult(result: DyslexiaAssessmentResult): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(result));
  } catch {
    // Silently ignore storage errors (private/incognito mode)
  }
}

export function loadAssessmentResult(): DyslexiaAssessmentResult | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as DyslexiaAssessmentResult;
  } catch {
    return null;
  }
}

export function clearAssessmentResult(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

// ── Progress tracking for training tasks ──────────────────────────────────
const PROGRESS_KEY = 'dyslexia_training_progress';

export interface TrainingProgress {
  completedTasks: string[]; // task ids completed today
  lastUpdatedDate: string;  // YYYY-MM-DD
  streakDays: number;
  totalTasksCompleted: number;
}

export function loadTrainingProgress(): TrainingProgress {
  if (typeof window === 'undefined') {
    return { completedTasks: [], lastUpdatedDate: '', streakDays: 0, totalTasksCompleted: 0 };
  }
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) return { completedTasks: [], lastUpdatedDate: '', streakDays: 0, totalTasksCompleted: 0 };
    const data = JSON.parse(raw) as TrainingProgress;
    // Reset daily tasks if it's a new day
    const today = new Date().toISOString().split('T')[0];
    if (data.lastUpdatedDate !== today) {
      // Check if streak continues
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      const newStreak = data.lastUpdatedDate === yesterday ? data.streakDays + 1 : 1;
      return { ...data, completedTasks: [], lastUpdatedDate: today, streakDays: newStreak };
    }
    return data;
  } catch {
    return { completedTasks: [], lastUpdatedDate: '', streakDays: 0, totalTasksCompleted: 0 };
  }
}

export function saveTrainingProgress(progress: TrainingProgress): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  } catch {
    // ignore
  }
}
