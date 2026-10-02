"use client";

import { useRef, type ReactNode } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "motion/react";

interface TiltProps {
  children: ReactNode;
  className?: string;
  max?: number;
  /** Shine/glow element that follows the pointer inside the card. */
  glow?: boolean;
  accent?: string;
}

/** 3D card tilt with a pointer-tracked glow. Falls back to flat on touch. */
export function Tilt({
  children,
  className,
  max = 8,
  glow = true,
  accent = "rgba(78,240,193,0.16)",
}: TiltProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const mx = useMotionValue(50);
  const my = useMotionValue(50);
  const srx = useSpring(rx, { stiffness: 180, damping: 20 });
  const sry = useSpring(ry, { stiffness: 180, damping: 20 });
  const shine = useMotionTemplate`radial-gradient(360px circle at ${mx}% ${my}%, ${accent}, transparent 62%)`;

  const move = (e: React.PointerEvent) => {
    if (reduce || e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    rx.set((0.5 - py) * max);
    ry.set((px - 0.5) * max);
    mx.set(px * 100);
    my.set(py * 100);
  };

  const leave = () => {
    rx.set(0);
    ry.set(0);
    mx.set(50);
    my.set(50);
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        rotateX: srx,
        rotateY: sry,
        transformPerspective: 1000,
        transformStyle: "preserve-3d",
      }}
      onPointerMove={move}
      onPointerLeave={leave}
    >
      {glow && (
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: shine }}
        />
      )}
      {children}
    </motion.div>
  );
}
