import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "outline" | "ghost" | "quiet";

interface ButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: Variant;
  className?: string;
  external?: boolean;
  type?: "button" | "submit";
  disabled?: boolean;
  ariaLabel?: string;
}

const base =
  "group/btn relative inline-flex items-center justify-center gap-2.5 rounded-full px-6 py-3 text-sm font-medium tracking-tight transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mint disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  primary:
    "bg-mint text-void shadow-[0_0_0_0_rgba(78,240,193,0)] hover:shadow-[0_10px_40px_-12px_rgba(78,240,193,0.65)] hover:-translate-y-0.5",
  outline:
    "border border-edge-2 bg-white/[0.02] text-fg hover:border-mint/45 hover:bg-mint/[0.06] hover:-translate-y-0.5",
  ghost: "text-dim hover:text-fg",
  quiet:
    "rounded-lg border border-edge bg-panel px-4 py-2 text-xs font-mono text-dim hover:border-mint/40 hover:text-fg",
};

export function Button({
  children,
  href,
  onClick,
  variant = "primary",
  className,
  external,
  type = "button",
  disabled,
  ariaLabel,
}: ButtonProps) {
  const cls = cn(base, variants[variant], className);

  if (href) {
    return (
      <a
        href={href}
        className={cls}
        aria-label={ariaLabel}
        {...(external
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
      >
        {children}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} className={cls} disabled={disabled} aria-label={ariaLabel}>
      {children}
    </button>
  );
}
