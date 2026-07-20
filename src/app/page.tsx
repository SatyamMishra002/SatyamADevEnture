import {
  getAdventures,
  getBlogs,
  getPhotos,
  getProjects,
  getSite,
  getSkills,
} from "@/lib/content";
import { AppShell } from "@/components/layout/AppShell";
import { HomeExperience } from "@/components/home/HomeExperience";

export default function HomePage() {
  const site = getSite();
  const projects = getProjects();
  const blogs = getBlogs();
  const adventures = getAdventures();
  const photos = getPhotos();
  const skills = getSkills();

  const searchItems = [
    ...projects.map((p) => ({
      id: p.id,
      title: p.title,
      subtitle: p.subtitle,
      href: `/projects/${p.slug}/`,
      group: "Projects",
    })),
    ...blogs.map((b) => ({
      id: b.id,
      title: b.title,
      subtitle: b.excerpt,
      href: `/blogs/${b.slug}/`,
      group: "Blogs",
    })),
    ...adventures.map((a) => ({
      id: a.id,
      title: a.title,
      subtitle: a.place,
      href: `/adventure/${a.slug}/`,
      group: "Adventure",
    })),
  ];

  return (
    <AppShell showParticles searchItems={searchItems}>
      <HomeExperience
        site={site}
        latestProject={projects.find((p) => p.featured) ?? projects[0]}
        latestBlog={blogs.find((b) => b.featured) ?? blogs[0]}
        adventure={adventures[0]}
        photo={photos.find((p) => p.favorite) ?? photos[0]}
        skills={skills.slice(0, 8)}
      />
    </AppShell>
  );
}
