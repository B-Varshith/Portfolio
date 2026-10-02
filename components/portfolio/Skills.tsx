"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";
import { levelLabels, skillGroups, type SkillLevel } from "@/data/skills";
import { cn } from "@/lib/cn";

const LEVEL_STYLE: Record<SkillLevel, string> = {
  core: "border-mint/45 bg-mint/10 text-mint",
  strong: "border-edge-2 bg-ink text-dim",
  exploring: "border-edge bg-ink/60 text-mute",
};

const LEVEL_DOT: Record<SkillLevel, string> = {
  core: "bg-mint",
  strong: "bg-sky/70",
  exploring: "bg-mute",
};

export function Skills() {
  const [active, setActive] = useState(skillGroups[0].id);
  const group = skillGroups.find((g) => g.id === active) ?? skillGroups[0];

  return (
    <section id="skills" aria-label="Skills" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <SectionHeader
          index="04"
          label="Skills"
          title={
            <>
              The stack, labelled by <span className="text-gradient">evidence.</span>
            </>
          }
          description="No fabricated percentages. Each technology is tagged by how often it shows up in shipped work: frequently used, working knowledge, or exploring."
        />

        <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
          {/* category rail */}
          <Reveal>
            <nav
              aria-label="Skill categories"
              className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0"
            >
              {skillGroups.map((g) => {
                const isActive = g.id === active;
                return (
                  <button
                    key={g.id}
                    onClick={() => setActive(g.id)}
                    aria-current={isActive ? "true" : undefined}
                    className={cn(
                      "relative shrink-0 rounded-xl border px-4 py-3 text-left transition-colors duration-300 lg:w-full",
                      isActive
                        ? "border-mint/40 bg-mint/[0.07]"
                        : "border-edge bg-panel/50 hover:border-edge-2 hover:bg-panel/80",
                    )}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="skills-active"
                        className="absolute top-3 bottom-3 -left-px w-0.5 rounded-full bg-mint"
                        transition={{ type: "spring", stiffness: 400, damping: 34 }}
                      />
                    )}
                    <span
                      className={cn(
                        "block text-sm font-medium tracking-tight whitespace-nowrap",
                        isActive ? "text-fg" : "text-dim",
                      )}
                    >
                      {g.label}
                    </span>
                    <span className="mt-0.5 hidden font-mono text-[10px] text-mute lg:block">
                      {g.items.length} entries
                    </span>
                  </button>
                );
              })}
            </nav>
          </Reveal>

          {/* skills panel */}
          <Reveal delay={0.08}>
            <div className="relative h-full overflow-hidden rounded-2xl border border-edge bg-panel/50 p-5 sm:p-7">
              <div className="pointer-events-none absolute inset-0 grid-bg-fine opacity-40" />
              <div className="relative">
                <div className="mb-5 flex flex-wrap items-baseline justify-between gap-3 border-b border-edge pb-4">
                  <h3 className="text-lg font-medium tracking-tight text-fg">
                    {group.label}
                  </h3>
                  <p className="font-mono text-[11px] text-mute">{group.hint}</p>
                </div>

                <AnimatePresence mode="wait">
                  <motion.ul
                    key={group.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-wrap gap-2.5"
                  >
                    {group.items.map((s, i) => (
                      <motion.li
                        key={s.name}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.03, duration: 0.3 }}
                      >
                        <span
                          className={cn(
                            "inline-flex items-center gap-2 rounded-lg border px-3 py-2 font-mono text-[12px] transition hover:-translate-y-0.5",
                            LEVEL_STYLE[s.level],
                          )}
                          title={levelLabels[s.level]}
                        >
                          <span
                            className={cn("h-1.5 w-1.5 rounded-full", LEVEL_DOT[s.level])}
                            aria-hidden
                          />
                          {s.name}
                        </span>
                      </motion.li>
                    ))}
                  </motion.ul>
                </AnimatePresence>

                <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 border-t border-edge pt-4">
                  {(Object.keys(levelLabels) as SkillLevel[]).map((lvl) => (
                    <span
                      key={lvl}
                      className="flex items-center gap-2 font-mono text-[10px] tracking-[0.14em] text-mute uppercase"
                    >
                      <span className={cn("h-1.5 w-1.5 rounded-full", LEVEL_DOT[lvl])} aria-hidden />
                      {levelLabels[lvl]}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
