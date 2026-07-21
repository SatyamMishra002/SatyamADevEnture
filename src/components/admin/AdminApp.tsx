"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Activity,
  BookOpen,
  Camera,
  FileJson,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  Map,
  Settings,
  Video,
  Award,
  Briefcase,
  Sparkles,
  UploadCloud,
} from "lucide-react";
import { useAdminStore, uid } from "@/lib/admin-store";
import {
  clearGithubToken,
  clearStaleMediaQueue,
  getGithubToken,
  githubPublishMeta,
  publishContentToGithub,
  setGithubToken,
  uploadImageToGithub,
} from "@/lib/github-publish";
import { withBasePath } from "@/lib/paths";
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
} from "@/types";
import { cn } from "@/lib/utils";

type Seed = {
  site: SiteSettings;
  projects: Project[];
  certificates: Certificate[];
  experience: Experience[];
  adventures: Adventure[];
  vlogs: Vlog[];
  photography: Photo[];
  blogs: BlogPost[];
  skills: Skill[];
};

const nav = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "projects", label: "Projects", icon: FolderKanban },
  { id: "blogs", label: "Blogs", icon: BookOpen },
  { id: "certificates", label: "Certificates", icon: Award },
  { id: "experience", label: "Experience", icon: Briefcase },
  { id: "adventures", label: "Adventure", icon: Map },
  { id: "vlogs", label: "Vlogs", icon: Video },
  { id: "photography", label: "Photography", icon: Camera },
  { id: "skills", label: "Skills", icon: Sparkles },
  { id: "settings", label: "Site settings", icon: Settings },
  { id: "publish", label: "Publish live", icon: UploadCloud },
  { id: "export", label: "Export JSON", icon: FileJson },
  { id: "logs", label: "Activity", icon: Activity },
] as const;

type Tab = (typeof nav)[number]["id"];

export function AdminApp({ seed }: { seed: Seed }) {
  const store = useAdminStore();
  const [tab, setTab] = useState<Tab>("dashboard");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const s = useAdminStore.getState();
    const fingerprint = [
      seed.site.name,
      seed.site.city,
      seed.site.phone ?? "",
      seed.projects.map((p) => p.slug).join(","),
      seed.adventures.map((a) => a.slug).join(","),
      seed.photography.length,
      seed.certificates.map((c) => c.title).join(","),
    ].join("|");
    const key = "satyam-seed-fp";
    const prev = localStorage.getItem(key);
    if (prev !== fingerprint || !s.projects.length) {
      s.hydrate({
        site: seed.site,
        projects: seed.projects,
        certificates: seed.certificates,
        experience: seed.experience,
        adventures: seed.adventures,
        vlogs: seed.vlogs,
        photography: seed.photography,
        blogs: seed.blogs,
        skills: seed.skills,
      });
      localStorage.setItem(key, fingerprint);
    }
    setHydrated(true);
    clearStaleMediaQueue();
  }, [seed]);

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg text-text-muted">
        Loading CMS…
      </div>
    );
  }

  if (!store.authenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg px-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const ok = store.login(password);
            setError(ok ? "" : "Invalid credentials");
          }}
          className="glass w-full max-w-md rounded-3xl p-8"
        >
          <p className="font-mono text-[11px] tracking-[0.3em] text-text-muted uppercase">
            Admin
          </p>
          <h1 className="font-display mt-3 text-3xl text-text">Sign in</h1>
          <p className="mt-2 text-sm text-text-muted">
            Protected CMS for content, media metadata, and JSON export.
          </p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="mt-8 w-full rounded-xl border border-border bg-bg-card px-4 py-3 text-sm text-text outline-none focus:border-border-strong"
          />
          {error && <p className="mt-2 text-sm text-danger">{error}</p>}
          <button
            type="submit"
            className="mt-4 w-full rounded-full bg-accent py-3 text-sm text-bg"
          >
            Enter
          </button>
          <p className="mt-6 text-center text-xs text-text-muted">
            Demo password: <span className="font-mono">satyam-admin</span>
          </p>
          <Link href="/" className="mt-4 block text-center text-xs text-text-muted hover:text-text">
            ← Back to site
          </Link>
        </form>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-bg text-text">
      <aside className="sticky top-0 hidden h-screen w-64 flex-col border-r border-border bg-bg-elevated p-4 lg:flex">
        <div className="mb-8 px-2">
          <p className="font-display text-lg">Satyam CMS</p>
          <p className="text-xs text-text-muted">Content control plane</p>
        </div>
        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto">
          {nav.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition",
                tab === item.id
                  ? "bg-accent-soft text-accent"
                  : "text-text-muted hover:bg-bg-card hover:text-text",
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </button>
          ))}
        </nav>
        <button
          type="button"
          onClick={() => store.logout()}
          className="mt-4 flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-text-muted hover:text-text"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </aside>

      <div className="flex-1 overflow-x-hidden">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-bg/80 px-6 py-4 backdrop-blur-md">
          <div className="lg:hidden">
            <select
              value={tab}
              onChange={(e) => setTab(e.target.value as Tab)}
              className="rounded-lg border border-border bg-bg-card px-3 py-2 text-sm"
            >
              {nav.map((n) => (
                <option key={n.id} value={n.id}>
                  {n.label}
                </option>
              ))}
            </select>
          </div>
          <p className="font-mono hidden text-[11px] tracking-widest text-text-muted uppercase lg:block">
            {tab}
          </p>
          <Link href="/" className="text-sm text-text-muted hover:text-text">
            View site →
          </Link>
        </header>
        <div className="mx-auto max-w-5xl px-6 py-10 pb-28 lg:pb-10">
          {tab === "dashboard" && <Dashboard />}
          {tab === "projects" && <ProjectsPanel />}
          {tab === "blogs" && <BlogsPanel />}
          {tab === "certificates" && <CertsPanel />}
          {tab === "experience" && <ExperiencePanel />}
          {tab === "adventures" && <AdventuresPanel />}
          {tab === "vlogs" && <VlogsPanel />}
          {tab === "photography" && <PhotosPanel />}
          {tab === "skills" && <SkillsPanel />}
          {tab === "settings" && <SettingsPanel />}
          {tab === "publish" && <PublishPanel />}
          {tab === "export" && <ExportPanel />}
          {tab === "logs" && <LogsPanel />}
        </div>
      </div>
      <MobilePublishBar onOpenPublish={() => setTab("publish")} />
    </div>
  );
}

function Dashboard() {
  const s = useAdminStore();
  const stats = useMemo(
    () => [
      { label: "Projects", value: s.projects.length },
      { label: "Blogs", value: s.blogs.length },
      { label: "Photos", value: s.photography.length },
      { label: "Trips", value: s.adventures.length },
      { label: "Vlogs", value: s.vlogs.length },
      { label: "Certificates", value: s.certificates.length },
    ],
    [s],
  );
  return (
    <div>
      <h1 className="font-display text-4xl">Dashboard</h1>
      <p className="mt-2 text-text-muted">
        Edit on this device, then use <span className="text-accent">Publish live</span> so
        visitors see changes after Pages rebuilds (~1–2 min).
      </p>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-border bg-bg-card p-6">
            <p className="text-sm text-text-muted">{stat.label}</p>
            <p className="font-display mt-2 text-4xl">{stat.value}</p>
          </div>
        ))}
      </div>
      <div className="mt-10 rounded-2xl border border-border p-6">
        <h2 className="font-display text-xl">Recent activity</h2>
        <ul className="mt-4 space-y-2">
          {s.logs.slice(0, 8).map((l) => (
            <li key={l.id} className="flex justify-between gap-4 text-sm text-text-muted">
              <span>
                {l.action} · {l.entity}
              </span>
              <span className="font-mono text-[11px]">
                {new Date(l.timestamp).toLocaleString()}
              </span>
            </li>
          ))}
          {!s.logs.length && <li className="text-sm text-text-muted">No activity yet.</li>}
        </ul>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  textarea,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
}) {
  const cls =
    "mt-1 w-full rounded-xl border border-border bg-bg-card px-3 py-2 text-sm text-text outline-none focus:border-border-strong";
  return (
    <label className="block text-xs text-text-muted">
      {label}
      {textarea ? (
        <textarea className={cn(cls, "min-h-28")} value={value} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input className={cls} value={value} onChange={(e) => onChange(e.target.value)} />
      )}
    </label>
  );
}

function ProjectsPanel() {
  const { projects, upsertProject, deleteProject } = useAdminStore();
  const [draft, setDraft] = useState<Project | null>(null);

  return (
    <EntityPanel
      title="Projects"
      onCreate={() =>
        setDraft({
          id: uid("p"),
          slug: "new-project",
          title: "New Project",
          subtitle: "",
          summary: "",
          cover: "/images/projects/signalboard.svg",
          gallery: [],
          status: "draft",
          featured: false,
          year: new Date().getFullYear(),
          role: "Engineer",
          timeline: [],
          problem: "",
          motivation: "",
          architecture: "",
          challenges: [],
          performance: [],
          lessons: [],
          future: [],
          stats: [],
          tech: [],
          tags: [],
        })
      }
    >
      <EntityList
        items={projects.map((p) => ({
          id: p.id,
          title: p.title,
          meta: `${p.status} · ${p.year}`,
          onEdit: () => setDraft(p),
          onDelete: () => {
            if (confirm("Delete project?")) deleteProject(p.id);
          },
        }))}
      />
      {draft && (
        <EditorSheet
          onClose={() => setDraft(null)}
          onSave={() => {
            upsertProject(draft);
            setDraft(null);
          }}
        >
          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Title" value={draft.title} onChange={(v) => setDraft({ ...draft, title: v })} />
            <Field label="Slug" value={draft.slug} onChange={(v) => setDraft({ ...draft, slug: v })} />
            <Field label="Subtitle" value={draft.subtitle} onChange={(v) => setDraft({ ...draft, subtitle: v })} />
            <Field label="Status" value={draft.status} onChange={(v) => setDraft({ ...draft, status: v as Project["status"] })} />
            <Field label="Summary" value={draft.summary} onChange={(v) => setDraft({ ...draft, summary: v })} textarea />
            <Field label="Problem" value={draft.problem} onChange={(v) => setDraft({ ...draft, problem: v })} textarea />
            <Field label="Architecture" value={draft.architecture} onChange={(v) => setDraft({ ...draft, architecture: v })} textarea />
            <Field label="Tech (comma)" value={draft.tech.join(", ")} onChange={(v) => setDraft({ ...draft, tech: v.split(",").map((x) => x.trim()).filter(Boolean) })} />
          </div>
        </EditorSheet>
      )}
    </EntityPanel>
  );
}

function BlogsPanel() {
  const { blogs, upsertBlog, deleteBlog } = useAdminStore();
  const [draft, setDraft] = useState<BlogPost | null>(null);
  return (
    <EntityPanel
      title="Blogs"
      onCreate={() =>
        setDraft({
          id: uid("b"),
          slug: "new-post",
          title: "Untitled",
          excerpt: "",
          date: new Date().toISOString().slice(0, 10),
          category: "Engineering",
          tags: [],
          readingTime: "5 min",
          content: "# Draft\n\nWrite in markdown…",
          status: "draft",
        })
      }
    >
      <EntityList
        items={blogs.map((b) => ({
          id: b.id,
          title: b.title,
          meta: `${b.status} · ${b.date}`,
          onEdit: () => setDraft(b),
          onDelete: () => {
            if (confirm("Delete post?")) deleteBlog(b.id);
          },
        }))}
      />
      {draft && (
        <EditorSheet
          onClose={() => setDraft(null)}
          onSave={() => {
            upsertBlog(draft);
            setDraft(null);
          }}
        >
          <div className="grid gap-3">
            <Field label="Title" value={draft.title} onChange={(v) => setDraft({ ...draft, title: v })} />
            <Field label="Slug" value={draft.slug} onChange={(v) => setDraft({ ...draft, slug: v })} />
            <Field label="Excerpt" value={draft.excerpt} onChange={(v) => setDraft({ ...draft, excerpt: v })} textarea />
            <Field label="Status" value={draft.status} onChange={(v) => setDraft({ ...draft, status: v as BlogPost["status"] })} />
            <Field label="Markdown" value={draft.content} onChange={(v) => setDraft({ ...draft, content: v })} textarea />
          </div>
        </EditorSheet>
      )}
    </EntityPanel>
  );
}

function CertsPanel() {
  const { certificates, upsertCertificate, deleteCertificate } = useAdminStore();
  const [draft, setDraft] = useState<Certificate | null>(null);
  return (
    <EntityPanel
      title="Certificates"
      onCreate={() =>
        setDraft({
          id: uid("c"),
          title: "New Certificate",
          issuer: "",
          date: new Date().toISOString().slice(0, 10),
          image: "/images/certs/fastapi.svg",
          skills: [],
        })
      }
    >
      <EntityList
        items={certificates.map((c) => ({
          id: c.id,
          title: c.title,
          meta: c.issuer,
          onEdit: () => setDraft(c),
          onDelete: () => {
            if (confirm("Delete?")) deleteCertificate(c.id);
          },
        }))}
      />
      {draft && (
        <EditorSheet onClose={() => setDraft(null)} onSave={() => { upsertCertificate(draft); setDraft(null); }}>
          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Title" value={draft.title} onChange={(v) => setDraft({ ...draft, title: v })} />
            <Field label="Issuer" value={draft.issuer} onChange={(v) => setDraft({ ...draft, issuer: v })} />
            <Field label="Date" value={draft.date} onChange={(v) => setDraft({ ...draft, date: v })} />
            <Field label="Verify URL" value={draft.verifyUrl ?? ""} onChange={(v) => setDraft({ ...draft, verifyUrl: v })} />
            <Field label="Skills" value={draft.skills.join(", ")} onChange={(v) => setDraft({ ...draft, skills: v.split(",").map((x) => x.trim()).filter(Boolean) })} />
          </div>
        </EditorSheet>
      )}
    </EntityPanel>
  );
}

function ExperiencePanel() {
  const { experience, upsertExperience, deleteExperience } = useAdminStore();
  const [draft, setDraft] = useState<Experience | null>(null);
  return (
    <EntityPanel
      title="Experience"
      onCreate={() =>
        setDraft({
          id: uid("e"),
          company: "Company",
          role: "Role",
          location: "",
          start: "2025-01",
          end: null,
          summary: "",
          highlights: [],
          tech: [],
        })
      }
    >
      <EntityList
        items={experience.map((e) => ({
          id: e.id,
          title: `${e.role} · ${e.company}`,
          meta: e.start,
          onEdit: () => setDraft(e),
          onDelete: () => {
            if (confirm("Delete?")) deleteExperience(e.id);
          },
        }))}
      />
      {draft && (
        <EditorSheet onClose={() => setDraft(null)} onSave={() => { upsertExperience(draft); setDraft(null); }}>
          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Company" value={draft.company} onChange={(v) => setDraft({ ...draft, company: v })} />
            <Field label="Role" value={draft.role} onChange={(v) => setDraft({ ...draft, role: v })} />
            <Field label="Summary" value={draft.summary} onChange={(v) => setDraft({ ...draft, summary: v })} textarea />
            <Field label="Highlights (newline)" value={draft.highlights.join("\n")} onChange={(v) => setDraft({ ...draft, highlights: v.split("\n").filter(Boolean) })} textarea />
          </div>
        </EditorSheet>
      )}
    </EntityPanel>
  );
}

function AdventuresPanel() {
  const { adventures, upsertAdventure, deleteAdventure } = useAdminStore();
  const [draft, setDraft] = useState<Adventure | null>(null);
  return (
    <EntityPanel
      title="Adventures"
      onCreate={() =>
        setDraft({
          id: uid("a"),
          slug: "new-trip",
          title: "New Trip",
          place: "",
          country: "India",
          date: new Date().toISOString().slice(0, 10),
          cover: "/images/adventure/triund.svg",
          gallery: [],
          journal: "",
          lat: 0,
          lng: 0,
          memories: [],
        })
      }
    >
      <EntityList
        items={adventures.map((a) => ({
          id: a.id,
          title: a.title,
          meta: a.place,
          onEdit: () => setDraft(a),
          onDelete: () => {
            if (confirm("Delete?")) deleteAdventure(a.id);
          },
        }))}
      />
      {draft && (
        <EditorSheet onClose={() => setDraft(null)} onSave={() => { upsertAdventure(draft); setDraft(null); }}>
          <div className="grid gap-3">
            <Field label="Title" value={draft.title} onChange={(v) => setDraft({ ...draft, title: v })} />
            <Field label="Place" value={draft.place} onChange={(v) => setDraft({ ...draft, place: v })} />
            <Field label="Journal" value={draft.journal} onChange={(v) => setDraft({ ...draft, journal: v })} textarea />
          </div>
        </EditorSheet>
      )}
    </EntityPanel>
  );
}

function VlogsPanel() {
  const { vlogs, upsertVlog, deleteVlog } = useAdminStore();
  const [draft, setDraft] = useState<Vlog | null>(null);
  return (
    <EntityPanel
      title="Vlogs"
      onCreate={() =>
        setDraft({
          id: uid("v"),
          slug: "new-vlog",
          title: "New Vlog",
          description: "",
          thumbnail: "/images/vlogs/building.svg",
          youtubeId: "",
          category: "Adventure",
          publishedAt: new Date().toISOString().slice(0, 10),
          duration: "10:00",
          likes: 0,
        })
      }
    >
      <EntityList
        items={vlogs.map((v) => ({
          id: v.id,
          title: v.title,
          meta: v.category,
          onEdit: () => setDraft(v),
          onDelete: () => {
            if (confirm("Delete?")) deleteVlog(v.id);
          },
        }))}
      />
      {draft && (
        <EditorSheet onClose={() => setDraft(null)} onSave={() => { upsertVlog(draft); setDraft(null); }}>
          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Title" value={draft.title} onChange={(v) => setDraft({ ...draft, title: v })} />
            <Field label="YouTube ID" value={draft.youtubeId} onChange={(v) => setDraft({ ...draft, youtubeId: v })} />
            <Field label="Description" value={draft.description} onChange={(v) => setDraft({ ...draft, description: v })} textarea />
          </div>
        </EditorSheet>
      )}
    </EntityPanel>
  );
}

function PhotosPanel() {
  const { photography, upsertPhoto, deletePhoto } = useAdminStore();
  const [draft, setDraft] = useState<Photo | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [preview, setPreview] = useState<string>("");

  return (
    <EntityPanel
      title="Photography"
      onCreate={() => {
        setPreview("");
        setUploadError("");
        setDraft({
          id: uid("ph"),
          title: "Untitled",
          src: "",
          collection: "General",
          mode: "landscape",
        });
      }}
    >
      <p className="mb-6 text-sm text-text-muted">
        Pick a photo from gallery — it compresses and uploads to GitHub right away (no storage quota).
        Then tap <strong className="text-text">Publish live</strong> so the gallery list updates on the site (~1–2 min).
      </p>
      <EntityList
        items={photography.map((p) => ({
          id: p.id,
          title: p.title,
          meta: `${p.collection} · ${p.mode}`,
          onEdit: () => {
            setPreview("");
            setUploadError("");
            setDraft(p);
          },
          onDelete: () => {
            if (confirm("Delete?")) deletePhoto(p.id);
          },
        }))}
      />
      {draft && (
        <EditorSheet
          onClose={() => {
            setDraft(null);
            setPreview("");
          }}
          onSave={() => {
            if (!draft.src) {
              setUploadError("Upload a photo first.");
              return;
            }
            upsertPhoto(draft);
            setDraft(null);
            setPreview("");
          }}
        >
          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Title" value={draft.title} onChange={(v) => setDraft({ ...draft, title: v })} />
            <Field label="Collection" value={draft.collection} onChange={(v) => setDraft({ ...draft, collection: v })} />
            <label className="block text-xs text-text-muted">
              Mode
              <select
                className="mt-1 w-full rounded-xl border border-border bg-bg-card px-3 py-2 text-sm text-text"
                value={draft.mode}
                onChange={(e) =>
                  setDraft({ ...draft, mode: e.target.value as Photo["mode"] })
                }
              >
                <option value="landscape">Landscape</option>
                <option value="portrait">Portrait</option>
                <option value="night">Night</option>
              </select>
            </label>
            <label className="block text-xs text-text-muted md:col-span-2">
              Upload photo (phone camera or gallery)
              <input
                type="file"
                accept="image/*"
                className="mt-2 block w-full text-sm text-text"
                disabled={uploading}
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file || !draft) return;
                  setUploading(true);
                  setUploadError("");
                  try {
                    const { publicSrc, previewUrl } =
                      await uploadImageToGithub(file);
                    setDraft({
                      ...draft,
                      src: publicSrc,
                      title:
                        draft.title === "Untitled"
                          ? file.name.replace(/\.[^.]+$/, "")
                          : draft.title,
                    });
                    setPreview(previewUrl);
                  } catch (err) {
                    setUploadError(
                      err instanceof Error ? err.message : "Upload failed",
                    );
                  } finally {
                    setUploading(false);
                    e.target.value = "";
                  }
                }}
              />
            </label>
          </div>
          {(preview || draft.src) && (
            <div className="mt-4 overflow-hidden rounded-xl border border-border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preview || withBasePath(draft.src)}
                alt={draft.title}
                className="max-h-64 w-full object-cover"
              />
              <p className="font-mono truncate px-3 py-2 text-[11px] text-text-muted">
                {draft.src || "No path yet"}
                {draft.src ? " · uploaded to GitHub" : ""}
              </p>
            </div>
          )}
          {uploading && (
            <p className="mt-3 text-sm text-text-muted">
              Compressing & uploading to GitHub…
            </p>
          )}
          {uploadError && <p className="mt-3 text-sm text-danger">{uploadError}</p>}
        </EditorSheet>
      )}
    </EntityPanel>
  );
}

function SkillsPanel() {
  const { skills, setSkills } = useAdminStore();
  const [text, setText] = useState(JSON.stringify(skills, null, 2));
  return (
    <div>
      <h1 className="font-display text-4xl">Skills</h1>
      <p className="mt-2 text-sm text-text-muted">Edit as JSON array, then save.</p>
      <textarea
        className="font-mono mt-6 min-h-96 w-full rounded-2xl border border-border bg-bg-card p-4 text-xs text-text"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        type="button"
        className="mt-4 rounded-full bg-accent px-5 py-2.5 text-sm text-bg"
        onClick={() => {
          try {
            setSkills(JSON.parse(text));
            alert("Skills saved");
          } catch {
            alert("Invalid JSON");
          }
        }}
      >
        Save skills
      </button>
    </div>
  );
}

function SettingsPanel() {
  const { site, setSite } = useAdminStore();
  const [draft, setDraft] = useState(site);
  if (!draft) return null;
  return (
    <div>
      <h1 className="font-display text-4xl">Site settings</h1>
      <div className="mt-8 grid gap-3 md:grid-cols-2">
        <Field label="Name" value={draft.name} onChange={(v) => setDraft({ ...draft, name: v })} />
        <Field label="Title" value={draft.title} onChange={(v) => setDraft({ ...draft, title: v })} />
        <Field label="Tagline" value={draft.tagline} onChange={(v) => setDraft({ ...draft, tagline: v })} />
        <Field label="Email" value={draft.email} onChange={(v) => setDraft({ ...draft, email: v })} />
        <Field label="City" value={draft.city} onChange={(v) => setDraft({ ...draft, city: v })} />
        <Field label="Availability" value={draft.availability} onChange={(v) => setDraft({ ...draft, availability: v })} />
        <Field label="GitHub" value={draft.social.github} onChange={(v) => setDraft({ ...draft, social: { ...draft.social, github: v } })} />
        <Field label="LinkedIn" value={draft.social.linkedin} onChange={(v) => setDraft({ ...draft, social: { ...draft.social, linkedin: v } })} />
      </div>
      <button
        type="button"
        className="mt-6 rounded-full bg-accent px-5 py-2.5 text-sm text-bg"
        onClick={() => setSite(draft)}
      >
        Save settings
      </button>
      <p className="mt-3 text-xs text-text-muted">
        Saved on this device. Open <span className="text-accent">Publish live</span> to push to the website.
      </p>
    </div>
  );
}

function PublishPanel() {
  const store = useAdminStore();
  const [token, setToken] = useState("");
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<string>("");
  const [error, setError] = useState("");
  const [commitUrl, setCommitUrl] = useState("");

  useEffect(() => {
    const existing = getGithubToken();
    setToken(existing);
    setSaved(Boolean(existing));
  }, []);

  const publish = async () => {
    setBusy(true);
    setError("");
    setStatus("Publishing content to GitHub…");
    setCommitUrl("");
    try {
      if (!store.site) throw new Error("Site settings missing — save settings first.");
      const result = await publishContentToGithub(
        {
          site: store.site,
          projects: store.projects,
          certificates: store.certificates,
          experience: store.experience,
          adventures: store.adventures,
          vlogs: store.vlogs,
          photography: store.photography,
          blogs: store.blogs,
          skills: store.skills,
        },
        "content: update from admin CMS",
      );
      store.log("publish", `github:${result.sha.slice(0, 7)}`);
      setCommitUrl(result.commitUrl);
      setStatus(
        "Published. GitHub Pages is rebuilding — live site updates in about 1–2 minutes.",
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Publish failed");
      setStatus("");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="pb-24">
      <h1 className="font-display text-4xl">Publish live</h1>
      <p className="mt-2 max-w-2xl text-sm text-text-muted">
        Edit anything in Admin, then tap <strong className="text-text">Publish to website</strong>.
        This writes your content into the GitHub repo and redeploys Pages. Works from your phone at{" "}
        <a className="text-accent" href={githubPublishMeta.adminUrl}>
          {githubPublishMeta.adminUrl}
        </a>
        .
      </p>

      <div className="mt-10 rounded-2xl border border-border bg-bg-card p-5">
        <p className="font-mono text-[11px] tracking-widest text-text-muted uppercase">
          One-time setup
        </p>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-text-muted">
          <li>
            Create a fine-grained token:{" "}
            <a
              className="text-accent"
              href={githubPublishMeta.tokenHelpUrl}
              target="_blank"
              rel="noreferrer"
            >
              GitHub → Personal access tokens
            </a>
          </li>
          <li>
            Resource owner: <span className="text-text">{githubPublishMeta.owner}</span>, repository:{" "}
            <span className="text-text">{githubPublishMeta.repo}</span>
          </li>
          <li>
            Permissions: <span className="text-text">Contents → Read and write</span>
          </li>
          <li>Paste the token below (stored only in this browser)</li>
        </ol>

        <label className="mt-6 block text-xs text-text-muted">
          GitHub token
          <input
            type="password"
            value={token}
            onChange={(e) => {
              setToken(e.target.value);
              setSaved(false);
            }}
            placeholder="github_pat_…"
            className="mt-1 w-full rounded-xl border border-border bg-bg px-3 py-3 text-sm text-text outline-none focus:border-border-strong"
            autoComplete="off"
          />
        </label>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            className="rounded-full bg-accent px-4 py-2 text-sm text-bg"
            onClick={() => {
              setGithubToken(token);
              setSaved(true);
            }}
          >
            Save token on this device
          </button>
          <button
            type="button"
            className="rounded-full border border-border px-4 py-2 text-sm text-text-muted"
            onClick={() => {
              clearGithubToken();
              setToken("");
              setSaved(false);
            }}
          >
            Clear token
          </button>
        </div>
        {saved && (
          <p className="mt-3 text-xs text-success">Token saved on this phone/browser.</p>
        )}
      </div>

      <div className="mt-8 rounded-2xl border border-border p-5">
        <p className="text-sm text-text-muted">
          Target:{" "}
          <span className="font-mono text-text">
            {githubPublishMeta.owner}/{githubPublishMeta.repo}@{githubPublishMeta.branch}
          </span>
        </p>
        <p className="mt-2 text-sm text-text-muted">
          Photos upload instantly when you pick them. Publish updates the gallery list / other content.
        </p>
        <button
          type="button"
          disabled={busy}
          onClick={publish}
          className="mt-5 w-full rounded-full bg-accent py-3.5 text-sm font-medium text-bg disabled:opacity-60 sm:w-auto sm:px-8"
        >
          {busy ? "Publishing…" : "Publish to website"}
        </button>
        {status && <p className="mt-4 text-sm text-text">{status}</p>}
        {commitUrl && (
          <a
            href={commitUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-block text-sm text-accent"
          >
            View commit →
          </a>
        )}
        {error && <p className="mt-4 text-sm text-danger">{error}</p>}
        <p className="mt-6 text-xs text-text-muted">
          After publish, open{" "}
          <a className="text-accent" href={githubPublishMeta.siteUrl}>
            the live site
          </a>{" "}
          in a minute or two (hard-refresh if needed).
        </p>
      </div>
    </div>
  );
}

function MobilePublishBar({ onOpenPublish }: { onOpenPublish: () => void }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-bg/95 p-3 backdrop-blur-md lg:hidden">
      <button
        type="button"
        onClick={onOpenPublish}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-accent py-3 text-sm text-bg"
      >
        <UploadCloud className="h-4 w-4" />
        Publish live
      </button>
    </div>
  );
}

function ExportPanel() {
  const exportAll = useAdminStore((s) => s.exportAll);
  const json = exportAll();
  return (
    <div>
      <h1 className="font-display text-4xl">Export</h1>
      <p className="mt-2 text-sm text-text-muted">
        Download and split into <code className="font-mono">content/*.json</code> for GitHub Pages builds.
      </p>
      <div className="mt-6 flex gap-3">
        <button
          type="button"
          className="rounded-full bg-accent px-5 py-2.5 text-sm text-bg"
          onClick={() => {
            const blob = new Blob([json], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "satyam-content-export.json";
            a.click();
            URL.revokeObjectURL(url);
          }}
        >
          Download JSON
        </button>
        <button
          type="button"
          className="rounded-full border border-border px-5 py-2.5 text-sm"
          onClick={() => navigator.clipboard.writeText(json)}
        >
          Copy
        </button>
      </div>
      <pre className="font-mono mt-8 max-h-[480px] overflow-auto rounded-2xl border border-border bg-bg-card p-4 text-[11px] text-text-muted">
        {json}
      </pre>
    </div>
  );
}

function LogsPanel() {
  const logs = useAdminStore((s) => s.logs);
  return (
    <div>
      <h1 className="font-display text-4xl">Activity logs</h1>
      <ul className="mt-8 space-y-3">
        {logs.map((l) => (
          <li key={l.id} className="rounded-xl border border-border px-4 py-3 text-sm">
            <span className="text-text">{l.action}</span>
            <span className="text-text-muted"> · {l.entity}</span>
            <span className="font-mono mt-1 block text-[11px] text-text-muted">
              {l.timestamp}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function EntityPanel({
  title,
  onCreate,
  children,
}: {
  title: string;
  onCreate: () => void;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <h1 className="font-display text-4xl">{title}</h1>
        <button type="button" onClick={onCreate} className="rounded-full bg-accent px-4 py-2 text-sm text-bg">
          New
        </button>
      </div>
      <div className="mt-8">{children}</div>
    </div>
  );
}

function EntityList({
  items,
}: {
  items: { id: string; title: string; meta: string; onEdit: () => void; onDelete: () => void }[];
}) {
  return (
    <ul className="divide-y divide-border rounded-2xl border border-border">
      {items.map((item) => (
        <li key={item.id} className="flex items-center justify-between gap-4 px-4 py-4">
          <div>
            <p className="text-sm text-text">{item.title}</p>
            <p className="text-xs text-text-muted">{item.meta}</p>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={item.onEdit} className="text-xs text-accent">
              Edit
            </button>
            <button type="button" onClick={item.onDelete} className="text-xs text-text-muted">
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

function EditorSheet({
  children,
  onClose,
  onSave,
}: {
  children: React.ReactNode;
  onClose: () => void;
  onSave: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-bg/70 p-4 backdrop-blur-sm md:items-center">
      <div className="glass max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-display text-2xl">Editor</h2>
          <button type="button" onClick={onClose} className="text-sm text-text-muted">
            Close
          </button>
        </div>
        {children}
        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="rounded-full border border-border px-4 py-2 text-sm">
            Cancel
          </button>
          <button type="button" onClick={onSave} className="rounded-full bg-accent px-4 py-2 text-sm text-bg">
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
