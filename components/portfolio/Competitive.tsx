"use client";

import { useMemo, useState } from "react";
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { Trophy, ArrowUpRight, Target, Flame } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";
import {
  cfContests,
  cfHandle,
  cfMaxRating,
  cfMaxRank,
  cfProfileUrl,
  cfRank,
  cfRating,
  cfStats,
} from "@/data/codeforces";

const W = 900;
const H = 340;
const PAD = { top: 28, right: 24, bottom: 44, left: 52 };

const BANDS = [
  { from: 1900, color: "#b06bff", label: "specialist+ 1900" },
  { from: 1600, color: "#56ccff", label: "expert 1600" },
  { from: 1400, color: "#4ef0c1", label: "1400" },
  { from: 1200, color: "#8bd450", label: "1200" },
];

function bandColor(rating: number) {
  if (rating >= 1900) return "#b06bff";
  if (rating >= 1600) return "#56ccff";
  if (rating >= 1400) return "#4ef0c1";
  if (rating >= 1200) return "#8bd450";
  return "#9aa4b2";
}

const STATS = [
  { icon: Trophy, label: "current / max", value: `${cfRating}`, sub: `max ${cfMaxRating}` },
  { icon: Target, label: "rank", value: cfRank.toUpperCase(), sub: `max ${cfMaxRank.toUpperCase()}` },
  { icon: Flame, label: "problems solved", value: `${cfStats.problemsSolved}`, sub: `${cfStats.submissions} submissions` },
  { icon: Target, label: "best finish", value: `#${cfStats.bestRank}`, sub: `${cfStats.contests} rated contests` },
];

export function Competitive() {
  const chartRef = useRef<HTMLDivElement>(null);
  const inView = useInView(chartRef, { once: true, margin: "-15%" });
  const [hover, setHover] = useState<number | null>(null);

  const geometry = useMemo(() => {
    if (cfContests.length < 2) return null;
    const ratings = cfContests.map((c) => c.to);
    const min = Math.min(...ratings, 0) - 80;
    const max = Math.max(...ratings) + 80;
    const innerW = W - PAD.left - PAD.right;
    const innerH = H - PAD.top - PAD.bottom;

    const x = (i: number) => PAD.left + (i / (cfContests.length - 1)) * innerW;
    const y = (r: number) => PAD.top + (1 - (r - min) / (max - min)) * innerH;

    const line = cfContests.map((c, i) => `${i === 0 ? "M" : "L"} ${x(i)} ${y(c.to)}`).join(" ");
    const area = `${line} L ${x(cfContests.length - 1)} ${PAD.top + innerH} L ${x(0)} ${PAD.top + innerH} Z`;

    return { x, y, line, area, min, max, innerH };
  }, []);

  if (!geometry) {
    return (
      <section id="competitive" className="py-24">
        <div className="mx-auto max-w-6xl px-5">
          <p className="rounded-xl border border-edge bg-panel p-6 text-center font-mono text-sm text-mute">
            No contest history to display yet.
          </p>
        </div>
      </section>
    );
  }

  const { x, y, line, area, min, max } = geometry;
  const active = hover !== null ? cfContests[hover] : null;

  return (
    <section id="competitive" aria-label="Competitive programming" className="relative py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-ink/60 to-transparent" />
      <div className="relative mx-auto max-w-6xl px-5 sm:px-6">
        <SectionHeader
          index="06"
          label="Competitive Programming"
          title={
            <>
              Twenty-two contests, one <span className="text-gradient">Expert title.</span>
            </>
          }
          description="Competitive programming is one part of the profile, not the whole of it — but it is where the algorithms in the production work were learned."
        />

        {/* stat strip */}
        <div className="mb-8 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-edge bg-edge lg:grid-cols-4">
          {STATS.map((s, i) => {
            const Icon = s.icon;
            return (
              <Reveal key={s.label} delay={i * 0.06}>
                <div className="h-full bg-panel/80 p-5">
                  <div className="mb-3 flex items-center gap-2 font-mono text-[10px] tracking-[0.18em] text-mute uppercase">
                    <Icon className="h-3.5 w-3.5 text-mint" aria-hidden />
                    {s.label}
                  </div>
                  <p
                    className="text-3xl font-medium tracking-tight"
                    style={{ color: i === 1 ? bandColor(cfRating) : undefined }}
                  >
                    {s.value}
                  </p>
                  <p className="mt-1 font-mono text-[11px] text-dim">{s.sub}</p>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* chart */}
        <Reveal>
          <div
            ref={chartRef}
            className="relative overflow-hidden rounded-2xl border border-edge bg-panel/50 p-4 sm:p-6"
          >
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-mono text-[11px] tracking-[0.2em] text-fg uppercase">
                  rating progression
                </p>
                <p className="font-mono text-[10px] text-mute">
                  @{cfHandle} · {cfContests.length} rated contests · {cfContests[0]?.date} →{" "}
                  {cfContests[cfContests.length - 1]?.date}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {active && (
                  <motion.span
                    key={active.date + active.name}
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-md border border-edge-2 bg-ink px-3 py-1.5 font-mono text-[11px] text-dim"
                  >
                    {active.name} · #{active.rank} ·{" "}
                    <span style={{ color: bandColor(active.to) }}>
                      {active.from} → {active.to}
                    </span>
                  </motion.span>
                )}
                <a
                  href={cfProfileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-md border border-edge-2 bg-ink px-3 py-1.5 font-mono text-[11px] text-dim transition hover:border-mint/50 hover:text-mint"
                >
                  View Codeforces
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                </a>
              </div>
            </div>

            <div className="overflow-x-auto">
              <svg
                viewBox={`0 0 ${W} ${H}`}
                className="h-auto w-full min-w-[640px]"
                role="img"
                aria-label={`Codeforces rating climbing from ${cfContests[0]?.to} to ${cfRating}`}
              >
                <defs>
                  <linearGradient id="cf-area" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4ef0c1" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#4ef0c1" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* band guides */}
                {BANDS.filter((b) => b.from > min && b.from < max).map((b) => (
                  <g key={b.from}>
                    <line
                      x1={PAD.left}
                      x2={W - PAD.right}
                      y1={y(b.from)}
                      y2={y(b.from)}
                      stroke={b.color}
                      strokeOpacity="0.22"
                      strokeDasharray="4 6"
                    />
                    <text
                      x={PAD.left - 8}
                      y={y(b.from) + 3.5}
                      textAnchor="end"
                      fontSize="10"
                      fontFamily="monospace"
                      fill={b.color}
                      fillOpacity="0.6"
                    >
                      {b.from}
                    </text>
                  </g>
                ))}

                {/* x axis labels (first / middle / last) */}
                {[0, Math.floor(cfContests.length / 2), cfContests.length - 1].map((i) => (
                  <text
                    key={i}
                    x={x(i)}
                    y={H - 16}
                    textAnchor="middle"
                    fontSize="10"
                    fontFamily="monospace"
                    fill="#6b7280"
                  >
                    {cfContests[i]?.date.slice(0, 7)}
                  </text>
                ))}

                <motion.path
                  d={area}
                  fill="url(#cf-area)"
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ duration: 1, delay: 0.5 }}
                />

                <motion.path
                  d={line}
                  fill="none"
                  stroke="#4ef0c1"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={inView ? { pathLength: 1 } : { pathLength: 0 }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                />

                {cfContests.map((c, i) => (
                  <g key={`${c.date}-${i}`}>
                    <rect
                      x={x(i) - 8}
                      y={PAD.top}
                      width={16}
                      height={H - PAD.top - PAD.bottom}
                      fill="transparent"
                      onMouseEnter={() => setHover(i)}
                      onMouseLeave={() => setHover((h) => (h === i ? null : h))}
                    />
                    <motion.circle
                      cx={x(i)}
                      cy={y(c.to)}
                      r={hover === i ? 5.5 : 3}
                      fill={bandColor(c.to)}
                      stroke="#040406"
                      strokeWidth="1.5"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
                      transition={{ duration: 0.3, delay: 0.6 + i * 0.045 }}
                      style={{ transition: "r .15s" }}
                    />
                  </g>
                ))}

                {/* peak marker */}
                <motion.g
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ delay: 2.1 }}
                >
                  <circle
                    cx={x(cfContests.length - 1)}
                    cy={y(cfMaxRating)}
                    r="7"
                    fill="none"
                    stroke="#56ccff"
                    strokeOpacity="0.7"
                  />
                  <text
                    x={x(cfContests.length - 1) - 12}
                    y={y(cfMaxRating) - 14}
                    textAnchor="end"
                    fontSize="12"
                    fontFamily="monospace"
                    fill="#56ccff"
                  >
                    {cfMaxRating} · {cfMaxRank.toUpperCase()}
                  </text>
                </motion.g>
              </svg>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-edge pt-4 font-mono text-[10px] tracking-[0.14em] text-mute uppercase">
              <span className="text-dim">top tags</span>
              {cfStats.topTags.slice(0, 8).map((t) => (
                <span key={t.tag}>
                  {t.tag} <span className="text-mint">{t.count}</span>
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
