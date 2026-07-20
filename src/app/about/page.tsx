import type { Metadata } from "next";
import { AppShell } from "@/components/layout/AppShell";
import { Reveal } from "@/components/ui/Reveal";
import { TextLink } from "@/components/ui/TextLink";
import { getAbout, getSkills } from "@/lib/content";

export const metadata: Metadata = {
  title: "About",
  description:
    "Journey, beliefs, workflow, and the tools behind the work — a quieter look at how I build and live.",
};

function SectionLabel({ n, label }: { n: string; label: string }) {
  return (
    <div className="mb-10 flex items-baseline gap-4">
      <span className="font-mono text-[11px] tracking-[0.35em] text-text-muted uppercase">
        {n}
      </span>
      <h2 className="font-display text-3xl text-text md:text-4xl">{label}</h2>
    </div>
  );
}

export default function AboutPage() {
  const about = getAbout();
  const skills = getSkills();

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl px-6 pb-32">
        <Reveal>
          <header className="pt-8 pb-28 md:pt-16 md:pb-40">
            <p className="font-mono text-[11px] tracking-[0.35em] text-text-muted uppercase">
              About
            </p>
            <h1 className="font-display mt-6 max-w-3xl text-[clamp(2.4rem,6vw,4.5rem)] leading-[0.98] text-text">
              Systems by day.
              <br />
              <span className="text-text-muted">Stories by weekend.</span>
            </h1>
            <p className="mt-8 max-w-lg text-lg leading-relaxed text-text-muted">
              A Python developer working at the intersection of intelligence,
              infrastructure, and the outdoors — with equal care for both.
            </p>
            <div className="mt-10">
              <TextLink href="/projects/">See the work</TextLink>
            </div>
          </header>
        </Reveal>

        {/* 01 Journey */}
        <Reveal>
          <section className="border-t border-border py-24 md:py-32">
            <SectionLabel n="01" label="My Journey" />
            <ol className="space-y-16">
              {about.journey.map((item) => (
                <li
                  key={item.year}
                  className="grid gap-4 md:grid-cols-[7rem_1fr] md:gap-12"
                >
                  <span className="font-mono text-sm text-accent">{item.year}</span>
                  <div>
                    <h3 className="font-display text-xl text-text md:text-2xl">
                      {item.title}
                    </h3>
                    <p className="mt-3 max-w-xl leading-relaxed text-text-muted">
                      {item.text}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        </Reveal>

        {/* 02 Lessons */}
        <Reveal>
          <section className="border-t border-border py-24 md:py-32">
            <SectionLabel n="02" label="Lessons Learned" />
            <ul className="space-y-6">
              {about.lessons.map((lesson, i) => (
                <li
                  key={lesson}
                  className="flex gap-6 border-b border-border/60 pb-6 last:border-0"
                >
                  <span className="font-mono text-xs text-text-muted">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="font-display text-xl text-text md:text-2xl">
                    {lesson}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        </Reveal>

        {/* 03 Beliefs */}
        <Reveal>
          <section className="border-t border-border py-24 md:py-32">
            <SectionLabel n="03" label="What I Believe" />
            <div className="grid gap-10 md:grid-cols-2">
              {about.beliefs.map((belief) => (
                <p
                  key={belief}
                  className="font-display text-xl leading-snug text-text md:text-2xl"
                >
                  {belief}
                </p>
              ))}
            </div>
          </section>
        </Reveal>

        {/* 04 How I Work */}
        <Reveal>
          <section className="border-t border-border py-24 md:py-32">
            <SectionLabel n="04" label="How I Work" />
            <ul className="max-w-2xl space-y-5">
              {about.howIWork.map((item) => (
                <li
                  key={item}
                  className="flex gap-4 text-lg leading-relaxed text-text-muted"
                >
                  <span className="mt-2.5 h-px w-6 shrink-0 bg-accent/40" />
                  <span className="text-text">{item}</span>
                </li>
              ))}
            </ul>
          </section>
        </Reveal>

        {/* 05 Workflow */}
        <Reveal>
          <section className="border-t border-border py-24 md:py-32">
            <SectionLabel n="05" label="Daily Workflow" />
            <div className="space-y-12">
              {about.workflow.map((w, i) => (
                <div
                  key={w.step}
                  className="grid gap-2 md:grid-cols-[10rem_1fr] md:items-baseline md:gap-10"
                >
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono text-[11px] text-text-muted">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-display text-lg text-accent">
                      {w.step}
                    </span>
                  </div>
                  <p className="text-lg leading-relaxed text-text-muted">
                    {w.detail}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </Reveal>

        {/* 06 Goals */}
        <Reveal>
          <section className="border-t border-border py-24 md:py-32">
            <SectionLabel n="06" label="Current Goals" />
            <ul className="space-y-8">
              {about.goals.map((goal, i) => (
                <li key={goal} className="flex gap-6">
                  <span className="font-mono text-sm text-text-muted">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="max-w-xl text-lg leading-relaxed text-text">
                    {goal}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        </Reveal>

        {/* 07 Vision */}
        <Reveal>
          <section className="border-t border-border py-24 md:py-32">
            <SectionLabel n="07" label="Future Vision" />
            <p className="font-display max-w-2xl text-2xl leading-snug text-text md:text-3xl">
              {about.vision}
            </p>
          </section>
        </Reveal>

        {/* 08 Technologies */}
        <Reveal>
          <section className="border-t border-border py-24 md:py-32">
            <SectionLabel n="08" label="Favorite Technologies" />
            <ul className="flex flex-wrap gap-x-8 gap-y-4">
              {about.technologies.map((tech) => (
                <li
                  key={tech}
                  className="font-display text-xl text-text md:text-2xl"
                >
                  {tech}
                </li>
              ))}
            </ul>
            <div className="mt-16 grid gap-3 sm:grid-cols-2">
              {skills.map((s) => (
                <div
                  key={s.name}
                  className="flex items-center justify-between gap-4 border-b border-border/50 py-3"
                >
                  <span className="text-sm text-text">{s.name}</span>
                  <span className="font-mono text-[11px] text-text-muted">
                    {s.level}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </Reveal>

        {/* 09 Books */}
        <Reveal>
          <section className="border-t border-border py-24 md:py-32">
            <SectionLabel n="09" label="Books" />
            <ul className="space-y-14">
              {about.books.map((book) => (
                <li key={book.title}>
                  <h3 className="font-display text-2xl text-text">
                    {book.title}
                  </h3>
                  <p className="mt-1 font-mono text-xs tracking-wider text-text-muted uppercase">
                    {book.author}
                  </p>
                  <p className="mt-4 max-w-md leading-relaxed text-text-muted">
                    {book.note}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        </Reveal>

        {/* 10 Workspace */}
        <Reveal>
          <section className="border-t border-border py-24 md:py-32">
            <SectionLabel n="10" label="Workspace" />
            <ul className="max-w-xl space-y-5">
              {about.workspace.map((item) => (
                <li
                  key={item}
                  className="border-l border-accent/30 pl-6 text-lg text-text-muted"
                >
                  {item}
                </li>
              ))}
            </ul>
          </section>
        </Reveal>

        {/* 11 Tools */}
        <Reveal>
          <section className="border-t border-border py-24 md:py-32">
            <SectionLabel n="11" label="Tools" />
            <ul className="grid gap-4 sm:grid-cols-2">
              {about.tools.map((tool) => (
                <li
                  key={tool}
                  className="font-display text-xl text-text md:text-2xl"
                >
                  {tool}
                </li>
              ))}
            </ul>
          </section>
        </Reveal>

        <Reveal>
          <footer className="border-t border-border pt-16">
            <p className="text-text-muted">Want the short version?</p>
            <div className="mt-4 flex flex-wrap gap-6">
              <TextLink href="/experience/">Experience</TextLink>
              <TextLink href="/projects/">Projects</TextLink>
              <TextLink href="/contact/">Contact</TextLink>
            </div>
          </footer>
        </Reveal>
      </div>
    </AppShell>
  );
}
