"use client";

import { useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Certificate } from "@/types";
import { formatDate } from "@/lib/utils";

export function CertWall({
  certificates,
  activeId,
  onSelect,
  onClose,
}: {
  certificates: Certificate[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onClose: () => void;
}) {
  const active = certificates.find((c) => c.id === activeId) ?? null;

  const onKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (!active) return;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [active, onKey]);

  return (
    <>
      <ul className="grid gap-6 sm:grid-cols-2">
        {certificates.map((cert, i) => (
          <li key={cert.id}>
            <button
              type="button"
              onClick={() => onSelect(cert.id)}
              className="group w-full text-left"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <div className="relative aspect-[4/3] overflow-hidden border border-border bg-bg-card transition duration-500 group-hover:border-border-strong">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={cert.image}
                  alt={cert.title}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg/80 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
              </div>
              <div className="mt-5">
                <p className="font-mono text-[10px] tracking-[0.25em] text-text-muted uppercase">
                  {cert.issuer}
                </p>
                <h2 className="font-display mt-2 text-xl text-text transition group-hover:text-accent md:text-2xl">
                  {cert.title}
                </h2>
                <p className="mt-2 font-mono text-xs text-text-muted">
                  {formatDate(cert.date)}
                </p>
              </div>
            </button>
          </li>
        ))}
      </ul>

      <AnimatePresence>
        {active && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <button
              type="button"
              aria-label="Close"
              className="absolute inset-0 bg-bg/85 backdrop-blur-md"
              onClick={onClose}
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="cert-title"
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="glass relative z-10 max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl p-6 md:p-10"
            >
              <button
                type="button"
                onClick={onClose}
                className="absolute top-5 right-5 font-mono text-xs text-text-muted transition hover:text-text"
              >
                Esc
              </button>

              <div className="relative aspect-[16/10] overflow-hidden rounded-lg border border-border bg-bg-card">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={active.image}
                  alt={active.title}
                  className="h-full w-full object-contain"
                />
              </div>

              <h2
                id="cert-title"
                className="font-display mt-8 text-2xl text-text md:text-3xl"
              >
                {active.title}
              </h2>
              <p className="mt-2 text-text-muted">{active.issuer}</p>
              <p className="mt-1 font-mono text-xs text-text-muted">
                Completed {formatDate(active.date)}
                {active.credentialId ? ` · ${active.credentialId}` : ""}
              </p>

              {active.skills.length > 0 && (
                <ul className="mt-6 flex flex-wrap gap-3">
                  {active.skills.map((s) => (
                    <li
                      key={s}
                      className="font-mono text-[10px] tracking-[0.15em] text-text-muted uppercase"
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              )}

              {active.verifyUrl && (
                <a
                  href={active.verifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 inline-flex text-sm text-accent transition hover:opacity-80"
                >
                  Verify credential →
                </a>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
