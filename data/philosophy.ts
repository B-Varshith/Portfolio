/**
 * Engineering philosophy — design statements for the site, not literal quotes.
 * Kept in data so they stay easy to edit.
 */

export interface Principle {
  index: string;
  statement: string;
  gloss: string;
}

export const principles: Principle[] = [
  {
    index: "01",
    statement: "Build systems, not just features.",
    gloss: "A feature ends at the merge. A system keeps working when nobody is watching it.",
  },
  {
    index: "02",
    statement: "Understand the abstraction before using it.",
    gloss: "Frameworks are leverage. Knowing what they hide is what makes it leverage instead of debt.",
  },
  {
    index: "03",
    statement: "Performance is a feature.",
    gloss: "Latency, memory and bundle size are product decisions, not cleanup tickets.",
  },
  {
    index: "04",
    statement: "Debugging is reading, not guessing.",
    gloss: "The bug is already in the code path. Follow it instead of rewriting around it.",
  },
  {
    index: "05",
    statement: "Keep learning.",
    gloss: "Contests, side projects and production systems are all the same loop: try, fail, understand, repeat.",
  },
];
