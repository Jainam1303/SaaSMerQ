# MerQPrime — AI Agent Bootstrap

You are working on **MerQPrime** (`https://merqprime.in`), a production Next.js 15 App Router SEO utility platform.

**Read this file and `brain.md` before editing code.** Do not explore the full repository unless the task requires it.

---

## 1. Start here (every session)

1. **Read `brain.md`** at the repo root — project memory (architecture, routes, SEO, analytics, deploy).
2. **Read only the sections of `brain.md` relevant to your task** — do not re-scan the entire codebase when `brain.md` already answers the question.
3. **Use targeted search** (`grep`, specific file reads) for the files listed in `brain.md` §3 (File Registry) instead of broad exploration.

If `brain.md` is outdated after your work, **update the affected sections and §20 Recent Changes Log**.

---

## 2. Project identity (quick reference)

| Item | Value |
|------|--------|
| Framework | Next.js 15 App Router, TypeScript, React 19 |
| Styling | Tailwind + CSS variables, dark default, Framer Motion |
| Deploy | AWS EC2, PM2 |
| Repo | Public GitHub repository, branch `main` |
| Data | No database — TypeScript data files + markdown in `content/` |
| Routes | ~493 (tools, conversions + long-tail, calculators, guides, blog, hubs) |

Full detail: `brain.md` §1–§4.

---

## 3. Working rules

### Scope and reuse

- **Reuse existing components** before creating new ones (`components/ui/`, `components/tool/`, `components/programmatic/`).
- **Follow established patterns** — see `brain.md` §8 for adding tools, conversions, calculators, guides.
- **Minimize diff scope** — fix only what the task requires; do not refactor unrelated code.

### UI

- **Do not redesign the UI** unless the user explicitly requests it.
- Match existing naming, spacing, and component patterns in surrounding files.

### SEO (non-negotiable)

- **Preserve SEO architecture** — metadata via `buildMetadata()` in `lib/seo.ts`.
- **Never remove JSON-LD** — use the correct `*JsonLd` builder per page type (`brain.md` §7).
- **Maintain canonical URLs**, breadcrumbs, and FAQ schema where they exist.
- **Update internal linking** when adding public routes: `app/sitemap.ts`, `lib/related-content.ts`, footer/hub links as appropriate.
- **CTR metadata** for tools lives in `data/seo/ctr-metadata.ts`.

### Programmatic content

- **Do not hand-write hundreds of conversion/calculator pages** — extend generators in `lib/programmatic/` or `data/programmatic/`.
- Conversion hubs: `lib/programmatic/conversion-hubs.ts`; leaves: `lib/programmatic/conversions.ts`.

### Analytics

- GA4 loads via **server-rendered** `GoogleAnalyticsScripts` in `<head>` (`brain.md` §11).
- Use helpers in `lib/analytics.ts` for events; do not duplicate `gtag` loading.

### Security

- **Never commit** `.env`, `.env.production`, secrets, or credentials.
- Admin routes use Basic Auth — do not weaken `middleware.ts` CSP without explicit approval.

---

## 4. Key paths (when you need code, not a full scan)

| Task | Start here |
|------|------------|
| New tool | `data/tools/definitions/`, `data/tools/index.ts`, `components/tools/tool-runner.tsx` |
| Tool page UI | `components/tool/tool-page.tsx` |
| Conversion / hub | `lib/programmatic/conversions.ts`, `conversion-hubs.ts`, `app/conversions/` |
| Calculator landing | `data/programmatic/calculators.ts`, `app/calculators/[slug]/page.tsx` |
| Blog | `content/blog/`, `lib/blog/index.ts`, `app/blog/[slug]/page.tsx` |
| Guide | `content/guides/`, `lib/programmatic/guides.ts` |
| Authority hub | `content/hubs/`, `lib/hubs/index.ts`, `components/hub/hub-page.tsx` |
| SEO / schema | `lib/seo.ts`, `app/sitemap.ts`, `app/robots.ts` |
| Internal links | `lib/related-content.ts`, `lib/internal-links.ts` |
| Site config | `lib/site.ts`, `lib/editorial.ts` |
| Analytics | `lib/analytics.ts`, `components/google-analytics-scripts.tsx` |
| Layout / nav | `app/layout.tsx`, `components/layout/` |

---

## 5. Verification before deploy

```bash
npm run typecheck
npm run build
```

Expect **~493 routes** after a full build (count may grow with new programmatic pages).

---

## 6. Deployment workflow

Only deploy when the user asks. Never force-push `main`.

1. `git push origin main`
2. On production server: `git pull`, `npm install`, `npm run build`
3. Restart PM2 application process
4. Verify build succeeds (~493 routes) and spot-check live URLs

Production secrets use a server-side `.env.production` file (never in git). Do not document SSH keys, IPs, hostnames, or absolute server paths in this repository.

---

## 7. After architectural changes

Update **`brain.md`**:

- Summary stats if counts changed (routes, tools, pages)
- §3 File Registry if new important files
- §4 Route Map for new routes
- §8 Programmatic SEO if generator patterns changed
- §14 Environment variables if new env vars
- §20 Recent Changes Log (newest first, with date and commit if deployed)

Optionally update this `AGENT.md` if bootstrap rules change.

---

## 8. Do not

- Scan the entire repo when `brain.md` + targeted reads suffice
- Create duplicate analytics, layout, or SEO helpers
- Add a database without explicit approval
- Redesign UI without explicit request
- Skip schema or sitemap updates for new indexable pages
- Commit lighthouse reports or local audit JSON unless requested

---

*Canonical project memory: `brain.md` · Bootstrap: `.cursor/AGENT.md` · Last aligned: 2026-06-27*
