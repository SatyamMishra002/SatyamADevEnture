import Link from "next/link";
import { getSite } from "@/lib/content";

export function SiteFooter() {
  const site = getSite();
  const socials = [
    { label: "GitHub", href: site.social.github },
    { label: "LinkedIn", href: site.social.linkedin },
    { label: "Twitter", href: site.social.twitter },
    { label: "YouTube", href: site.social.youtube },
    { label: "Instagram", href: site.social.instagram },
  ].filter((s): s is { label: string; href: string } => Boolean(s.href));

  return (
    <footer className="mt-auto border-t border-border">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-16 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-display text-2xl text-text">{site.name}</p>
          <p className="mt-2 max-w-sm text-sm text-text-muted">{site.tagline}</p>
        </div>
        <div className="flex flex-wrap gap-5 text-sm text-text-muted">
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              className="hover:text-text"
            >
              {s.label}
            </a>
          ))}
          <Link href="/terminal/" className="hover:text-text">
            Terminal
          </Link>
          <Link href="/admin/" className="hover:text-text">
            Admin
          </Link>
        </div>
      </div>
      <div className="editorial-rule" />
      <p className="px-6 py-6 text-center font-mono text-[11px] tracking-widest text-text-muted uppercase">
        Built with restraint · {new Date().getFullYear()}
      </p>
    </footer>
  );
}
