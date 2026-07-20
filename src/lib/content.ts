import site from "../../content/site.json";
import about from "../../content/about.json";
import projects from "../../content/projects.json";
import certificates from "../../content/certificates.json";
import experience from "../../content/experience.json";
import adventures from "../../content/adventures.json";
import vlogs from "../../content/vlogs.json";
import photography from "../../content/photography.json";
import blogs from "../../content/blogs.json";
import skills from "../../content/skills.json";
import guestbook from "../../content/guestbook.json";
import extras from "../../content/extras.json";
import type {
  AboutContent,
  Adventure,
  BlogPost,
  Certificate,
  Experience,
  GuestbookEntry,
  Photo,
  Project,
  SiteSettings,
  Skill,
  Vlog,
} from "@/types";

export const getSite = () => site as SiteSettings;
export const getAbout = () => about as AboutContent;
export const getProjects = () =>
  (projects as Project[]).filter((p) => p.status !== "draft");
export const getAllProjects = () => projects as Project[];
export const getProject = (slug: string) =>
  getProjects().find((p) => p.slug === slug);
export const getCertificates = () => certificates as Certificate[];
export const getExperience = () => experience as Experience[];
export const getAdventures = () => adventures as Adventure[];
export const getAdventure = (slug: string) =>
  getAdventures().find((a) => a.slug === slug);
export const getVlogs = () => vlogs as Vlog[];
export const getVlog = (slug: string) => getVlogs().find((v) => v.slug === slug);
export const getPhotos = () => photography as Photo[];
export const getBlogs = () =>
  (blogs as BlogPost[]).filter((b) => b.status === "published");
export const getAllBlogs = () => blogs as BlogPost[];
export const getBlog = (slug: string) => getBlogs().find((b) => b.slug === slug);
export const getSkills = () => skills as Skill[];
export const getGuestbook = () => guestbook as GuestbookEntry[];
export const getExtras = () => extras;

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about/", label: "About" },
  { href: "/projects/", label: "Projects" },
  { href: "/experience/", label: "Experience" },
  { href: "/certifications/", label: "Certifications" },
  { href: "/adventure/", label: "Adventure" },
  { href: "/vlogs/", label: "Vlogs" },
  { href: "/photography/", label: "Photography" },
  { href: "/blogs/", label: "Blogs" },
  { href: "/contact/", label: "Contact" },
] as const;
