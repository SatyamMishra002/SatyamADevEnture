import type { MetadataRoute } from "next";
import {
  getAdventures,
  getBlogs,
  getProjects,
  getVlogs,
} from "@/lib/content";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://satyam.dev";
  const staticRoutes = [
    "",
    "/about/",
    "/projects/",
    "/experience/",
    "/certifications/",
    "/adventure/",
    "/vlogs/",
    "/photography/",
    "/blogs/",
    "/contact/",
    "/terminal/",
  ].map((path) => ({
    url: `${base}${path || "/"}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  const projects = getProjects().map((p) => ({
    url: `${base}/projects/${p.slug}/`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const blogs = getBlogs().map((b) => ({
    url: `${base}/blogs/${b.slug}/`,
    lastModified: new Date(b.date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const adventures = getAdventures().map((a) => ({
    url: `${base}/adventure/${a.slug}/`,
    lastModified: new Date(a.date),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const vlogs = getVlogs().map((v) => ({
    url: `${base}/vlogs/${v.slug}/`,
    lastModified: new Date(v.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [...staticRoutes, ...projects, ...blogs, ...adventures, ...vlogs];
}
