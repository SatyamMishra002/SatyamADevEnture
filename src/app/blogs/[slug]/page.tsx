import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBlog, getBlogs } from "@/lib/content";
import { AppShell } from "@/components/layout/AppShell";
import { BlogArticle } from "@/components/blogs/BlogArticle";

export function generateStaticParams() {
  return getBlogs().map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlog(slug);
  if (!post) return { title: "Post" };
  return { title: post.title, description: post.excerpt };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlog(slug);
  if (!post) notFound();
  const related = getBlogs()
    .filter((b) => b.slug !== slug)
    .filter((b) => b.category === post.category || b.tags.some((t) => post.tags.includes(t)))
    .slice(0, 3);

  return (
    <AppShell
      searchItems={getBlogs().map((b) => ({
        id: b.id,
        title: b.title,
        subtitle: b.excerpt,
        href: `/blogs/${b.slug}/`,
        group: "Blogs",
      }))}
    >
      <BlogArticle post={post} related={related} />
    </AppShell>
  );
}
