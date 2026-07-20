export type SiteSettings = {
  name: string;
  title: string;
  tagline: string;
  description: string;
  email: string;
  location: string;
  city: string;
  availability: string;
  resumeUrl: string;
  social: {
    github: string;
    linkedin: string;
    twitter: string;
    youtube?: string;
    instagram?: string;
  };
  spotify?: {
    track: string;
    artist: string;
    url?: string;
  };
};

export type Project = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  summary: string;
  cover: string;
  gallery: string[];
  videos?: string[];
  status: "published" | "draft" | "featured";
  featured: boolean;
  year: number;
  role: string;
  timeline: { label: string; date: string }[];
  problem: string;
  motivation: string;
  architecture: string;
  challenges: string[];
  performance: string[];
  lessons: string[];
  future: string[];
  stats: { label: string; value: string }[];
  tech: string[];
  github?: string;
  live?: string;
  tags: string[];
};

export type Certificate = {
  id: string;
  title: string;
  issuer: string;
  date: string;
  image: string;
  credentialId?: string;
  verifyUrl?: string;
  skills: string[];
};

export type Experience = {
  id: string;
  company: string;
  role: string;
  location: string;
  start: string;
  end: string | null;
  summary: string;
  highlights: string[];
  tech: string[];
};

export type Adventure = {
  id: string;
  slug: string;
  title: string;
  place: string;
  country: string;
  date: string;
  cover: string;
  gallery: string[];
  journal: string;
  lat: number;
  lng: number;
  elevation?: string;
  memories: string[];
};

export type Vlog = {
  id: string;
  slug: string;
  title: string;
  description: string;
  thumbnail: string;
  youtubeId: string;
  category: string;
  publishedAt: string;
  duration: string;
  likes: number;
  featured?: boolean;
};

export type Photo = {
  id: string;
  title: string;
  src: string;
  collection: string;
  mode: "landscape" | "portrait" | "night";
  favorite?: boolean;
  location?: string;
  exif?: {
    camera: string;
    lens?: string;
    aperture?: string;
    shutter?: string;
    iso?: string;
    focal?: string;
  };
};

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  cover?: string;
  date: string;
  updated?: string;
  category: string;
  tags: string[];
  readingTime: string;
  content: string;
  status: "published" | "draft";
  featured?: boolean;
};

export type Skill = {
  name: string;
  category: "language" | "framework" | "tool" | "ml" | "soft";
  level: number;
};

export type AboutContent = {
  journey: { year: string; title: string; text: string }[];
  lessons: string[];
  beliefs: string[];
  howIWork: string[];
  workflow: { step: string; detail: string }[];
  goals: string[];
  vision: string;
  technologies: string[];
  books: { title: string; author: string; note: string }[];
  workspace: string[];
  tools: string[];
};

export type GuestbookEntry = {
  id: string;
  name: string;
  message: string;
  date: string;
};

export type ActivityLog = {
  id: string;
  action: string;
  entity: string;
  timestamp: string;
  user: string;
};
