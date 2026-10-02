"use client";

import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Loader2, Send, AlertTriangle } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";
import { GithubIcon, LinkedinIcon, MailIcon } from "@/components/ui/BrandIcons";
import { profile } from "@/data/profile";

/**
 * Contact form.
 *  · If NEXT_PUBLIC_CONTACT_ENDPOINT is set (Resend / Formspree / your own
 *    route handler), the payload is POSTed there as JSON.
 *  · Otherwise it falls back to a prefilled mailto: so the form works with
 *    zero backend — nothing is invented and nothing silently fails.
 */
const ENDPOINT = process.env.NEXT_PUBLIC_CONTACT_ENDPOINT;

type Status = "idle" | "sending" | "sent" | "error";

export function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");

    try {
      if (ENDPOINT) {
        const res = await fetch(ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error(String(res.status));
      } else {
        const subject = encodeURIComponent(`Portfolio contact — ${form.name}`);
        const body = encodeURIComponent(`${form.message}\n\n— ${form.name} (${form.email})`);
        window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
        await new Promise((r) => setTimeout(r, 400));
      }
      setStatus("sent");
      setForm({ name: "", email: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  const field =
    "w-full rounded-xl border border-edge bg-black/40 px-4 py-3 text-sm text-fg placeholder:text-mute transition focus:border-mint/50 focus:outline-none";

  return (
    <section id="contact" aria-label="Contact" className="relative py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 radial-fade" />
      <div className="relative mx-auto max-w-6xl px-5 sm:px-6">
        <SectionHeader
          index="10"
          label="Contact"
          title={<span className="text-gradient">Let&apos;s build something.</span>}
          description="Have an interesting project, opportunity, or idea? Let's talk."
        />

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          {/* links */}
          <Reveal className="flex flex-col gap-4">
            <div className="rounded-2xl border border-edge bg-panel/60 p-6">
              <p className="font-mono text-[11px] tracking-[0.24em] text-mute uppercase">
                direct channels
              </p>
              <div className="mt-5 space-y-3">
                {[
                  { icon: GithubIcon, label: "GitHub", value: `/${profile.githubHandle}`, href: profile.github },
                  { icon: LinkedinIcon, label: "LinkedIn", value: "/in/varshith-756519286", href: profile.linkedin },
                  { icon: MailIcon, label: "Email", value: profile.email, href: `mailto:${profile.email}` },
                ].map((c) => {
                  const Icon = c.icon;
                  return (
                    <a
                      key={c.label}
                      href={c.href}
                      target={c.href.startsWith("http") ? "_blank" : undefined}
                      rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="group flex items-center gap-4 rounded-xl border border-edge bg-ink px-4 py-3.5 transition hover:border-mint/40 hover:bg-mint/[0.05]"
                    >
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-edge-2 bg-panel text-dim transition group-hover:text-mint">
                        <Icon className="h-4 w-4" aria-hidden />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-mono text-[10px] tracking-[0.18em] text-mute uppercase">
                          {c.label}
                        </span>
                        <span className="block truncate text-sm text-fg">{c.value}</span>
                      </span>
                    </a>
                  );
                })}
              </div>
            </div>

            <div className="rounded-2xl border border-edge bg-panel/60 p-6">
              <p className="font-mono text-[11px] tracking-[0.24em] text-mute uppercase">
                currently
              </p>
              <p className="mt-3 text-sm leading-relaxed text-dim">
                AI Developer Intern at Dentsu, Bengaluru, and finishing a B.Tech in
                Data Science &amp; AI at IIIT Dharwad (2027). Open to interesting
                engineering conversations — especially anything involving agents,
                retrieval, or developer tooling.
              </p>
            </div>
          </Reveal>

          {/* form */}
          <Reveal delay={0.08}>
            <form
              onSubmit={onSubmit}
              className="rounded-2xl border border-edge bg-panel/60 p-6 sm:p-7"
              aria-label="Contact form"
            >
              <div className="mb-4 flex items-center justify-between">
                <p className="font-mono text-[11px] tracking-[0.24em] text-mute uppercase">
                  send a message
                </p>
                <span className="font-mono text-[10px] text-mute">
                  {ENDPOINT ? "api endpoint" : "mailto fallback"}
                </span>
              </div>

              <div className="space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-1.5 block font-mono text-[10px] tracking-[0.18em] text-mute uppercase">
                      name
                    </span>
                    <input
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Ada Lovelace"
                      className={field}
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block font-mono text-[10px] tracking-[0.18em] text-mute uppercase">
                      email
                    </span>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="you@company.com"
                      className={field}
                    />
                  </label>
                </div>

                <label className="block">
                  <span className="mb-1.5 block font-mono text-[10px] tracking-[0.18em] text-mute uppercase">
                    message
                  </span>
                  <textarea
                    required
                    rows={6}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="What are you building?"
                    className={`${field} resize-none`}
                  />
                </label>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-4">
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="inline-flex items-center gap-2 rounded-full bg-mint px-6 py-3 text-sm font-medium text-void transition hover:-translate-y-0.5 hover:shadow-[0_16px_44px_-18px_rgba(78,240,193,0.9)] disabled:opacity-60"
                >
                  {status === "sending" ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                      Sending…
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" aria-hidden />
                      Send message
                    </>
                  )}
                </button>

                <AnimatePresence>
                  {status === "sent" && (
                    <motion.span
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2 font-mono text-xs text-mint"
                    >
                      <Check className="h-4 w-4" aria-hidden />
                      Message queued — your mail client should be opening.
                    </motion.span>
                  )}
                  {status === "error" && (
                    <motion.span
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2 font-mono text-xs text-rose"
                    >
                      <AlertTriangle className="h-4 w-4" aria-hidden />
                      Something went wrong — email me directly instead.
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
