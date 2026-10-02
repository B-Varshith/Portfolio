import { SiteShell } from "@/components/SiteShell";
import { profile, education } from "@/data/profile";

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  alternateName: profile.githubHandle,
  jobTitle: profile.role,
  url: profile.github,
  email: `mailto:${profile.email}`,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Dharwad",
    addressRegion: "Karnataka",
    addressCountry: "IN",
  },
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: education.school,
  },
  sameAs: [profile.github, profile.linkedin, profile.codeforces],
  knowsAbout: [
    "Software Engineering",
    "Agentic AI",
    "Retrieval-Augmented Generation",
    "Full-Stack Development",
    "Competitive Programming",
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <SiteShell />
    </>
  );
}
