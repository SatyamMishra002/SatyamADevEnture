import type { Metadata } from "next";
import { AdminApp } from "@/components/admin/AdminApp";
import {
  getAllBlogs,
  getAllProjects,
  getAdventures,
  getCertificates,
  getExperience,
  getPhotos,
  getSite,
  getSkills,
  getVlogs,
} from "@/lib/content";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <AdminApp
      seed={{
        site: getSite(),
        projects: getAllProjects(),
        certificates: getCertificates(),
        experience: getExperience(),
        adventures: getAdventures(),
        vlogs: getVlogs(),
        photography: getPhotos(),
        blogs: getAllBlogs(),
        skills: getSkills(),
      }}
    />
  );
}
