"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { KeyRound, X } from "lucide-react";

const KONAMI = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

/**
 * Console greeting, inspect-element wink and the Konami code.
 * Nothing sensitive is hidden here — it is a reward for poking around.
 */
export function EasterEggs() {
  const [unlocked, setUnlocked] = useState(false);
  const bufferRef = useRef<string[]>([]);

  useEffect(() => {
    console.log(
      "%cYou opened the console.",
      "color:#4ef0c1;font-size:14px;font-weight:bold",
    );
    console.log("%cRespect.", "color:#8b7cff;font-size:12px");
    console.log(
      "%cTry the Konami code: ↑ ↑ ↓ ↓ ← → ← → B A",
      "color:#9aa4b2;font-size:11px",
    );
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      const next = [...bufferRef.current, key].slice(-KONAMI.length);
      bufferRef.current = next;
      if (next.length === KONAMI.length && next.every((k, i) => k === KONAMI[i])) {
        bufferRef.current = [];
        setUnlocked(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <AnimatePresence>
      {unlocked && (
        <motion.aside
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.97 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          role="status"
          className="fixed right-4 bottom-4 z-[75] w-[min(24rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-mint/40 bg-ink/95 p-5 shadow-[0_30px_80px_-30px_rgba(0,0,0,1)] backdrop-blur-xl"
        >
          <div className="mb-3 flex items-center justify-between">
            <span className="flex items-center gap-2 font-mono text-[11px] tracking-[0.2em] text-mint uppercase">
              <KeyRound className="h-3.5 w-3.5" aria-hidden />
              secret room unlocked
            </span>
            <button
              onClick={() => setUnlocked(false)}
              aria-label="Close secret"
              className="rounded p-1 text-mute transition hover:text-fg"
            >
              <X className="h-4 w-4" aria-hidden />
            </button>
          </div>
          <p className="font-mono text-[12px] leading-relaxed text-dim">
            You typed the Konami code into a portfolio.
            <br />
            <span className="text-fg">Achievement: irredeemably nerdy.</span>
          </p>
          <p className="mt-3 border-t border-edge pt-3 font-mono text-[11px] leading-relaxed text-mute">
            First repo ever pushed: <span className="text-mint">varshith-demo</span> —
            described by its author as “This is my first repository.”
          </p>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
