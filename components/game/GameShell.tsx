"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Check, Lock, RotateCcw, ArrowRight } from "lucide-react";
import { levels, TOTAL_LEVELS } from "@/data/puzzles";
import { useGame } from "@/lib/game-context";
import { BootIntro } from "@/components/game/BootIntro";
import { LevelView } from "@/components/game/LevelView";
import { LazyDeveloperCore } from "@/components/three/loader";
import { LazyMount } from "@/components/three/LazyMount";
import { useTypewriter } from "@/hooks/useTypewriter";
import { cn } from "@/lib/cn";

const FINAL_LINES = [
  "ALL SYSTEMS UNLOCKED.",
  "",
  "You solved the puzzles.",
  "You investigated the repositories.",
  "You debugged the code.",
  "You followed the algorithms.",
  "",
  "Now you know who built this.",
];

export function GameShell() {
  const {
    phase,
    state,
    corePercent,
    enter,
    goTo,
    finish,
    completeRun,
    reset,
    hydrated,
  } = useGame();
  const reduce = useReducedMotion();

  /* lock page scroll while the challenge owns the screen */
  useEffect(() => {
    const locked = hydrated && phase !== "done";
    document.body.classList.toggle("is-locked", locked);
    return () => document.body.classList.remove("is-locked");
  }, [phase, hydrated]);

  if (!hydrated || phase === "done") return null;

  const index = Math.min(state.activeLevel, TOTAL_LEVELS - 1);
  const level = levels[index];

  const isUnlocked = (i: number) => {
    if (i === 0) return true;
    const prev = state.results[levels[i - 1].id];
    return Boolean(prev && (prev.solved || prev.skipped));
  };

  const goNext = () => {
    if (index + 1 >= TOTAL_LEVELS) {
      finish();
      window.scrollTo({ top: 0 });
    } else {
      goTo(index + 1);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      role="dialog"
      aria-modal="true"
      aria-label="Developer challenge"
      className="fixed inset-0 z-[70] overflow-y-auto overscroll-contain bg-void"
    >
      {/* backdrop */}
      <div className="pointer-events-none fixed inset-0 grid-bg-fine opacity-60" />
      <div className="pointer-events-none fixed inset-0 radial-fade" />

      {phase === "intro" && (
        <BootIntro
          hasProgress={state.started && Object.keys(state.results).length > 0}
          onEnter={enter}
          onSkip={completeRun}
          onResume={enter}
        />
      )}

      {phase === "playing" && (
        <div className="relative min-h-full">
          <Hud
            index={index}
            corePercent={corePercent}
            score={state.score}
            results={state.results}
            onGo={(i) => isUnlocked(i) && goTo(i)}
            isUnlocked={isUnlocked}
            onReset={reset}
          />

          <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 pt-28 pb-24 sm:px-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:pt-32">
            <div className="min-w-0">
              <AnimatePresence mode="wait">
                <LevelView
                  key={level.id}
                  level={level}
                  index={index}
                  total={TOTAL_LEVELS}
                  isLast={index === TOTAL_LEVELS - 1}
                  onNext={goNext}
                />
              </AnimatePresence>

              {index > 0 && (
                <div className="mx-auto mt-8 flex max-w-3xl justify-between">
                  <button
                    onClick={() => goTo(index - 1)}
                    className="font-mono text-[11px] tracking-widest text-mute uppercase transition hover:text-dim"
                  >
                    ← previous
                  </button>
                  <button
                    onClick={finish}
                    className="font-mono text-[11px] tracking-widest text-mute uppercase transition hover:text-mint"
                  >
                    finish run →
                  </button>
                </div>
              )}
            </div>

            {/* evolving core */}
            <aside className="sticky top-28 hidden self-start lg:block">
              <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-edge bg-panel/50">
                <LazyMount
                  className="absolute inset-0"
                  fallback={
                    <div className="grid-bg-fine h-full w-full opacity-60" />
                  }
                >
                  <LazyDeveloperCore progress={corePercent} reduced={Boolean(reduce)} />
                </LazyMount>
                <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-void/90 to-transparent p-4 font-mono text-[10px] tracking-[0.2em] uppercase">
                  <span className="text-mute">core status</span>
                  <span className={cn(corePercent >= 100 ? "text-mint" : "text-fg")}>
                    {corePercent >= 100 ? "OPEN" : `${corePercent}%`}
                  </span>
                </div>
              </div>
              <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-edge">
                <motion.div
                  className="h-full bg-gradient-to-r from-mint to-violet"
                  initial={{ width: 0 }}
                  animate={{ width: `${corePercent}%` }}
                  transition={{ type: "spring", stiffness: 120, damping: 22 }}
                />
              </div>
            </aside>
          </div>
        </div>
      )}

      {phase === "reveal" && <FinalReveal onComplete={completeRun} reduce={Boolean(reduce)} />}
    </motion.div>
  );
}

/* ───────────────────────── HUD ───────────────────────── */

function Hud({
  index,
  corePercent,
  score,
  results,
  onGo,
  isUnlocked,
  onReset,
}: {
  index: number;
  corePercent: number;
  score: number;
  results: Record<string, { solved?: boolean; skipped?: boolean }>;
  onGo: (i: number) => void;
  isUnlocked: (i: number) => boolean;
  onReset: () => void;
}) {
  const solvedCount = levels.filter(
    (l) => results[l.id]?.solved || results[l.id]?.skipped,
  ).length;

  return (
    <header className="fixed inset-x-0 top-0 z-20 border-b border-edge/70 bg-void/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2">
          <span className="grid h-6 w-6 place-items-center rounded border border-mint/30 bg-mint/10 font-mono text-[10px] font-bold text-mint">
            V
          </span>
          <span className="font-mono text-[11px] tracking-[0.2em] text-dim uppercase">
            Varshith<span className="text-mute">.os</span>
          </span>
        </div>

        <nav
          aria-label="Challenges"
          className="no-scrollbar -mx-1 flex flex-1 items-center gap-1 overflow-x-auto px-1"
        >
          {levels.map((l, i) => {
            const done = results[l.id]?.solved || results[l.id]?.skipped;
            const current = i === index;
            const open = isUnlocked(i);
            return (
              <button
                key={l.id}
                onClick={() => onGo(i)}
                disabled={!open}
                aria-current={current ? "step" : undefined}
                className={cn(
                  "flex shrink-0 items-center gap-1.5 rounded-md border px-2 py-1.5 font-mono text-[10px] tracking-[0.14em] uppercase transition",
                  current
                    ? "border-mint bg-mint/12 text-mint"
                    : done
                      ? "border-edge-2 bg-panel text-dim hover:border-mint/40"
                      : open
                        ? "border-edge-2 bg-panel/60 text-mute hover:text-dim"
                        : "border-edge bg-panel/40 text-mute/50",
                )}
                title={l.title}
              >
                {done ? (
                  <Check className="h-3 w-3 text-mint" aria-hidden />
                ) : !open ? (
                  <Lock className="h-3 w-3" aria-hidden />
                ) : (
                  <span className="opacity-70">{String(i + 1).padStart(2, "0")}</span>
                )}
                <span className="hidden sm:inline">{l.chip}</span>
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-3 font-mono text-[10px] tracking-[0.18em] text-mute uppercase">
          <span>
            <span className="text-mint">{solvedCount}</span>/{TOTAL_LEVELS}
          </span>
          <span className="hidden sm:inline">
            score <span className="text-fg">{score}</span>
          </span>
          <span className="hidden md:inline">
            core <span className="text-fg">{corePercent}%</span>
          </span>
          <button
            onClick={onReset}
            aria-label="Reset challenge"
            className="rounded border border-edge p-1 transition hover:border-rose/50 hover:text-rose"
          >
            <RotateCcw className="h-3 w-3" />
          </button>
        </div>
      </div>
      <div className="h-px w-full bg-edge">
        <div
          className="h-full bg-gradient-to-r from-mint to-violet transition-all duration-700"
          style={{ width: `${corePercent}%` }}
        />
      </div>
    </header>
  );
}

/* ─────────────────────── FINAL REVEAL ─────────────────────── */

function FinalReveal({ onComplete, reduce }: { onComplete: () => void; reduce: boolean }) {
  const { visible, done } = useTypewriter(FINAL_LINES, !reduce, 14);
  const [showName, setShowName] = useState(reduce);

  useEffect(() => {
    if (!done) return;
    const t = window.setTimeout(() => setShowName(true), 350);
    return () => window.clearTimeout(t);
  }, [done]);

  useEffect(() => {
    if (!showName) return;
    const t = window.setTimeout(onComplete, 5200);
    return () => window.clearTimeout(t);
  }, [showName, onComplete]);

  return (
    <div className="relative flex min-h-full flex-col items-center justify-center px-5 py-24 text-center">
      <div className="w-full max-w-2xl font-mono text-sm leading-relaxed text-dim sm:text-base">
        {visible.map((line, i) => (
          <p key={i} className={line.includes("UNLOCKED") ? "text-mint" : ""}>
            {line || "\u00A0"}
          </p>
        ))}
      </div>

      <AnimatePresence>
        {showName && (
          <motion.div
            initial={{ opacity: 0, y: 24, filter: "blur(12px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10"
          >
            <h1 className="text-gradient text-6xl font-semibold tracking-tight sm:text-8xl">
              VARSHITH
            </h1>
            <p className="mt-4 font-mono text-[11px] tracking-[0.3em] text-dim uppercase sm:text-xs">
              Software Engineer · AI Developer · Competitive Programmer
            </p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-8"
            >
              <button
                onClick={onComplete}
                className="group inline-flex items-center gap-2.5 rounded-full bg-mint px-7 py-3.5 text-sm font-medium text-void transition hover:-translate-y-0.5 hover:shadow-[0_16px_44px_-16px_rgba(78,240,193,0.8)]"
              >
                Open the portfolio
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
