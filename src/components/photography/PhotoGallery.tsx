"use client";

import { useEffect, useMemo, useState } from "react";
import type { Photo } from "@/types";
import { Reveal } from "@/components/ui/Reveal";

const MODES = ["All", "landscape", "portrait", "night"] as const;

export function PhotoGallery({ photos }: { photos: Photo[] }) {
  const [mode, setMode] = useState<(typeof MODES)[number]>("All");
  const [collection, setCollection] = useState("All");
  const [active, setActive] = useState<Photo | null>(null);

  const collections = useMemo(
    () => ["All", ...Array.from(new Set(photos.map((p) => p.collection)))],
    [photos],
  );

  const filtered = useMemo(() => {
    return photos.filter((p) => {
      const modeOk = mode === "All" || p.mode === mode;
      const colOk = collection === "All" || p.collection === collection;
      return modeOk && colOk;
    });
  }, [photos, mode, collection]);

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        const idx = filtered.findIndex((p) => p.id === active.id);
        if (idx < 0) return;
        const next =
          e.key === "ArrowRight"
            ? filtered[(idx + 1) % filtered.length]
            : filtered[(idx - 1 + filtered.length) % filtered.length];
        setActive(next);
      }
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [active, filtered]);

  return (
    <div>
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {MODES.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`rounded-full px-4 py-2 text-sm capitalize transition ${
                mode === m
                  ? "bg-accent text-bg"
                  : "border border-border text-text-muted hover:text-text"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {collections.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCollection(c)}
              className={`rounded-full px-3 py-1.5 text-xs transition ${
                collection === c
                  ? "border border-accent/40 text-accent"
                  : "text-text-muted hover:text-text"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-10 columns-1 gap-4 sm:columns-2 lg:columns-3">
        {filtered.map((photo, i) => (
          <Reveal key={photo.id} delay={(i % 6) * 0.04} className="mb-4 break-inside-avoid">
            <button
              type="button"
              onClick={() => setActive(photo)}
              className="group w-full text-left"
            >
              <img
                src={photo.src}
                alt={photo.title}
                className={`w-full rounded-sm object-cover transition duration-500 group-hover:opacity-90 ${
                  photo.mode === "portrait" ? "aspect-[3/4]" : "aspect-[4/3]"
                }`}
              />
              <div className="mt-3 flex items-baseline justify-between gap-3">
                <p className="font-display text-base text-text">{photo.title}</p>
                <span className="font-mono text-[10px] tracking-wider text-text-muted uppercase">
                  {photo.mode}
                </span>
              </div>
              {photo.location && (
                <p className="mt-1 text-sm text-text-muted">{photo.location}</p>
              )}
            </button>
          </Reveal>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="mt-12 text-text-muted">No frames match these filters.</p>
      )}

      {active && (
        <div
          role="dialog"
          aria-modal
          aria-label={active.title}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-bg/95 p-4 backdrop-blur-md md:p-10"
          onClick={() => setActive(null)}
        >
          <button
            type="button"
            className="absolute top-6 right-6 font-mono text-xs tracking-widest text-text-muted uppercase hover:text-text"
            onClick={() => setActive(null)}
          >
            Close · Esc
          </button>
          <div
            className="grid w-full max-w-5xl gap-8 lg:grid-cols-[minmax(0,1fr)_240px]"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={active.src}
              alt={active.title}
              className="max-h-[75vh] w-full rounded-sm object-contain"
            />
            <div className="self-end lg:self-center">
              <p className="font-mono text-[11px] tracking-[0.25em] text-text-muted uppercase">
                {active.collection} · {active.mode}
              </p>
              <h2 className="font-display mt-3 text-2xl text-text">
                {active.title}
              </h2>
              {active.location && (
                <p className="mt-2 text-text-muted">{active.location}</p>
              )}
              {active.exif && (
                <dl className="mt-8 space-y-2 border-t border-border pt-6 text-sm">
                  {Object.entries(active.exif).map(([k, v]) =>
                    v ? (
                      <div key={k} className="flex justify-between gap-4">
                        <dt className="capitalize text-text-muted">{k}</dt>
                        <dd className="font-mono text-text">{v}</dd>
                      </div>
                    ) : null,
                  )}
                </dl>
              )}
              <p className="mt-6 font-mono text-[10px] text-text-muted">
                ← → to navigate
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
