/**
 * Single source of truth for identity + links.
 *
 * Every field below is traceable to a public source:
 *  - GitHub REST API  : https://api.github.com/users/B-Varshith
 *  - Codeforces API   : https://codeforces.com/api/user.info?handles=bvarshith_77
 *                      https://codeforces.com/api/user.rating?handle=bvarshith_77
 *                      https://codeforces.com/api/user.status?handle=bvarshith_77
 *  - LinkedIn public profile : linkedin.com/in/varshith-756519286
 *
 * Do not invent values here — if something can't be verified, leave it out.
 */

export const profile = {
  name: "Varshith",
  role: "Software Engineer",
  roles: ["Software Engineer", "AI Developer", "Competitive Programmer"],
  tagline: "Software Engineer • AI Developer • Competitive Programmer",
  intro:
    "Building scalable software, AI-powered systems, and developer-focused products.",
  location: "Dharwad, Karnataka, India",
  email: "bvarshith77@gmail.com",
  github: "https://github.com/B-Varshith",
  githubHandle: "B-Varshith",
  codeforces: "https://codeforces.com/profile/bvarshith_77",
  codeforcesHandle: "bvarshith_77",
  linkedin: "https://www.linkedin.com/in/varshith-756519286/",
  /** No shareable resume document was supplied — points at the LinkedIn profile instead. */
  resume: "https://www.linkedin.com/in/varshith-756519286/",
} as const;

export const education = {
  degree: "B.Tech — Data Science & Artificial Intelligence",
  school: "Indian Institute of Information Technology, Dharwad",
  schoolShort: "IIIT Dharwad",
  period: "2023 — 2027",
  note: "Undergraduate, class of 2027.",
} as const;

/** Snapshot taken from the GitHub REST API (public account). */
export const githubSnapshot = {
  publicRepos: 26,
  followers: 13,
  following: 60,
  accountCreated: "2024",
  company: "IIIT DHARWAD",
  location: "DHARWAD, KARNATAKA",
  /** Primary language of each *non-fork* public repository. */
  languageSpread: [
    { name: "JavaScript", repos: 6 },
    { name: "Python", repos: 5 },
    { name: "TypeScript", repos: 3 },
    { name: "HTML/CSS", repos: 3 },
    { name: "Java", repos: 2 },
    { name: "C / C++ / CUDA", repos: 3 },
  ],
} as const;

/**
 * High-level story used by the About + hero sections.
 * Ordered: student → competitive programmer → software engineer → AI developer.
 */
export const timelineHighlights = [
  { label: "Started B.Tech, Data Science & AI", year: "2023" },
  { label: "First public repositories on GitHub", year: "2024" },
  { label: "Registered on Codeforces", year: "2024" },
  { label: "Reached Codeforces Expert (1641)", year: "2026" },
  { label: "AI Developer Intern at Dentsu", year: "2026" },
] as const;
