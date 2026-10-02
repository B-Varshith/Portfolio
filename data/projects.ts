/**
 * Curated projects — every entry maps to a real repository on
 * https://github.com/B-Varshith and every description is derived from that
 * repository's own README / GitHub description. Nothing here is invented.
 */

export type ProjectCategory =
  | "ai"
  | "fullstack"
  | "systems"
  | "data"
  | "tooling"
  | "competitive";

export interface Project {
  id: string;
  name: string;
  repo: string;
  url: string;
  demo?: string;
  category: ProjectCategory;
  featured: boolean;
  year: string;
  /** One-line hook shown on the card. */
  summary: string;
  /** Longer copy shown when a card expands. */
  detail: string;
  tech: string[];
  highlights: string[];
  /** Accent used for card glow / 3D panel tint. */
  accent: "mint" | "violet" | "amber" | "sky" | "rose";
}

export const categoryLabels: Record<ProjectCategory, string> = {
  ai: "AI / Agents",
  fullstack: "Full-Stack",
  systems: "Systems",
  data: "Data & ML",
  tooling: "Developer Tooling",
  competitive: "Competitive",
};

export const projects: Project[] = [
  {
    id: "finwise",
    name: "Personal Finance Assistant",
    repo: "B-Varshith/Personal-Finance-Assistance",
    url: "https://github.com/B-Varshith/Personal-Finance-Assistance",
    category: "ai",
    featured: true,
    year: "2026",
    accent: "mint",
    summary:
      "A local-first, full-stack finance workspace with a chat-first AI assistant and multi-agent reasoning.",
    detail:
      "Three-tier architecture: a React 18 + Vite client, an Express 5 + TypeScript API, and a Python FastAPI AI Core that runs LangGraph orchestration. Specialist agents (budgeting, debt, investing, education, synthesis) are routed by a master agent, with provider failover across Gemini → OpenRouter → Groq → Grok → Together → Mistral.",
    tech: [
      "React 18",
      "TypeScript",
      "Vite",
      "Express 5",
      "FastAPI",
      "LangGraph",
      "MongoDB",
      "Redis",
      "BullMQ",
      "Zustand",
      "Stripe",
    ],
    highlights: [
      "Multi-agent chat with per-domain specialist agents",
      "49 Mongoose models, 100+ REST endpoints, Zod validation",
      "File analysis: PDF, XLSX, DOCX, CSV + PaddleOCR for receipts",
      "Realtime updates over Server-Sent Events",
    ],
  },
  {
    id: "weather-agent",
    name: "Weather Advisory Agent",
    repo: "B-Varshith/Weather_App",
    url: "https://github.com/B-Varshith/Weather_App",
    category: "ai",
    featured: true,
    year: "2026",
    accent: "sky",
    summary:
      "Policy-driven LangGraph chatbot that turns live weather data into traceable, safety-focused advice.",
    detail:
      "Pulls live Open-Meteo data, evaluates configurable standard-operating-procedure policies deterministically, and returns recommendations with a reasoning trace. Handles conversational context, graceful failure paths and automated evaluations.",
    tech: ["Python", "LangGraph", "Open-Meteo", "LLM tool-calling", "pytest"],
    highlights: [
      "Deterministic policy evaluation layered on top of an LLM",
      "Full workflow trace returned with every recommendation",
      "Automated evaluation harness for answer quality",
    ],
  },
  {
    id: "meditrack",
    name: "MediTrack",
    repo: "B-Varshith/Medistock-Backend",
    url: "https://github.com/B-Varshith/Medistock-Backend",
    demo: "https://github.com/B-Varshith/Medistock-Frontend",
    category: "fullstack",
    featured: true,
    year: "2026",
    accent: "violet",
    summary:
      "Medical inventory platform — expiry alerts, billing and subscriptions, split across a Next.js client and a Node API.",
    detail:
      "The backend is Node.js + PostgreSQL + Prisma behind Docker, with AWS S3 for storage, JWT + OAuth for auth, medicines/expiry/billing domains and premium subscriptions. The frontend is a Next.js 16 + React 19 app styled with Tailwind CSS 4, animated with Framer Motion and talking to the API through Axios.",
    tech: [
      "Next.js 16",
      "React 19",
      "TypeScript",
      "Node.js",
      "PostgreSQL",
      "Prisma",
      "Docker",
      "AWS S3",
      "JWT",
      "OAuth",
    ],
    highlights: [
      "Expiry alerts and billing for medicine inventory",
      "Prisma-typed data layer over PostgreSQL",
      "Containerised, S3-backed file storage",
      "Companion repo: Medistock-Frontend",
    ],
  },
  {
    id: "queuectl",
    name: "QueueCTL",
    repo: "B-Varshith/QueueCTL",
    url: "https://github.com/B-Varshith/QueueCTL",
    category: "systems",
    featured: false,
    year: "2026",
    accent: "amber",
    summary:
      "CLI background-job queue with parallel workers, retries, backoff and a dead-letter queue.",
    detail:
      "A production-inspired job runner: persistent job storage, multiple worker processes executing in parallel, automatic retries using exponential backoff, a Dead Letter Queue for poisoned jobs and configurable execution policies — all driven from a single CLI.",
    tech: ["Python", "CLI", "Multiprocessing", "Backoff", "DLQ"],
    highlights: [
      "Persistent job store with worker pools",
      "Exponential backoff retries + dead-letter queue",
      "Configurable job execution policies",
    ],
  },
  {
    id: "sql-optimizer",
    name: "SQL Query Optimizer",
    repo: "B-Varshith/SQL-Query-optimzer",
    url: "https://github.com/B-Varshith/SQL-Query-optimzer",
    category: "tooling",
    featured: false,
    year: "2025",
    accent: "mint",
    summary:
      "Paste a query, get PostgreSQL's EXPLAIN ANALYZE plan back as an interactive tree with readable insights.",
    detail:
      "Runs the query against a connected PostgreSQL instance, receives the JSON execution plan and renders it as an interactive, collapsible tree — then extracts simple human-readable observations so developers can spot the expensive nodes without reading the raw plan.",
    tech: ["JavaScript", "PostgreSQL", "EXPLAIN ANALYZE", "Node.js"],
    highlights: [
      "JSON plan → interactive tree visualisation",
      "Plain-English insights over raw planner output",
      "Built for DBAs and application developers alike",
    ],
  },
  {
    id: "reliable-udp",
    name: "Reliable UDP",
    repo: "B-Varshith/Reliable_UDP_v2",
    url: "https://github.com/B-Varshith/Reliable_UDP_v2",
    category: "systems",
    featured: false,
    year: "2025",
    accent: "rose",
    summary:
      "Stop-and-wait ARQ implemented over raw UDP to make lossy transports behave reliably.",
    detail:
      "A small, focused networking project: reliable message exchange on top of UDP using the stop-and-wait protocol, so packets are acknowledged, lost ones are retransmitted and data loss is minimised on unreliable links.",
    tech: ["C", "UDP", "Sockets", "Stop-and-Wait ARQ"],
    highlights: [
      "Acknowledgement + retransmission over datagram sockets",
      "Sequence numbers and timeout handling",
      "Measured against raw, unreliable UDP",
    ],
  },
  {
    id: "gpu-segment-tree",
    name: "GPU Segment Tree",
    repo: "B-Varshith/Segment-Tree",
    url: "https://github.com/B-Varshith/Segment-Tree",
    category: "systems",
    featured: false,
    year: "2026",
    accent: "amber",
    summary:
      "CUDA-accelerated range-query engine with shared-memory and warp-level optimisations.",
    detail:
      "Implements a segment tree directly on the GPU for parallel range sum/min/max queries: parallel build, batched queries, shared memory tiling and warp-level primitives — benchmarked against both naive and optimised CPU implementations to show the real speed-up.",
    tech: ["CUDA", "C++", "Shared Memory", "Warp Primitives", "Benchmarking"],
    highlights: [
      "Parallel tree construction on device",
      "Batched range queries with warp-level optimisation",
      "Head-to-head benchmarks vs. optimised CPU code",
    ],
  },
  {
    id: "clause-boundary",
    name: "Clause Boundary Detection",
    repo: "B-Varshith/Clause-Boundary-Detection",
    url: "https://github.com/B-Varshith/Clause-Boundary-Detection",
    category: "data",
    featured: false,
    year: "2026",
    accent: "violet",
    summary:
      "One NLP pipeline, three approaches: rules, CRF and a BiLSTM with dual embeddings.",
    detail:
      "Detects clause boundaries in sentences using rule-based methods, Conditional Random Fields and a BiLSTM deep model with word + POS embeddings. All three emit standardised BIO tags so the approaches can be compared fairly on the same metric.",
    tech: ["Python", "CRF", "BiLSTM", "BIO Tagging", "NLP"],
    highlights: [
      "Rule-based baseline vs. statistical vs. neural models",
      "Word + part-of-speech embeddings",
      "Unified evaluation over standard BIO tagging",
    ],
  },
  {
    id: "patient-vitals",
    name: "Real-Time Patient Vitals Pipeline",
    repo: "B-Varshith/Patient-Vital-Monitoring",
    url: "https://github.com/B-Varshith/Patient-Vital-Monitoring",
    category: "data",
    featured: false,
    year: "2026",
    accent: "sky",
    summary: "Streaming pipeline for real-time patient vitals monitoring.",
    detail:
      "A Python project that ingests and monitors patient vitals in real time — the data-engineering side of the portfolio, sitting alongside the AI and full-stack work.",
    tech: ["Python", "Streaming", "Data Pipeline"],
    highlights: ["Real-time ingestion and monitoring", "Time-series vitals data"],
  },
  {
    id: "cp-archive",
    name: "Competitive Programming Archive",
    repo: "B-Varshith/CP",
    url: "https://github.com/B-Varshith/CP",
    category: "competitive",
    featured: false,
    year: "2025",
    accent: "mint",
    summary:
      "Templates and problem solutions in C++, written with fast I/O and STL best practices.",
    detail:
      "Contest-tested implementations of the algorithms he reaches for most, written in C++ with fast I/O and optimised approaches. The same templates that support 470 solved Codeforces problems.",
    tech: ["C++", "STL", "Algorithms", "Fast I/O"],
    highlights: [
      "Optimised implementations of core algorithms",
      "Used across live contests and practice",
      "Backs 470 accepted Codeforces problems",
    ],
  },
];

export const featuredProjects = projects.filter((p) => p.featured);
export const nonFeaturedProjects = projects.filter((p) => !p.featured);

export function projectsByCategory(category: ProjectCategory) {
  return projects.filter((p) => p.category === category);
}
