import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { profile } from "@/data/profile";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://varshith.dev"),
  title: {
    default: `${profile.name} — Software Engineer · AI Developer · Competitive Programmer`,
    template: "%s — Varshith",
  },
  description:
    "Portfolio of Varshith, a software engineer and AI developer building agentic AI platforms, full-stack products and competitive programming systems. Solve the challenges to unlock it.",
  keywords: [
    "Varshith",
    "software engineer",
    "AI developer",
    "agentic AI",
    "RAG",
    "Codeforces Expert",
    "IIIT Dharwad",
    "Next.js",
    "TypeScript",
  ],
  authors: [{ name: profile.name, url: profile.github }],
  openGraph: {
    type: "website",
    title: `${profile.name} — Software Engineer · AI Developer`,
    description:
      "An interactive developer portfolio disguised as an investigation. Solve the puzzles to unlock the profile.",
    url: profile.github,
    siteName: "VARSHITH.OS",
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.name} — Software Engineer · AI Developer`,
    description:
      "An interactive developer portfolio disguised as an investigation. Solve the puzzles to unlock the profile.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#040406",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-void text-fg">
        {children}
      </body>
    </html>
  );
}
