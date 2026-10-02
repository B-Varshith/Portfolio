"use client";

import { GameProvider, useGame } from "@/lib/game-context";
import { CustomCursor } from "@/components/cursor/CustomCursor";
import { GameShell } from "@/components/game/GameShell";
import { CommandPalette } from "@/components/command/CommandPalette";
import { EasterEggs } from "@/components/easter/EasterEggs";
import { Navbar } from "@/components/nav/Navbar";
import { Footer } from "@/components/footer/Footer";
import { Hero } from "@/components/portfolio/Hero";
import { About } from "@/components/portfolio/About";
import { Experience } from "@/components/portfolio/Experience";
import { Projects } from "@/components/portfolio/Projects";
import { Skills } from "@/components/portfolio/Skills";
import { AiSection } from "@/components/portfolio/AiSection";
import { Competitive } from "@/components/portfolio/Competitive";
import { GithubSection } from "@/components/portfolio/GithubSection";
import { Philosophy } from "@/components/portfolio/Philosophy";
import { Achievements } from "@/components/portfolio/Achievements";
import { Contact } from "@/components/portfolio/Contact";

/* If you're reading this, you're playing the game correctly. */

function Portfolio() {
  const { phase, hydrated } = useGame();
  const locked = hydrated && phase !== "done";

  return (
    <div
      inert={locked}
      aria-hidden={locked}
      className={locked ? "pointer-events-none select-none" : undefined}
    >
      <Navbar />
      <main>
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <AiSection />
        <Competitive />
        <GithubSection />
        <Philosophy />
        <Achievements />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export function SiteShell() {
  return (
    <GameProvider>
      <CustomCursor />
      <Portfolio />
      <GameShell />
      <CommandPalette />
      <EasterEggs />
    </GameProvider>
  );
}
