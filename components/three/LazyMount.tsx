"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

interface LazyMountProps {
  children: ReactNode;
  className?: string;
  /** Placeholder rendered until the element approaches the viewport. */
  fallback?: ReactNode;
  rootMargin?: string;
  /** Render immediately (used for the hero). */
  immediate?: boolean;
}

/** Mounts heavy children (3D canvases) only once they near the viewport. */
export function LazyMount({
  children,
  className,
  fallback,
  rootMargin = "300px 0px",
  immediate = false,
}: LazyMountProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(immediate);

  useEffect(() => {
    if (show) return;
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setShow(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShow(true);
          io.disconnect();
        }
      },
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [show, rootMargin]);

  return (
    <div ref={ref} className={className}>
      {show ? children : fallback}
    </div>
  );
}
