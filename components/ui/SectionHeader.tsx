"use client";

import { Reveal } from "@/components/ui/Reveal";

interface SectionHeaderProps {
  index: string;
  label: string;
  title: React.ReactNode;
  description?: string;
  align?: "left" | "center";
}

export function SectionHeader({
  index,
  label,
  title,
  description,
  align = "left",
}: SectionHeaderProps) {
  const centered = align === "center";
  return (
    <Reveal
      className={`mb-12 flex flex-col gap-5 md:mb-16 ${
        centered ? "items-center text-center" : "items-start"
      }`}
    >
      <div className="flex items-center gap-3 font-mono text-[11px] tracking-[0.28em] text-mute uppercase">
        <span className="text-mint">{index}</span>
        <span aria-hidden className="h-px w-8 bg-edge-2" />
        <span>{label}</span>
      </div>

      <h2 className="max-w-3xl text-3xl leading-[1.08] font-medium tracking-tight text-fg text-balance sm:text-4xl md:text-5xl">
        {title}
      </h2>

      {description && (
        <p
          className={`max-w-2xl text-base leading-relaxed text-dim md:text-lg ${
            centered ? "mx-auto" : ""
          }`}
        >
          {description}
        </p>
      )}
    </Reveal>
  );
}
