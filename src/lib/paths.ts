const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

/** Prefix absolute asset paths for GitHub Pages project sites. */
export function withBasePath(path: string): string {
  if (!path) return path;
  if (
    path.startsWith("http://") ||
    path.startsWith("https://") ||
    path.startsWith("data:") ||
    path.startsWith("mailto:") ||
    path.startsWith("#")
  ) {
    return path;
  }
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (!BASE) return normalized;
  if (normalized === BASE || normalized.startsWith(`${BASE}/`)) return normalized;
  return `${BASE}${normalized}`;
}
