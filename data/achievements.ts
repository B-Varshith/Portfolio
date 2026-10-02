/** Verified only — each item carries the source that proves it. */

export interface Achievement {
  id: string;
  title: string;
  detail: string;
  metric?: string;
  source: string;
  href?: string;
  accent: "mint" | "violet" | "amber" | "sky" | "rose";
}

export const achievements: Achievement[] = [
  {
    id: "cf-expert",
    title: "Codeforces Expert",
    detail: "Peak rating 1641, achieved at Codeforces Round 1071 (Div. 3).",
    metric: "1641",
    source: "Codeforces API",
    href: "https://codeforces.com/profile/bvarshith_77",
    accent: "mint",
  },
  {
    id: "cf-solved",
    title: "470 problems solved",
    detail: "470 distinct problems accepted across 1,065 submissions on Codeforces.",
    metric: "470",
    source: "Codeforces API",
    href: "https://codeforces.com/profile/bvarshith_77",
    accent: "sky",
  },
  {
    id: "cf-top500",
    title: "Top 500 finish",
    detail: "Ranked #495 in Codeforces Round 1071 (Div. 3).",
    metric: "#495",
    source: "Codeforces API",
    href: "https://codeforces.com/profile/bvarshith_77",
    accent: "violet",
  },
  {
    id: "dentsu",
    title: "AI Developer Intern @ Dentsu",
    detail:
      "Building production applications for an internal Agentic AI platform since July 2026.",
    source: "LinkedIn",
    href: "https://www.linkedin.com/in/varshith-756519286/",
    accent: "amber",
  },
  {
    id: "repos",
    title: "26 public repositories",
    detail:
      "Shipped across AI, full-stack, systems, NLP and competitive programming.",
    metric: "26",
    source: "GitHub API",
    href: "https://github.com/B-Varshith",
    accent: "rose",
  },
  {
    id: "postman",
    title: "Postman API Fundamentals Student Expert",
    detail: "Certified by Postman on API design fundamentals.",
    source: "LinkedIn certification",
    href: "https://api.badgr.io/public/assertions/Nyjq3pT8TVyND4Vsb_UftQ",
    accent: "mint",
  },
];
