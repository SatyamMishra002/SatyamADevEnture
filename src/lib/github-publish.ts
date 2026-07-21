const OWNER = "SatyamMishra002";
const REPO = "SatyamADevEnture";
const BRANCH = "main";
const TOKEN_KEY = "satyam-gh-token";

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

/** Clear any leftover oversized queue from older admin builds. */
export function clearStaleMediaQueue() {
  try {
    localStorage.removeItem("satyam-pending-media");
  } catch {
    /* ignore */
  }
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

/** Compress for mobile: max edge 1920px, JPEG ~0.8 — avoids storage quota issues. */
export async function compressImageFile(file: File): Promise<Blob> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Please choose an image file (JPG, PNG, WebP).");
  }

  const bitmap = await createImageBitmap(file);
  const maxEdge = 1920;
  const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    bitmap.close();
    throw new Error("Could not process image on this device.");
  }
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("Image compress failed"))),
      "image/jpeg",
      0.8,
    );
  });

  if (blob.size > 4.5 * 1024 * 1024) {
    throw new Error("Even after compress, image is too large. Try a smaller photo.");
  }
  return blob;
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result ?? "");
      resolve(result.includes(",") ? result.split(",")[1] : result);
    };
    reader.onerror = () => reject(new Error("Could not read image"));
    reader.readAsDataURL(blob);
  });
}

/**
 * Compress + upload image to the repo immediately (no localStorage).
 * Returns the public path used in photography.json, e.g. /images/photos/….jpg
 */
export async function uploadImageToGithub(
  file: File,
  folder = "public/images/photos",
): Promise<{ publicSrc: string; previewUrl: string }> {
  const token = getGithubToken();
  if (!token) {
    throw new Error("Save your GitHub token under Publish live first, then upload.");
  }

  const compressed = await compressImageFile(file);
  const base64 = await blobToBase64(compressed);
  const stamp = Date.now().toString(36);
  const path = `${folder}/${stamp}-${safeFileName(file.name) || "photo"}.jpg`;
  const publicSrc = `/${path.replace(/^public\//, "")}`;

  await gh(`/repos/${OWNER}/${REPO}/contents/${path}`, token, {
    method: "PUT",
    body: JSON.stringify({
      message: `media: add ${path}`,
      content: base64,
      branch: BRANCH,
    }),
  });

  return {
    publicSrc,
    previewUrl: URL.createObjectURL(compressed),
  };
}

/**
 * Commits content JSON files to main. Photos should already be uploaded via uploadImageToGithub.
 */
export async function publishContentToGithub(
  bundle: ContentBundle,
  message = "content: update site from admin CMS",
): Promise<{ commitUrl: string; sha: string }> {
  const token = getGithubToken();
  if (!token) {
    throw new Error("Add a GitHub token in Publish settings first.");
  }

  clearStaleMediaQueue();

  const files = toFiles(bundle);
  const ref = await gh<{ object: { sha: string } }>(
    `/repos/${OWNER}/${REPO}/git/ref/heads/${BRANCH}`,
    token,
  );
  const baseCommitSha = ref.object.sha;
  const baseCommit = await gh<{ tree: { sha: string } }>(
    `/repos/${OWNER}/${REPO}/git/commits/${baseCommitSha}`,
    token,
  );

  const blobs = await Promise.all(
    Object.entries(files).map(async ([path, content]) => {
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

  const tree = await gh<{ sha: string }>(
    `/repos/${OWNER}/${REPO}/git/trees`,
    token,
    {
      method: "POST",
      body: JSON.stringify({
        base_tree: baseCommit.tree.sha,
        tree: blobs,
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

  return { commitUrl: commit.html_url, sha: commit.sha };
}

export const githubPublishMeta = {
  owner: OWNER,
  repo: REPO,
  branch: BRANCH,
  siteUrl: `https://${OWNER.toLowerCase()}.github.io/${REPO}/`,
  adminUrl: `https://${OWNER.toLowerCase()}.github.io/${REPO}/admin/`,
  tokenHelpUrl: "https://github.com/settings/personal-access-tokens/new",
};
