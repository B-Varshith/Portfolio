"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { ChevronUp, ChevronDown, Check, Lock } from "lucide-react";

interface Entry {
  id: string;
  log: string;
}

const CORRECT: Entry[] = [
  { id: "e1", log: "account initialized — github.com/B-Varshith" },
  { id: "e2", log: "first submission accepted — codeforces" },
  { id: "e3", log: "rating crossed 1600 — title upgraded to EXPERT" },
  { id: "e4", log: "production AI platform commits — dentsu" },
  { id: "e5", log: "policy-driven weather agent pushed" },
];

const INITIAL: Entry[] = [CORRECT[3], CORRECT[0], CORRECT[4], CORRECT[2], CORRECT[1]];

interface Props {
  onSolve: () => void;
  onWrong: () => void;
  solved: boolean;
}

export function TimelinePuzzle({ onSolve, onWrong, solved }: Props) {
  const [order, setOrder] = useState<Entry[]>(INITIAL);
  const [message, setMessage] = useState<string | null>(null);
  const [shake, setShake] = useState(0);

  const move = (i: number, dir: -1 | 1) => {
    if (solved) return;
    const j = i + dir;
    if (j < 0 || j >= order.length) return;
    const next = [...order];
    [next[i], next[j]] = [next[j], next[i]];
    setOrder(next);
    setMessage(null);
  };

  const submit = () => {
    const ok = order.every((e, i) => e.id === CORRECT[i].id);
    if (ok) onSolve();
    else {
      onWrong();
      setShake((s) => s + 1);
      setMessage("Timestamps don't line up. Think about what has to exist first.");
      setTimeout(() => setMessage(null), 3200);
    }
  };

  return (
    <div className="rounded-2xl border border-edge bg-panel/70 p-5">
      <div className="mb-4 flex items-center justify-between font-mono text-[10px] tracking-widest text-mute uppercase">
        <span>/var/log/varshith.log</span>
        <span className="text-rose">timestamps redacted</span>
      </div>

      <ul className="space-y-2">
        {order.map((entry, i) => (
          <motion.li
            key={entry.id}
            layout
            transition={{ type: "spring", stiffness: 420, damping: 34 }}
            className={`flex items-center gap-3 rounded-lg border px-3 py-3 ${
              solved
                ? "border-mint/40 bg-mint/[0.06]"
                : "border-edge-2 bg-ink"
            }`}
          >
            <span className="font-mono text-[11px] text-mute">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="min-w-0 flex-1 truncate font-mono text-[12px] text-dim">
              {entry.log}
            </span>
            {solved ? (
              <Check className="h-4 w-4 shrink-0 text-mint" aria-hidden />
            ) : (
              <span className="flex shrink-0 gap-1">
                <button
                  onClick={() => move(i, -1)}
                  aria-label={`Move ${entry.log} up`}
                  className="rounded border border-edge p-1 text-mute transition hover:border-mint/40 hover:text-mint"
                >
                  <ChevronUp className="h-3.5 w-3.5" aria-hidden />
                </button>
                <button
                  onClick={() => move(i, 1)}
                  aria-label={`Move ${entry.log} down`}
                  className="rounded border border-edge p-1 text-mute transition hover:border-mint/40 hover:text-mint"
                >
                  <ChevronDown className="h-3.5 w-3.5" aria-hidden />
                </button>
              </span>
            )}
            {solved && i === 0 && (
              <Lock className="hidden h-3.5 w-3.5 text-mute sm:block" aria-hidden />
            )}
          </motion.li>
        ))}
      </ul>

      <div className="mt-4 flex items-center justify-between gap-3">
        <p className="font-mono text-xs text-amber">{message ?? ""}</p>
        <motion.button
          key={shake}
          onClick={submit}
          animate={shake ? { x: [0, -7, 7, -5, 5, 0] } : undefined}
          transition={{ duration: 0.32 }}
          disabled={solved}
          className="shrink-0 rounded-lg bg-mint px-4 py-2 font-mono text-[11px] font-semibold tracking-widest text-void uppercase transition hover:brightness-110 disabled:opacity-50"
        >
          restore log
        </motion.button>
      </div>
    </div>
  );
}
