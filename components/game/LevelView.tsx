"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  AlertTriangle,
  ArrowRight,
  Check,
  CornerDownLeft,
  Lightbulb,
  SkipForward,
} from "lucide-react";
import type { Level } from "@/data/puzzles";
import { matches } from "@/lib/game";
import { useGame } from "@/lib/game-context";
import { useTypewriter } from "@/hooks/useTypewriter";
import { Button } from "@/components/ui/Button";
import { GraphPuzzle } from "@/components/game/puzzles/GraphPuzzle";
import { AgentPuzzle } from "@/components/game/puzzles/AgentPuzzle";
import { ReposPuzzle } from "@/components/game/puzzles/ReposPuzzle";
import { TimelinePuzzle } from "@/components/game/puzzles/TimelinePuzzle";

interface Props {
  level: Level;
  index: number;
  total: number;
  isLast: boolean;
  onNext: () => void;
}

export function LevelView({ level, index, total, isLast, onNext }: Props) {
  const { state, registerAttempt, registerHint, solve } = useGame();
  const saved = state.results[level.id];
  const alreadySolved = Boolean(saved?.solved || saved?.skipped);

  const [solved, setSolved] = useState(alreadySolved);
  const [skipped, setSkipped] = useState(Boolean(saved?.skipped));
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [gained, setGained] = useState<number | null>(null);
  const [hints, setHints] = useState(saved?.hintsUsed ?? 0);
  const [confirmSkip, setConfirmSkip] = useState(false);
  const [choice, setChoice] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const reduce = useReducedMotion();

  const brief = useTypewriter(level.brief, !reduce, 8);

  /* focus the prompt on text levels so Enter always works */
  useEffect(() => {
    if (level.kind !== "text" || alreadySolved) return;
    const t = window.setTimeout(() => inputRef.current?.focus(), 380);
    return () => window.clearTimeout(t);
  }, [level.id, level.kind, alreadySolved]);

  const complete = (wasSkipped: boolean) => {
    const points = solve(level.id, { skipped: wasSkipped });
    setGained(points);
    setSolved(true);
    setSkipped(wasSkipped);
  };

  const submitText = () => {
    if (!input.trim()) return;
    if (matches(input, level.answers)) {
      setError(null);
      complete(false);
      return;
    }
    registerAttempt(level.id);
    setError("ACCESS DENIED — that's not it. Re-read the prompt and try again.");
  };

  const submitChoice = () => {
    if (!choice) return;
    if (choice === level.correctOption) {
      setError(null);
      complete(false);
    } else {
      registerAttempt(level.id);
      setError("ACCESS DENIED — wrong component. Trace the request again.");
    }
  };

  const useHint = () => {
    if (hints >= level.hints.length) return;
    registerHint(level.id);
    setHints((h) => h + 1);
  };

  const codeLines = useMemo(
    () => (level.code ? level.code.source.split("\n") : []),
    [level.code],
  );

  return (
    <motion.div
      key={level.id}
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -14 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="mx-auto w-full max-w-3xl"
    >
      {/* header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="rounded-md border border-mint/30 bg-mint/10 px-2 py-1 font-mono text-[10px] font-bold tracking-[0.2em] text-mint">
            {level.kicker}
          </span>
          <span className="font-mono text-[11px] tracking-[0.2em] text-mute uppercase">
            {level.chip}
          </span>
        </div>
        <span className="font-mono text-[11px] tracking-widest text-mute">
          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
      </div>

      <h2 className="mb-5 text-3xl font-medium tracking-tight text-fg sm:text-4xl">
        {level.title}
      </h2>

      {/* narrative */}
      <div className="mb-6 rounded-2xl border border-edge bg-black/50 p-4 font-mono text-[13px] leading-relaxed sm:p-5">
        {brief.visible.map((line, i) => (
          <p key={i} className={line.startsWith(">") ? "text-mint" : "text-dim"}>
            {line || "\u00A0"}
          </p>
        ))}
        {!brief.done && (
          <span className="inline-block h-[1em] w-[0.5em] animate-blink bg-mint align-middle" />
        )}
      </div>

      {/* code window */}
      {level.code && (
        <div className="mb-6 overflow-hidden rounded-2xl border border-edge bg-[#080a0d]">
          <div className="flex items-center justify-between border-b border-edge px-4 py-2.5">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-rose/70" />
              <span className="h-2 w-2 rounded-full bg-amber/70" />
              <span className="h-2 w-2 rounded-full bg-mint/70" />
            </span>
            <span className="font-mono text-[10px] tracking-[0.2em] text-mute uppercase">
              {level.code.language}
            </span>
          </div>
          <pre className="overflow-x-auto px-4 py-4 font-mono text-[13px] leading-relaxed text-fg sm:text-sm">
            {codeLines.map((l, i) => (
              <div key={i} className="flex gap-4">
                <span className="w-5 shrink-0 select-none text-right text-mute/60">
                  {i + 1}
                </span>
                <span className="whitespace-pre">{l || "\u00A0"}</span>
              </div>
            ))}
          </pre>
        </div>
      )}

      {/* prompt */}
      <p className="mb-4 text-lg text-fg">{level.prompt}</p>

      {/* ── interaction ─────────────────────────────────────── */}
      {!solved && level.kind === "text" && (
        <div className="mb-6">
          <div
            className={`flex items-center gap-2 rounded-xl border bg-black/40 px-4 py-3 transition ${
              error ? "border-rose/60" : "border-edge-2 focus-within:border-mint/50"
            }`}
          >
            <span className="font-mono text-sm text-mint">›</span>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setError(null);
              }}
              onKeyDown={(e) => e.key === "Enter" && submitText()}
              placeholder="type your answer…"
              aria-label="Answer"
              aria-invalid={Boolean(error)}
              className="w-full bg-transparent font-mono text-sm text-fg placeholder:text-mute focus:outline-none"
            />
            <button
              onClick={submitText}
              className="flex shrink-0 items-center gap-1.5 rounded-lg bg-mint px-3 py-1.5 font-mono text-[11px] font-semibold tracking-widest text-void uppercase transition hover:brightness-110"
            >
              run
              <CornerDownLeft className="h-3.5 w-3.5" aria-hidden />
            </button>
          </div>
        </div>
      )}

      {!solved && level.kind === "choice" && level.options && (
        <div className="mb-6 grid gap-2 sm:grid-cols-2">
          {level.options.map((o) => (
            <button
              key={o.id}
              onClick={() => {
                setChoice(o.id);
                setError(null);
              }}
              className={`rounded-xl border px-4 py-3 text-left font-mono text-sm transition ${
                choice === o.id
                  ? "border-mint/60 bg-mint/10 text-fg"
                  : "border-edge-2 bg-ink text-dim hover:border-mint/40"
              }`}
            >
              {o.label}
            </button>
          ))}
          <div className="sm:col-span-2">
            <Button onClick={submitChoice} disabled={!choice}>
              submit answer
            </Button>
          </div>
        </div>
      )}

      {!solved && level.kind === "custom" && (
        <div className="mb-6">
          {level.custom === "graph" && (
            <GraphPuzzle solved={solved} onSolve={() => complete(false)} onWrong={() => registerAttempt(level.id)} />
          )}
          {level.custom === "agent" && (
            <AgentPuzzle solved={solved} onSolve={() => complete(false)} onWrong={() => registerAttempt(level.id)} />
          )}
          {level.custom === "repos" && (
            <ReposPuzzle solved={solved} onSolve={() => complete(false)} onWrong={() => registerAttempt(level.id)} />
          )}
          {level.custom === "timeline" && (
            <TimelinePuzzle solved={solved} onSolve={() => complete(false)} onWrong={() => registerAttempt(level.id)} />
          )}
        </div>
      )}

      {/* error */}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            className="mb-5 flex items-center gap-2 font-mono text-xs text-rose"
          >
            <AlertTriangle className="h-3.5 w-3.5 shrink-0" aria-hidden />
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      {/* hints + skip */}
      {!solved && (
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div className="flex-1">
            <button
              onClick={useHint}
              disabled={hints >= level.hints.length}
              className="flex items-center gap-2 rounded-lg border border-edge bg-panel px-3 py-2 font-mono text-[11px] tracking-widest text-mute uppercase transition hover:border-amber/50 hover:text-amber disabled:opacity-40"
            >
              <Lightbulb className="h-3.5 w-3.5" aria-hidden />
              {hints >= level.hints.length
                ? "no more hints"
                : `hint ${hints + 1}/${level.hints.length}`}
              {hints < level.hints.length && (
                <span className="text-mute/70">−20</span>
              )}
            </button>

            <AnimatePresence>
              {level.hints.slice(0, hints).map((h, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 max-w-lg border-l-2 border-amber/50 pl-3 font-mono text-xs leading-relaxed text-dim"
                >
                  <span className="text-amber">HINT {i + 1}</span> — {h}
                </motion.p>
              ))}
            </AnimatePresence>
          </div>

          <div className="text-right">
            {confirmSkip ? (
              <div className="rounded-xl border border-amber/40 bg-amber/[0.06] p-3 text-left">
                <p className="mb-2 max-w-[15rem] text-xs text-amber">
                  Skip the challenge? You can. But where&apos;s the fun in that?
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      complete(true);
                      setConfirmSkip(false);
                    }}
                    className="rounded-lg bg-amber px-3 py-1.5 font-mono text-[10px] font-bold tracking-widest text-void uppercase"
                  >
                    skip it
                  </button>
                  <button
                    onClick={() => setConfirmSkip(false)}
                    className="rounded-lg border border-edge px-3 py-1.5 font-mono text-[10px] tracking-widest text-dim uppercase"
                  >
                    keep trying
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setConfirmSkip(true)}
                className="flex items-center gap-1.5 font-mono text-[11px] tracking-widest text-mute uppercase transition hover:text-dim"
              >
                <SkipForward className="h-3.5 w-3.5" aria-hidden />
                skip challenge
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── reward ─────────────────────────────────────────── */}
      <AnimatePresence>
        {solved && (
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative overflow-hidden rounded-2xl border border-mint/30 bg-gradient-to-b from-mint/[0.08] to-transparent p-5 sm:p-6"
          >
            <div className="pointer-events-none absolute inset-0 grid-bg-fine opacity-40" />
            <div className="relative">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <span className="flex items-center gap-2 font-mono text-[11px] font-bold tracking-[0.2em] text-mint uppercase">
                  <Check className="h-4 w-4" aria-hidden />
                  {skipped ? "Challenge skipped" : level.reward.title}
                </span>
                {!skipped && gained !== null && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="rounded-full bg-mint px-2.5 py-1 font-mono text-[11px] font-bold text-void"
                  >
                    +{gained}
                  </motion.span>
                )}
              </div>

              {level.reward.stat && (
                <div className="mb-4">
                  <p className="text-gradient text-4xl font-semibold tracking-tight sm:text-5xl">
                    {level.reward.stat}
                  </p>
                  {level.reward.statLabel && (
                    <p className="mt-1 font-mono text-[11px] tracking-[0.2em] text-mute uppercase">
                      {level.reward.statLabel}
                    </p>
                  )}
                </div>
              )}

              <div className="space-y-1 font-mono text-[13px] leading-relaxed text-dim">
                {level.reward.lines.map((l, i) => (
                  <motion.p
                    key={i}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 + i * 0.05 }}
                    className={l.startsWith("  ·") || l.startsWith("  ") ? "pl-3" : ""}
                  >
                    {l || "\u00A0"}
                  </motion.p>
                ))}
              </div>

              <p className="mt-4 font-mono text-xs leading-relaxed text-mute">
                {level.solution}
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Button onClick={onNext}>
                  {isLast ? "Enter the workspace" : "Continue"}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5" aria-hidden />
                </Button>
                {level.reward.link && (
                  <Button
                    variant="outline"
                    href={level.reward.link.href}
                    external={!level.reward.link.href.startsWith("#")}
                  >
                    {level.reward.link.label}
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
