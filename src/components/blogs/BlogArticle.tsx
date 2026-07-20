"use client";

import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { BlogPost } from "@/types";
import { ReadingProgress } from "@/components/blogs/ReadingProgress";
import { TextLink } from "@/components/ui/TextLink";
import { formatDate } from "@/lib/utils";

function extractToc(markdown: string) {
  return markdown
    .split("\n")
    .filter((l) => /^#{2,3}\s+/.test(l))
    .map((l) => {
      const level = l.startsWith("###") ? 3 : 2;
      const text = l.replace(/^#{2,3}\s+/, "").trim();
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-");
      return { level, text, id };
    });
}

export function BlogArticle({
  post,
  related,
}: {
  post: BlogPost;
  related: BlogPost[];
}) {
  const toc = extractToc(post.content);

  return (
    <article className="mx-auto max-w-6xl px-6 pb-28">
      <ReadingProgress />
      <header className="mx-auto max-w-3xl pt-6">
        <p className="font-mono text-[11px] tracking-[0.3em] text-text-muted uppercase">
          {post.category} · {post.readingTime} · {formatDate(post.date)}
        </p>
        <h1 className="font-display mt-6 text-4xl text-text md:text-6xl">{post.title}</h1>
        <p className="mt-6 text-lg text-text-muted">{post.excerpt}</p>
      </header>

      <div className="mt-16 grid gap-12 lg:grid-cols-[200px_minmax(0,1fr)]">
        <aside className="hidden lg:block">
          <div className="sticky top-28">
            <p className="font-mono text-[10px] tracking-widest text-text-muted uppercase">
              Contents
            </p>
            <ul className="mt-4 space-y-2">
              {toc.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className={
                      item.level === 3
                        ? "pl-3 text-xs text-text-muted hover:text-text"
                        : "text-sm text-text-muted hover:text-text"
                    }
                  >
                    {item.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <div className="prose-calm mx-auto max-w-2xl">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h2: ({ children }) => {
                const text = String(children);
                const id = text
                  .toLowerCase()
                  .replace(/[^a-z0-9\s-]/g, "")
                  .replace(/\s+/g, "-");
                return <h2 id={id}>{children}</h2>;
              },
              h3: ({ children }) => {
                const text = String(children);
                const id = text
                  .toLowerCase()
                  .replace(/[^a-z0-9\s-]/g, "")
                  .replace(/\s+/g, "-");
                return <h3 id={id}>{children}</h3>;
              },
            }}
          >
            {post.content}
          </ReactMarkdown>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mx-auto mt-24 max-w-3xl border-t border-border pt-12">
          <h2 className="font-display text-2xl text-text">Related</h2>
          <ul className="mt-6 space-y-4">
            {related.map((r) => (
              <li key={r.id}>
                <TextLink href={`/blogs/${r.slug}/`}>{r.title}</TextLink>
              </li>
            ))}
          </ul>
          <div className="mt-10">
            <Link href="/blogs/" className="text-sm text-text-muted hover:text-text">
              ← All writing
            </Link>
          </div>
        </section>
      )}
    </article>
  );
}
