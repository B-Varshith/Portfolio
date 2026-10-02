"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { GraduationCap, Briefcase, Brain, Trophy, GitPullRequest, Sparkles } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";
import { Counter } from "@/components/ui/Counter";
import { education, profile, githubSnapshot } from "@/data/profile";

const INTERESTS = [
  {
    id: "role",
    icon: Briefcase,
    title: "AI Developer Intern @ Dentsu",
    body: "Production applications for an internal Agentic AI platform: orchestration agents, streaming UIs and a RAG pipeline feeding LLM workflows. TypeScript, Python, Next.js, React, NestJS.",
    tag: "current",
  },
  {
    id: "edu",
    icon: GraduationCap,
    title: "B.Tech, Data Science & AI",
    body: `${education.schoolShort} · ${education.period}. ${education.note} Software and AI development run alongside coursework rather than after it.`,
    tag: "education",
  },
  {
    id: "ai",
    icon: Brain,
    title: "Agentic AI & LLM systems",
    body: "Agents that plan, call tools and keep memory — LangGraph orchestration, retrieval-augmented generation, provider failover and evaluations. More interested in systems that stay reliable than in demos.",
    tag: "focus",
  },
  {
    id: "cp",
    icon: Trophy,
    title: "Competitive programming",
    body: "Codeforces Expert at 1641, 470 accepted problems across 1,065 submissions. Greedy, DP, graphs and number theory — the part of the profile that keeps the rest honest.",
    tag: "discipline",
  },
  {
    id: "fs",
    icon: Sparkles,
    title: "Full-stack engineering",
    body: "Next.js and React on the front, Node/NestJS and FastAPI behind them, PostgreSQL, MongoDB and Redis underneath. Shipping complete products, not just endpoints.",
    tag: "craft",
  },
  {
    id: "oss",
    icon: GitPullRequest,
    title: "Open systems & tooling",
    body: "Job queues, query plan visualisers, CUDA range-query engines, networking primitives. Developer-facing tools are where curiosity turns into reusable work.",
    tag: "interest",
  },
];

const COUNTERS = [
  { to: 470, label: "problems accepted" },
  { to: 22, label: "rated contests" },
  { to: githubSnapshot.publicRepos, label: "public repositories" },
  { to: 1641, label: "peak Codeforces rating" },
];

export function About() {
  const [open, setOpen] = useState<string | null>("role");

  return (
    <section id="about" aria-label="About" className="relative py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-ink/60 to-transparent" />
      <div className="relative mx-auto max-w-6xl px-5 sm:px-6">
        <SectionHeader
          index="01"
          label="About"
          title={
            <>
              Student, competitive programmer, engineer —{" "}
              <span className="text-gradient">sometimes all three at once.</span>
            </>
          }
          description="A B.Tech Data Science & AI undergraduate at IIIT Dharwad who spends contest season on Codeforces and the rest of the time building AI-powered products."
        />

        {/* counters */}
        <Reveal className="mb-12 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-edge bg-edge md:grid-cols-4">
          {COUNTERS.map((c) => (
            <div key={c.label} className="bg-panel/80 p-5 sm:p-6">
              <p className="text-3xl font-medium tracking-tight text-fg sm:text-4xl">
                <Counter to={c.to} />
              </p>
              <p className="mt-2 font-mono text-[10px] tracking-[0.18em] text-mute uppercase">
                {c.label}
              </p>
            </div>
          ))}
        </Reveal>

        {/* identity cards */}
        <div className="grid gap-4 md:grid-cols-2">
          {INTERESTS.map((item, i) => {
            const Icon = item.icon;
            const isOpen = open === item.id;
            return (
              <Reveal key={item.id} delay={i * 0.05}>
                <motion.article
                  layout
                  className={`group h-full cursor-pointer overflow-hidden rounded-2xl border p-5 transition-colors duration-300 sm:p-6 ${
                    isOpen
                      ? "border-mint/40 bg-mint/[0.045]"
                      : "border-edge bg-panel/60 hover:border-edge-2"
                  }`}
                  onClick={() => setOpen(isOpen ? null : item.id)}
                >
                  <button
                    className="flex w-full items-start gap-4 text-left"
                    aria-expanded={isOpen}
                  >
                    <span
                      className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg border transition ${
                        isOpen
                          ? "border-mint/40 bg-mint/10 text-mint"
                          : "border-edge-2 bg-ink text-dim group-hover:text-mint"
                      }`}
                    >
                      <Icon className="h-4 w-4" aria-hidden />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-3">
                        <span className="text-base font-medium tracking-tight text-fg sm:text-lg">
                          {item.title}
                        </span>
                        <span className="rounded-full border border-edge-2 px-2 py-0.5 font-mono text-[9px] tracking-[0.16em] text-mute uppercase">
                          {item.tag}
                        </span>
                      </span>
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <p className="pt-4 pl-14 text-sm leading-relaxed text-dim">
                          {item.body}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.article>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.1} className="mt-10">
          <div className="rounded-2xl border border-edge bg-panel/50 p-5 sm:p-7">
            <p className="font-mono text-[11px] tracking-[0.24em] text-mute uppercase">
              coordinates
            </p>
            <dl className="mt-4 grid gap-x-8 gap-y-4 font-mono text-sm sm:grid-cols-2">
              {[
                ["name", profile.name],
                ["location", profile.location],
                ["education", `${education.degree}, ${education.schoolShort}`],
                ["period", education.period],
                ["handle", `github.com/${profile.githubHandle}`],
                ["codeforces", profile.codeforcesHandle],
              ].map(([k, v]) => (
                <div key={k} className="flex items-baseline gap-3 border-b border-edge/60 pb-2">
                  <dt className="w-24 shrink-0 text-mute">{k}</dt>
                  <dd className="text-dim">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
