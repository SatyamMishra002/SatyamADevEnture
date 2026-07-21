const OWNER = "SatyamMishra002";
const REPO = "SatyamADevEnture";
const BRANCH = "main";
const TOKEN_KEY = "satyam-gh-token";
const PENDING_MEDIA_KEY = "satyam-pending-media";

export type ContentBundle = {
  site: unknown;
  projects: unknown;
  certificates: unknown;
  experience: unknown;
  adventures: unknown;
  vlogs: unknown;
  photography: unknown;
  blogs: unknown;
  skills: unknown;
};

export type PendingMedia = {
  path: string; // e.g. public/images/photos/foo.jpg
  base64: string; // raw base64, no data: prefix
  contentType: string;
};

export function getGithubToken() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(TOKEN_KEY) ?? "";
}

export function setGithubToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token.trim());
}

export function clearGithubToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function getPendingMedia(): PendingMedia[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(PENDING_MEDIA_KEY) ?? "[]") as PendingMedia[];
  } catch {
    return [];
  }
}

export function addPendingMedia(item: PendingMedia) {
  const next = [...getPendingMedia().filter((m) => m.path !== item.path), item];
  localStorage.setItem(PENDING_MEDIA_KEY, JSON.stringify(next));
}

export function clearPendingMedia() {
  localStorage.removeItem(PENDING_MEDIA_KEY);
}

function toFiles(bundle: ContentBundle): Record<string, string> {
  return {
    "content/site.json": JSON.stringify(bundle.site, null, 2) + "\n",
    "content/projects.json": JSON.stringify(bundle.projects, null, 2) + "\n",
    "content/certificates.json":
      JSON.stringify(bundle.certificates, null, 2) + "\n",
    "content/experience.json":
      JSON.stringify(bundle.experience, null, 2) + "\n",
    "content/adventures.json":
      JSON.stringify(bundle.adventures, null, 2) + "\n",
    "content/vlogs.json": JSON.stringify(bundle.vlogs, null, 2) + "\n",
    "content/photography.json":
      JSON.stringify(bundle.photography, null, 2) + "\n",
    "content/blogs.json": JSON.stringify(bundle.blogs, null, 2) + "\n",
    "content/skills.json": JSON.stringify(bundle.skills, null, 2) + "\n",
  };
}

async function gh<T>(
  path: string,
  token: string,
  init?: RequestInit,
): Promise<T> {
  const res = await fetch(`https://api.github.com${path}`, {
    ...init,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`${res.status} ${res.statusText}: ${body.slice(0, 300)}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

function safeFileName(name: string) {
  return name
    .toLowerCase()
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
}

/** Read a browser File into base64 + a repo path under public/images/photos. */
export async function fileToPendingMedia(
  file: File,
  folder = "public/images/photos",
): Promise<{ media: PendingMedia; publicSrc: string }> {
  const maxBytes = 4.5 * 1024 * 1024;
  if (file.size > maxBytes) {
    throw new Error("Image is larger than 4.5MB. Compress it or choose a smaller photo.");
  }
  if (!file.type.startsWith("image/")) {
    throw new Error("Please choose an image file (JPG, PNG, WebP).");
  }

  const ext =
    file.type === "image/png"
      ? "png"
      : file.type === "image/webp"
        ? "webp"
        : file.type === "image/gif"
          ? "gif"
          : "jpg";

  const base64 = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result ?? "");
      const raw = result.includes(",") ? result.split(",")[1] : result;
      resolve(raw);
    };
    reader.onerror = () => reject(new Error("Could not read file"));
    reader.readAsDataURL(file);
  });

  const stamp = Date.now().toString(36);
  const path = `${folder}/${stamp}-${safeFileName(file.name) || "photo"}.${ext}`;
  const publicSrc = `/${path.replace(/^public\//, "")}`;

  return {
    media: { path, base64, contentType: file.type },
    publicSrc,
  };
}

/**
 * Commits content JSON + any pending media files to main in one commit.
 * GitHub Actions then rebuilds Pages (~1–2 minutes).
 */
export async function publishContentToGithub(
  bundle: ContentBundle,
  message = "content: update site from admin CMS",
): Promise<{ commitUrl: string; sha: string; mediaCount: number }> {
  const token = getGithubToken();
  if (!token) {
    throw new Error("Add a GitHub token in Publish settings first.");
  }

  const textFiles = toFiles(bundle);
  const media = getPendingMedia();

  const ref = await gh<{ object: { sha: string } }>(
    `/repos/${OWNER}/${REPO}/git/ref/heads/${BRANCH}`,
    token,
  );
  const baseCommitSha = ref.object.sha;
  const baseCommit = await gh<{ tree: { sha: string } }>(
    `/repos/${OWNER}/${REPO}/git/commits/${baseCommitSha}`,
    token,
  );

  const textBlobs = await Promise.all(
    Object.entries(textFiles).map(async ([path, content]) => {
      const blob = await gh<{ sha: string }>(
        `/repos/${OWNER}/${REPO}/git/blobs`,
        token,
        {
          method: "POST",
          body: JSON.stringify({ content, encoding: "utf-8" }),
        },
      );
      return {
        path,
        mode: "100644" as const,
        type: "blob" as const,
        sha: blob.sha,
      };
    }),
  );

  const mediaBlobs = await Promise.all(
    media.map(async (m) => {
      const blob = await gh<{ sha: string }>(
        `/repos/${OWNER}/${REPO}/git/blobs`,
        token,
        {
          method: "POST",
          body: JSON.stringify({ content: m.base64, encoding: "base64" }),
        },
      );
      return {
        path: m.path,
        mode: "100644" as const,
        type: "blob" as const,
        sha: blob.sha,
      };
    }),
  );

  const tree = await gh<{ sha: string }>(
    `/repos/${OWNER}/${REPO}/git/trees`,
    token,
    {
      method: "POST",
      body: JSON.stringify({
        base_tree: baseCommit.tree.sha,
        tree: [...textBlobs, ...mediaBlobs],
      }),
    },
  );

  const commit = await gh<{ sha: string; html_url: string }>(
    `/repos/${OWNER}/${REPO}/git/commits`,
    token,
    {
      method: "POST",
      body: JSON.stringify({
        message,
        tree: tree.sha,
        parents: [baseCommitSha],
      }),
    },
  );

  await gh(`/repos/${OWNER}/${REPO}/git/refs/heads/${BRANCH}`, token, {
    method: "PATCH",
    body: JSON.stringify({ sha: commit.sha }),
  });

  clearPendingMedia();

  return {
    commitUrl: commit.html_url,
    sha: commit.sha,
    mediaCount: media.length,
  };
}

export const githubPublishMeta = {
  owner: OWNER,
  repo: REPO,
  branch: BRANCH,
  siteUrl: `https://${OWNER.toLowerCase()}.github.io/${REPO}/`,
  adminUrl: `https://${OWNER.toLowerCase()}.github.io/${REPO}/admin/`,
  tokenHelpUrl: "https://github.com/settings/personal-access-tokens/new",
};
