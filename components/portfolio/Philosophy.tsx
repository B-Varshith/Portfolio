"use client";

import { motion, useReducedMotion } from "motion/react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { principles } from "@/data/philosophy";

export function Philosophy() {
  const reduce = useReducedMotion();

  return (
    <section id="philosophy" aria-label="Engineering philosophy" className="relative overflow-hidden py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-40" />
      <div className="pointer-events-none absolute inset-0 radial-fade" />

      <div className="relative mx-auto max-w-6xl px-5 sm:px-6">
        <SectionHeader
          index="08"
          label="Philosophy"
          title={
            <>
              Design statements, <span className="text-gradient">not slogans.</span>
            </>
          }
        />

        <ol className="space-y-10 md:space-y-14">
          {principles.map((p) => (
            <motion.li
              key={p.index}
              initial={reduce ? false : { opacity: 0, y: 34, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-15%" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="group flex flex-col gap-3 border-t border-edge pt-6 md:flex-row md:items-start md:gap-10"
            >
              <span className="font-mono text-xs tracking-[0.3em] text-mute transition-colors group-hover:text-mint md:w-16 md:shrink-0 md:pt-4">
                {p.index}
              </span>

              <div className="min-w-0 flex-1">
                <p className="text-[clamp(1.6rem,4.6vw,3.4rem)] leading-[1.06] font-medium tracking-tight text-fg text-balance">
                  {p.statement}
                </p>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-mute md:text-base">
                  {p.gloss}
                </p>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
