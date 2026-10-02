"use client";

import { ArrowUp } from "lucide-react";
import { GithubIcon, LinkedinIcon, CodeforcesIcon, MailIcon } from "@/components/ui/BrandIcons";
import { profile } from "@/data/profile";

const LINKS = [
  { icon: GithubIcon, label: "GitHub", href: profile.github },
  { icon: LinkedinIcon, label: "LinkedIn", href: profile.linkedin },
  { icon: CodeforcesIcon, label: "Codeforces", href: profile.codeforces },
  { icon: MailIcon, label: "Email", href: `mailto:${profile.email}` },
];

export function Footer() {
  return (
    <footer className="relative border-t border-edge">
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-6">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xl font-medium tracking-tight text-fg">{profile.name}</p>
            <p className="mt-1.5 font-mono text-[11px] tracking-[0.2em] text-mute uppercase">
              Software Engineer · AI Developer
            </p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-mute">
              Building scalable software, AI-powered systems and developer-focused
              products.
            </p>
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-x-10 gap-y-3 sm:flex sm:gap-8">
            {LINKS.map((l) => {
              const Icon = l.icon;
              return (
                <a
                  key={l.label}
                  href={l.href}
                  target={l.href.startsWith("http") ? "_blank" : undefined}
                  rel={l.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="group flex items-center gap-2 text-sm text-dim transition hover:text-mint"
                >
                  <Icon className="h-4 w-4 text-mute transition group-hover:text-mint" aria-hidden />
                  {l.label}
                </a>
              );
            })}
          </nav>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-edge pt-6 sm:flex-row sm:items-center">
          <p className="font-mono text-[11px] text-mute">
            Built with Next.js, React &amp; Three.js
          </p>
          <div className="flex items-center gap-5">
            <span className="font-mono text-[11px] text-mute/70">
              © {new Date().getFullYear()} {profile.name}
            </span>
            <a
              href="#home"
              className="flex items-center gap-1.5 font-mono text-[11px] tracking-widest text-mute uppercase transition hover:text-mint"
            >
              top
              <ArrowUp className="h-3.5 w-3.5" aria-hidden />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
