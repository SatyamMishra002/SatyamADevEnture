import type { Metadata } from "next";
import { AppShell } from "@/components/layout/AppShell";
import { Reveal } from "@/components/ui/Reveal";
import { VlogsExperience } from "@/components/vlogs/VlogsExperience";
import { getSite, getVlogs } from "@/lib/content";

export const metadata: Metadata = {
  title: "Vlogs",
  description:
    "Trail films, desk-to-trail resets, and building-in-public sessions — quiet YouTube-style field notes.",
};

export default function VlogsPage() {
  const site = getSite();
  const vlogs = getVlogs();
  const featured = vlogs.find((v) => v.featured) ?? vlogs[0];
  const rest = vlogs.filter((v) => v.id !== featured?.id);
  const categories = Array.from(new Set(vlogs.map((v) => v.category)));

  return (
    <AppShell
      searchItems={vlogs.map((v) => ({
        id: v.id,
        title: v.title,
        subtitle: v.category,
        href: `/vlogs/${v.slug}/`,
        group: "Vlogs",
      }))}
    >
      <div className="mx-auto max-w-6xl px-6 pb-28">
        <Reveal>
          <header className="pt-4 pb-12">
            <p className="font-mono text-[11px] tracking-[0.35em] text-text-muted uppercase">
              Field films · {site.name}
            </p>
            <h1 className="font-display mt-6 max-w-3xl text-[clamp(2.4rem,6vw,4.5rem)] leading-[0.95] text-text">
              Watch the work
              <br />
              <span className="text-text-muted">and the wilderness.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-text-muted">
              Short films from ridges, desks, and shipping weeks — paced like a
              long exhale.
            </p>
          </header>
        </Reveal>

        <VlogsExperience
          featured={featured}
          rest={rest}
          all={vlogs}
          categories={categories}
        />
      </div>
    </AppShell>
  );
}
