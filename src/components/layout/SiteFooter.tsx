import Link from "next/link";
import { getSite } from "@/lib/content";

export function SiteFooter() {
  const site = getSite();
  return (
    <footer className="mt-auto border-t border-border">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-16 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-display text-2xl text-text">{site.name}</p>
          <p className="mt-2 max-w-sm text-sm text-text-muted">{site.tagline}</p>
        </div>
        <div className="flex flex-wrap gap-5 text-sm text-text-muted">
          <Link href={site.social.github} className="hover:text-text">
            GitHub
          </Link>
          <Link href={site.social.linkedin} className="hover:text-text">
            LinkedIn
          </Link>
          <Link href={site.social.twitter} className="hover:text-text">
            Twitter
          </Link>
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
