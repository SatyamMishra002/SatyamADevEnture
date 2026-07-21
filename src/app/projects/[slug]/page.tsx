import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { Reveal } from "@/components/ui/Reveal";
import { TextLink } from "@/components/ui/TextLink";
import { getProject, getProjects } from "@/lib/content";
import { withBasePath } from "@/lib/paths";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: "Project" };
  return {
    title: project.title,
    description: project.summary,
  };
}

function CaseSection({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Reveal>
      <section className="border-t border-border py-16 md:py-20">
        <h2 className="font-mono text-[11px] tracking-[0.35em] text-text-muted uppercase">
          {label}
        </h2>
        <div className="mt-6">{children}</div>
      </section>
    </Reveal>
  );
}

export default async function ProjectCaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const projects = getProjects();
  const idx = projects.findIndex((p) => p.slug === slug);
  const prev = idx > 0 ? projects[idx - 1] : null;
  const next = idx < projects.length - 1 ? projects[idx + 1] : null;

  const searchItems = projects.map((p) => ({
    id: p.id,
    title: p.title,
    subtitle: p.subtitle,
    href: `/projects/${p.slug}/`,
    group: "Projects",
  }));

  return (
    <AppShell searchItems={searchItems}>
      <article className="mx-auto max-w-4xl px-6 pb-32">
        <Reveal>
          <header className="pt-8 pb-16 md:pt-16 md:pb-24">
            <Link
              href="/projects/"
              className="font-mono text-[11px] tracking-[0.3em] text-text-muted uppercase transition hover:text-text"
            >
              ← Projects
            </Link>
            <p className="mt-8 font-mono text-xs text-text-muted">
              {project.year} · {project.role}
            </p>
            <h1 className="font-display mt-4 text-[clamp(2.5rem,7vw,5rem)] leading-[0.95] text-text">
              {project.title}
            </h1>
            <p className="mt-6 max-w-2xl text-xl leading-relaxed text-text-muted">
              {project.subtitle}
            </p>

            <div className="mt-10 flex flex-wrap gap-6">
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-accent transition hover:opacity-80"
                >
                  GitHub →
                </a>
              )}
              {project.live && (
                <a
                  href={project.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-accent transition hover:opacity-80"
                >
                  Live demo →
                </a>
              )}
            </div>
          </header>
        </Reveal>

        <Reveal>
          <div className="relative mb-8 aspect-[16/9] overflow-hidden border border-border bg-bg-card">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={withBasePath(project.cover)}
              alt={project.title}
              className="h-full w-full object-cover"
            />
          </div>
        </Reveal>

        {project.stats.length > 0 && (
          <Reveal>
            <div className="mb-8 grid grid-cols-2 gap-px border border-border bg-border md:grid-cols-3">
              {project.stats.map((stat) => (
                <div
                  key={stat.label}
                  className="bg-bg px-6 py-8 text-center md:text-left"
                >
                  <p className="font-display text-3xl text-accent md:text-4xl">
                    {stat.value}
                  </p>
                  <p className="mt-2 font-mono text-[10px] tracking-[0.25em] text-text-muted uppercase">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        )}

        <CaseSection label="Problem">
          <p className="max-w-2xl text-lg leading-relaxed text-text">
            {project.problem}
          </p>
        </CaseSection>

        <CaseSection label="Motivation">
          <p className="max-w-2xl text-lg leading-relaxed text-text-muted">
            {project.motivation}
          </p>
        </CaseSection>

        <CaseSection label="Architecture">
          <p className="font-display max-w-2xl text-xl leading-snug text-text md:text-2xl">
            {project.architecture}
          </p>
        </CaseSection>

        {project.gallery.length > 0 && (
          <CaseSection label="Gallery">
            <div className="grid gap-4 md:grid-cols-2">
              {project.gallery.map((src, i) => (
                <div
                  key={src}
                  className="relative aspect-[4/3] overflow-hidden border border-border bg-bg-card"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={withBasePath(src)}
                    alt={`${project.title} screenshot ${i + 1}`}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          </CaseSection>
        )}

        <CaseSection label="Tech Stack">
          <ul className="flex flex-wrap gap-x-6 gap-y-3">
            {project.tech.map((t) => (
              <li key={t} className="font-display text-xl text-text">
                {t}
              </li>
            ))}
          </ul>
        </CaseSection>

        <CaseSection label="Challenges">
          <ul className="max-w-2xl space-y-5">
            {project.challenges.map((c, i) => (
              <li key={c} className="flex gap-4">
                <span className="font-mono text-xs text-text-muted">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-lg text-text">{c}</span>
              </li>
            ))}
          </ul>
        </CaseSection>

        <CaseSection label="Performance">
          <ul className="max-w-2xl space-y-4">
            {project.performance.map((p) => (
              <li
                key={p}
                className="border-l border-accent/30 pl-5 text-lg text-text-muted"
              >
                {p}
              </li>
            ))}
          </ul>
        </CaseSection>

        <CaseSection label="Lessons">
          <ul className="space-y-6">
            {project.lessons.map((l) => (
              <li
                key={l}
                className="font-display text-xl text-text md:text-2xl"
              >
                {l}
              </li>
            ))}
          </ul>
        </CaseSection>

        <CaseSection label="Future">
          <ul className="max-w-2xl space-y-4">
            {project.future.map((f) => (
              <li key={f} className="flex gap-3 text-lg text-text-muted">
                <span className="text-accent">·</span>
                {f}
              </li>
            ))}
          </ul>
        </CaseSection>

        {project.timeline.length > 0 && (
          <CaseSection label="Timeline">
            <ol className="space-y-8">
              {project.timeline.map((t) => (
                <li
                  key={`${t.label}-${t.date}`}
                  className="grid gap-1 md:grid-cols-[10rem_1fr] md:items-baseline"
                >
                  <span className="font-mono text-xs text-text-muted">
                    {t.date}
                  </span>
                  <span className="font-display text-xl text-text">
                    {t.label}
                  </span>
                </li>
              ))}
            </ol>
          </CaseSection>
        )}

        <Reveal>
          <nav className="mt-8 flex flex-col gap-8 border-t border-border pt-16 sm:flex-row sm:justify-between">
            {prev ? (
              <TextLink href={`/projects/${prev.slug}/`}>
                {prev.title}
              </TextLink>
            ) : (
              <span />
            )}
            {next ? (
              <TextLink href={`/projects/${next.slug}/`}>
                {next.title}
              </TextLink>
            ) : (
              <span />
            )}
          </nav>
        </Reveal>
      </article>
    </AppShell>
  );
}
