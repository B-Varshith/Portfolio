"use client";

import { useEffect, useState } from "react";

export interface GhEvent {
  id: string;
  type: string;
  repo: string;
  date: string;
}

export interface GhActivity {
  status: "loading" | "ready" | "error";
  /** Daily event counts for the trailing 84 days. */
  buckets: Array<{ date: string; count: number }>;
  events: GhEvent[];
}

const API = "https://api.github.com/users/B-Varshith/events/public?per_page=100";

/**
 * Reads the *public* GitHub event feed (no token, no secrets).
 * Everything degrades to a static view if the request fails or is rate-limited.
 */
export function useGithubActivity(): GhActivity {
  const [state, setState] = useState<GhActivity>({
    status: "loading",
    buckets: [],
    events: [],
  });

  useEffect(() => {
    const controller = new AbortController();

    const run = async () => {
      try {
        const res = await fetch(API, {
          signal: controller.signal,
          headers: { Accept: "application/vnd.github+json" },
        });
        if (!res.ok) throw new Error(String(res.status));
        const data = (await res.json()) as Array<{
          id: string;
          type: string;
          repo: { name: string };
          created_at: string;
        }>;

        const days = 12;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const buckets = Array.from({ length: days * 7 }, (_, i) => {
          const d = new Date(today);
          d.setDate(today.getDate() - (days * 7 - 1 - i));
          return { date: d.toISOString().slice(0, 10), count: 0 };
        });
        const index = new Map(buckets.map((b, i) => [b.date, i]));

        const events: GhEvent[] = data.map((e) => ({
          id: e.id,
          type: e.type,
          repo: e.repo.name,
          date: e.created_at,
        }));

        for (const e of data) {
          const key = e.created_at.slice(0, 10);
          const i = index.get(key);
          if (i !== undefined) buckets[i].count += 1;
        }

        setState({ status: "ready", buckets, events });
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        setState({ status: "error", buckets: [], events: [] });
      }
    };

    run();
    return () => controller.abort();
  }, []);

  return state;
}
