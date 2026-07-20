"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { GuestbookEntry, SiteSettings } from "@/types";
import { Reveal } from "@/components/ui/Reveal";
import { MagneticButton } from "@/components/ui/MagneticButton";

export function ContactExperience({
  site,
  guestbook,
}: {
  site: SiteSettings;
  guestbook: GuestbookEntry[];
}) {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [entries, setEntries] = useState<GuestbookEntry[]>(guestbook);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("satyam-guestbook");
      if (raw) setEntries(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  const channels = useMemo(
    () => [
      { label: "Email", value: site.email, href: `mailto:${site.email}` },
      { label: "GitHub", value: "Profile", href: site.social.github },
      { label: "LinkedIn", value: "Connect", href: site.social.linkedin },
      { label: "Twitter", value: "Follow", href: site.social.twitter },
    ],
    [site],
  );

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    const entry: GuestbookEntry = {
      id: `local-${Date.now()}`,
      name: name.trim(),
      message: message.trim(),
      date: new Date().toISOString().slice(0, 10),
    };
    const next = [entry, ...entries].slice(0, 40);
    setEntries(next);
    localStorage.setItem("satyam-guestbook", JSON.stringify(next));
    setName("");
    setMessage("");
  };

  return (
    <div className="mx-auto max-w-6xl px-6 pb-28">
      <Reveal>
        <p className="font-mono text-[11px] tracking-[0.35em] text-text-muted uppercase">
          Contact
        </p>
        <h1 className="font-display mt-6 max-w-3xl text-5xl text-text md:text-7xl">
          Let’s build something calm.
        </h1>
        <p className="mt-6 max-w-xl text-lg text-text-muted">
          {site.availability}. Based in {site.city}, {site.location}.
        </p>
      </Reveal>

      <div className="mt-20 grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <Reveal>
          <div className="space-y-6">
            {channels.map((c, i) => (
              <a
                key={c.label}
                href={c.href}
                className="group flex items-end justify-between border-b border-border pb-4"
              >
                <div>
                  <p className="font-mono text-[10px] tracking-widest text-text-muted uppercase">
                    0{i + 1} · {c.label}
                  </p>
                  <p className="font-display mt-2 text-3xl text-text transition group-hover:text-accent">
                    {c.value}
                  </p>
                </div>
                <span className="text-text-muted transition group-hover:translate-x-1 group-hover:text-accent">
                  →
                </span>
              </a>
            ))}
            <a
              href={site.resumeUrl}
              className="inline-flex pt-4"
              download
            >
              <MagneticButton className="rounded-full border border-border px-5 py-2.5 text-sm text-text hover:border-border-strong">
                Download résumé
              </MagneticButton>
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="relative overflow-hidden rounded-[2rem] border border-border bg-bg-card/40 p-8">
            <p className="font-mono text-[11px] tracking-[0.3em] text-text-muted uppercase">
              Location
            </p>
            <p className="font-display mt-3 text-3xl text-text">{site.city}</p>
            <div className="relative mx-auto mt-10 aspect-square w-full max-w-xs">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border border-border"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
                className="absolute inset-6 rounded-full border border-dashed border-border-strong"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-3 w-3 rounded-full bg-accent shadow-[0_0_24px_rgba(245,240,232,0.45)]" />
              </div>
              <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full opacity-40">
                <ellipse cx="100" cy="100" rx="70" ry="28" fill="none" stroke="rgba(245,240,232,0.25)" />
                <ellipse cx="100" cy="100" rx="28" ry="70" fill="none" stroke="rgba(245,240,232,0.18)" />
                <circle cx="100" cy="100" r="58" fill="none" stroke="rgba(156,163,175,0.2)" />
              </svg>
            </div>
            <p className="mt-8 text-center text-sm text-text-muted">
              Soft globe · coordinates live in adventure journals
            </p>
          </div>
        </Reveal>
      </div>

      <section className="mt-28">
        <Reveal>
          <h2 className="font-display text-4xl text-text">Guestbook</h2>
          <p className="mt-3 text-text-muted">
            Leave a quiet note. Stored locally in your browser for this demo.
          </p>
        </Reveal>
        <form onSubmit={submit} className="mt-10 grid gap-4 md:grid-cols-[1fr_2fr_auto]">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className="rounded-2xl border border-border bg-bg-card px-4 py-3 text-sm outline-none focus:border-border-strong"
          />
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="A short message"
            className="rounded-2xl border border-border bg-bg-card px-4 py-3 text-sm outline-none focus:border-border-strong"
          />
          <button type="submit" className="rounded-full bg-accent px-6 py-3 text-sm text-bg">
            Sign
          </button>
        </form>
        <ul className="mt-12 space-y-6">
          {entries.map((e) => (
            <li key={e.id} className="border-b border-border pb-6">
              <p className="text-text">{e.message}</p>
              <p className="mt-2 font-mono text-[11px] text-text-muted">
                {e.name} · {e.date}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <p className="mt-16 text-sm text-text-muted">
        Prefer the shell?{" "}
        <Link href="/terminal/" className="text-accent">
          Open terminal
        </Link>
      </p>
    </div>
  );
}
