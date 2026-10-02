"use client";

import { useReducedMotion } from "motion/react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";
import { LazyMount } from "@/components/three/LazyMount";
import { LazyNeuralNetwork } from "@/components/three/loader";

const NODES = ["LLM", "AGENTS", "TOOLS", "MEMORY", "RAG", "APIS", "DATA"];

const FOCUS = [
  {
    title: "Agentic workflows",
    body: "Orchestration agents that plan a task, invoke tools, pass context between stages and surface intermediate output — built in production at Dentsu and in the FinWise assistant.",
  },
  {
    title: "Retrieval that holds up",
    body: "Document processing, embeddings and semantic retrieval over Qdrant, with the retrieved context wired into real LLM calls instead of a demo notebook.",
  },
  {
    title: "Reliability over razzle",
    body: "Policy checks, deterministic evaluation, provider failover and traces. An agent is only useful if you can explain what it did.",
  },
  {
    title: "Developer tooling",
    body: "Streaming responses over SSE, typed contracts, CLI job queues and query-plan visualisers — the unglamorous layer that makes AI features shippable.",
  },
];

export function AiSection() {
  const reduce = useReducedMotion();

  return (
    <section id="ai" aria-label="Building with AI" className="relative py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-violet/[0.06] to-transparent" />
      <div className="relative mx-auto max-w-6xl px-5 sm:px-6">
        <SectionHeader
          index="05"
          label="Building with AI"
          title={
            <>
              Agents, retrieval and the <span className="text-gradient">systems around them.</span>
            </>
          }
          description="AI development is the current centre of gravity: agentic workflows, RAG pipelines, LLM applications — and the engineering discipline that keeps them dependable."
        />

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_440px]">
          {/* focus cards */}
          <div className="grid gap-4 sm:grid-cols-2">
            {FOCUS.map((f, i) => (
              <Reveal key={f.title} delay={i * 0.07}>
                <article className="group relative h-full overflow-hidden rounded-2xl border border-edge bg-panel/60 p-5 transition-colors hover:border-violet/40">
                  <span
                    className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    aria-hidden
                  />
                  <h3 className="text-base font-medium tracking-tight text-fg">{f.title}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-dim">{f.body}</p>
                </article>
              </Reveal>
            ))}
          </div>

          {/* neural network */}
          <Reveal delay={0.12}>
            <div className="relative h-full min-h-[420px] overflow-hidden rounded-2xl border border-edge bg-panel/50">
              <div className="pointer-events-none absolute inset-0 grid-bg-fine opacity-50" />
              <LazyMount
                className="absolute inset-0"
                fallback={
                  <div className="grid absolute inset-0 grid-cols-3 gap-3 p-6 opacity-60">
                    {NODES.slice(0, 6).map((n) => (
                      <span
                        key={n}
                        className="self-center rounded-lg border border-edge-2 bg-ink px-2 py-2 text-center font-mono text-[10px] text-mute"
                      >
                        {n}
                      </span>
                    ))}
                  </div>
                }
              >
                <LazyNeuralNetwork reduced={Boolean(reduce)} />
              </LazyMount>

              {/* legend lives in the DOM — no 3D font loading */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-void/95 via-void/70 to-transparent px-5 pt-14 pb-5">
                <p className="mb-3 font-mono text-[10px] tracking-[0.24em] text-mute uppercase">
                  agent topology
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {NODES.map((n) => (
                    <span
                      key={n}
                      className="rounded-md border border-edge-2 bg-ink/90 px-2 py-1 font-mono text-[10px] tracking-[0.14em] text-dim"
                    >
                      {n}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* proof strip */}
        <Reveal delay={0.1} className="mt-5">
          <div className="grid gap-px overflow-hidden rounded-2xl border border-edge bg-edge md:grid-cols-3">
            {[
              {
                k: "production",
                v: "Agentic AI platform @ Dentsu",
                d: "Orchestration agent, SSE streaming, RAG with Qdrant.",
              },
              {
                k: "shipped",
                v: "FinWise multi-agent finance core",
                d: "FastAPI + LangGraph specialist agents with provider failover.",
              },
              {
                k: "shipped",
                v: "Policy-driven weather agent",
                d: "LangGraph + live Open-Meteo data with deterministic policy checks.",
              },
            ].map((s) => (
              <div key={s.v} className="bg-panel/80 p-5">
                <p className="font-mono text-[10px] tracking-[0.2em] text-mint uppercase">
                  {s.k}
                </p>
                <p className="mt-2 text-sm font-medium text-fg">{s.v}</p>
                <p className="mt-1.5 text-sm text-mute">{s.d}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
