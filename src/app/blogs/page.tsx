import type { Metadata } from "next";
import { AppShell } from "@/components/layout/AppShell";
import { Reveal } from "@/components/ui/Reveal";
import { BlogList } from "@/components/blogs/BlogList";
import { getBlogs, getSite } from "@/lib/content";

export const metadata: Metadata = {
  title: "Blogs",
  description:
    "Essays on calm APIs, production ML, respectful scraping, and the craft of shipping quietly.",
};

export default function BlogsPage() {
  const site = getSite();
  const blogs = getBlogs();

  return (
    <AppShell
      searchItems={blogs.map((b) => ({
        id: b.id,
        title: b.title,
        subtitle: b.excerpt,
        href: `/blogs/${b.slug}/`,
        group: "Blogs",
      }))}
    >
      <div className="mx-auto max-w-3xl px-6 pb-28">
        <Reveal>
          <header className="pt-4 pb-12">
            <p className="font-mono text-[11px] tracking-[0.35em] text-text-muted uppercase">
              Writing · {site.name}
            </p>
            <h1 className="font-display mt-6 text-[clamp(2.4rem,6vw,4rem)] leading-[0.95] text-text">
              Notes on systems
              <br />
              <span className="text-text-muted">and stillness.</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg text-text-muted">
              Medium-minimal essays — reading time listed, noise removed.
            </p>
          </header>
        </Reveal>

        <BlogList posts={blogs} />
      </div>
    </AppShell>
  );
}
