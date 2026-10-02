"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "motion/react";
import { Building2, GraduationCap, MapPin, ChevronDown } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";
import { experiences } from "@/data/experience";
import { cn } from "@/lib/cn";

export function Experience() {
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<string | null>(experiences[0]?.id ?? null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 65%", "end 60%"],
  });
  const lineScale = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.4 });

  return (
    <section id="experience" aria-label="Experience" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <SectionHeader
          index="02"
          label="Experience"
          title={
            <>
              Where the work has been{" "}
              <span className="text-gradient">so far.</span>
            </>
          }
          description="One production AI platform, one undergraduate programme — and a large amount of code written in between."
        />

        <div ref={ref} className="relative pl-6 sm:pl-10">
          {/* rail */}
          <div className="absolute top-2 bottom-2 left-0 w-px bg-edge sm:left-2">
            <motion.div
              style={{ scaleY: lineScale }}
              className="h-full w-full origin-top bg-gradient-to-b from-mint via-mint/60 to-violet"
            />
          </div>

          <ol className="space-y-6">
            {experiences.map((exp, i) => {
              const isOpen = open === exp.id;
              const Icon = exp.kind === "education" ? GraduationCap : Building2;
              return (
                <Reveal key={exp.id} delay={i * 0.08}>
                  <li>
                    <button
                      onClick={() => setOpen(isOpen ? null : exp.id)}
                      aria-expanded={isOpen}
                      className={cn(
                        "group relative w-full rounded-2xl border p-5 text-left transition-all duration-300 sm:p-7",
                        isOpen
                          ? "border-mint/35 bg-mint/[0.04] shadow-[0_30px_80px_-50px_rgba(78,240,193,0.6)]"
                          : "border-edge bg-panel/50 hover:border-edge-2 hover:bg-panel/80",
                      )}
                    >
                      {/* node */}
                      <span
                        className={cn(
                          "absolute -left-[1.72rem] top-8 grid h-4 w-4 place-items-center rounded-full border transition sm:-left-[2.72rem]",
                          isOpen
                            ? "border-mint bg-mint shadow-[0_0_18px_rgba(78,240,193,0.75)]"
                            : "border-edge-2 bg-void",
                        )}
                      >
                        <span
                          className={cn(
                            "h-1.5 w-1.5 rounded-full",
                            isOpen ? "bg-void" : "bg-mute",
                          )}
                        />
                      </span>

                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="mb-2 flex flex-wrap items-center gap-2.5">
                            <span className="flex items-center gap-1.5 rounded-full border border-edge-2 bg-ink px-2.5 py-1 font-mono text-[10px] tracking-[0.18em] text-mute uppercase">
                              <Icon className="h-3 w-3" aria-hidden />
                              {exp.kind === "education" ? "education" : "work"}
                            </span>
                            <span className="font-mono text-[11px] tracking-[0.16em] text-mint uppercase">
                              {exp.period}
                            </span>
                          </div>

                          <h3 className="text-xl font-medium tracking-tight text-fg sm:text-2xl">
                            {exp.role}
                          </h3>
                          <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-dim">
                            <span className="text-fg/90">{exp.company}</span>
                            <span className="flex items-center gap-1 text-mute">
                              <MapPin className="h-3.5 w-3.5" aria-hidden />
                              {exp.location}
                            </span>
                          </p>
                        </div>

                        <span
                          className={cn(
                            "grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-edge-2 bg-ink text-mute transition group-hover:text-fg",
                            isOpen && "rotate-180 text-mint",
                          )}
                        >
                          <ChevronDown className="h-4 w-4" aria-hidden />
                        </span>
                      </div>

                      <p className="mt-4 max-w-3xl text-sm leading-relaxed text-dim">
                        {exp.summary}
                      </p>

                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                            className="overflow-hidden"
                          >
                            <ul className="mt-5 space-y-2.5 border-t border-edge pt-5">
                              {exp.bullets.map((b) => (
                                <li
                                  key={b}
                                  className="flex gap-3 text-sm leading-relaxed text-dim"
                                >
                                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-mint" aria-hidden />
                                  {b}
                                </li>
                              ))}
                            </ul>

                            <div className="mt-5 flex flex-wrap gap-2">
                              {exp.tech.map((t) => (
                                <span
                                  key={t}
                                  className="rounded-md border border-edge-2 bg-ink px-2.5 py-1 font-mono text-[11px] text-dim transition hover:border-mint/40 hover:text-mint"
                                >
                                  {t}
                                </span>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </button>
                  </li>
                </Reveal>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
