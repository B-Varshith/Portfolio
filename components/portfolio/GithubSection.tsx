"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";
import Image from "next/image";
import { ArrowUpRight, GitFork, Star, Users, MapPin, BookMarked } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";
import { GithubIcon } from "@/components/ui/BrandIcons";
import { githubSnapshot, profile } from "@/data/profile";
import { useGithubActivity } from "@/hooks/useGithubActivity";

const MAX_LANG = Math.max(...githubSnapshot.languageSpread.map((l) => l.repos));

export function GithubSection() {
  const { status, buckets, events } = useGithubActivity();
  const barsRef = useRef<HTMLDivElement>(null);
  const barsInView = useInView(barsRef, { once: true, margin: "-12%" });
  const maxCount = Math.max(1, ...buckets.map((b) => b.count));

  return (
    <section id="github" aria-label="GitHub" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <SectionHeader
          index="07"
          label="GitHub"
          title={
            <>
              The evidence locker:{" "}
              <span className="text-gradient">{githubSnapshot.publicRepos} public repositories.</span>
            </>
          }
          description="A live pull from the public GitHub API — no tokens, no secrets, just the public event feed and account metadata."
        />

        <div className="grid gap-5 lg:grid-cols-[380px_minmax(0,1fr)]">
          {/* profile card */}
          <Reveal>
            <div className="relative overflow-hidden rounded-2xl border border-edge bg-panel/60 p-6">
              <div className="pointer-events-none absolute -top-20 -right-16 h-52 w-52 rounded-full bg-mint/10 blur-3xl" />
              <div className="relative flex items-start gap-4">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-edge-2">
                  <Image
                    src="https://avatars.githubusercontent.com/u/165387944?v=4"
                    alt={`${profile.githubHandle} avatar`}
                    width={64}
                    height={64}
                    className="h-full w-full object-cover"
                    priority={false}
                  />
                </div>
                <div className="min-w-0">
                  <p className="flex items-center gap-2 text-lg font-medium tracking-tight text-fg">
                    <GithubIcon className="h-4 w-4 text-mute" aria-hidden />
                    {profile.githubHandle}
                  </p>
                  <p className="font-mono text-[11px] text-mute">{githubSnapshot.company}</p>
                  <p className="mt-1 flex items-center gap-1.5 font-mono text-[11px] text-mute">
                    <MapPin className="h-3 w-3" aria-hidden />
                    {githubSnapshot.location}
                  </p>
                </div>
              </div>

              <dl className="relative mt-6 grid grid-cols-3 gap-3 border-t border-edge pt-5 text-center">
                {[
                  { icon: BookMarked, label: "repos", value: githubSnapshot.publicRepos },
                  { icon: Users, label: "followers", value: githubSnapshot.followers },
                  { icon: Star, label: "following", value: githubSnapshot.following },
                ].map((s) => {
                  const Icon = s.icon;
                  return (
                    <div key={s.label}>
                      <dt className="mb-1 flex items-center justify-center gap-1 font-mono text-[10px] tracking-[0.14em] text-mute uppercase">
                        <Icon className="h-3 w-3" aria-hidden />
                        {s.label}
                      </dt>
                      <dd className="text-xl font-medium text-fg">{s.value}</dd>
                    </div>
                  );
                })}
              </dl>

              <p className="relative mt-5 font-mono text-[11px] text-mute">
                public since {githubSnapshot.accountCreated} · {githubSnapshot.following} following
              </p>

              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                className="relative mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-fg px-5 py-3 text-sm font-medium text-void transition hover:-translate-y-0.5 hover:bg-mint"
              >
                View GitHub
                <ArrowUpRight className="h-4 w-4" aria-hidden />
              </a>
            </div>
          </Reveal>

          {/* activity */}
          <Reveal delay={0.08}>
            <div className="h-full rounded-2xl border border-edge bg-panel/60 p-6">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-mono text-[11px] tracking-[0.2em] text-fg uppercase">
                    contribution activity
                  </p>
                  <p className="font-mono text-[10px] text-mute">
                    public events · trailing 12 weeks
                  </p>
                </div>
                <span
                  className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase ${
                    status === "ready"
                      ? "border-mint/40 text-mint"
                      : status === "loading"
                        ? "border-edge-2 text-mute"
                        : "border-amber/40 text-amber"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      status === "ready"
                        ? "animate-pulse-soft bg-mint"
                        : status === "loading"
                          ? "bg-mute"
                          : "bg-amber"
                    }`}
                  />
                  {status === "ready"
                    ? "live"
                    : status === "loading"
                      ? "loading…"
                      : "offline — static view"}
                </span>
              </div>

              {status === "loading" && (
                <div className="flex h-24 items-end gap-1" aria-live="polite">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex-1 animate-pulse-soft rounded-sm bg-edge"
                      style={{ height: `${30 + ((i * 37) % 60)}%`, animationDelay: `${i * 90}ms` }}
                    />
                  ))}
                </div>
              )}

              {status !== "loading" && (
                <>
                  <div className="flex h-24 items-end gap-[3px]" aria-hidden>
                    {buckets.map((b, i) => (
                      <motion.span
                        key={b.date}
                        title={`${b.date}: ${b.count} event${b.count === 1 ? "" : "s"}`}
                        initial={{ height: 0 }}
                        whileInView={{ height: `${Math.max(4, (b.count / maxCount) * 100)}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: (i % 9) * 0.04 }}
                        className="flex-1 rounded-[2px]"
                        style={{
                          background:
                            b.count === 0
                              ? "#1a1e24"
                              : `rgba(78,240,193,${0.35 + (b.count / maxCount) * 0.6})`,
                        }}
                      />
                    ))}
                  </div>

                  <ul className="mt-5 space-y-2">
                    {(status === "ready" ? events.slice(0, 5) : []).map((e) => (
                      <li
                        key={e.id}
                        className="flex items-center gap-3 rounded-lg border border-edge bg-ink px-3 py-2 font-mono text-[11px]"
                      >
                        <span className="rounded bg-mint/10 px-1.5 py-0.5 text-[10px] text-mint">
                          {e.type.replace("Event", "")}
                        </span>
                        <span className="min-w-0 flex-1 truncate text-dim">{e.repo}</span>
                        <span className="shrink-0 text-mute">{e.date.slice(0, 10)}</span>
                      </li>
                    ))}

                    {status !== "ready" && (
                      <li className="rounded-lg border border-edge bg-ink px-3 py-4 text-center font-mono text-[11px] text-mute">
                        GitHub&apos;s public event feed is unavailable right now — account
                        statistics above are the last verified snapshot.
                      </li>
                    )}
                    {status === "ready" && events.length === 0 && (
                      <li className="rounded-lg border border-edge bg-ink px-3 py-4 text-center font-mono text-[11px] text-mute">
                        No public events in the last 90 days.
                      </li>
                    )}
                  </ul>
                </>
              )}
            </div>
          </Reveal>
        </div>

        {/* languages */}
        <Reveal delay={0.1} className="mt-5">
          <div ref={barsRef} className="rounded-2xl border border-edge bg-panel/60 p-6">
            <p className="mb-5 font-mono text-[11px] tracking-[0.2em] text-fg uppercase">
              primary language by repository
            </p>
            <div className="space-y-3.5">
              {githubSnapshot.languageSpread.map((l, i) => (
                <div key={l.name} className="flex items-center gap-4">
                  <span className="w-28 shrink-0 font-mono text-[11px] text-dim sm:w-36">
                    {l.name}
                  </span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-edge">
                    <motion.span
                      className="block h-full rounded-full bg-gradient-to-r from-mint to-violet"
                      initial={{ width: 0 }}
                      animate={barsInView ? { width: `${(l.repos / MAX_LANG) * 100}%` } : {}}
                      transition={{ duration: 0.9, delay: 0.1 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </div>
                  <span className="w-8 shrink-0 text-right font-mono text-[11px] text-mute">
                    {l.repos}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-5 border-t border-edge pt-4 font-mono text-[10px] text-mute">
              Counted from the primary language of each non-fork public repository.
              <GitFork className="ml-1.5 inline h-3 w-3" aria-hidden />
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
