"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Menu, X, RotateCcw, Command } from "lucide-react";
import { cn } from "@/lib/cn";
import { GithubIcon } from "@/components/ui/BrandIcons";
import { useGame } from "@/lib/game-context";
import { TOTAL_LEVELS } from "@/data/puzzles";

export const NAV_ITEMS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "competitive", label: "Competitive" },
  { id: "github", label: "GitHub" },
  { id: "contact", label: "Contact" },
] as const;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>("home");
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const { corePercent, state, reset } = useGame();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = NAV_ITEMS.map((i) => document.getElementById(i.id)).filter(
      Boolean,
    ) as HTMLElement[];
    if (!sections.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0.01, 0.25, 0.5] },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const go = (id: string) => {
    setOpen(false);
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    history.replaceState(null, "", `#${id}`);
  };

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 sm:pt-4">
        <nav
          aria-label="Primary"
          className={cn(
            "flex w-full max-w-6xl items-center justify-between rounded-2xl border px-3 py-2 transition-all duration-500 sm:px-4",
            scrolled
              ? "border-white/10 bg-ink/80 shadow-[0_18px_50px_-24px_rgba(0,0,0,0.9)] backdrop-blur-xl"
              : "border-transparent bg-transparent",
          )}
        >
          {/* mark */}
          <button
            onClick={() => go("home")}
            className="group flex items-center gap-2.5 rounded-lg px-1 py-1"
            aria-label="Go to top"
          >
            <span className="relative grid h-7 w-7 place-items-center rounded-md border border-mint/30 bg-mint/10 font-mono text-[11px] font-bold text-mint transition group-hover:bg-mint/20">
              V
              <span className="absolute -inset-1 rounded-md bg-mint/10 opacity-0 blur-md transition group-hover:opacity-100" />
            </span>
            <span className="hidden font-mono text-[11px] tracking-[0.24em] text-dim uppercase sm:block">
              Varshith<span className="text-mute">.os</span>
            </span>
          </button>

          {/* desktop links */}
          <ul className="hidden items-center gap-0.5 lg:flex">
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => go(item.id)}
                  aria-current={active === item.id ? "true" : undefined}
                  className={cn(
                    "relative rounded-lg px-3 py-2 text-[13px] tracking-tight transition-colors duration-200",
                    active === item.id
                      ? "text-fg"
                      : "text-mute hover:text-dim",
                  )}
                >
                  {item.label}
                  {active === item.id && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-x-2 -bottom-0.5 h-px bg-mint"
                      transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    />
                  )}
                </button>
              </li>
            ))}
          </ul>

          {/* right cluster */}
          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                window.dispatchEvent(new CustomEvent("open-palette"))
              }
              className="hidden items-center gap-1.5 rounded-lg border border-edge bg-panel px-2.5 py-1.5 font-mono text-[10px] tracking-widest text-mute uppercase transition hover:border-mint/40 hover:text-dim sm:flex"
              aria-label="Open command palette"
            >
              <Command className="h-3 w-3" aria-hidden />
              K
            </button>

            <button
              onClick={reset}
              className="hidden items-center gap-1.5 rounded-lg border border-edge bg-panel px-2.5 py-1.5 font-mono text-[10px] tracking-widest text-mute uppercase transition hover:border-rose/40 hover:text-rose md:flex"
              title="Reset challenge progress"
            >
              <RotateCcw className="h-3 w-3" aria-hidden />
              Reset
            </button>

            <a
              href="https://github.com/B-Varshith"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub profile"
              className="hidden rounded-lg border border-edge bg-panel p-2 text-dim transition hover:border-mint/40 hover:text-mint sm:block"
            >
              <GithubIcon className="h-4 w-4" />
            </a>

            <button
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              className="rounded-lg border border-edge bg-panel p-2 text-fg transition hover:border-mint/40 lg:hidden"
            >
              <Menu className="h-4 w-4" aria-hidden />
            </button>
          </div>
        </nav>
      </header>

      {/* progress rail */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-40 flex justify-center px-3 pt-3 sm:pt-4">
        <div className="mt-[3.1rem] flex w-full max-w-6xl items-center gap-3 px-1 sm:mt-[3.4rem]">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <span className="font-mono text-[10px] tracking-[0.2em] text-mute uppercase">
            challenges{" "}
            <span className="text-mint">
              {Math.round((corePercent / 100) * TOTAL_LEVELS)}/{TOTAL_LEVELS}
            </span>
            <span className="mx-2 text-edge-2">·</span>
            score{" "}
            <span className="text-fg">{state.score.toLocaleString()}</span>
          </span>
        </div>
      </div>

      {/* mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[60] lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
          >
            <div
              className="absolute inset-0 bg-void/92 backdrop-blur-2xl"
              onClick={() => setOpen(false)}
            />
            <motion.div
              className="absolute inset-x-3 top-3 rounded-2xl border border-edge bg-ink/95 p-5 backdrop-blur-2xl"
              initial={{ y: -16, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -16, opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="mb-6 flex items-center justify-between">
                <span className="font-mono text-[11px] tracking-[0.24em] text-mute uppercase">
                  navigation
                </span>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="rounded-lg border border-edge bg-panel p-2 text-fg"
                >
                  <X className="h-4 w-4" aria-hidden />
                </button>
              </div>

              <ul className="flex flex-col">
                {NAV_ITEMS.map((item, i) => (
                  <motion.li
                    key={item.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.045, duration: 0.35 }}
                  >
                    <button
                      onClick={() => go(item.id)}
                      className="flex w-full items-baseline gap-4 border-b border-edge/70 py-3.5 text-left"
                    >
                      <span className="font-mono text-[10px] text-mute">
                        0{i + 1}
                      </span>
                      <span
                        className={cn(
                          "text-2xl font-medium tracking-tight",
                          active === item.id ? "text-mint" : "text-fg",
                        )}
                      >
                        {item.label}
                      </span>
                    </button>
                  </motion.li>
                ))}
              </ul>

              <div className="mt-6 flex items-center justify-between font-mono text-[10px] tracking-widest text-mute uppercase">
                <span>
                  progress{" "}
                  <span className="text-mint">{corePercent}%</span>
                </span>
                <button
                  onClick={() => {
                    setOpen(false);
                    reset();
                  }}
                  className="text-rose/80 hover:text-rose"
                >
                  reset game
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
