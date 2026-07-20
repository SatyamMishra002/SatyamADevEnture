# Satyam — Portfolio & Digital Journal

A premium multi-page developer portfolio designed as a calm digital experience — professional case studies alongside adventure journals, photography, and writing.

## Architecture

| Layer | Choice | Why |
| --- | --- | --- |
| Framework | Next.js App Router + TypeScript | Strong DX, file-based routes, static export |
| Styling | Tailwind CSS v4 + design tokens | Fast iteration with a locked premium palette |
| Motion | Framer Motion | Tasteful page/scroll motion without flash |
| Content | JSON in `/content` | Git-friendly CMS source of truth for GitHub Pages |
| Admin | Client CMS + localStorage + JSON export | Edit without a database; commit exported files |
| Deploy | `output: "export"` → GitHub Pages | Zero-ops hosting with Actions |

### Important decisions

1. **Static-first** — The public site is fully static so it deploys cleanly to GitHub Pages with no runtime database.
2. **Content as files** — All portfolio data lives in `/content/*.json`. The admin panel hydrates from these files and can export an updated bundle to paste back into the repo.
3. **Separate experiences** — Each route owns its visual identity (e.g. Adventure uses a nature-tinted theme) while sharing one design system.
4. **Mindset over bio on Home** — The landing introduces principles and living context (time, weather, music, stack) rather than a résumé dump.
5. **Case studies over cards** — Projects open into full narratives: problem, architecture, metrics, lessons.

## Pages

- `/` Home — scroll storytelling, particles, live context
- `/about` Editorial sections (journey, beliefs, workflow…)
- `/projects` + `/projects/[slug]` Case studies
- `/certifications` Certificate wall + modal
- `/experience` Career narrative
- `/adventure` + journals Nature-inspired
- `/vlogs` Video index
- `/photography` Masonry + lightbox EXIF
- `/blogs` + posts Medium-minimal writing
- `/contact` Availability + guestbook
- `/terminal` Interactive shell easter egg
- `/admin` Full CMS (password: `satyam-admin`)

## Develop

```bash
npm install
npm run dev
```

## Build (GitHub Pages)

```bash
# User site (username.github.io) — leave base path empty
npm run build

# Project site — set base path to /repo-name
NEXT_PUBLIC_BASE_PATH=/satyam-portfolio npm run build
```

Output lands in `/out`. The workflow in `.github/workflows/deploy.yml` builds and publishes automatically.

### GitHub Pages setup

1. Push to `main`
2. Repo → Settings → Pages → Source: **GitHub Actions**
3. Optional: set repository variable `BASE_PATH` to `/your-repo` for project pages

## Admin CMS

1. Visit `/admin/`
2. Sign in with `satyam-admin` (change before production)
3. CRUD projects, blogs, certificates, trips, vlogs, photos, experience, skills, settings
4. Export JSON and sync into `/content`

## Extra features

- Command palette (`⌘K` / `Ctrl+K`)
- Custom cursor (fine pointers)
- Magnetic CTAs, scroll progress, page noise + mesh
- Local AI guide (rule-based, no API key)
- PWA manifest + service worker
- `sitemap.xml`, `robots.txt`, `feed.xml`
- Guestbook (localStorage) on Contact

## Customize

Edit `/content` JSON files for copy and media paths. Replace SVG placeholders in `/public/images` with real photography when ready.

## License

Personal portfolio — all rights reserved.
