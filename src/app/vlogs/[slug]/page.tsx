import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { Reveal } from "@/components/ui/Reveal";
import { TextLink } from "@/components/ui/TextLink";
import { getVlog, getVlogs } from "@/lib/content";
import { formatDate } from "@/lib/utils";

export function generateStaticParams() {
  return getVlogs().map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const vlog = getVlog(slug);
  if (!vlog) return { title: "Vlog" };
  return {
    title: vlog.title,
    description: vlog.description,
  };
}

export default async function VlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const vlog = getVlog(slug);
  if (!vlog) notFound();

  const related = getVlogs()
    .filter((v) => v.slug !== vlog.slug)
    .filter((v) => v.category === vlog.category)
    .slice(0, 2);
  const fallback = getVlogs()
    .filter((v) => v.slug !== vlog.slug)
    .slice(0, 2);
  const relatedList = related.length ? related : fallback;

  return (
    <AppShell
      searchItems={getVlogs().map((v) => ({
        id: v.id,
        title: v.title,
        subtitle: v.category,
        href: `/vlogs/${v.slug}/`,
        group: "Vlogs",
      }))}
    >
      <article className="mx-auto max-w-5xl px-6 pb-28">
        <Reveal>
          <div className="pt-4">
            <TextLink href="/vlogs/">All vlogs</TextLink>
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <header className="mt-10">
            <p className="font-mono text-[11px] tracking-[0.3em] text-text-muted uppercase">
              {vlog.category} · {formatDate(vlog.publishedAt)} · {vlog.duration}
            </p>
            <h1 className="font-display mt-4 text-[clamp(2.2rem,5vw,3.75rem)] leading-[0.95] text-text">
              {vlog.title}
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-text-muted">
              {vlog.description}
            </p>
            <p className="mt-4 font-mono text-sm text-text-muted">
              {vlog.likes.toLocaleString()} likes
            </p>
          </header>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-10 overflow-hidden rounded-sm border border-border">
            <div className="aspect-video w-full bg-bg-elevated">
              <iframe
                title={vlog.title}
                src={`https://www.youtube.com/embed/${vlog.youtubeId}`}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </Reveal>

        {relatedList.length > 0 && (
          <section className="mt-20 border-t border-border pt-14">
            <Reveal>
              <p className="font-mono text-[11px] tracking-[0.3em] text-text-muted uppercase">
                Related
              </p>
              <div className="mt-8 grid gap-8 sm:grid-cols-2">
                {relatedList.map((v) => (
                  <Link key={v.id} href={`/vlogs/${v.slug}/`} className="group block">
                    <img
                      src={v.thumbnail}
                      alt=""
                      className="aspect-video w-full rounded-sm object-cover transition group-hover:opacity-90"
                    />
                    <h3 className="font-display mt-4 text-xl text-text">
                      {v.title}
                    </h3>
                    <p className="mt-1 text-sm text-text-muted">{v.category}</p>
                  </Link>
                ))}
              </div>
            </Reveal>
          </section>
        )}
      </article>
    </AppShell>
  );
}
