import type { Metadata } from "next";
import { AppShell } from "@/components/layout/AppShell";
import { Reveal } from "@/components/ui/Reveal";
import { TextLink } from "@/components/ui/TextLink";
import { InteractiveGlobe } from "@/components/contact/InteractiveGlobe";
import { Guestbook } from "@/components/contact/Guestbook";
import { getGuestbook, getSite } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Email, socials, resume, and a quiet guestbook — open to thoughtful collaborations.",
};

export default function ContactPage() {
  const site = getSite();
  const guestbook = getGuestbook();

  const socials = [
    { label: "GitHub", href: site.social.github },
    { label: "LinkedIn", href: site.social.linkedin },
    { label: "Twitter", href: site.social.twitter },
    { label: "YouTube", href: site.social.youtube },
    { label: "Instagram", href: site.social.instagram },
  ].filter((s): s is { label: string; href: string } => Boolean(s.href));

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl px-6 pb-28">
        <div className="grid items-center gap-12 pt-4 pb-16 lg:grid-cols-[minmax(0,1fr)_auto]">
          <Reveal>
            <header>
              <p className="font-mono text-[11px] tracking-[0.35em] text-text-muted uppercase">
                Contact · {site.city}
              </p>
              <h1 className="font-display mt-6 max-w-xl text-[clamp(2.4rem,6vw,4.5rem)] leading-[0.95] text-text">
                Say hello
                <br />
                <span className="text-text-muted">without the noise.</span>
              </h1>
              <p className="mt-6 max-w-md text-lg text-text-muted">
                {site.availability}. Prefer thoughtful notes over cold pitches.
              </p>
            </header>
          </Reveal>
          <Reveal delay={0.1}>
            <InteractiveGlobe city={site.city} />
          </Reveal>
        </div>

        <div className="editorial-rule" />

        <section className="grid gap-16 py-16 md:grid-cols-2">
          <Reveal>
            <p className="font-mono text-[11px] tracking-[0.3em] text-text-muted uppercase">
              Reach
            </p>
            <dl className="mt-8 space-y-6">
              <div>
                <dt className="text-sm text-text-muted">Email</dt>
                <dd className="mt-2">
                  <a
                    href={`mailto:${site.email}`}
                    className="font-display text-2xl text-text transition hover:text-accent"
                  >
                    {site.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-sm text-text-muted">Location</dt>
                <dd className="mt-2 text-lg text-text">
                  {site.city}, {site.location}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-text-muted">Availability</dt>
                <dd className="mt-2 text-lg text-text">{site.availability}</dd>
              </div>
              <div>
                <dt className="text-sm text-text-muted">Resume</dt>
                <dd className="mt-3">
                  <TextLink href={site.resumeUrl}>Download PDF</TextLink>
                </dd>
              </div>
            </dl>
          </Reveal>

          <Reveal delay={0.08}>
            <p className="font-mono text-[11px] tracking-[0.3em] text-text-muted uppercase">
              Elsewhere
            </p>
            <ul className="mt-8 space-y-4">
              {socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-center justify-between border-b border-border py-3 text-text transition hover:text-accent"
                  >
                    <span className="font-display text-xl">{s.label}</span>
                    <span className="text-sm text-text-muted transition group-hover:translate-x-0.5 group-hover:text-accent">
                      →
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        </section>

        <div className="editorial-rule" />

        <section className="grid gap-12 py-16 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <Reveal>
            <p className="font-mono text-[11px] tracking-[0.3em] text-text-muted uppercase">
              Guestbook
            </p>
            <h2 className="font-display mt-4 text-3xl text-text">
              Leave a quiet note
            </h2>
            <p className="mt-4 max-w-sm text-text-muted">
              Messages are stored in your browser and shown alongside curated
              entries from the site.
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <Guestbook seed={guestbook} />
          </Reveal>
        </section>
      </div>
    </AppShell>
  );
}
