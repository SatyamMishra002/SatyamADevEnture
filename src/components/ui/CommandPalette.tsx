"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { Search } from "lucide-react";
import { navLinks } from "@/lib/content";

type SearchItem = {
  id: string;
  title: string;
  subtitle?: string;
  href: string;
  group: string;
};

export function CommandPalette({
  open,
  onOpenChange,
  items,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  items: SearchItem[];
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onOpenChange(!open);
      }
      if (e.key === "Escape") onOpenChange(false);
    };
    window.addEventListener("keydown", down);
    return () => window.removeEventListener("keydown", down);
  }, [open, onOpenChange]);

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  if (!open) return null;

  const go = (href: string) => {
    onOpenChange(false);
    router.push(href);
  };

  const pages: SearchItem[] = navLinks.map((l) => ({
    id: `nav-${l.href}`,
    title: l.label,
    href: l.href,
    group: "Pages",
  }));

  const all: SearchItem[] = [...pages, ...items];

  return (
    <div className="fixed inset-0 z-[80] flex items-start justify-center bg-bg/70 px-4 pt-[15vh] backdrop-blur-sm">
      <button
        type="button"
        className="absolute inset-0"
        aria-label="Close command palette"
        onClick={() => onOpenChange(false)}
      />
      <Command className="glass relative z-10 w-full max-w-xl overflow-hidden rounded-2xl shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
        <div className="flex items-center gap-3 border-b border-border px-4">
          <Search className="h-4 w-4 text-text-muted" />
          <Command.Input
            value={query}
            onValueChange={setQuery}
            placeholder="Search pages, projects, blogs…"
            className="h-14 w-full bg-transparent text-sm text-text outline-none placeholder:text-text-muted"
          />
        </div>
        <Command.List className="max-h-80 overflow-y-auto p-2">
          <Command.Empty className="px-3 py-8 text-center text-sm text-text-muted">
            Nothing found.
          </Command.Empty>
          {["Pages", "Projects", "Blogs", "Adventure", "Actions"].map((group) => {
            const groupItems = all.filter((i) => i.group === group);
            if (!groupItems.length) return null;
            return (
              <Command.Group
                key={group}
                heading={group}
                className="px-1 py-2 text-[11px] tracking-widest text-text-muted uppercase [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:pb-2"
              >
                {groupItems.map((item) => (
                  <Command.Item
                    key={item.id}
                    value={`${item.title} ${item.subtitle ?? ""}`}
                    onSelect={() => go(item.href)}
                    className="flex cursor-pointer flex-col rounded-xl px-3 py-2.5 text-sm text-text aria-selected:bg-accent-soft"
                  >
                    <span>{item.title}</span>
                    {item.subtitle && (
                      <span className="text-xs text-text-muted">{item.subtitle}</span>
                    )}
                  </Command.Item>
                ))}
              </Command.Group>
            );
          })}
        </Command.List>
      </Command>
    </div>
  );
}
