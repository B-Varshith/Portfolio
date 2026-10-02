"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowDown, ArrowUpRight, Terminal } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { GithubIcon } from "@/components/ui/BrandIcons";
import { LazyHeroCore } from "@/components/three/loader";
import { LazyMount } from "@/components/three/LazyMount";
import { profile } from "@/data/profile";
import { Magnetic } from "@/components/ui/Magnetic";

const WORDS = ["Hi,", "I'm", "Varshith."];

const STATS = [
  { value: "470", label: "CF problems solved" },
  { value: "1641", label: "Codeforces peak" },
  { value: "26", label: "public repos" },
  { value: "2027", label: "B.Tech, IIIT Dharwad" },
];

export function Hero() {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 600], [0, reduce ? 0 : 120]);
  const heroOpacity = useTransform(scrollY, [0, 520], [1, reduce ? 1 : 0]);

  return (
    <section
      id="home"
      aria-label="Introduction"
      className="relative flex min-h-[100svh] items-center overflow-hidden"
    >
      {/* backdrop */}
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-70" />
      <div className="pointer-events-none absolute inset-0 radial-fade" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-void to-transparent" />

      {/* 3D core */}
      <div className="pointer-events-none absolute top-1/2 right-[-8%] hidden h-[85vh] w-[55vw] max-w-[720px] -translate-y-1/2 opacity-90 md:block">
        <LazyMount
          className="h-full w-full"
          fallback={<div className="h-full w-full radial-fade" />}
          immediate
        >
          <LazyHeroCore reduced={Boolean(reduce)} />
        </LazyMount>
      </div>

      <motion.div
        style={{ y: heroY, opacity: heroOpacity }}
        className="relative z-10 mx-auto w-full max-w-6xl px-5 pt-32 pb-24 sm:px-6"
      >
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-7 flex items-center gap-3"
        >
          <span className="flex items-center gap-2 rounded-full border border-edge bg-panel/70 px-3 py-1.5 font-mono text-[10px] tracking-[0.24em] text-dim uppercase backdrop-blur">
            <span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-mint" />
            available for work
          </span>
          <span className="hidden font-mono text-[10px] tracking-[0.24em] text-mute uppercase sm:inline">
            {profile.location}
          </span>
        </motion.div>

        <h1 className="flex flex-wrap gap-x-5 gap-y-1 text-[clamp(2.75rem,9vw,7rem)] leading-[0.95] font-semibold tracking-tight">
          {WORDS.map((w, i) => (
            <motion.span
              key={w}
              initial={reduce ? false : { opacity: 0, y: 40, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{
                duration: 0.85,
                delay: 0.12 + i * 0.11,
                ease: [0.16, 1, 0.3, 1],
              }}
              className={i === 2 ? "text-gradient" : "text-fg"}
            >
              {w}
            </motion.span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.42 }}
          className="mt-6 max-w-xl font-mono text-xs tracking-[0.2em] text-mint uppercase sm:text-sm"
        >
          {profile.tagline}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.52 }}
          className="mt-5 max-w-lg text-lg leading-relaxed text-dim md:text-xl"
        >
          {profile.intro}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.62 }}
          className="mt-9 flex flex-wrap items-center gap-3"
        >
          <Magnetic>
            <Button
              href="#projects"
              ariaLabel="View projects"
            >
              <Terminal className="h-4 w-4" aria-hidden />
              View projects
            </Button>
          </Magnetic>
          <Magnetic strength={0.22}>
            <Button href={profile.github} external variant="outline" ariaLabel="GitHub profile">
              <GithubIcon className="h-4 w-4" aria-hidden />
              GitHub
            </Button>
          </Magnetic>
          <Magnetic strength={0.22}>
            <Button href="#contact" variant="outline">
              Contact me
              <ArrowUpRight className="h-4 w-4" aria-hidden />
            </Button>
          </Magnetic>
        </motion.div>

        {/* stats */}
        <motion.dl
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-14 grid max-w-2xl grid-cols-2 gap-x-6 gap-y-6 border-t border-edge pt-7 sm:grid-cols-4"
        >
          {STATS.map((s) => (
            <div key={s.label}>
              <dt className="sr-only">{s.label}</dt>
              <dd className="text-2xl font-medium tracking-tight text-fg">{s.value}</dd>
              <dd className="mt-1 font-mono text-[10px] tracking-[0.16em] text-mute uppercase">
                {s.label}
              </dd>
            </div>
          ))}
        </motion.dl>
      </motion.div>

      {/* scroll indicator */}
      <motion.a
        href="#about"
        aria-label="Scroll to about section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-7 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 text-mute transition hover:text-mint md:flex"
      >
        <span className="font-mono text-[9px] tracking-[0.3em] uppercase">scroll</span>
        <span className="flex h-9 w-5 items-start justify-center rounded-full border border-edge-2 p-1">
          <motion.span
            animate={reduce ? {} : { y: [0, 14, 0], opacity: [1, 0.2, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="h-1.5 w-1.5 rounded-full bg-mint"
          />
        </span>
        <ArrowDown className="h-3 w-3" aria-hidden />
      </motion.a>
    </section>
  );
}
