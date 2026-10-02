"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Command,
  FolderGit2,
  Sparkles,
  Trophy,
  User,
  Wrench,
  RotateCcw,
  Gamepad2,
  Terminal,
  Cpu,
} from "lucide-react";
import { GithubIcon } from "@/components/ui/BrandIcons";
import { useGame } from "@/lib/game-context";

interface Cmd {
  id: string;
  label: string;
  hint: string;
  icon: React.ComponentType<{ className?: string }>;
  keywords: string[];
  run: () => void;
}

const goTo = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  history.replaceState(null, "", `#${id}`);
};

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const [secret, setSecret] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { reset, state } = useGame();

  const commands = useMemo<Cmd[]>(
    () => [
      { id: "help", label: "/help", hint: "List the available commands", icon: Terminal, keywords: ["help", "commands", "?"], run: () => setSecret(false) },
      { id: "home", label: "/home", hint: "Jump to the hero", icon: Sparkles, keywords: ["home", "top", "hero"], run: () => goTo("home") },
      { id: "about", label: "/about", hint: "Who is behind this", icon: User, keywords: ["about", "bio", "who"], run: () => goTo("about") },
      { id: "projects", label: "/projects", hint: "Selected repositories", icon: FolderGit2, keywords: ["projects", "work", "repos"], run: () => goTo("projects") },
      { id: "github", label: "/github", hint: "github.com/B-Varshith", icon: GithubIcon, keywords: ["github", "git"], run: () => goTo("github") },
      { id: "codeforces", label: "/codeforces", hint: "Competitive programming record", icon: Trophy, keywords: ["codeforces", "cp", "rating", "contest"], run: () => goTo("competitive") },
      { id: "experience", label: "/experience", hint: "Work + education timeline", icon: Cpu, keywords: ["experience", "work", "dentsu", "job"], run: () => goTo("experience") },
      { id: "skills", label: "/skills", hint: "Languages, frameworks, algorithms", icon: Wrench, keywords: ["skills", "stack", "tech"], run: () => goTo("skills") },
      { id: "contact", label: "/contact", hint: "Get in touch", icon: Sparkles, keywords: ["contact", "email", "hire"], run: () => goTo("contact") },
      { id: "game", label: "/game", hint: "Replay the challenge from level 1", icon: Gamepad2, keywords: ["game", "replay", "challenge", "play"], run: () => { reset(); setTimeout(() => window.scrollTo({ top: 0 }), 60); } },
      { id: "reset", label: "/reset", hint: "Clear saved progress", icon: RotateCcw, keywords: ["reset", "clear", "wipe"], run: () => reset() },
      { id: "secret", label: "/secret", hint: "You weren't supposed to find this yet", icon: Sparkles, keywords: ["secret", "hidden", "easter"], run: () => setSecret(true) },
    ],
    [reset],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase().replace(/^\//, "");
    if (!q) return commands;
    return commands.filter(
      (c) =>
        c.label.includes(q) ||
        c.hint.toLowerCase().includes(q) ||
        c.keywords.some((k) => k.includes(q)),
    );
  }, [query, commands]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
        setQuery("");
        setIndex(0);
        setSecret(false);
      }
    };
    const onOpen = () => {
      setOpen(true);
      setQuery("");
      setIndex(0);
      setSecret(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("open-palette", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("open-palette", onOpen);
    };
  }, []);

  useEffect(() => {
    if (open) requestAnimationFrame(() => inputRef.current?.focus());
  }, [open]);

  const close = () => {
    setOpen(false);
    setSecret(false);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") return close();
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setIndex((i) => Math.min(i + 1, filtered.length - 1));
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setIndex((i) => Math.max(i - 1, 0));
    }
    if (e.key === "Enter") {
      e.preventDefault();
      const cmd = filtered[index];
      if (cmd) {
        cmd.run();
        if (cmd.id !== "help") close();
      }
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-start justify-center px-4 pt-[14vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.16 }}
        >
          <div className="absolute inset-0 bg-void/80 backdrop-blur-md" onClick={close} />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-edge bg-ink/95 shadow-[0_40px_120px_-40px_rgba(0,0,0,1)]"
            initial={{ y: -14, scale: 0.985, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: -10, scale: 0.99, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            onKeyDown={onKeyDown}
          >
            <div className="flex items-center gap-3 border-b border-edge px-4 py-3.5">
              <Command className="h-4 w-4 text-mint" aria-hidden />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setIndex(0);
                }}
                placeholder="Type a command…"
                aria-label="Command input"
                className="w-full bg-transparent font-mono text-sm text-fg placeholder:text-mute focus:outline-none"
              />
              <kbd className="rounded border border-edge bg-panel px-1.5 py-0.5 font-mono text-[10px] text-mute">
                ESC
              </kbd>
            </div>

            <div className="max-h-[52vh] overflow-y-auto p-2">
              {secret && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-2 rounded-xl border border-mint/25 bg-mint/[0.06] p-4 font-mono text-[12px] leading-relaxed text-dim"
                >
                  <p className="mb-2 text-mint">▸ hidden room unlocked</p>
                  <p>
                    You opened the console before the site told you to. Respect.
                  </p>
                  <p className="mt-2">
                    Three more secrets exist: the Konami code, an HTML comment, and
                    this very palette.
                  </p>
                  <p className="mt-2 text-mute">
                    score: {state.score} · keep exploring.
                  </p>
                </motion.div>
              )}

              {filtered.length === 0 && (
                <p className="px-3 py-6 text-center font-mono text-xs text-mute">
                  no command matches “{query}”
                </p>
              )}

              <ul role="listbox">
                {filtered.map((cmd, i) => {
                  const Icon = cmd.icon;
                  const active = i === index;
                  return (
                    <li key={cmd.id}>
                      <button
                        role="option"
                        aria-selected={active}
                        onMouseEnter={() => setIndex(i)}
                        onClick={() => {
                          cmd.run();
                          if (cmd.id !== "help") close();
                        }}
                        className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition ${
                          active ? "bg-mint/10 text-fg" : "text-dim hover:bg-white/[0.03]"
                        }`}
                      >
                        <Icon
                          className={`h-4 w-4 ${active ? "text-mint" : "text-mute"}`}
                        />
                        <span className="font-mono text-[13px]">{cmd.label}</span>
                        <span className="ml-auto text-[11px] text-mute">{cmd.hint}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="flex items-center justify-between border-t border-edge px-4 py-2.5 font-mono text-[10px] tracking-widest text-mute uppercase">
              <span>↑↓ navigate · ⏎ run</span>
              <span>VARSHITH.OS</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
