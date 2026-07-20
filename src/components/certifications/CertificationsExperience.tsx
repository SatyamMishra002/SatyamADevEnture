"use client";

import { useState } from "react";
import type { Certificate } from "@/types";
import { CertWall } from "@/components/certifications/CertWall";
import { Reveal } from "@/components/ui/Reveal";

export function CertificationsExperience({
  certificates,
}: {
  certificates: Certificate[];
}) {
  const [activeId, setActiveId] = useState<string | null>(null);

  return (
    <div className="mx-auto max-w-5xl px-6 pb-32">
      <Reveal>
        <header className="pt-8 pb-20 md:pt-16 md:pb-28">
          <p className="font-mono text-[11px] tracking-[0.35em] text-text-muted uppercase">
            Certifications
          </p>
          <h1 className="font-display mt-6 max-w-3xl text-[clamp(2.4rem,6vw,4.5rem)] leading-[0.98] text-text">
            Proof of craft.
          </h1>
          <p className="mt-8 max-w-md text-lg leading-relaxed text-text-muted">
            Credentials earned along the way — tap any to zoom in, verify, and
            see the skills behind it.
          </p>
        </header>
      </Reveal>

      <Reveal>
        <CertWall
          certificates={certificates}
          activeId={activeId}
          onSelect={setActiveId}
          onClose={() => setActiveId(null)}
        />
      </Reveal>
    </div>
  );
}
