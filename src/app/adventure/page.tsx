import type { Metadata } from "next";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { MountainHero } from "@/components/adventure/MountainHero";
import { Reveal } from "@/components/ui/Reveal";
import { TextLink } from "@/components/ui/TextLink";
import { getAdventures, getExtras, getSite } from "@/lib/content";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Adventure",
  description:
    "Trip journals from ridges, valleys, and monsoon greens — mountains as a second operating system.",
};

export default function AdventurePage() {
  const site = getSite();
  const adventures = getAdventures();
  const extras = getExtras();
  const places = extras.placesVisited ?? [];
  const bucket = extras.bucketList ?? [];

  const searchItems = adventures.map((a) => ({
    id: a.id,
    title: a.title,
    subtitle: a.place,
    href: `/adventure/${a.slug}/`,
    group: "Adventure",
  }));

  return (
    <AppShell adventure searchItems={searchItems}>
      <MountainHero
        eyebrow="Field notes · Elevation · Silence"
        title={
          <>
            Where the trail
            <br />
            <span className="text-text-muted">rewrites the week.</span>
          </>
        }
        subtitle={`Journals from ${site.location} and beyond — ridges before dawn, high-desert light, and the soft reset of rain.`}
      />

      <div className="mx-auto max-w-6xl px-6 pb-28">
        <section className="py-20">
          <Reveal>
            <p className="font-mono text-[11px] tracking-[0.3em] text-text-muted uppercase">
              Trip journals
            </p>
            <h2 className="font-display mt-4 text-3xl text-text md:text-4xl">
              Recent climbs & quiet roads
            </h2>
          </Reveal>

          <ul className="mt-14 space-y-0">
            {adventures.map((trip, i) => (
              <Reveal key={trip.id} delay={i * 0.06}>
                <li className="group border-t border-border py-8 last:border-b">
                  <Link
                    href={`/adventure/${trip.slug}/`}
                    className="grid items-center gap-6 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_auto]"
                  >
                    <div className="overflow-hidden rounded-sm">
                      <img
                        src={trip.cover}
                        alt=""
                        className="aspect-[16/10] w-full object-cover transition duration-700 group-hover:scale-[1.03]"
                      />
                    </div>
                    <div>
                      <p className="font-mono text-[11px] tracking-[0.2em] text-text-muted uppercase">
                        {formatDate(trip.date)}
                        {trip.elevation ? ` · ${trip.elevation}` : ""}
                      </p>
                      <h3 className="font-display mt-3 text-2xl text-text md:text-3xl">
                        {trip.title}
                      </h3>
                      <p className="mt-2 text-text-muted">
                        {trip.place}, {trip.country}
                      </p>
                      <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-text-muted">
                        {trip.journal}
                      </p>
                    </div>
                    <span className="hidden text-sm text-accent transition group-hover:translate-x-1 md:inline">
                      Open journal →
                    </span>
                  </Link>
                </li>
              </Reveal>
            ))}
          </ul>
        </section>

        <div className="editorial-rule my-8" />

        <section className="grid gap-16 py-16 md:grid-cols-2">
          <Reveal>
            <p className="font-mono text-[11px] tracking-[0.3em] text-text-muted uppercase">
              Places visited
            </p>
            <h2 className="font-display mt-4 text-2xl text-text">
              Pins on the map
            </h2>
            <ul className="mt-8 space-y-3">
              {places.map((p) => (
                <li
                  key={p.name}
                  className="flex items-baseline justify-between border-b border-border/60 py-3"
                >
                  <span className="text-text">{p.name}</span>
                  <span className="font-mono text-xs text-text-muted">
                    {p.country}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="font-mono text-[11px] tracking-[0.3em] text-text-muted uppercase">
              Bucket list
            </p>
            <h2 className="font-display mt-4 text-2xl text-text">
              Still calling
            </h2>
            <ul className="mt-8 space-y-3">
              {bucket.map((b) => (
                <li
                  key={b.place}
                  className="flex items-baseline justify-between border-b border-border/60 py-3"
                >
                  <span className="text-text">{b.place}</span>
                  <span className="font-mono text-xs tracking-wider text-text-muted uppercase">
                    {b.status}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        </section>

        <Reveal>
          <div className="mt-8 flex flex-wrap gap-6">
            <TextLink href="/photography/">See the frames</TextLink>
            <TextLink href="/vlogs/">Watch the trails</TextLink>
          </div>
        </Reveal>
      </div>
    </AppShell>
  );
}
