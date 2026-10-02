"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";

const subscribePointer = (onChange: () => void) => {
  if (typeof window === "undefined") return () => {};
  const mq = window.matchMedia("(pointer: fine)");
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
};
const pointerFine = () =>
  typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches;

/**
 * Desktop-only cursor: an instant dot, a lagging ring and an optional label.
 * Native cursor stays available for text fields (see globals.css).
 */
export function CustomCursor() {
  const reduce = useReducedMotion();
  const enabled = useSyncExternalStore(subscribePointer, pointerFine, () => false);
  const [hot, setHot] = useState(false);
  const [down, setDown] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 340, damping: 32, mass: 0.5 });
  const ringY = useSpring(y, { stiffness: 340, damping: 32, mass: 0.5 });

  useEffect(() => {
    if (!enabled) return;
    document.body.classList.add("has-cursor");
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      if (!visible) setVisible(true);

      const target = (e.target as HTMLElement | null)?.closest?.(
        "a, button, [role='button'], [data-cursor], input, textarea, label, summary",
      ) as HTMLElement | null;
      setHot(Boolean(target));
      setLabel(target?.dataset?.cursorLabel ?? null);
    };
    const over = () => setVisible(true);
    const out = (e: PointerEvent) => {
      if (!e.relatedTarget) setVisible(false);
    };
    const dn = () => setDown(true);
    const up = () => setDown(false);

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    window.addEventListener("pointerout", out, { passive: true });
    window.addEventListener("pointerdown", dn);
    window.addEventListener("pointerup", up);

    return () => {
      document.body.classList.remove("has-cursor");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      window.removeEventListener("pointerout", out);
      window.removeEventListener("pointerdown", dn);
      window.removeEventListener("pointerup", up);
    };
  }, [enabled, x, y, visible]);

  if (!enabled) return null;

  const scale = down ? 0.8 : hot ? 1.55 : 1;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[9999] hidden md:block"
      style={{ opacity: visible ? 1 : 0, transition: "opacity .2s" }}
    >
      {/* lagging ring */}
      <motion.div
        className="absolute top-0 left-0 rounded-full border"
        style={{
          x: ringX,
          y: ringY,
          borderColor: hot ? "rgba(78,240,193,0.85)" : "rgba(255,255,255,0.35)",
          boxShadow: hot ? "0 0 24px rgba(78,240,193,0.35)" : "none",
        }}
        animate={{
          width: reduce ? 30 : hot ? 54 : 32,
          height: reduce ? 30 : hot ? 54 : 32,
          marginLeft: reduce ? -15 : hot ? -27 : -16,
          marginTop: reduce ? -15 : hot ? -27 : -16,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
      />

      {/* instant dot */}
      <motion.div
        className="absolute top-0 left-0 h-1.5 w-1.5 rounded-full bg-mint"
        style={{ x, y, marginLeft: -3, marginTop: -3 }}
        animate={{ scale }}
        transition={{ type: "spring", stiffness: 500, damping: 28 }}
      />

      {label && (
        <motion.span
          className="absolute top-0 left-0 rounded-full bg-mint px-2.5 py-1 font-mono text-[10px] font-semibold tracking-widest text-void uppercase"
          style={{ x, y }}
          initial={{ opacity: 0, scale: 0.8, marginLeft: 26, marginTop: -10 }}
          animate={{ opacity: 1, scale: 1, marginLeft: 26, marginTop: -10 }}
          transition={{ duration: 0.18 }}
        >
          {label}
        </motion.span>
      )}
    </div>
  );
}
