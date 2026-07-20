"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import type { Adventure, BlogPost, Photo, Project, SiteSettings, Skill } from "@/types";
import { FloatingCode } from "@/components/home/FloatingCode";
import { LiveContext } from "@/components/home/LiveContext";
import { ContributionGraph } from "@/components/home/ContributionGraph";
import { Reveal } from "@/components/ui/Reveal";
import { TextLink } from "@/components/ui/TextLink";
import { MagneticButton } from "@/components/ui/MagneticButton";

export function HomeExperience({
  site,
  latestProject,
  latestBlog,
  adventure,
  photo,
  skills,
}: {
  site: SiteSettings;
  latestProject: Project;
  latestBlog: BlogPost;
  adventure: Adventure;
  photo: Photo;
  skills: Skill[];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <div>
      <section ref={ref} className="relative min-h-[92vh] overflow-hidden px-6">
        <FloatingCode />
        <motion.div style={{ y, opacity }} className="mx-auto flex min-h-[92vh] max-w-6xl flex-col justify-center py-24">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="font-mono text-[11px] tracking-[0.35em] text-text-muted uppercase"
          >
            Mindset · Systems · Wilderness
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="font-display mt-8 max-w-4xl text-[clamp(2.8rem,8vw,6.5rem)] leading-[0.95] text-text"
          >
            Build systems
            <br />
            that think.
            <br />
            <span className="text-text-muted">Live stories</span>
            <br />
            that breathe.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.35 }}
            className="mt-8 max-w-xl text-lg text-text-muted"
          >
            {site.tagline} A Python developer working at the intersection of
            intelligence, infrastructure, and the outdoors.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <Link href="/projects/">
              <MagneticButton className="rounded-full bg-accent px-6 py-3 text-sm text-bg transition hover:opacity-90">
                Enter the work
              </MagneticButton>
            </Link>
            <Link href="/adventure/" className="text-sm text-text-muted hover:text-text">
              Or the mountains →
            </Link>
          </motion.div>
        </motion.div>
        <div className="pointer-events-none absolute bottom-10 left-1/2 -translate-x-1/2 font-mono text-[10px] tracking-[0.3em] text-text-muted uppercase">
          Scroll to continue
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-10">
        <Reveal>
          <LiveContext
            city={site.city}
            track={site.spotify?.track}
            artist={site.spotify?.artist}
          />
        </Reveal>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-24">
        <Reveal>
          <p className="font-mono text-[11px] tracking-[0.3em] text-text-muted uppercase">
            Chapter 01
          </p>
          <h2 className="font-display mt-4 max-w-3xl text-4xl text-text md:text-5xl">
            Clarity is the feature. Everything else is decoration.
          </h2>
        </Reveal>
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Backend as craft",
              body: "APIs, queues, and data paths designed to stay quiet in production.",
            },
            {
              title: "AI with judgement",
              body: "Models earn their place through evaluation — not demos.",
            },
            {
              title: "Life outside the IDE",
              body: "Mountains, cameras, and journals keep the work human.",
            },
          ].map((item, i) => (
            <Reveal key={item.title} delay={0.1 * i}>
              <div className="h-full rounded-3xl border border-border bg-bg-card/40 p-8">
                <p className="font-mono text-[10px] text-text-muted">0{i + 1}</p>
                <h3 className="font-display mt-4 text-2xl text-text">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-text-muted">{item.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <Reveal>
            <p className="font-mono text-[11px] tracking-[0.3em] text-text-muted uppercase">
              Latest project
            </p>
            <h2 className="font-display mt-4 text-4xl text-text">{latestProject.title}</h2>
            <p className="mt-4 text-text-muted">{latestProject.summary}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {latestProject.tech.slice(0, 5).map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-border px-3 py-1 font-mono text-[11px] text-text-muted"
                >
                  {t}
                </span>
              ))}
            </div>
            <div className="mt-8">
              <TextLink href={`/projects/${latestProject.slug}/`}>Read case study</TextLink>
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <Link href={`/projects/${latestProject.slug}/`} className="group block overflow-hidden rounded-3xl border border-border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={latestProject.cover}
                alt={latestProject.title}
                className="aspect-[4/3] w-full object-cover transition duration-700 group-hover:scale-[1.03]"
              />
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid gap-8 md:grid-cols-2">
          <Reveal>
            <div className="rounded-3xl border border-border bg-bg-elevated/60 p-8">
              <p className="font-mono text-[11px] tracking-[0.3em] text-text-muted uppercase">
                Latest writing
              </p>
              <h3 className="font-display mt-4 text-3xl text-text">{latestBlog.title}</h3>
              <p className="mt-3 text-sm text-text-muted">{latestBlog.excerpt}</p>
              <div className="mt-6">
                <TextLink href={`/blogs/${latestBlog.slug}/`}>Read essay</TextLink>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="rounded-3xl border border-border bg-bg-elevated/60 p-8">
              <p className="font-mono text-[11px] tracking-[0.3em] text-text-muted uppercase">
                Adventure highlight
              </p>
              <h3 className="font-display mt-4 text-3xl text-text">{adventure.title}</h3>
              <p className="mt-3 text-sm text-text-muted">
                {adventure.place} · {adventure.elevation ?? adventure.country}
              </p>
              <div className="mt-6">
                <TextLink href={`/adventure/${adventure.slug}/`}>Open journal</TextLink>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-24">
        <Reveal>
          <div className="grid items-end gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="font-mono text-[11px] tracking-[0.3em] text-text-muted uppercase">
                Photography
              </p>
              <h2 className="font-display mt-4 text-4xl text-text">{photo.title}</h2>
              <p className="mt-3 text-sm text-text-muted">{photo.location}</p>
              <div className="mt-6">
                <TextLink href="/photography/">Enter gallery</TextLink>
              </div>
            </div>
            <Link href="/photography/" className="overflow-hidden rounded-3xl border border-border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photo.src} alt={photo.title} className="aspect-[16/10] w-full object-cover" />
            </Link>
          </div>
        </Reveal>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-24">
        <Reveal>
          <p className="font-mono text-[11px] tracking-[0.3em] text-text-muted uppercase">
            Current stack
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {skills.map((s) => (
              <span
                key={s.name}
                className="rounded-full border border-border bg-bg-card/50 px-4 py-2 text-sm text-text"
              >
                {s.name}
              </span>
            ))}
          </div>
        </Reveal>
        <Reveal delay={0.15} className="mt-16">
          <p className="mb-6 font-mono text-[11px] tracking-[0.3em] text-text-muted uppercase">
            GitHub rhythm
          </p>
          <ContributionGraph />
        </Reveal>
      </section>
    </div>
  );
}
