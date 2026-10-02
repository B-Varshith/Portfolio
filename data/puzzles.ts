/**
 * The challenge engine's data layer.
 *
 * A level is pure data: narrative, prompt, accepted answers, escalating hints
 * and the profile fragment it unlocks. Adding a new level means adding an
 * entry here (plus, for interactive puzzles, a `custom` renderer).
 */

export type LevelKind = "text" | "choice" | "custom";
export type CustomBody = "graph" | "agent" | "repos" | "timeline";

export interface Reward {
  title: string;
  /** Monospace "system" lines printed after the puzzle is solved. */
  lines: string[];
  /** Optional big stat shown above the lines, e.g. "1641". */
  stat?: string;
  statLabel?: string;
  link?: { label: string; href: string };
}

export interface Choice {
  id: string;
  label: string;
}

export interface Level {
  id: string;
  chip: string;
  kicker: string;
  title: string;
  brief: string[];
  /** Optional code window shown above the prompt. */
  code?: { language: string; source: string };
  prompt: string;
  kind: LevelKind;
  /** kind === "text": normalised answers that count as correct. */
  answers?: string[];
  /** kind === "choice": single-select options. */
  options?: Choice[];
  correctOption?: string;
  /** kind === "custom": which interactive body to render. */
  custom?: CustomBody;
  hints: string[];
  /** Shown when the level is solved or skipped. */
  solution: string;
  reward: Reward;
}

export const levels: Level[] = [
  {
    id: "identity",
    chip: "IDENTITY",
    kicker: "LEVEL 01",
    title: "Who am I?",
    brief: [
      "> boot portfolio.exe",
      "SYSTEM ONLINE",
      "Unknown developer detected.",
      "Name: ███████",
      "Role: ██████████████████",
      "Primary language: ███",
      "ACCESS DENIED — solve the first puzzle to continue.",
    ],
    code: {
      language: "cpp",
      source: `int x = 5;\nint y = 3;\n\nx = x ^ y;\ny = x ^ y;\nx = x ^ y;\n\nstd::cout << x << " " << y;`,
    },
    prompt: "What does this program print?",
    kind: "text",
    answers: ["3 5", "35", "3,5", "3  5"],
    hints: [
      "No temporary variable is ever declared. What is the code avoiding?",
      "XOR is its own inverse: a ^ a == 0 and a ^ 0 == a.",
      "After the third line the two values have traded places.",
    ],
    solution:
      "XOR swap: the values exchange without a temporary. Output is `3 5`.",
    reward: {
      title: "IDENTITY CONFIRMED",
      stat: "Varshith",
      statLabel: "developer identity",
      lines: [
        "Name .............. Varshith",
        "Role .............. Software Engineer · AI Developer",
        "Location .......... Dharwad, Karnataka, India",
        "Education ......... B.Tech Data Science & AI, IIIT Dharwad (2023—2027)",
        "Handle ............ github.com/B-Varshith",
      ],
      link: { label: "View GitHub", href: "https://github.com/B-Varshith" },
    },
  },
  {
    id: "code",
    chip: "CODE",
    kicker: "LEVEL 02",
    title: "The programmer",
    brief: [
      "> fragment recovered from developer memory",
      "MEMORY CORRUPTED — 2 blocks lost",
      "Recover the indices to restore the record.",
    ],
    code: {
      language: "cpp",
      source: `std::vector<int> a = {2, 7, 11, 15};\n// find two entries whose sum is 18\n// report their 0-based indices`,
    },
    prompt: "Which two 0-based indices sum to 18?",
    kind: "text",
    answers: ["1 2", "12", "1,2", "[1,2]", "2 1", "21", "2,1"],
    hints: [
      "Brute force works fine at n = 4 — but which pair actually reaches 18?",
      "2 + 7 = 9, 2 + 11 = 13, 2 + 15 = 17. Keep going.",
      "7 + 11 = 18.",
    ],
    solution: "a[1] + a[2] = 7 + 11 = 18 → indices 1 and 2.",
    reward: {
      title: "MEMORY RESTORED",
      lines: [
        "Developer: Varshith",
        "Known for:",
        "  · Competitive programming — 470 accepted Codeforces problems",
        "  · Software engineering — full-stack & backend systems",
        "  · AI development — agents, RAG and LLM workflows",
      ],
      link: {
        label: "Open the CP archive",
        href: "https://github.com/B-Varshith/CP",
      },
    },
  },
  {
    id: "graph",
    chip: "ALGORITHMS",
    kicker: "LEVEL 03",
    title: "Algorithm detective",
    brief: [
      "> map fragment recovered",
      "SIX NODES. SEVEN EDGES.",
      "Some nodes are hiding profile fragments.",
    ],
    prompt:
      "Find the shortest path from A to F — click the nodes to build your path, starting at A.",
    kind: "custom",
    custom: "graph",
    hints: [
      "Every edge costs the same, so count hops instead of weights.",
      "Breadth-first search expands one layer at a time — the answer is only 3 hops away.",
      "Three valid shortest paths exist: A→B→C→F, A→B→E→F and A→D→E→F.",
    ],
    solution:
      "Shortest path is 3 edges: A→B→C→F, A→B→E→F or A→D→E→F.",
    reward: {
      title: "PATH FOUND",
      lines: [
        "BFS / DFS / GRAPH SYSTEMS",
        "",
        "Interesting… you think in graphs.",
        "The developer does too:",
        "  · Graph traversal, greedy, DP and number theory",
        "  · 32 graph problems accepted on Codeforces",
        "  · Algorithms shipped into real systems, not just contests",
      ],
      link: {
        label: "View Codeforces",
        href: "https://codeforces.com/profile/bvarshith_77",
      },
    },
  },
  {
    id: "debug",
    chip: "DEBUG",
    kicker: "LEVEL 04",
    title: "Debug my code",
    brief: [
      "> crash dump incoming",
      "SIGSEGV: heap-buffer-overflow",
      "A production loop is reading past the end of the array.",
    ],
    code: {
      language: "cpp",
      source: `for (int i = 0; i <= arr.size(); i++) {\n    std::cout << arr[i] << std::endl;\n}`,
    },
    prompt: "What single change fixes the loop?",
    kind: "text",
    answers: [
      "iarrsize",
      "iarrsize1",
      "arrsizeminus1",
      "arrsize1",
      "offbyone",
      "changeto",
      "lessthan",
    ],
    hints: [
      "Valid indices run from 0 to size()-1 — what does the condition allow?",
      "`<=` grants one extra iteration, and that iteration indexes one past the end.",
      "Change `i <= arr.size()` to `i < arr.size()`.",
    ],
    solution:
      "`i <= arr.size()` should be `i < arr.size()` (or `i <= arr.size() - 1`). Off-by-one.",
    reward: {
      title: "BUG FIXED",
      stat: "470",
      statLabel: "problems accepted on Codeforces",
      lines: [
        "The developer spends a suspicious amount of time debugging.",
        "",
        "1,065 submissions · 474 accepted · 470 distinct problems",
        "Languages: C++ (primary), Python, Java",
        "Top tags: greedy 239 · math 215 · brute force 112 · DP 100",
      ],
      link: { label: "View profile", href: "https://codeforces.com/profile/bvarshith_77" },
    },
  },
  {
    id: "project",
    chip: "PROJECTS",
    kicker: "LEVEL 05",
    title: "The hidden project",
    brief: [
      "> scanning github://B-Varshith",
      "PROJECT_FRAGMENT_01 recovered",
      "01001100 — 01101101 — 01001101",
      "…payload still encoded.",
    ],
    prompt:
      "Decode the 8-bit ASCII payload. What project fragment is hidden here?",
    kind: "text",
    answers: [
      "personalfinance",
      "personal finance assistant",
      "finwise",
      "personal-finance-assistance",
      "finance",
    ],
    hints: [
      "Each group is exactly 8 bits — one byte, one character.",
      "`01000001` is 'A'. The high bits spell ASCII capitals.",
      "Read it as: 01010000 01000101 01010010 … → P E R S O N A L.",
    ],
    solution:
      "01010000… decodes to `PERSONAL FINANCE` — the FinWise repository.",
    reward: {
      title: "PROJECT IDENTIFIED",
      stat: "FinWise",
      statLabel: "AI / multi-agent finance platform",
      lines: [
        "ACCESSING PROJECT FILES…",
        "",
        "Personal Finance Assistant — a local-first, full-stack workspace:",
        "  React 18 + Vite client",
        "  Express 5 + TypeScript API (100+ endpoints, 49 models)",
        "  Python FastAPI AI Core with LangGraph orchestration",
        "  MongoDB · Redis · BullMQ · provider failover Gemini → OpenRouter → Groq",
      ],
      link: {
        label: "Open repository",
        href: "https://github.com/B-Varshith/Personal-Finance-Assistance",
      },
    },
  },
  {
    id: "ai",
    chip: "AI",
    kicker: "LEVEL 06",
    title: "Agent architecture",
    brief: [
      "> agent offline — pipeline degraded",
      "USER → AGENT → { MEMORY, TOOLS, LLM }",
      "Route each request to the component that should handle it.",
    ],
    prompt: "Complete all three routes to restore the workflow.",
    kind: "custom",
    custom: "agent",
    hints: [
      "MEMORY stores, TOOLS act on the outside world, LLM reasons.",
      "Anything that touches a database, an API or a file is a tool call.",
      "Recall of earlier turns belongs to memory — the model only sees the context window.",
    ],
    solution:
      "Database → TOOLS · reasoning → LLM · conversation recall → MEMORY.",
    reward: {
      title: "AGENT WORKFLOW RESTORED",
      lines: [
        "This mirrors real production work:",
        "",
        "Dentsu — AI Developer Intern",
        "  · Built an orchestration agent for the end-to-end Copilot workflow",
        "  · Tool invocation, context flow and intermediate outputs across stages",
        "  · SSE-based streaming of agent execution to the frontend",
        "  · RAG pipeline: document processing, embeddings, retrieval with Qdrant",
      ],
      link: {
        label: "See the experience",
        href: "#experience",
      },
    },
  },
  {
    id: "cp",
    chip: "CODEFORCES",
    kicker: "LEVEL 07",
    title: "Competitive programming archive",
    brief: [
      "> COMPETITIVE PROGRAMMING ARCHIVE",
      "Unknown contestant detected.",
      "Peak rating ██████ · title ███████",
      "Recover the contestant's identity.",
    ],
    prompt:
      "The contestant's peak rating is 1641. Written in binary, how many bits are set?",
    kind: "text",
    answers: ["6", "six", "0110", "110"],
    hints: [
      "Write 1641 in base 2 first — start from the largest power of two below it.",
      "1024 + 512 = 1536, leaving 105.",
      "64 + 32 + 8 + 1 = 105, so 1641 = 11001101001₂.",
    ],
    solution: "1641 = 11001101001₂ — six bits are set.",
    reward: {
      title: "CONTESTANT IDENTIFIED",
      stat: "1641",
      statLabel: "max rating · EXPERT",
      lines: [
        "Handle .......... bvarshith_77",
        "Rank ............ Expert (max rank: Expert)",
        "Rated contests .. 22",
        "Problems solved . 470",
        "Best finish ..... #495 — Codeforces Round 1071 (Div. 3)",
        "Registered ...... May 2024",
      ],
      link: {
        label: "View Codeforces profile",
        href: "https://codeforces.com/profile/bvarshith_77",
      },
    },
  },
  {
    id: "repos",
    chip: "GITHUB",
    kicker: "LEVEL 08",
    title: "Repository investigation",
    brief: [
      "> github://B-Varshith/repositories",
      "26 repositories found. 3 are referenced by the case file.",
      "Identify each one from its description.",
    ],
    prompt: "Solve all three clues to open the repository index.",
    kind: "custom",
    custom: "repos",
    hints: [
      "Read the descriptions — each clue quotes a real feature.",
      "Networking + UDP narrows it to exactly one systems repo.",
      "The finance agent is the only repo with specialist sub-agents.",
    ],
    solution:
      "Reliable_UDP_v2 (networking) · SQL-Query-optimzer (PostgreSQL plans) · Personal-Finance-Assistance (AI/RAG).",
    reward: {
      title: "REPOSITORY INDEX UNLOCKED",
      lines: [
        "Selected repositories:",
        "  Personal-Finance-Assistance ... AI · multi-agent · TypeScript/Python",
        "  Weather_App ................... LangGraph policy-driven agent",
        "  Medistock-Backend / Frontend .. Node · PostgreSQL · Next.js",
        "  QueueCTL ...................... CLI job queue, retries, DLQ",
        "  SQL-Query-optimzer ............ EXPLAIN ANALYZE visualiser",
        "  Reliable_UDP_v2 ............... stop-and-wait over UDP",
        "  Segment-Tree .................. CUDA range-query engine",
        "  Clause-Boundary-Detection ..... rules vs CRF vs BiLSTM",
      ],
      link: { label: "Browse all 26", href: "https://github.com/B-Varshith?tab=repositories" },
    },
  },
  {
    id: "timeline",
    chip: "EXPERIENCE",
    kicker: "LEVEL 09",
    title: "System logs",
    brief: [
      "> reading /var/log/varshith.log",
      "Timestamps redacted.",
      "Restore the chronological order of the developer's record.",
    ],
    prompt: "Arrange the log entries oldest → newest, then submit.",
    kind: "custom",
    custom: "timeline",
    hints: [
      "An account has to exist before anything can be pushed to it.",
      "The contest archive starts right after the account appears.",
      "Promotions and employment happen long after the first submissions.",
    ],
    solution:
      "Account (Mar 2024) → first Codeforces submission (May 2024) → Expert title (Dec 2025) → Dentsu AI platform (Jul 2026) → weather agent (Oct 2026).",
    reward: {
      title: "RECORD RESTORED",
      lines: [
        "EXPERIENCE UNLOCKED",
        "",
        "2023 — 2027  B.Tech Data Science & AI, IIIT Dharwad",
        "Jul 2026 —   AI Developer Intern @ Dentsu, Bengaluru",
        "             Agentic AI platform · orchestration agent · SSE · RAG/Qdrant",
        "             TypeScript · Python · Next.js · React · NestJS",
      ],
      link: {
        label: "See the full timeline",
        href: "#experience",
      },
    },
  },
];

export const TOTAL_LEVELS = levels.length;

export function levelIndex(id: string) {
  return levels.findIndex((l) => l.id === id);
}
