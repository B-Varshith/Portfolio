"use client";

import { useState } from "react";
import { motion } from "motion/react";

const NODES: Record<string, { x: number; y: number; label: string }> = {
  A: { x: 70, y: 60, label: "A" },
  B: { x: 250, y: 60, label: "B" },
  C: { x: 430, y: 60, label: "C" },
  D: { x: 70, y: 210, label: "D" },
  E: { x: 250, y: 210, label: "E" },
  F: { x: 430, y: 210, label: "F" },
};

const EDGES: Array<[string, string]> = [
  ["A", "B"],
  ["B", "C"],
  ["A", "D"],
  ["B", "E"],
  ["C", "F"],
  ["D", "E"],
  ["E", "F"],
];

const adjacent = (a: string, b: string) =>
  EDGES.some(([x, y]) => (x === a && y === b) || (x === b && y === a));

interface Props {
  onSolve: () => void;
  onWrong: () => void;
  solved: boolean;
}

export function GraphPuzzle({ onSolve, onWrong, solved }: Props) {
  const [path, setPath] = useState<string[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [shake, setShake] = useState(0);

  const tap = (id: string) => {
    if (solved) return;
    setMessage(null);
    if (path.length === 0) {
      if (id !== "A") {
        setMessage("Every route in this level starts at A.");
        return;
      }
      setPath(["A"]);
      return;
    }
    const last = path[path.length - 1];
    if (id === last) return;
    if (path.length > 1 && id === path[path.length - 2]) {
      setPath(path.slice(0, -1));
      return;
    }
    if (path.includes(id)) {
      setPath([id]);
      return;
    }
    if (!adjacent(last, id)) {
      setMessage(`No edge from ${last} to ${id}.`);
      return;
    }
    setPath([...path, id]);
  };

  const submit = () => {
    const ok =
      path.length === 4 &&
      path[0] === "A" &&
      path[path.length - 1] === "F" &&
      path.every((n, i) => i === 0 || adjacent(path[i - 1], n));
    if (ok) {
      onSolve();
    } else {
      onWrong();
      setShake((s) => s + 1);
      setMessage(
        path.length === 0
          ? "Build a path first — start by clicking A."
          : "Not the shortest route. Aim for 3 hops.",
      );
    }
  };

  const clear = () => {
    setPath([]);
    setMessage(null);
  };

  const inPath = (id: string) => path.includes(id);

  return (
    <div className="rounded-2xl border border-edge bg-panel/70 p-4 sm:p-5">
      <svg
        viewBox="0 0 500 270"
        className="w-full"
        role="group"
        aria-label="Six node graph puzzle"
      >
        {EDGES.map(([a, b]) => {
          const used =
            path.some((n, i) => i > 0 && path[i - 1] === b && n === a) ||
            path.some((n, i) => i > 0 && path[i - 1] === a && n === b);
          return (
            <line
              key={`${a}-${b}`}
              x1={NODES[a].x}
              y1={NODES[a].y}
              x2={NODES[b].x}
              y2={NODES[b].y}
              stroke={used ? "#4ef0c1" : "#262c34"}
              strokeWidth={used ? 3 : 1.5}
              strokeLinecap="round"
            />
          );
        })}

        {Object.entries(NODES).map(([id, n]) => {
          const active = inPath(id);
          const isEnd = id === "F";
          return (
            <g
              key={id}
              onClick={() => tap(id)}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && tap(id)}
              role="button"
              tabIndex={0}
              aria-label={`node ${id}`}
              className="cursor-pointer outline-none"
            >
              <circle
                cx={n.x}
                cy={n.y}
                r={26}
                fill={active ? "#4ef0c1" : "#0b0d10"}
                stroke={active ? "#4ef0c1" : isEnd ? "#ffc24b" : "#262c34"}
                strokeWidth={2}
              />
              <text
                x={n.x}
                y={n.y + 6}
                textAnchor="middle"
                fontSize="18"
                fontWeight="700"
                fill={active ? "#040406" : "#9aa4b2"}
                fontFamily="monospace"
              >
                {n.label}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="font-mono text-xs text-dim">
          path:{" "}
          <span className="text-mint">{path.length ? path.join(" → ") : "—"}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={clear}
            className="rounded-lg border border-edge px-3 py-2 font-mono text-[11px] tracking-widest text-mute uppercase transition hover:border-rose/40 hover:text-rose"
          >
            clear
          </button>
          <motion.button
            key={shake}
            onClick={submit}
            animate={shake ? { x: [0, -7, 7, -5, 5, 0] } : undefined}
            transition={{ duration: 0.32 }}
            disabled={solved}
            className="rounded-lg bg-mint px-4 py-2 font-mono text-[11px] font-semibold tracking-widest text-void uppercase transition hover:brightness-110 disabled:opacity-50"
          >
            submit path
          </motion.button>
        </div>
      </div>

      {message && (
        <p className="mt-3 font-mono text-xs text-amber">{message}</p>
      )}
    </div>
  );
}
