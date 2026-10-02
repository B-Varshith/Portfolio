"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { FolderGit2, Lock, Check } from "lucide-react";

const REPOS = [
  "Weather_App",
  "Personal-Finance-Assistance",
  "Medistock-Backend",
  "QueueCTL",
  "SQL-Query-optimzer",
  "Reliable_UDP_v2",
  "Segment-Tree",
  "Clause-Boundary-Detection",
  "CP",
];

const CLUES = [
  {
    id: "c1",
    text: "Find the repository demonstrating reliable message exchange over UDP with stop-and-wait.",
    answer: "Reliable_UDP_v2",
  },
  {
    id: "c2",
    text: "Find the tool that renders PostgreSQL's EXPLAIN ANALYZE plan as an interactive tree.",
    answer: "SQL-Query-optimzer",
  },
  {
    id: "c3",
    text: "Find the repository that routes finance questions through specialist agents.",
    answer: "Personal-Finance-Assistance",
  },
];

interface Props {
  onSolve: () => void;
  onWrong: () => void;
  solved: boolean;
}

export function ReposPuzzle({ onSolve, onWrong, solved }: Props) {
  const [step, setStep] = useState(0);
  const [wrongRepo, setWrongRepo] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const current = CLUES[step];
  const unlocked = (repo: string) =>
    CLUES.some((c, i) => (solved || i < step) && c.answer === repo);

  const pick = (repo: string) => {
    if (solved || !current) return;
    if (repo === current.answer) {
      const next = step + 1;
      if (next >= CLUES.length) onSolve();
      else setStep(next);
      setMessage(null);
    } else {
      onWrong();
      setWrongRepo(repo);
      setMessage("Case file doesn't match that repository.");
      setTimeout(() => setWrongRepo(null), 700);
      setTimeout(() => setMessage(null), 2600);
    }
  };

  return (
    <div className="rounded-2xl border border-edge bg-panel/70 p-5">
      <div className="mb-4 flex items-center gap-2 font-mono text-xs tracking-widest text-mute uppercase">
        <FolderGit2 className="h-3.5 w-3.5" aria-hidden />
        github://B-Varshith/
        <span className="text-mint">{solved ? CLUES.length : step}</span> of {CLUES.length} clues
      </div>

      <div className="mb-4 rounded-xl border border-mint/25 bg-mint/[0.05] p-4">
        <p className="text-sm leading-relaxed text-fg">
          {solved ? "All three repositories identified." : current?.text}
        </p>
      </div>

      <ul className="grid gap-2 sm:grid-cols-2">
        {REPOS.map((repo) => {
          const found = unlocked(repo);
          const wrong = wrongRepo === repo;
          return (
            <li key={repo}>
              <motion.button
                onClick={() => pick(repo)}
                disabled={solved || found}
                animate={wrong ? { x: [0, -6, 6, -4, 4, 0] } : undefined}
                transition={{ duration: 0.3 }}
                className={`flex w-full items-center gap-2.5 rounded-lg border px-3 py-2.5 text-left font-mono text-[12px] transition ${
                  wrong
                    ? "border-rose/60 bg-rose/10 text-rose"
                    : found
                      ? "border-mint/40 bg-mint/[0.07] text-mint"
                      : "border-edge-2 bg-ink text-dim hover:border-mint/40 hover:text-fg"
                }`}
              >
                {found ? (
                  <Check className="h-3.5 w-3.5 shrink-0" aria-hidden />
                ) : (
                  <Lock className="h-3.5 w-3.5 shrink-0 text-mute" aria-hidden />
                )}
                <span className="truncate">{repo}</span>
              </motion.button>
            </li>
          );
        })}
      </ul>

      {message && <p className="mt-3 font-mono text-xs text-rose">{message}</p>}
    </div>
  );
}
