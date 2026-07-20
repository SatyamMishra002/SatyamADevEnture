"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Vlog } from "@/types";
import { formatDate } from "@/lib/utils";
import { Reveal } from "@/components/ui/Reveal";

const PROGRESS_KEY = "satyam-vlog-progress";

function readProgress(): Record<string, number> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(PROGRESS_KEY) ?? "{}") as Record<
      string,
      number
    >;
  } catch {
    return {};
  }
}

function writeProgress(id: string, percent: number) {
  const next = { ...readProgress(), [id]: percent };
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(next));
}

export function VlogsExperience({
  featured,
  rest,
  all,
  categories,
}: {
  featured: Vlog | undefined;
  rest: Vlog[];
  all: Vlog[];
  categories: string[];
}) {
  const [category, setCategory] = useState<string>("All");
  const [progress, setProgress] = useState<Record<string, number>>({});

  useEffect(() => {
    setProgress(readProgress());
  }, []);

  const filtered = useMemo(() => {
    const pool = category === "All" ? all : all.filter((v) => v.category === category);
    return pool;
  }, [all, category]);

  const feature =
    featured && (category === "All" || featured.category === category)
      ? featured
      : filtered[0];
  const grid = filtered.filter((v) => v.id !== feature?.id);

  const markWatched = (id: string) => {
    writeProgress(id, 100);
    setProgress(readProgress());
  };

  if (!feature) {
    return (
      <p className="text-text-muted">No vlogs in this category yet.</p>
    );
  }

  return (
    <div>
      <Reveal>
        <div className="overflow-hidden rounded-sm border border-border bg-bg-elevated">
          <div className="aspect-video w-full bg-bg">
            <iframe
              title={feature.title}
              src={`https://www.youtube.com/embed/${feature.youtubeId}`}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              onLoad={() => markWatched(feature.id)}
            />
          </div>
          <div className="flex flex-wrap items-end justify-between gap-4 p-6 md:p-8">
            <div>
              <p className="font-mono text-[11px] tracking-[0.25em] text-text-muted uppercase">
                Featured · {feature.category} · {feature.duration}
              </p>
              <h2 className="font-display mt-3 text-2xl text-text md:text-3xl">
                {feature.title}
              </h2>
              <p className="mt-3 max-w-2xl text-text-muted">
                {feature.description}
              </p>
            </div>
            <Link
              href={`/vlogs/${feature.slug}/`}
              className="text-sm text-accent transition hover:opacity-80"
            >
              Open details →
            </Link>
          </div>
          {progress[feature.id] ? (
            <div className="h-0.5 bg-accent/20">
              <div
                className="h-full bg-accent/70 transition-all"
                style={{ width: `${progress[feature.id]}%` }}
              />
            </div>
          ) : null}
        </div>
      </Reveal>

      <div className="mt-12 flex flex-wrap gap-2">
        {["All", ...categories].map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCategory(c)}
            className={`rounded-full px-4 py-2 text-sm transition ${
              category === c
                ? "bg-accent text-bg"
                : "border border-border text-text-muted hover:text-text"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {(category === "All" ? rest : grid).map((v, i) => (
          <Reveal key={v.id} delay={i * 0.05}>
            <Link href={`/vlogs/${v.slug}/`} className="group block">
              <div className="relative overflow-hidden rounded-sm">
                <img
                  src={v.thumbnail}
                  alt=""
                  className="aspect-video w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                />
                <span className="absolute right-3 bottom-3 rounded bg-bg/80 px-2 py-0.5 font-mono text-[10px] text-text backdrop-blur">
                  {v.duration}
                </span>
                {progress[v.id] ? (
                  <div className="absolute inset-x-0 bottom-0 h-0.5 bg-accent/20">
                    <div
                      className="h-full bg-accent"
                      style={{ width: `${progress[v.id]}%` }}
                    />
                  </div>
                ) : null}
              </div>
              <p className="mt-4 font-mono text-[11px] tracking-[0.2em] text-text-muted uppercase">
                {v.category} · {formatDate(v.publishedAt)}
              </p>
              <h3 className="font-display mt-2 text-xl text-text">{v.title}</h3>
              <p className="mt-2 line-clamp-2 text-sm text-text-muted">
                {v.description}
              </p>
            </Link>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
