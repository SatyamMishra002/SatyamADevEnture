import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { Reveal } from "@/components/ui/Reveal";
import { TextLink } from "@/components/ui/TextLink";
import { getAdventure, getAdventures } from "@/lib/content";
import { formatDate } from "@/lib/utils";

export function generateStaticParams() {
  return getAdventures().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const trip = getAdventure(slug);
  if (!trip) return { title: "Adventure" };
  return {
    title: trip.title,
    description: trip.journal.slice(0, 160),
  };
}

export default async function AdventureJournalPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const trip = getAdventure(slug);
  if (!trip) notFound();

  const others = getAdventures().filter((a) => a.slug !== trip.slug);

  return (
    <AppShell
      adventure
      searchItems={getAdventures().map((a) => ({
        id: a.id,
        title: a.title,
        subtitle: a.place,
        href: `/adventure/${a.slug}/`,
        group: "Adventure",
      }))}
    >
      <article className="mx-auto max-w-6xl px-6 pb-28">
        <Reveal>
          <div className="pt-4">
            <TextLink href="/adventure/">All adventures</TextLink>
          </div>
        </Reveal>

        <header className="mt-10 max-w-3xl">
          <Reveal>
            <p className="font-mono text-[11px] tracking-[0.3em] text-text-muted uppercase">
              {formatDate(trip.date)}
              {trip.elevation ? ` · ${trip.elevation}` : ""}
            </p>
            <h1 className="font-display mt-4 text-[clamp(2.4rem,6vw,4.5rem)] leading-[0.95] text-text">
              {trip.title}
            </h1>
            <p className="mt-4 text-lg text-text-muted">
              {trip.place}, {trip.country}
            </p>
          </Reveal>
        </header>

        <Reveal delay={0.08}>
          <div className="mt-12 overflow-hidden rounded-sm">
            <img
              src={trip.cover}
              alt={trip.title}
              className="aspect-[21/9] w-full object-cover"
            />
          </div>
        </Reveal>

        <div className="mt-14 grid gap-16 lg:grid-cols-[minmax(0,1fr)_240px]">
          <div>
            <Reveal>
              <p className="prose-calm text-lg leading-relaxed text-text-muted">
                {trip.journal}
              </p>
            </Reveal>

            <Reveal delay={0.06}>
              <section className="mt-16">
                <p className="font-mono text-[11px] tracking-[0.3em] text-text-muted uppercase">
                  Memories
                </p>
                <ul className="mt-6 space-y-4">
                  {trip.memories.map((m) => (
                    <li
                      key={m}
                      className="border-l border-accent/30 pl-5 text-text"
                    >
                      {m}
                    </li>
                  ))}
                </ul>
              </section>
            </Reveal>

            {trip.gallery.length > 0 && (
              <Reveal delay={0.1}>
                <section className="mt-16">
                  <p className="font-mono text-[11px] tracking-[0.3em] text-text-muted uppercase">
                    Gallery
                  </p>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    {trip.gallery.map((src) => (
                      <img
                        key={src}
                        src={src}
                        alt=""
                        className="aspect-[4/3] w-full rounded-sm object-cover"
                      />
                    ))}
                  </div>
                </section>
              </Reveal>
            )}
          </div>

          <aside className="lg:pt-2">
            <Reveal delay={0.12}>
              <div className="sticky top-28 rounded-sm border border-border bg-bg-elevated/60 p-5">
                <p className="font-mono text-[11px] tracking-[0.25em] text-text-muted uppercase">
                  Coordinates
                </p>
                <dl className="mt-4 space-y-3 text-sm">
                  <div className="flex justify-between gap-4">
                    <dt className="text-text-muted">Lat</dt>
                    <dd className="font-mono text-text">{trip.lat.toFixed(3)}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-text-muted">Lng</dt>
                    <dd className="font-mono text-text">{trip.lng.toFixed(3)}</dd>
                  </div>
                  {trip.elevation && (
                    <div className="flex justify-between gap-4">
                      <dt className="text-text-muted">Elev</dt>
                      <dd className="font-mono text-text">{trip.elevation}</dd>
                    </div>
                  )}
                </dl>
                <a
                  href={`https://www.openstreetmap.org/?mlat=${trip.lat}&mlon=${trip.lng}#map=11/${trip.lat}/${trip.lng}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-block text-sm text-accent transition hover:opacity-80"
                >
                  View on map →
                </a>
              </div>
            </Reveal>
          </aside>
        </div>

        {others.length > 0 && (
          <section className="mt-24 border-t border-border pt-16">
            <Reveal>
              <p className="font-mono text-[11px] tracking-[0.3em] text-text-muted uppercase">
                More journals
              </p>
              <div className="mt-8 grid gap-8 sm:grid-cols-2">
                {others.slice(0, 2).map((a) => (
                  <Link
                    key={a.id}
                    href={`/adventure/${a.slug}/`}
                    className="group block"
                  >
                    <img
                      src={a.cover}
                      alt=""
                      className="aspect-[16/10] w-full rounded-sm object-cover transition duration-500 group-hover:opacity-90"
                    />
                    <h3 className="font-display mt-4 text-xl text-text">
                      {a.title}
                    </h3>
                    <p className="mt-1 text-sm text-text-muted">{a.place}</p>
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
