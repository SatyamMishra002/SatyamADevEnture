"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { BlogPost } from "@/types";
import { formatDate } from "@/lib/utils";
import { Reveal } from "@/components/ui/Reveal";

export function BlogList({ posts }: { posts: BlogPost[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(posts.map((p) => p.category)))],
    [posts],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((p) => {
      const catOk = category === "All" || p.category === category;
      if (!catOk) return false;
      if (!q) return true;
      return (
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [posts, query, category]);

  return (
    <div>
      <div className="flex flex-col gap-4 border-b border-border pb-8 sm:flex-row sm:items-end sm:justify-between">
        <label className="block flex-1">
          <span className="font-mono text-[11px] tracking-[0.25em] text-text-muted uppercase">
            Search
          </span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Title, tag, or idea…"
            className="mt-2 w-full border-0 border-b border-border bg-transparent py-3 text-text outline-none placeholder:text-text-muted/50 focus:border-accent/40"
          />
        </label>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={`rounded-full px-3 py-1.5 text-xs transition ${
                category === c
                  ? "bg-accent text-bg"
                  : "text-text-muted hover:text-text"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <ul className="mt-4">
        {filtered.map((post, i) => (
          <Reveal key={post.id} delay={i * 0.04}>
            <li className="border-b border-border">
              <Link
                href={`/blogs/${post.slug}/`}
                className="group grid gap-3 py-10 md:grid-cols-[140px_minmax(0,1fr)_auto] md:items-baseline"
              >
                <time className="font-mono text-xs text-text-muted">
                  {formatDate(post.date)}
                </time>
                <div>
                  <p className="font-mono text-[11px] tracking-[0.2em] text-text-muted uppercase">
                    {post.category} · {post.readingTime}
                  </p>
                  <h2 className="font-display mt-2 text-2xl text-text transition group-hover:text-accent md:text-3xl">
                    {post.title}
                  </h2>
                  <p className="mt-3 max-w-2xl text-text-muted">{post.excerpt}</p>
                </div>
                <span className="hidden text-sm text-text-muted transition group-hover:text-accent md:inline">
                  Read →
                </span>
              </Link>
            </li>
          </Reveal>
        ))}
      </ul>

      {filtered.length === 0 && (
        <p className="mt-12 text-text-muted">No essays match that search.</p>
      )}
    </div>
  );
}
