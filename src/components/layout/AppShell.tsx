"use client";

import { useEffect, useState } from "react";
import { FloatingNav } from "@/components/layout/FloatingNav";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { CommandPalette } from "@/components/ui/CommandPalette";
import { ParticleField } from "@/components/home/ParticleField";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { AiAssistant } from "@/components/ui/AiAssistant";
import { ServiceWorkerRegister } from "@/components/pwa/ServiceWorkerRegister";

export function AppShell({
  children,
  searchItems = [],
  showParticles = false,
  adventure = false,
}: {
  children: React.ReactNode;
  searchItems?: {
    id: string;
    title: string;
    subtitle?: string;
    href: string;
    group: string;
  }[];
  showParticles?: boolean;
  adventure?: boolean;
}) {
  const [cmdOpen, setCmdOpen] = useState(false);
  const [booted, setBooted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setBooted(true), 600);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className={adventure ? "adventure-theme noise mesh min-h-screen" : "noise mesh min-h-screen"}>
      {!booted && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-bg">
          <div className="font-display text-sm tracking-[0.3em] text-text-muted uppercase">
            Satyam
          </div>
        </div>
      )}
      {showParticles && <ParticleField />}
      <CustomCursor />
      <ScrollProgress />
      <FloatingNav onOpenCommand={() => setCmdOpen(true)} />
      <CommandPalette
        open={cmdOpen}
        onOpenChange={setCmdOpen}
        items={[
          ...searchItems,
          {
            id: "action-terminal",
            title: "Open terminal",
            href: "/terminal/",
            group: "Actions",
          },
          {
            id: "action-admin",
            title: "Admin panel",
            href: "/admin/",
            group: "Actions",
          },
        ]}
      />
      <main className="relative z-10 flex-1 pt-24">{children}</main>
      <SiteFooter />
      <AiAssistant />
      <ServiceWorkerRegister />
    </div>
  );
}
