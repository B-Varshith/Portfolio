"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowUpRight,
  ExternalLink,
  Box,
  LayoutGrid,
  Sparkles,
} from "lucide-react";
import { GithubIcon } from "@/components/ui/BrandIcons";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";
import { Tilt } from "@/components/ui/Tilt";
import { LazyMount } from "@/components/three/LazyMount";
import { LazyProjectOrbit } from "@/components/three/loader";
import {
  categoryLabels,
  featuredProjects,
  nonFeaturedProjects,
  projects,
  type Project,
  type ProjectCategory,
} from "@/data/projects";

const ACCENT: Record<string, string> = {
  mint: "#4ef0c1",
  violet: "#8b7cff",
  amber: "#ffc24b",
  sky: "#56ccff",
  rose: "#ff6b81",
};

const FILTERS: Array<{ id: ProjectCategory | "all"; label: string }> = [
  { id: "all", label: "All" },
  { id: "ai", label: categoryLabels.ai },
  { id: "fullstack", label: categoryLabels.fullstack },
  { id: "systems", label: categoryLabels.systems },
  { id: "data", label: categoryLabels.data },
  { id: "tooling", label: categoryLabels.tooling },
  { id: "competitive", label: categoryLabels.competitive },
];

export function Projects() {
  const [filter, setFilter] = useState<ProjectCategory | "all">("all");
  const [orbit, setOrbit] = useState(false);
  const reduce = useReducedMotion();

  const visible = useMemo(() => {
    const list = filter === "all" ? nonFeaturedProjects : projects.filter((p) => p.category === filter);
    return list.filter((p) => filter !== "all" || !p.featured);
  }, [filter]);

  const orbitCards = useMemo(
    () =>
      projects.map((p) => ({
        id: p.id,
        name: p.name,
        category: categoryLabels[p.category],
        repo: p.repo,
        url: p.url,
        accent: p.accent,
      })),
    [],
  );

  return (
    <section id="projects" aria-label="Projects" className="relative py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-ink/50 to-transparent" />
      <div className="relative mx-auto max-w-6xl px-5 sm:px-6">
        <SectionHeader
          index="03"
          label="Projects"
          title={
            <>
              Selected work — <span className="text-gradient">shipped, not staged.</span>
            </>
          }
          description="Every project below maps to a public repository. Descriptions come from those repositories, not from a marketing department."
        />

        {/* ── featured ─────────────────────────────────────── */}
        <div className="space-y-6">
          {featuredProjects.map((p, i) => (
            <FeaturedCard key={p.id} project={p} flip={i % 2 === 1} />
          ))}
        </div>

        {/* ── 3D showcase ──────────────────────────────────── */}
        <Reveal className="mt-14">
          <div className="overflow-hidden rounded-2xl border border-edge bg-panel/50">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-edge px-5 py-4">
              <div className="flex items-center gap-2.5">
                <span className="grid h-7 w-7 place-items-center rounded-md border border-violet/40 bg-violet/10 text-violet">
                  <Box className="h-3.5 w-3.5" aria-hidden />
                </span>
                <div>
                  <p className="font-mono text-[11px] tracking-[0.2em] text-fg uppercase">
                    orbital showcase
                  </p>
                  <p className="font-mono text-[10px] text-mute">
                    {orbit ? "drag to rotate · click a panel to open" : "3D view is off — list fallback active"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setOrbit((o) => !o)}
                className="flex items-center gap-2 rounded-lg border border-edge bg-ink px-3 py-2 font-mono text-[11px] tracking-widest text-dim uppercase transition hover:border-violet/50 hover:text-fg"
              >
                {orbit ? <LayoutGrid className="h-3.5 w-3.5" aria-hidden /> : <Box className="h-3.5 w-3.5" aria-hidden />}
                {orbit ? "2D view" : "3D view"}
              </button>
            </div>

            <AnimatePresence initial={false} mode="wait">
              {orbit ? (
                <motion.div
                  key="orbit"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="relative h-[420px] w-full bg-[radial-gradient(120%_120%_at_50%_10%,rgba(78,240,193,0.07),transparent_60%)]"
                >
                  <LazyMount className="h-full w-full" fallback={<div className="grid-bg-fine h-full w-full" />}>
                    <LazyProjectOrbit cards={orbitCards} reduced={Boolean(reduce)} />
                  </LazyMount>
                  <p className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 font-mono text-[10px] tracking-[0.2em] text-mute uppercase">
                    nine repositories in orbit
                  </p>
                </motion.div>
              ) : (
                <motion.ul
                  key="list"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="divide-y divide-edge"
                >
                  {projects.map((p) => (
                    <li key={p.id}>
                      <a
                        href={p.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-4 px-5 py-3.5 transition hover:bg-white/[0.02]"
                      >
                        <span
                          className="h-1.5 w-1.5 shrink-0 rounded-full"
                          style={{ background: ACCENT[p.accent] }}
                          aria-hidden
                        />
                        <span className="min-w-0 flex-1 truncate font-mono text-[13px] text-dim">
                          {p.name}
                        </span>
                        <span className="hidden font-mono text-[10px] tracking-[0.16em] text-mute uppercase sm:inline">
                          {categoryLabels[p.category]}
                        </span>
                        <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-mute" aria-hidden />
                      </a>
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        </Reveal>

        {/* ── filter + grid ────────────────────────────────── */}
        <div className="mt-14 flex flex-wrap items-center gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`rounded-full border px-3.5 py-1.5 font-mono text-[11px] tracking-[0.14em] uppercase transition ${
                filter === f.id
                  ? "border-mint bg-mint/12 text-mint"
                  : "border-edge bg-panel/60 text-mute hover:border-edge-2 hover:text-dim"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <motion.ul
          layout
          className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {visible.map((p) => (
              <motion.li
                key={p.id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.3 }}
              >
                <ProjectCard project={p} />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>

        {visible.length === 0 && (
          <p className="mt-8 rounded-xl border border-edge bg-panel/50 p-6 text-center font-mono text-sm text-mute">
            No repositories in this category yet.
          </p>
        )}
      </div>
    </section>
  );
}

/* ───────────────────── featured showcase ───────────────────── */

function FeaturedCard({ project, flip }: { project: Project; flip: boolean }) {
  const accent = ACCENT[project.accent];
  return (
    <Reveal>
      <Tilt
        max={5}
        accent={`${accent}22`}
        className="group relative overflow-hidden rounded-3xl border border-edge bg-panel/60 transition-colors hover:border-edge-2"
      >
        <div
          className="pointer-events-none absolute -top-24 h-56 w-56 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: accent }}
          aria-hidden
        />

        <div
          className={`relative grid gap-0 md:grid-cols-2 ${flip ? "md:[direction:rtl]" : ""}`}
        >
          {/* copy */}
          <div className="p-6 sm:p-9 md:[direction:ltr]">
            <div className="mb-4 flex flex-wrap items-center gap-2.5">
              <span
                className="rounded-full border px-2.5 py-1 font-mono text-[10px] tracking-[0.18em] uppercase"
                style={{ color: accent, borderColor: `${accent}55`, background: `${accent}12` }}
              >
                {categoryLabels[project.category]}
              </span>
              <span className="rounded-full border border-edge-2 px-2.5 py-1 font-mono text-[10px] tracking-[0.18em] text-mute uppercase">
                {project.year}
              </span>
              <span className="flex items-center gap-1 font-mono text-[10px] tracking-[0.18em] text-amber uppercase">
                <Sparkles className="h-3 w-3" aria-hidden />
                featured
              </span>
            </div>

            <h3 className="text-2xl font-medium tracking-tight text-fg sm:text-3xl">
              {project.name}
            </h3>

            <p className="mt-3 text-sm leading-relaxed text-dim sm:text-base">
              {project.summary}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-mute">{project.detail}</p>

            <ul className="mt-5 space-y-2">
              {project.highlights.map((h) => (
                <li key={h} className="flex gap-3 text-[13px] leading-relaxed text-dim">
                  <span
                    className="mt-2 h-1 w-1 shrink-0 rounded-full"
                    style={{ background: accent }}
                    aria-hidden
                  />
                  {h}
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-wrap gap-1.5">
              {project.tech.slice(0, 8).map((t) => (
                <span
                  key={t}
                  className="rounded-md border border-edge-2 bg-ink px-2 py-1 font-mono text-[11px] text-dim transition hover:border-mint/40 hover:text-mint"
                >
                  {t}
                </span>
              ))}
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-edge-2 bg-ink px-4 py-2.5 text-sm text-fg transition hover:border-mint/50 hover:bg-mint/10"
              >
                <GithubIcon className="h-4 w-4" aria-hidden />
                Repository
              </a>
              {project.demo && (
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-edge-2 bg-ink px-4 py-2.5 text-sm text-fg transition hover:border-mint/50 hover:bg-mint/10"
                >
                  <ExternalLink className="h-4 w-4" aria-hidden />
                  Client repo
                </a>
              )}
            </div>
          </div>

          {/* visual */}
          <div
            className="relative min-h-[16rem] overflow-hidden border-t border-edge p-6 md:[direction:ltr] md:border-t-0 md:border-l"
            style={{
              background: `linear-gradient(150deg, ${accent}12, transparent 55%), #08090c`,
            }}
          >
            <div className="pointer-events-none absolute inset-0 grid-bg-fine opacity-70" />
            <div className="relative h-full">
              <div className="overflow-hidden rounded-xl border border-edge bg-black/60">
                <div className="flex items-center gap-2 border-b border-edge px-3 py-2">
                  <span className="h-2 w-2 rounded-full bg-rose/70" />
                  <span className="h-2 w-2 rounded-full bg-amber/70" />
                  <span className="h-2 w-2 rounded-full bg-mint/70" />
                  <span className="ml-2 truncate font-mono text-[10px] text-mute">
                    ~/repos/{project.repo.split("/")[1]}
                  </span>
                </div>
                <div className="space-y-2 p-4 font-mono text-[12px] leading-relaxed text-dim">
                  <p>
                    <span className="text-mint">$</span> git clone {project.url}
                  </p>
                  <p className="text-mute">Cloning into &apos;{project.repo.split("/")[1]}&apos;…</p>
                  <p>
                    <span className="text-mint">$</span>{" "}
                    <span className="text-fg">{project.tech[0]?.toLowerCase()}</span> .
                  </p>
                  <p style={{ color: accent }}>✓ {project.highlights[0]}</p>
                  <p className="text-mute">
                    {project.tech.length} technologies · {project.year}
                  </p>
                  <p>
                    <span className="text-mint">$</span>
                    <span className="ml-1 inline-block h-[1em] w-[0.5em] translate-y-[0.15em] animate-blink bg-mint" />
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {project.tech.map((t) => (
                  <span
                    key={t}
                    className="rounded-md border border-edge-2 bg-ink/80 px-2 py-1 font-mono text-[10px] text-mute"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Tilt>
    </Reveal>
  );
}

/* ───────────────────── standard card ───────────────────── */

function ProjectCard({ project }: { project: Project }) {
  const accent = ACCENT[project.accent];
  return (
    <Tilt
      max={9}
      accent={`${accent}26`}
      className="group relative h-full overflow-hidden rounded-2xl border border-edge bg-panel/60 transition-colors hover:border-edge-2"
    >
      <span
        className="absolute inset-x-0 top-0 h-px opacity-60"
        style={{ background: `linear-gradient(to right, transparent, ${accent}, transparent)` }}
        aria-hidden
      />

      <div className="relative flex h-full flex-col p-5">
        <div className="mb-3 flex items-start justify-between gap-3">
          <span
            className="rounded-full border px-2 py-0.5 font-mono text-[9px] tracking-[0.16em] uppercase"
            style={{ color: accent, borderColor: `${accent}55`, background: `${accent}12` }}
          >
            {categoryLabels[project.category]}
          </span>
          <span className="font-mono text-[10px] text-mute">{project.year}</span>
        </div>

        <h3 className="text-lg font-medium tracking-tight text-fg transition group-hover:text-white">
          {project.name}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-dim">{project.summary}</p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.tech.slice(0, 5).map((t, i) => (
            <motion.span
              key={t}
              initial={false}
              className="rounded-md border border-edge-2 bg-ink px-2 py-1 font-mono text-[10px] text-mute transition group-hover:border-mint/30 group-hover:text-dim"
              style={{ transitionDelay: `${i * 30}ms` }}
            >
              {t}
            </motion.span>
          ))}
          {project.tech.length > 5 && (
            <span className="rounded-md px-2 py-1 font-mono text-[10px] text-mute">
              +{project.tech.length - 5}
            </span>
          )}
        </div>

        <div className="mt-5 flex gap-2 opacity-0 transition-all duration-300 group-hover:opacity-100 group-focus-within:opacity-100">
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-edge-2 bg-ink px-3 py-2 text-xs text-fg transition hover:border-mint/50 hover:text-mint"
          >
            <GithubIcon className="h-3.5 w-3.5" aria-hidden />
            Code
          </a>
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-edge-2 bg-ink px-3 py-2 text-xs text-fg transition hover:border-mint/50 hover:text-mint"
            >
              <ExternalLink className="h-3.5 w-3.5" aria-hidden />
              More
            </a>
          )}
        </div>
      </div>
    </Tilt>
  );
}
