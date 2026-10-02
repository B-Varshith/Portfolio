"use client";

import { ArrowUpRight, BadgeCheck } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";
import { achievements } from "@/data/achievements";

const ACCENT: Record<string, string> = {
  mint: "#4ef0c1",
  violet: "#8b7cff",
  amber: "#ffc24b",
  sky: "#56ccff",
  rose: "#ff6b81",
};

export function Achievements() {
  return (
    <section id="achievements" aria-label="Achievements" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <SectionHeader
          index="09"
          label="Achievements"
          title={
            <>
              Verified only — <span className="text-gradient">every claim has a source.</span>
            </>
          }
          description="Nothing here is estimated. Each card names the API or profile it came from."
        />

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {achievements.map((a, i) => {
            const accent = ACCENT[a.accent];
            return (
              <Reveal key={a.id} delay={i * 0.06} as="li" className="h-full">
                  <a
                    href={a.href ?? "#"}
                    target={a.href ? "_blank" : undefined}
                    rel={a.href ? "noopener noreferrer" : undefined}
                    className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-edge bg-panel/60 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-edge-2"
                  >
                    <span
                      className="absolute -top-16 -right-10 h-32 w-32 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-30"
                      style={{ background: accent }}
                      aria-hidden
                    />

                    <div className="relative flex items-start justify-between gap-3">
                      <span
                        className="rounded-full border px-2.5 py-1 font-mono text-[10px] tracking-[0.16em] uppercase"
                        style={{ color: accent, borderColor: `${accent}55`, background: `${accent}12` }}
                      >
                        {a.source}
                      </span>
                      <BadgeCheck className="h-4 w-4 shrink-0 text-mute transition group-hover:text-mint" aria-hidden />
                    </div>

                    {a.metric && (
                      <p
                        className="relative mt-5 text-4xl font-semibold tracking-tight"
                        style={{ color: accent }}
                      >
                        {a.metric}
                      </p>
                    )}

                    <h3 className="relative mt-3 text-base font-medium tracking-tight text-fg">
                      {a.title}
                    </h3>
                    <p className="relative mt-2 flex-1 text-sm leading-relaxed text-dim">
                      {a.detail}
                    </p>

                    {a.href && (
                      <span className="relative mt-4 inline-flex items-center gap-1.5 font-mono text-[11px] tracking-widest text-mute uppercase transition group-hover:text-mint">
                        verify
                        <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                      </span>
                    )}
                  </a>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
