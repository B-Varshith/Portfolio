/**
 * Work + education history.
 *
 * Source: public LinkedIn profile (linkedin.com/in/varshith-756519286)
 * and GitHub account metadata. Dates are quoted exactly as published.
 */

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  period: string;
  location: string;
  kind: "work" | "education";
  summary: string;
  bullets: string[];
  tech: string[];
}

export const experiences: ExperienceItem[] = [
  {
    id: "dentsu",
    company: "Dentsu",
    role: "AI Developer Intern",
    period: "Jul 2026 — Present",
    location: "Bengaluru, Karnataka, India",
    kind: "work",
    summary:
      "Building production applications for an internal Agentic AI platform — orchestration agents, streaming UIs and a RAG pipeline feeding real LLM workflows.",
    bullets: [
      "Developed production applications for an internal Agentic AI platform using TypeScript, Python, Next.js, React and NestJS, building scalable backend services and business logic.",
      "Designed and implemented REST APIs, authentication, request validation, error handling and data flows for AI-powered enterprise applications.",
      "Built an orchestration agent for the end-to-end Copilot workflow — coordinating agent execution, tool invocation, context flow and intermediate outputs across the pipeline.",
      "Built Server-Sent Events based real-time communication to stream agent execution and intermediate outputs to the frontend.",
      "Developed a RAG pipeline using document processing, embeddings, semantic retrieval and Qdrant, integrating retrieved context into production LLM workflows.",
      "Worked with Docker, Git, REST APIs, databases, Linux, logging and debugging to develop, deploy and troubleshoot production applications.",
    ],
    tech: [
      "TypeScript",
      "Python",
      "Next.js",
      "React",
      "NestJS",
      "REST APIs",
      "SSE",
      "RAG",
      "Qdrant",
      "Embeddings",
      "Docker",
      "Linux",
    ],
  },
  {
    id: "iiit-dharwad",
    company: "IIIT Dharwad",
    role: "B.Tech — Data Science & Artificial Intelligence",
    period: "2023 — 2027",
    location: "Dharwad, Karnataka, India",
    kind: "education",
    summary:
      "Undergraduate in Data Science & AI, with competitive programming and full-stack/AI engineering running in parallel.",
    bullets: [
      "B.Tech in Data Science & Artificial Intelligence, class of 2027.",
      "Focused on software engineering, backend systems and AI development outside the classroom.",
      "Active on Codeforces and CodeChef alongside course work.",
    ],
    tech: ["Data Science", "Artificial Intelligence", "DSA", "Software Engineering"],
  },
];
