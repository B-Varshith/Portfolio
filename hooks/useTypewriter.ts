"use client";

import { useEffect, useMemo, useState } from "react";

/**
 * Reveals lines one character at a time, like a terminal printing output.
 * With prefers-reduced-motion everything is shown immediately.
 */
export function useTypewriter(lines: string[], enabled = true, speed = 16) {
  const total = useMemo(
    () => lines.reduce((sum, l) => sum + l.length + 1, 0),
    [lines],
  );
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!enabled || count >= total) return;
    let i = count;
    const id = window.setInterval(() => {
      i += 3;
      setCount(i);
      if (i >= total) window.clearInterval(id);
    }, speed);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, speed, total]);

  const active = enabled ? count : total;

  const visible: string[] = [];
  let used = 0;
  for (const line of lines) {
    const remaining = active - used;
    visible.push(line.slice(0, Math.max(0, Math.min(line.length, remaining))));
    used += line.length + 1;
  }

  return { visible, done: active >= total, skip: () => setCount(total) };
}
