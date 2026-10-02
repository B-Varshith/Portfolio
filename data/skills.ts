/**
 * Skills — only technologies evidenced by the supplied profiles:
 * GitHub repositories, the Dentsu role on LinkedIn and Codeforces submissions.
 *
 * Levels describe *frequency of evidence*, not a self-assigned percentage:
 *   core     → primary tooling used repeatedly across shipped work
 *   strong   → used in real projects / production code
 *   exploring → present in project work but used less often
 */

export type SkillLevel = "core" | "strong" | "exploring";

export interface Skill {
  name: string;
  level: SkillLevel;
}

export interface SkillGroup {
  id: string;
  label: string;
  hint: string;
  items: Skill[];
}

export const levelLabels: Record<SkillLevel, string> = {
  core: "Frequently used",
  strong: "Working knowledge",
  exploring: "Exploring",
};

export const skillGroups: SkillGroup[] = [
  {
    id: "languages",
    label: "Languages",
    hint: "What the code actually gets written in.",
    items: [
      { name: "C++", level: "core" },
      { name: "TypeScript", level: "core" },
      { name: "Python", level: "core" },
      { name: "JavaScript", level: "strong" },
      { name: "C", level: "strong" },
      { name: "Java", level: "exploring" },
      { name: "SQL", level: "strong" },
      { name: "CUDA C++", level: "exploring" },
    ],
  },
  {
    id: "frontend",
    label: "Frontend",
    hint: "Interfaces that stay responsive under load.",
    items: [
      { name: "React", level: "core" },
      { name: "Next.js", level: "core" },
      { name: "TypeScript", level: "core" },
      { name: "Tailwind CSS", level: "strong" },
      { name: "Vite", level: "strong" },
      { name: "Framer Motion", level: "strong" },
      { name: "Zustand", level: "strong" },
      { name: "React Query", level: "strong" },
      { name: "Radix UI", level: "exploring" },
      { name: "Three.js", level: "exploring" },
    ],
  },
  {
    id: "backend",
    label: "Backend",
    hint: "APIs, services and the glue between agents and data.",
    items: [
      { name: "Node.js", level: "core" },
      { name: "NestJS", level: "core" },
      { name: "Express", level: "core" },
      { name: "FastAPI", level: "strong" },
      { name: "REST API design", level: "core" },
      { name: "Server-Sent Events", level: "strong" },
      { name: "JWT / OAuth", level: "strong" },
      { name: "BullMQ", level: "exploring" },
      { name: "Stripe", level: "exploring" },
    ],
  },
  {
    id: "data",
    label: "Databases",
    hint: "Relational, document, cache and vector stores.",
    items: [
      { name: "PostgreSQL", level: "strong" },
      { name: "MongoDB", level: "strong" },
      { name: "Prisma", level: "strong" },
      { name: "Redis", level: "strong" },
      { name: "Qdrant (vector)", level: "strong" },
      { name: "SQLite", level: "exploring" },
    ],
  },
  {
    id: "ai",
    label: "AI / ML",
    hint: "Agents, retrieval and applied machine learning.",
    items: [
      { name: "Agentic AI", level: "core" },
      { name: "LangGraph", level: "core" },
      { name: "RAG pipelines", level: "core" },
      { name: "LLM tool-calling", level: "strong" },
      { name: "Embeddings", level: "strong" },
      { name: "Gemini", level: "strong" },
      { name: "LangChain", level: "strong" },
      { name: "Multi-agent orchestration", level: "core" },
      { name: "NLP / sequence labelling", level: "exploring" },
      { name: "OCR (PaddleOCR)", level: "exploring" },
    ],
  },
  {
    id: "devops",
    label: "Cloud & DevOps",
    hint: "Shipping and running things.",
    items: [
      { name: "Docker", level: "strong" },
      { name: "AWS (S3)", level: "strong" },
      { name: "Linux", level: "strong" },
      { name: "Git", level: "core" },
      { name: "Logging & debugging", level: "strong" },
    ],
  },
  {
    id: "tools",
    label: "Tools",
    hint: "Daily drivers and testing tooling.",
    items: [
      { name: "Git / GitHub", level: "core" },
      { name: "Postman", level: "strong" },
      { name: "pytest", level: "strong" },
      { name: "Zod", level: "strong" },
      { name: "Jupyter Notebook", level: "exploring" },
      { name: "Pandas", level: "exploring" },
    ],
  },
  {
    id: "algorithms",
    label: "Algorithms",
    hint: "What 470 accepted Codeforces problems and 1,065 submissions look like.",
    items: [
      { name: "Greedy", level: "core" },
      { name: "Math", level: "core" },
      { name: "Dynamic programming", level: "strong" },
      { name: "Constructive algorithms", level: "strong" },
      { name: "Binary search", level: "strong" },
      { name: "Data structures", level: "strong" },
      { name: "Number theory", level: "strong" },
      { name: "Graphs", level: "strong" },
      { name: "Bitmasks", level: "strong" },
      { name: "Strings", level: "strong" },
    ],
  },
];
