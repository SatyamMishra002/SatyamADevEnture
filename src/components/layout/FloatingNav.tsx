"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Command, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { navLinks } from "@/lib/content";

export function FloatingNav({ onOpenCommand }: { onOpenCommand: () => void }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  const primary = navLinks.filter((l) =>
    ["/", "/about/", "/projects/", "/adventure/", "/blogs/", "/contact/"].includes(
      l.href,
    ),
  );

  return (
    <>
      <motion.header
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "fixed left-1/2 top-5 z-40 flex w-[min(1100px,calc(100%-1.5rem))] -translate-x-1/2 items-center justify-between rounded-full px-4 py-2.5 transition-all duration-500",
          scrolled ? "glass shadow-[0_8px_40px_rgba(0,0,0,0.35)]" : "bg-transparent",
        )}
      >
        <Link
          href="/"
          className="font-display text-sm tracking-tight text-text transition hover:text-accent"
        >
          Satyam
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {primary.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href.replace(/\/$/, ""));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs tracking-wide transition",
                  active
                    ? "bg-accent-soft text-accent"
                    : "text-text-muted hover:text-text",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenCommand}
            className="hidden items-center gap-2 rounded-full border border-border px-3 py-1.5 text-xs text-text-muted transition hover:border-border-strong hover:text-text sm:inline-flex"
            aria-label="Open command palette"
          >
            <Command className="h-3.5 w-3.5" />
            <span>Search</span>
            <kbd className="rounded bg-bg-card px-1.5 py-0.5 font-mono text-[10px]">
              ⌘K
            </kbd>
          </button>
          <button
            type="button"
            className="inline-flex rounded-full border border-border p-2 text-text-muted md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 bg-bg/90 backdrop-blur-md md:hidden"
          >
            <nav className="flex h-full flex-col justify-center gap-2 px-8">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.03 * i }}
                >
                  <Link
                    href={link.href}
                    className="font-display block py-2 text-3xl text-text"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
