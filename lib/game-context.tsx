"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  POINTS,
  clearState,
  emptyState,
  loadState,
  saveState,
  type GameState,
  type LevelResult,
} from "@/lib/game";
import { TOTAL_LEVELS } from "@/data/puzzles";

export type Phase = "intro" | "playing" | "reveal" | "done";

interface GameContextValue {
  state: GameState;
  phase: Phase;
  /** true once it is safe to render saved game data (avoids hydration drift) */
  hydrated: boolean;
  corePercent: number;
  enter: () => void;
  goTo: (index: number) => void;
  registerAttempt: (id: string) => void;
  registerHint: (id: string) => void;
  solve: (id: string, opts?: { skipped?: boolean }) => number;
  finish: () => void;
  completeRun: () => void;
  reset: () => void;
}

const GameContext = createContext<GameContextValue | null>(null);

/** Stable subscribe + client/server snapshots for "am I hydrated yet". */
const subscribe = () => () => {};
const clientMounted = () => true;
const serverMounted = () => false;

export function GameProvider({ children }: { children: ReactNode }) {
  const hydrated = useSyncExternalStore(subscribe, clientMounted, serverMounted);

  const [state, setState] = useState<GameState>(
    () => loadState() ?? emptyState(),
  );
  const [phase, setPhase] = useState<Phase>(() => {
    const saved = typeof window === "undefined" ? null : loadState();
    if (saved?.completed) return "done";
    if (saved?.started) return "playing";
    return "intro";
  });
  const firstRunRef = useRef(true);

  /* persist on change (skip the very first render) */
  useEffect(() => {
    if (firstRunRef.current) {
      firstRunRef.current = false;
      return;
    }
    if (hydrated) saveState(state);
  }, [state, hydrated, firstRunRef]);

  const corePercent = useMemo(() => {
    const done = Object.values(state.results).filter(
      (r: LevelResult) => r.solved || r.skipped,
    ).length;
    if (TOTAL_LEVELS === 0) return 0;
    return Math.min(100, Math.round((done / TOTAL_LEVELS) * 100));
  }, [state.results]);

  const enter = useCallback(() => {
    setState((s) => ({ ...s, started: true }));
    setPhase("playing");
  }, []);

  const goTo = useCallback((index: number) => {
    setState((s) => ({ ...s, activeLevel: index }));
  }, []);

  const registerAttempt = useCallback((id: string) => {
    setState((s) => {
      const prev = s.results[id];
      return {
        ...s,
        results: {
          ...s.results,
          [id]: {
            ...prev,
            solved: prev?.solved ?? false,
            skipped: prev?.skipped ?? false,
            attempts: (prev?.attempts ?? 0) + 1,
            hintsUsed: prev?.hintsUsed ?? 0,
            firstTry: false,
          },
        },
      };
    });
  }, []);

  const registerHint = useCallback((id: string) => {
    setState((s) => {
      const prev = s.results[id];
      return {
        ...s,
        results: {
          ...s.results,
          [id]: {
            ...prev,
            solved: prev?.solved ?? false,
            skipped: prev?.skipped ?? false,
            attempts: prev?.attempts ?? 0,
            hintsUsed: (prev?.hintsUsed ?? 0) + 1,
            firstTry: false,
          },
        },
      };
    });
  }, []);

  const solve = useCallback((id: string, opts?: { skipped?: boolean }) => {
    let gained = 0;
    setState((s) => {
      const prev: LevelResult = s.results[id] ?? {
        solved: false,
        skipped: false,
        attempts: 0,
        hintsUsed: 0,
        firstTry: true,
      };
      const skipped = opts?.skipped ?? false;
      if (prev.solved) return s;

      if (skipped) {
        gained = 0;
      } else {
        gained = POINTS.solve;
        if (prev.attempts === 0 && prev.hintsUsed === 0) gained += POINTS.firstTry;
        gained += POINTS.attempt * prev.attempts;
        gained += POINTS.hint * prev.hintsUsed;
        gained = Math.max(0, gained);
      }

      return {
        ...s,
        score: s.score + gained,
        results: {
          ...s.results,
          [id]: {
            solved: !skipped,
            skipped,
            attempts: prev.attempts,
            hintsUsed: prev.hintsUsed,
            firstTry: prev.attempts === 0 && prev.hintsUsed === 0 && !skipped,
          },
        },
      };
    });
    return gained;
  }, []);

  const finish = useCallback(() => setPhase("reveal"), []);

  const completeRun = useCallback(() => {
    setState((s) => ({ ...s, started: true, completed: true }));
    setPhase("done");
  }, []);

  const reset = useCallback(() => {
    clearState();
    setState(emptyState());
    setPhase("intro");
  }, []);

  const value = useMemo<GameContextValue>(
    () => ({
      state,
      phase,
      hydrated,
      corePercent,
      enter,
      goTo,
      registerAttempt,
      registerHint,
      solve,
      finish,
      completeRun,
      reset,
    }),
    [
      state,
      phase,
      hydrated,
      corePercent,
      enter,
      goTo,
      registerAttempt,
      registerHint,
      solve,
      finish,
      completeRun,
      reset,
    ],
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used inside <GameProvider>");
  return ctx;
}
