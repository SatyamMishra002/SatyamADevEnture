"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Adventure,
  BlogPost,
  Certificate,
  Experience,
  Photo,
  Project,
  SiteSettings,
  Skill,
  Vlog,
  ActivityLog,
} from "@/types";

type ContentState = {
  authenticated: boolean;
  token: string | null;
  site: SiteSettings | null;
  projects: Project[];
  certificates: Certificate[];
  experience: Experience[];
  adventures: Adventure[];
  vlogs: Vlog[];
  photography: Photo[];
  blogs: BlogPost[];
  skills: Skill[];
  logs: ActivityLog[];
  login: (password: string) => boolean;
  logout: () => void;
  hydrate: (data: Partial<ContentState>) => void;
  upsertProject: (p: Project) => void;
  deleteProject: (id: string) => void;
  upsertBlog: (b: BlogPost) => void;
  deleteBlog: (id: string) => void;
  upsertCertificate: (c: Certificate) => void;
  deleteCertificate: (id: string) => void;
  upsertAdventure: (a: Adventure) => void;
  deleteAdventure: (id: string) => void;
  upsertVlog: (v: Vlog) => void;
  deleteVlog: (id: string) => void;
  upsertPhoto: (p: Photo) => void;
  deletePhoto: (id: string) => void;
  upsertExperience: (e: Experience) => void;
  deleteExperience: (id: string) => void;
  setSkills: (s: Skill[]) => void;
  setSite: (s: SiteSettings) => void;
  exportAll: () => string;
  log: (action: string, entity: string) => void;
};

const ADMIN_PASSWORD = "satyam-admin";

function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

export const useAdminStore = create<ContentState>()(
  persist(
    (set, get) => ({
      authenticated: false,
      token: null,
      site: null,
      projects: [],
      certificates: [],
      experience: [],
      adventures: [],
      vlogs: [],
      photography: [],
      blogs: [],
      skills: [],
      logs: [],
      login: (password) => {
        if (password === ADMIN_PASSWORD) {
          const token = btoa(`${Date.now()}:satyam`);
          set({ authenticated: true, token });
          get().log("login", "auth");
          return true;
        }
        return false;
      },
      logout: () => {
        get().log("logout", "auth");
        set({ authenticated: false, token: null });
      },
      hydrate: (data) => set({ ...data }),
      log: (action, entity) =>
        set({
          logs: [
            {
              id: uid("log"),
              action,
              entity,
              timestamp: new Date().toISOString(),
              user: "admin",
            },
            ...get().logs,
          ].slice(0, 100),
        }),
      upsertProject: (p) => {
        const list = get().projects;
        const exists = list.some((x) => x.id === p.id);
        set({
          projects: exists
            ? list.map((x) => (x.id === p.id ? p : x))
            : [p, ...list],
        });
        get().log(exists ? "update" : "create", `project:${p.slug}`);
      },
      deleteProject: (id) => {
        set({ projects: get().projects.filter((p) => p.id !== id) });
        get().log("delete", `project:${id}`);
      },
      upsertBlog: (b) => {
        const list = get().blogs;
        const exists = list.some((x) => x.id === b.id);
        set({
          blogs: exists ? list.map((x) => (x.id === b.id ? b : x)) : [b, ...list],
        });
        get().log(exists ? "update" : "create", `blog:${b.slug}`);
      },
      deleteBlog: (id) => {
        set({ blogs: get().blogs.filter((b) => b.id !== id) });
        get().log("delete", `blog:${id}`);
      },
      upsertCertificate: (c) => {
        const list = get().certificates;
        const exists = list.some((x) => x.id === c.id);
        set({
          certificates: exists
            ? list.map((x) => (x.id === c.id ? c : x))
            : [c, ...list],
        });
        get().log(exists ? "update" : "create", `certificate:${c.id}`);
      },
      deleteCertificate: (id) => {
        set({ certificates: get().certificates.filter((c) => c.id !== id) });
        get().log("delete", `certificate:${id}`);
      },
      upsertAdventure: (a) => {
        const list = get().adventures;
        const exists = list.some((x) => x.id === a.id);
        set({
          adventures: exists
            ? list.map((x) => (x.id === a.id ? a : x))
            : [a, ...list],
        });
        get().log(exists ? "update" : "create", `adventure:${a.slug}`);
      },
      deleteAdventure: (id) => {
        set({ adventures: get().adventures.filter((a) => a.id !== id) });
        get().log("delete", `adventure:${id}`);
      },
      upsertVlog: (v) => {
        const list = get().vlogs;
        const exists = list.some((x) => x.id === v.id);
        set({
          vlogs: exists ? list.map((x) => (x.id === v.id ? v : x)) : [v, ...list],
        });
        get().log(exists ? "update" : "create", `vlog:${v.slug}`);
      },
      deleteVlog: (id) => {
        set({ vlogs: get().vlogs.filter((v) => v.id !== id) });
        get().log("delete", `vlog:${id}`);
      },
      upsertPhoto: (p) => {
        const list = get().photography;
        const exists = list.some((x) => x.id === p.id);
        set({
          photography: exists
            ? list.map((x) => (x.id === p.id ? p : x))
            : [p, ...list],
        });
        get().log(exists ? "update" : "create", `photo:${p.id}`);
      },
      deletePhoto: (id) => {
        set({ photography: get().photography.filter((p) => p.id !== id) });
        get().log("delete", `photo:${id}`);
      },
      upsertExperience: (e) => {
        const list = get().experience;
        const exists = list.some((x) => x.id === e.id);
        set({
          experience: exists
            ? list.map((x) => (x.id === e.id ? e : x))
            : [e, ...list],
        });
        get().log(exists ? "update" : "create", `experience:${e.id}`);
      },
      deleteExperience: (id) => {
        set({ experience: get().experience.filter((e) => e.id !== id) });
        get().log("delete", `experience:${id}`);
      },
      setSkills: (skills) => {
        set({ skills });
        get().log("update", "skills");
      },
      setSite: (site) => {
        set({ site });
        get().log("update", "site");
      },
      exportAll: () =>
        JSON.stringify(
          {
            site: get().site,
            projects: get().projects,
            certificates: get().certificates,
            experience: get().experience,
            adventures: get().adventures,
            vlogs: get().vlogs,
            photography: get().photography,
            blogs: get().blogs,
            skills: get().skills,
          },
          null,
          2,
        ),
    }),
    { name: "satyam-admin-cms" },
  ),
);

export { uid };
