import type { Metadata } from "next";
import { AppShell } from "@/components/layout/AppShell";
import { Reveal } from "@/components/ui/Reveal";
import { TextLink } from "@/components/ui/TextLink";
import { getExperience } from "@/lib/content";
import { formatMonthYear } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Experience",
  description:
    "Career narrative — roles, systems, and the quiet work behind reliable backends.",
};

function dateRange(start: string, end: string | null) {
  const from = formatMonthYear(start);
  const to = end ? formatMonthYear(end) : "Present";
  return `${from} — ${to}`;
}

export default function ExperiencePage() {
  const experience = getExperience();

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl px-6 pb-32">
        <Reveal>
          <header className="pt-8 pb-20 md:pt-16 md:pb-28">
            <p className="font-mono text-[11px] tracking-[0.35em] text-text-muted uppercase">
              Experience
            </p>
            <h1 className="font-display mt-6 max-w-3xl text-[clamp(2.4rem,6vw,4.5rem)] leading-[0.98] text-text">
              Where the work
              <br />
              <span className="text-text-muted">took shape.</span>
            </h1>
            <p className="mt-8 max-w-md text-lg leading-relaxed text-text-muted">
              Not a résumé dump — a narrative of roles, systems, and the habits
              that stuck.
            </p>
          </header>
        </Reveal>

        <div className="relative">
          {/* Soft date rail */}
          <div
            aria-hidden
            className="absolute top-0 bottom-0 left-[5.5rem] hidden w-px bg-border md:block"
          />

          <div>
            {experience.map((job, i) => (
              <Reveal key={job.id} delay={i * 0.06}>
                <article className="relative border-t border-border py-20 md:py-28">
                  <div className="grid gap-8 md:grid-cols-[7rem_1fr] md:gap-16">
                    <div className="md:pt-2">
                      <p className="font-mono text-[11px] leading-relaxed tracking-wide text-text-muted">
                        {dateRange(job.start, job.end)}
                      </p>
                      <p className="mt-3 hidden font-mono text-[10px] text-text-muted/60 md:block">
                        {job.location}
                      </p>
                    </div>

                    <div>
                      <h2 className="font-display text-[clamp(1.75rem,4vw,2.75rem)] leading-[1.05] text-text">
                        {job.company}
                      </h2>
                      <p className="mt-3 font-display text-xl text-accent md:text-2xl">
                        {job.role}
                      </p>
                      <p className="mt-2 font-mono text-[11px] text-text-muted md:hidden">
                        {job.location}
                      </p>

                      <p className="mt-8 max-w-xl text-lg leading-relaxed text-text-muted">
                        {job.summary}
                      </p>

                      {job.highlights.length > 0 && (
                        <ul className="mt-10 max-w-xl space-y-4">
                          {job.highlights.map((h) => (
                            <li
                              key={h}
                              className="flex gap-4 text-[15px] leading-relaxed text-text-muted"
                            >
                              <span className="mt-2.5 h-px w-4 shrink-0 bg-border-strong" />
                              <span>{h}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                      {job.tech.length > 0 && (
                        <ul className="mt-10 flex flex-wrap gap-x-5 gap-y-2">
                          {job.tech.map((t) => (
                            <li
                              key={t}
                              className="font-mono text-[10px] tracking-[0.2em] text-text-muted uppercase"
                            >
                              {t}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal>
          <footer className="border-t border-border pt-16">
            <p className="text-text-muted">Prefer artifacts over titles?</p>
            <div className="mt-4 flex flex-wrap gap-6">
              <TextLink href="/projects/">Projects</TextLink>
              <TextLink href="/certifications/">Certifications</TextLink>
              <TextLink href="/about/">About</TextLink>
            </div>
          </footer>
        </Reveal>
      </div>
    </AppShell>
  );
}
