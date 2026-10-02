"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Check, X } from "lucide-react";

const SCENARIOS = [
  {
    id: "s1",
    text: "The agent needs information from a database.",
    answer: "tools",
  },
  {
    id: "s2",
    text: "The agent must reason about the request and decide the next step.",
    answer: "llm",
  },
  {
    id: "s3",
    text: "The agent has to recall what the user said ten turns ago.",
    answer: "memory",
  },
] as const;

const COMPONENTS = [
  { id: "memory", label: "MEMORY", note: "state & recall" },
  { id: "tools", label: "TOOLS", note: "act on the world" },
  { id: "llm", label: "LLM", note: "reason & plan" },
] as const;

interface Props {
  onSolve: () => void;
  onWrong: () => void;
  solved: boolean;
}

export function AgentPuzzle({ onSolve, onWrong, solved }: Props) {
  const [step, setStep] = useState(0);
  const [feedback, setFeedback] = useState<{ ok: boolean; msg: string } | null>(null);

  const current = SCENARIOS[step];

  const pick = (id: string) => {
    if (solved || !current) return;
    if (id === current.answer) {
      const next = step + 1;
      setFeedback({ ok: true, msg: `routed → ${id.toUpperCase()}` });
      if (next >= SCENARIOS.length) {
        onSolve();
      } else {
        setStep(next);
        setTimeout(() => setFeedback(null), 700);
      }
    } else {
      onWrong();
      setFeedback({
        ok: false,
        msg: `${id.toUpperCase()} can't handle that — think about who talks to the outside world.`,
      });
      setTimeout(() => setFeedback(null), 2600);
    }
  };

  const solvedCount = solved ? SCENARIOS.length : step;

  return (
    <div className="rounded-2xl border border-edge bg-panel/70 p-5">
      {/* pipeline */}
      <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center">
        <div className="rounded-xl border border-edge-2 bg-ink px-4 py-3 text-center font-mono text-xs tracking-widest text-dim">
          USER
        </div>
        <div className="hidden text-mute sm:block">↓</div>
        <div className="rounded-xl border border-mint/40 bg-mint/[0.07] px-4 py-3 text-center font-mono text-xs tracking-widest text-mint">
          AGENT
        </div>
        <div className="hidden text-mute sm:block">↓</div>
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {COMPONENTS.map((c) => (
            <motion.button
              key={c.id}
              onClick={() => pick(c.id)}
              disabled={solved}
              whileHover={solved ? undefined : { y: -3 }}
              className={`rounded-xl border px-3 py-3 text-center transition ${
                solved
                  ? "border-mint/40 bg-mint/[0.07]"
                  : "border-edge-2 bg-ink hover:border-mint/50"
              }`}
            >
              <span className="block font-mono text-[11px] tracking-widest text-fg">
                {c.label}
              </span>
              <span className="mt-1 block font-mono text-[10px] text-mute">
                {c.note}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* current scenario */}
      <div className="mt-5 rounded-xl border border-edge bg-black/40 p-4">
        <div className="mb-2 flex items-center justify-between font-mono text-[10px] tracking-widest text-mute uppercase">
          <span>route request</span>
          <span>
            <span className="text-mint">{solvedCount}</span> / {SCENARIOS.length}
          </span>
        </div>
        <p className="text-sm text-fg">
          {solved
            ? "Agent workflow restored — every request routed."
            : current?.text}
        </p>
      </div>

      {feedback && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-3 flex items-center gap-2 font-mono text-xs ${
            feedback.ok ? "text-mint" : "text-rose"
          }`}
        >
          {feedback.ok ? (
            <Check className="h-3.5 w-3.5" aria-hidden />
          ) : (
            <X className="h-3.5 w-3.5" aria-hidden />
          )}
          {feedback.msg}
        </motion.p>
      )}
    </div>
  );
}
