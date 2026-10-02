"use client";

import { motion, useReducedMotion } from "motion/react";
import { ChevronRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useTypewriter } from "@/hooks/useTypewriter";

const BOOT = [
  "$ ./open portfolio.exe",
  "",
  "VARSHITH.OS  ·  secure developer workspace",
  "",
  "You've found Varshith's developer workspace.",
  "",
  "Most people scroll through portfolios.",
  "Developers investigate.",
  "",
  "If you want to know who built this…",
  "solve the challenges.",
];

export function BootIntro({
  onEnter,
  onSkip,
  hasProgress,
  onResume,
}: {
  onEnter: () => void;
  onSkip: () => void;
  hasProgress: boolean;
  onResume: () => void;
}) {
  const reduce = useReducedMotion();
  const { visible, done, skip } = useTypewriter(BOOT, !reduce, 14);

  const finished = done || reduce;

  return (
    <div className="relative flex min-h-full flex-col items-center justify-center px-5 py-24">
      <div className="pointer-events-none absolute inset-0 grid-bg-fine opacity-[0.5]" />
      <div className="pointer-events-none absolute inset-0 radial-fade" />

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-2xl"
      >
        {/* terminal window */}
        <div className="glass overflow-hidden rounded-2xl shadow-[0_50px_120px_-50px_rgba(0,0,0,1)]">
          <div className="flex items-center gap-2 border-b border-white/8 bg-black/40 px-4 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-rose/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-mint/80" />
            <span className="ml-3 font-mono text-[11px] tracking-[0.2em] text-mute uppercase">
              bash — portfolio.exe
            </span>
          </div>

          <div
            className="min-h-[19rem] px-5 py-6 font-mono text-[13px] leading-relaxed text-dim sm:min-h-[17rem] sm:px-7 sm:text-[15px]"
            onClick={skip}
          >
            {(() => {
              const caret = visible.reduce(
                (acc, line, i) => (line.length > 0 ? i : acc),
                0,
              );
              return visible.map((line, i) => (
                <motion.p key={i} className={i === 0 ? "text-mint" : i >= 3 && line ? "text-fg" : ""} initial={false}>
                  {line || "\u00A0"}
                  {!done && i === caret && (
                    <span className="ml-0.5 inline-block h-[1.05em] w-[0.55em] translate-y-[0.15em] animate-blink bg-mint align-middle" />
                  )}
                </motion.p>
              ));
            })()}
          </div>

          <div className="flex flex-col gap-3 border-t border-white/8 bg-black/30 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: finished ? 1 : 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-wrap items-center gap-3"
            >
              <Button onClick={onEnter} ariaLabel="Enter the challenge">
                <Zap className="h-4 w-4" aria-hidden />
                Enter the challenge
                <ChevronRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5" aria-hidden />
              </Button>

              {hasProgress && (
                <Button variant="outline" onClick={onResume}>
                  Resume progress
                </Button>
              )}
            </motion.div>

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: finished ? 1 : 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              onClick={onSkip}
              className="self-start font-mono text-[11px] tracking-widest text-mute uppercase transition hover:text-dim sm:self-auto"
            >
              just open the portfolio →
            </motion.button>
          </div>
        </div>

        <p className="mt-6 text-center font-mono text-[11px] tracking-[0.22em] text-mute uppercase">
          9 challenges · hint system · local save · no login
        </p>
      </motion.div>
    </div>
  );
}
