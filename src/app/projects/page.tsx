import type { Metadata } from "next";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { Reveal } from "@/components/ui/Reveal";
import { getProjects } from "@/lib/content";
import { ProjectIndex } from "@/components/projects/ProjectIndex";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Selected systems and tools — case studies on AI, backends, and calm infrastructure.",
};

export default function ProjectsPage() {
  const projects = getProjects();

  const searchItems = projects.map((p) => ({
    id: p.id,
    title: p.title,
    subtitle: p.subtitle,
    href: `/projects/${p.slug}/`,
    group: "Projects",
  }));

  return (
    <AppShell searchItems={searchItems}>
      <div className="mx-auto max-w-5xl px-6 pb-32">
        <Reveal>
          <header className="pt-8 pb-20 md:pt-16 md:pb-28">
            <p className="font-mono text-[11px] tracking-[0.35em] text-text-muted uppercase">
              Projects
            </p>
            <h1 className="font-display mt-6 max-w-3xl text-[clamp(2.4rem,6vw,4.5rem)] leading-[0.98] text-text">
              Selected work.
            </h1>
            <p className="mt-8 max-w-md text-lg leading-relaxed text-text-muted">
              Systems designed to stay calm under load — each one a full case
              study, not a thumbnail.
            </p>
          </header>
        </Reveal>

        <ProjectIndex projects={projects} />

        <Reveal>
          <div className="mt-24 border-t border-border pt-10">
            <Link
              href="/experience/"
              className="text-sm text-text-muted transition hover:text-text"
            >
              Or read the career narrative →
            </Link>
          </div>
        </Reveal>
      </div>
    </AppShell>
  );
}
