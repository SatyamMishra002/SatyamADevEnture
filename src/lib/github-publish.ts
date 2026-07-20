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

/**
 * Commits all content JSON files to main in one commit via the Git Data API.
 * GitHub Actions then rebuilds Pages (~1–2 minutes).
 */
export async function publishContentToGithub(
  bundle: ContentBundle,
  message = "content: update site from admin CMS",
): Promise<{ commitUrl: string; sha: string }> {
  const token = getGithubToken();
  if (!token) {
    throw new Error("Add a GitHub token in Publish settings first.");
  }

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
