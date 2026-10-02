/**
 * Pure game logic: answer checking, scoring and persistence.
 * No React in here so it can be unit-tested or reused by the command palette.
 */

export interface LevelResult {
  solved: boolean;
  skipped: boolean;
  attempts: number;
  hintsUsed: number;
  firstTry: boolean;
}

export interface GameState {
  version: number;
  started: boolean;
  completed: boolean;
  activeLevel: number;
  score: number;
  results: Record<string, LevelResult>;
}

const STORAGE_KEY = "varshith.os.progress.v1";

export const POINTS = {
  solve: 100,
  firstTry: 50,
  hint: -20,
  attempt: -10,
} as const;

export const emptyState = (): GameState => ({
  version: 1,
  started: false,
  completed: false,
  activeLevel: 0,
  score: 0,
  results: {},
});

/** Loose normalisation so formatting never blocks a correct answer. */
export function normalize(input: string) {
  return input
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[^a-z0-9<>+\-./ ]/g, "")
    .trim()
    .replace(/\s+/g, "");
}

export function matches(input: string, answers: string[] | undefined) {
  if (!answers || answers.length === 0) return false;
  const candidate = normalize(input);
  if (!candidate) return false;
  return answers.some((a) => normalize(a) === candidate);
}

export function loadState(): GameState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as GameState;
    if (parsed?.version !== 1) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveState(state: GameState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* storage disabled — the game still works, it just won't resume */
  }
}

export function clearState() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

export function completedCount(state: GameState) {
  return Object.values(state.results).filter((r) => r.solved || r.skipped).length;
}

export function progressPercent(state: GameState, total: number) {
  if (total === 0) return 0;
  return Math.round((completedCount(state) / total) * 100);
}
