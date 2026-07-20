import type { Metadata } from "next";
import { AppShell } from "@/components/layout/AppShell";
import { Reveal } from "@/components/ui/Reveal";
import { PhotoGallery } from "@/components/photography/PhotoGallery";
import { getPhotos, getSite } from "@/lib/content";

export const metadata: Metadata = {
  title: "Photography",
  description:
    "A calm gallery of mountains, night fields, and quiet desks — framed with intention.",
};

export default function PhotographyPage() {
  const site = getSite();
  const photos = getPhotos();

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl px-6 pb-28">
        <Reveal>
          <header className="pt-4 pb-12">
            <p className="font-mono text-[11px] tracking-[0.35em] text-text-muted uppercase">
              Frames · {site.name}
            </p>
            <h1 className="font-display mt-6 max-w-3xl text-[clamp(2.4rem,6vw,4.5rem)] leading-[0.95] text-text">
              Light, patience,
              <br />
              <span className="text-text-muted">and the long wait.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-text-muted">
              Landscapes, portraits, and night work — less about gear, more about
              staying still long enough.
            </p>
          </header>
        </Reveal>

        <PhotoGallery photos={photos} />
      </div>
    </AppShell>
  );
}
