# MerQPrime — Project Brain

> Internal engineering memory for AI agents and developers.
> **Not user documentation.** Read this first before scanning the repo.
>
> **Last updated:** 2026-06-27

---

## Summary Stats

| Metric | Count |
|--------|-------|
| **Total routes (build)** | 393 |
| **Tools** | 45 |
| **Blog articles** | 27 |
| **Guides** | 50 |
| **Calculator landing pages** | 30 |
| **Conversion pages** | 194 |
| **Conversion category hubs** | 8 |
| **Authority hubs** | 6 |
| **Categories** | 5 |
| **Components (`components/`)** | ~105 |
| **Lib modules (`lib/`)** | ~43 |
| **Schema JSON-LD builders** | 11 |
| **Programmatic content pages** | ~283 |

---

# 1. Project Overview

```
Project Name:     MerQPrime (MerQPrime Tools)
Domain:           https://merqprime.in
Purpose:          SEO-first free online utility platform for India and global users

Framework:        Next.js 15.5.19 (App Router)
Language:         TypeScript 5.7
React:            19.0
Styling:          Tailwind CSS 3.4 + CSS variables
Animations:       Framer Motion 12
Markdown:         gray-matter + react-markdown + remark-gfm

Deployment:       AWS EC2 (Linux)
Process manager:  PM2
GitHub:           Public repository (branch: `main`)

Database:         None (file-based JSON for admin/backlinks/GSC)
Authentication:   HTTP Basic Auth on `/admin/*` only
Analytics:        GA4 (production, `afterInteractive`, server-rendered in `<head>`)
Ads:              Disabled (`siteConfig.ads.enabled = false`)

SEO strategy:     Programmatic SEO (conversions, calculators, guides),
                  authority hubs, blog, internal linking graph,
                  CTR metadata overrides, FAQ schema, breadcrumbs,
                  sitemap, robots, llms.txt, GSC admin integration

Design:           Premium SaaS UI — glass navbar, elevated cards, dark default,
                  Plus Jakarta Sans + Inter, Framer Motion fade-ups
```

**Folder philosophy:** Data in `data/` and `content/`, logic in `lib/`, UI in `components/`, routes in `app/`. Programmatic pages generated from TypeScript data — not hundreds of hand-written page files.

---

# 2. Complete Folder Tree

```
app/                    # Next.js App Router routes
├── layout.tsx          # Root layout (theme, GA, header, footer)
├── page.tsx            # Homepage
├── globals.css         # Design tokens + theme CSS
├── sitemap.ts          # Dynamic sitemap
├── robots.ts           # Robots.txt
├── manifest.ts         # PWA manifest
├── conversions/        # Conversion index + [slug] (hubs + leaf pages)
├── calculators/[slug]/ # Calculator landing pages (SSG)
├── guides/[slug]/      # Guide articles (SSG, markdown)
├── tools/[slug]/       # Tool pages (SSG)
├── blog/               # Blog index + [slug]
├── category/[slug]/    # Tool category pages
├── *-tools/            # Authority hub routes (finance, gst, etc.)
├── admin/              # Basic-auth admin (launch, seo dashboards)
├── api/                # OG image, admin APIs (GSC, backlinks)
└── llms.txt/           # llms.txt route

components/             # React UI (see Component Registry)
├── layout/             # SiteHeader, SiteFooter
├── tool/               # ToolPage, ToolCard, breadcrumbs, FAQ
├── tools/impl/         # 45 lazy-loaded tool implementations
├── programmatic/       # Conversion calculator, hub page, links
├── hub/                # Authority hub page component
├── blog/               # BlogContent, BlogCard, TOC
├── search/             # HeroSearch, ToolSearch
├── home/               # Premium homepage sections
├── admin/              # GSC dashboard, backlink tracker
├── ui/                 # shadcn-style primitives (Button, Card, Input…)
└── seo/                # RelatedContentSection

lib/                    # Business logic, loaders, SEO builders
├── programmatic/       # Conversions, units, guides, conversion-hubs
├── blog/               # Blog markdown loader
├── hubs/               # Authority hub markdown loader
├── gsc/                # Google Search Console OAuth + API
├── backlinks/          # Backlink tracker storage
├── seo.ts              # Metadata + JSON-LD builders
├── analytics.ts        # GA4 event helpers
├── related-content.ts  # Cross-linking graph
├── site.ts             # Central site config
└── tool-content.ts     # Optional tool SEO markdown

data/                   # Static TypeScript data (no runtime DB)
├── tools/              # Tool definitions + categories + index
├── programmatic/       # Calculator page definitions
├── seo/                # CTR metadata overrides
└── backlinks/          # Default backlink submission data

content/                # Markdown content (git-tracked)
├── blog/               # 27 blog posts
├── guides/             # 50 programmatic guide articles
├── hubs/               # 6 authority hub pages
└── tools/              # Optional per-tool SEO markdown (e.g. upi-qr)

public/                 # Static assets (logo, favicons, icons)
scripts/                # Audit and generation CLI scripts
middleware.ts           # CSP nonce + admin auth
next.config.mjs         # Security headers, image formats
tailwind.config.ts      # Design tokens extension
```

### Folder purposes

| Folder | Purpose | Key deps | Important files |
|--------|---------|----------|-----------------|
| `app/` | Routes, metadata, page composition | `lib/`, `components/` | `layout.tsx`, `sitemap.ts` |
| `components/` | All React UI | `lib/`, `data/` | `tool-page.tsx`, `tool-runner.tsx`, `hub-page.tsx` |
| `lib/` | Loaders, SEO, analytics, programmatic gen | `content/`, `data/` | `seo.ts`, `conversions.ts`, `related-content.ts` |
| `data/` | Tool + calculator metadata (TS) | — | `tools/index.ts`, `programmatic/calculators.ts` |
| `content/` | Long-form markdown | gray-matter | `blog/`, `guides/`, `hubs/` |
| `public/` | Static files | — | `logo.png`, favicons |

---

# 3. File Registry

### Core config & entry

| Path | Purpose | Exports | Used by |
|------|---------|---------|---------|
| `app/layout.tsx` | Root layout | default layout | Entire app |
| `middleware.ts` | CSP nonce, admin auth | `middleware`, `config` | All matched routes |
| `next.config.mjs` | Security headers, images | default config | Next.js build |
| `lib/site.ts` | Brand, URL, analytics env | `siteConfig` | SEO, layout, sitemap |
| `lib/editorial.ts` | E-E-A-T dates, author | `editorialConfig` | EditorialMeta, schema |
| `lib/seo.ts` | Metadata + all JSON-LD | `buildMetadata`, `*JsonLd` | Every page |
| `lib/analytics.ts` | GA4 helpers | `pageView`, `trackEvent`, `trackToolUsage`… | Components, tracker |

### Data layer

| Path | Purpose | Exports | Used by |
|------|---------|---------|---------|
| `data/tools/index.ts` | Master tool list | `tools`, `getToolBySlug`, `getRelatedTools` | Tool pages, search, hubs |
| `data/tools/categories.ts` | 5 tool categories | `categories`, `categoryMap` | Category pages, UI |
| `data/tools/definitions/*.ts` | Per-tool metadata (45 files) | `ToolMeta` object | `data/tools/index.ts` |
| `data/programmatic/calculators.ts` | 30 calculator landing defs | `calculatorPages`, getters | `app/calculators/[slug]` |
| `data/seo/ctr-metadata.ts` | SERP title/description overrides | `toolCtrMetadata` | Tool metadata merge |
| `lib/programmatic/conversions.ts` | 194 conversion page generator | `conversionPages`, getters | `app/conversions/[slug]` |
| `lib/programmatic/conversion-hubs.ts` | 8 category hub definitions | `CONVERSION_HUBS`, getters | Hub pages |
| `lib/programmatic/units.ts` | Unit defs + convert math | `CONVERSION_CATEGORIES`, `convertUnits` | Conversions |
| `lib/programmatic/guides.ts` | Guide markdown loader | `getGuideBySlug`, `getAllGuides` | `app/guides/[slug]` |
| `lib/hubs/index.ts` | Authority hub markdown loader | `getHubBySlug`, `getAllHubs` | Hub routes, footer |
| `lib/blog/index.ts` | Blog markdown loader | `getAllPosts`, `getPostBySlug` | Blog pages |
| `lib/tool-content.ts` | Optional `content/tools/{slug}.md` | `getToolContent` | `ToolPage` |
| `lib/related-content.ts` | Cross-type internal linking | `getRelatedContentFor*` | RelatedContentSection |

### Route pages (app/)

| Path | Purpose |
|------|---------|
| `app/page.tsx` | Homepage (hero, categories, featured tools) |
| `app/tools/page.tsx` | Tool directory + search |
| `app/tools/[slug]/page.tsx` | Individual tool page → `ToolPage` |
| `app/conversions/page.tsx` | Conversion index (8 category cards) |
| `app/conversions/[slug]/page.tsx` | Hub OR conversion leaf (branch on category slug) |
| `app/calculators/[slug]/page.tsx` | Calculator landing + `ToolRunner` |
| `app/guides/[slug]/page.tsx` | Guide article from markdown |
| `app/blog/page.tsx` | Blog index |
| `app/blog/[slug]/page.tsx` | Blog post + FAQ schema |
| `app/category/[slug]/page.tsx` | Tool category listing |
| `app/finance-tools/page.tsx` | Authority hub (pattern for 6 hubs) |
| `app/admin/launch/page.tsx` | Launch hub admin |
| `app/admin/seo/page.tsx` | GSC + SEO admin dashboard |
| `app/sitemap.ts` | All public URLs |
| `app/robots.ts` | Allow all except `/api/`, `/admin/` |

### Key components

| Path | Purpose | Reusable |
|------|---------|----------|
| `components/tool/tool-page.tsx` | Full tool page layout | Per tool route |
| `components/tools/tool-runner.tsx` | Dynamic import registry for 45 tools | Yes |
| `components/hub/hub-page.tsx` | Authority hub layout | 6 hub routes |
| `components/programmatic/conversion-hub-page.tsx` | Conversion category hub | 8 hubs |
| `components/programmatic/conversion-calculator.tsx` | Input/output converter UI | Conversion pages |
| `components/seo/related-content-section.tsx` | Grouped internal links | Tools, conversions, blogs |
| `components/google-analytics-scripts.tsx` | Server-rendered gtag in `<head>` | Root layout |
| `components/analytics-tracker.tsx` | SPA page views + outbound clicks | Root layout |
| `components/tool/tool-interaction-tracker.tsx` | Delegated tool events | Tool + calculator pages |
| `components/blog/blog-content.tsx` | Markdown renderer | Blog, guides, hubs |

---

# 4. Route Map

### Static / marketing

| Route | Component | Rendering | Schema |
|-------|-----------|-----------|--------|
| `/` | `app/page.tsx` | Dynamic (ƒ) | Website, Organization (layout) |
| `/about` | static page | ƒ | — |
| `/privacy` | static page | ƒ | — |
| `/editorial-policy` | static page | ƒ | — |
| `/methodology` | static page | ƒ | — |
| `/free-online-tools` | static page | ƒ | — |
| `/launch` | launch hub | ƒ | — |

### Tools (45 SSG)

| Route | Data source | Schema |
|-------|-------------|--------|
| `/tools` | `data/tools` | — |
| `/tools/[slug]` | `data/tools/definitions/*` + optional `content/tools/*.md` | SoftwareApplication, FAQ, Breadcrumb |

### Programmatic — conversions (202 SSG under `[slug]` + index)

| Route | Type | Data source |
|-------|------|-------------|
| `/conversions` | Index | `getAllConversionHubs()` |
| `/conversions/length` … `/conversions/data` | Category hub (8) | `lib/programmatic/conversion-hubs.ts` |
| `/conversions/km-to-miles` etc. | Leaf converter (194) | `lib/programmatic/conversions.ts` |

Hub slugs: `length`, `weight`, `temperature`, `volume`, `area`, `speed`, `time`, `data`

### Programmatic — calculators (30 SSG)

| Route | Data | Embeds |
|-------|------|--------|
| `/calculators/[slug]` | `data/programmatic/calculators.ts` | `ToolRunner` for linked tool |

### Programmatic — guides (50 SSG)

| Route | Data | Schema |
|-------|------|--------|
| `/guides/[slug]` | `content/guides/*.md` | Article, FAQ, Breadcrumb |

### Blog (27 SSG)

| Route | Data | Schema |
|-------|------|--------|
| `/blog` | `content/blog/*.md` | — |
| `/blog/[slug]` | gray-matter frontmatter | BlogPosting, FAQ (if frontmatter `faqs`) |

### Authority hubs (6)

| Route | Markdown |
|-------|----------|
| `/finance-tools` | `content/hubs/finance-tools.md` |
| `/investment-tools` | `content/hubs/investment-tools.md` |
| `/gst-tools` | `content/hubs/gst-tools.md` |
| `/business-tools` | `content/hubs/business-tools.md` |
| `/developer-tools` | `content/hubs/developer-tools.md` |
| `/seo-tools` | `content/hubs/seo-tools.md` |

### Categories (5 SSG)

| Route | Data |
|-------|------|
| `/category/[slug]` | `data/tools/categories.ts` + tools filter |

### Admin (noindex via robots + Basic Auth)

| Route | Purpose |
|-------|---------|
| `/admin/launch` | Launch checklist UI |
| `/admin/seo` | GSC dashboard, backlink tracker |

### API

| Route | Purpose |
|-------|---------|
| `/api/og` | Dynamic OG images (edge) |
| `/api/admin/gsc/*` | GSC OAuth + data sync |
| `/api/admin/backlinks/*` | Backlink CRUD/export |
| `/llms.txt` | LLM crawler manifest |

### System

| Route | Type |
|-------|------|
| `/sitemap.xml` | Generated from `app/sitemap.ts` |
| `/robots.txt` | `app/robots.ts` |
| `/manifest.webmanifest` | `app/manifest.ts` |

---

# 5. Component Registry (high-signal)

### Layout shell

| Component | Props | Used in |
|-----------|-------|---------|
| `SiteHeader` | — | `layout.tsx` — glass nav, theme toggle, mobile menu |
| `SiteFooter` | — | `layout.tsx` — categories, popular tools, resources |
| `ThemeProvider` | `nonce`, `defaultTheme="dark"` | `layout.tsx` — next-themes |

### Tool system

| Component | Props | Notes |
|-----------|-------|-------|
| `ToolPage` | `{ tool: ToolMeta }` | Hero, ToolRunner, SEO content, FAQ, related |
| `ToolRunner` | `{ slug }` | Dynamic registry, `ssr: false` per tool |
| `ToolCard` | `{ tool }` | Grid card for listings |
| `ToolInteractionTracker` | `{ toolSlug, children }` | GA: opened, generate, download |
| `CopyButton` | `{ value, toolSlug? }` | Clipboard + GA copy event |
| `FaqSection` | `{ faqs }` | Accordion FAQ block |

### Programmatic

| Component | Props | Notes |
|-----------|-------|-------|
| `ConversionHubPage` | `{ hub }` | Category hub full layout |
| `ConversionCalculator` | category, units, labels | Client calculator |
| `ProgrammaticLinks` | relatedPages, toolSlugs, hubSlug | 3-column link grid |
| `HubPage` | `{ hub }` | Authority hub from markdown |

### SEO / content

| Component | Props | Notes |
|-----------|-------|-------|
| `RelatedContentSection` | `{ bundle }` | Tools, guides, blogs, conversions, calculators |
| `BlogContent` | `{ content }` | react-markdown + GFM |
| `Breadcrumbs` | `{ items: Crumb[] }` | Accessible breadcrumb nav |
| `JsonLd` | `{ data }` | Injects `<script type="application/ld+json">` |
| `EditorialMeta` | optional dates | Byline, updated, reviewed |

### Analytics

| Component | Location | Role |
|-----------|----------|------|
| `GoogleAnalyticsScripts` | `<head>` in layout | gtag.js + init (CSP nonce) |
| `Analytics` | end of `<body>` | Tracker + optional Plausible |
| `AnalyticsTracker` | client | SPA `pageView`, tool_view, blog_view, outbound |
| `NotFoundAnalytics` | `not-found.tsx` | `page_not_found` event |

---

# 6. Data Flow

### Tool page

```
data/tools/definitions/*.ts
  → data/tools/index.ts (tools array)
  → app/tools/[slug]/page.tsx (generateStaticParams, metadata)
  → components/tool/tool-page.tsx
  → components/tools/tool-runner.tsx (dynamic import)
  → components/tools/impl/*-tool.tsx (client UI)
```

### Conversion page

```
lib/programmatic/units.ts (unit defs + math)
  → lib/programmatic/conversions.ts (generateAll: every from×to pair)
  → app/conversions/[slug]/page.tsx
  → ConversionTool → ConversionCalculator
```

### Conversion hub

```
lib/programmatic/conversion-hubs.ts (editorial copy per category)
  → app/conversions/[slug]/page.tsx (if isConversionCategory(slug))
  → ConversionHubPage
```

### Blog / guide

```
content/{blog|guides}/*.md
  → gray-matter parse (lib/blog or lib/programmatic/guides)
  → app/{blog|guides}/[slug]/page.tsx
  → BlogContent (react-markdown)
```

### Authority hub

```
content/hubs/*.md
  → lib/hubs/index.ts
  → app/{slug}-tools/page.tsx OR dedicated route
  → HubPage
```

### Internal linking

```
lib/related-content.ts
  ← tools, conversions, calculators, guides, blog
  → RelatedContentSection on tool/conversion/calculator/guide/blog pages
```

### Optional tool SEO markdown

```
content/tools/{slug}.md
  → lib/tool-content.ts
  → ToolPage (BlogContent section below calculator)
```

---

# 7. SEO Architecture

### Metadata

- **Builder:** `lib/seo.ts` → `buildMetadata({ title, description, path, keywords, absoluteTitle, ogTitle })`
- **Canonical:** Always set via `alternates.canonical` to `https://merqprime.in{path}`
- **OG images:** Dynamic `/api/og?title=...` (1200×630)
- **CTR overrides:** `data/seo/ctr-metadata.ts` merged into tool definitions
- **Root defaults:** `app/layout.tsx` metadata + `siteConfig`

### Robots

- `app/robots.ts`: Allow `/`, disallow `/api/`, `/admin/`
- Admin routes also get `X-Robots-Tag: noindex` via middleware

### Sitemap

- `app/sitemap.ts`: static routes, hubs, categories, tools, blog, conversions (index + 8 hubs + 194 leaves), calculators, guides
- Priorities: home 1.0, tools 0.8, hubs 0.88, conversions hub 0.8, conversion leaf 0.72

### Schema (JSON-LD builders in `lib/seo.ts`)

| Builder | Type | Used on |
|---------|------|---------|
| `websiteJsonLd` | WebSite | Root layout |
| `organizationJsonLd` | Organization | Root layout |
| `softwareApplicationJsonLd` | SoftwareApplication | Tool pages |
| `programmaticSoftwareJsonLd` | SoftwareApplication | Conversions, calculators |
| `breadcrumbJsonLd` | BreadcrumbList | Most content pages |
| `faqJsonLd` | FAQPage | Tools, conversions, hubs, blog (if faqs) |
| `articleJsonLd` | BlogPosting | Blog posts |
| `guideArticleJsonLd` | Article | Guides |
| `webPageJsonLd` | WebPage | Conversions, calculators |
| `collectionPageJsonLd` | CollectionPage | Conversion index + hubs |
| `itemListJsonLd` | ItemList | Conversion hubs (all converters list) |

### Breadcrumbs

- Component: `components/tool/breadcrumbs.tsx`
- Conversion leaf: Home → Conversions → Category hub → Page
- Conversion hub: Home → Conversions → Category
- Tools: Home → Category → Tool

### Internal linking

- `lib/related-content.ts` — cross-type link bundles per page type
- `lib/internal-links.ts` — blog ↔ tool relationships
- `ProgrammaticLinks` — related programmatic pages + tools + hub
- Footer: categories, popular tools, resources (includes `/conversions`)
- Hub pages link down to all leaf converters; leaves link up to category hub

### Programmatic SEO patterns

- **Slug:** `{from-slug}-to-{to-slug}` (e.g. `km-to-miles`)
- **FAQs:** Auto-generated 6 per conversion; `ensureMinFaqs` for calculators
- **Examples:** Computed from `convertUnits()` at build time
- **Enriched leaf content:** whatIs, formula, examples, conversion table, common mistakes

### GSC / admin

- OAuth flow: `/api/admin/gsc/oauth/*`
- Dashboard: `/admin/seo`
- Env: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GSC_SITE_URL`

### llms.txt

- `app/llms.txt/route.ts` + `lib/llms.ts` — curated URL list for LLM crawlers

---

# 8. Programmatic SEO

### Generators (all build-time, no runtime DB)

| Generator | File | Output count | Route pattern |
|-----------|------|--------------|---------------|
| Conversions | `lib/programmatic/conversions.ts` | 194 | `/conversions/{from}-to-{to}` |
| Conversion hubs | `lib/programmatic/conversion-hubs.ts` | 8 | `/conversions/{category}` |
| Calculators | `data/programmatic/calculators.ts` | 30 | `/calculators/{slug}` |
| Guides | `content/guides/*.md` | 50 | `/guides/{slug}` |
| Tools | `data/tools/index.ts` | 45 | `/tools/{slug}` |

### Conversion categories (8)

`length` (8 units), `weight` (5), `temperature` (3), `volume` (5), `area` (5), `speed` (4), `time` (6), `data` (6)

### Relationships

```
/conversions (index)
  └── /conversions/{category} (hub)
        └── /conversions/{from}-to-{to} (leaf)
              └── links back to hub + siblings + popular

/calculators/{slug}
  └── embeds ToolRunner({ toolSlug })
  └── links to finance-tools hub

/guides/{slug}
  └── links to tools, calculators, conversions (via related-content)
```

### Adding a new conversion category

1. Add units to `lib/programmatic/units.ts` (`CONVERSION_CATEGORIES` + `toBase`/`fromBase`)
2. Add hub copy to `lib/programmatic/conversion-hubs.ts`
3. Pages auto-generate via `generateAll()` in `conversions.ts`

### Adding a new tool

1. Create `data/tools/definitions/{slug}.ts`
2. Import in `data/tools/index.ts`
3. Add lazy import in `components/tools/tool-runner.tsx`
4. Create `components/tools/impl/{slug}-tool.tsx`
5. Optional: `data/seo/ctr-metadata.ts` entry
6. Optional: `content/tools/{slug}.md` for SEO body

### Adding a new calculator landing

1. Add entry to `data/programmatic/calculators.ts`
2. Route auto-SSG via `generateStaticParams`

---

# 9. Content System

### Blog (`content/blog/` — 27 files)

**Frontmatter:** `title`, `description`, `publishedAt`, `updatedAt`, `category`, `keywords`, `toolSlug`, `relatedSlugs`, `relatedToolSlugs`, optional `faqs[]`

**Loader:** `lib/blog/index.ts` (gray-matter)

**Renderer:** `BlogContent` + optional `BlogToc`, `FaqSection` if `faqs` present

**Related:** `getPostsForTool`, `RelatedPosts`, `getRelatedContentForBlog`

### Guides (`content/guides/` — 50 files)

**Frontmatter:** `title`, `description`, `toolSlug`, `hubSlug`, `relatedGuideSlugs`, `faqs`, dates

**Loader:** `lib/programmatic/guides.ts`

### Authority hubs (`content/hubs/` — 6 files)

**Frontmatter:** `path`, `title`, `seoTitle`, `description`, `toolSlugs`, `blogSlugs`, `relatedHubSlugs`, `categorySummaries`, `faqs`

**Loader:** `lib/hubs/index.ts`

### Tool SEO markdown (`content/tools/`)

Optional per-tool markdown loaded by `lib/tool-content.ts` → rendered in `ToolPage`

### Categories

5 categories in `data/tools/categories.ts`: business, developer, image, text, finance

---

# 10. Styling System

### Stack

- **Tailwind CSS 3.4** + `@tailwindcss/typography` + `tailwindcss-animate`
- **Fonts:** Inter (`--font-inter`), Plus Jakarta Sans (`--font-jakarta`) via `next/font`
- **Theme:** `next-themes` — `defaultTheme="dark"`, `enableSystem`, class-based

### CSS tokens (`app/globals.css`)

- HSL CSS variables: `--background`, `--foreground`, `--primary`, `--surface`, `--border`, etc.
- Light: `#F6F8FC` background; dark: `#0b1020`
- Utility classes: `elevated-card`, `tool-surface`, `section-eyebrow`, `hero-glow`, `shadow-premium`, `prose-section`

### UI primitives (`components/ui/`)

Button, Card, Input, Textarea, Label, Badge, Tabs, Select, Slider, Switch — shadcn-style with `cn()` from `lib/utils.ts`

### Motion

`components/motion/fade-up.tsx` — Framer Motion `whileInView` fade-up (respects `prefers-reduced-motion` via hook)

### Layout spacing

- Container: max 1280px (`2xl`), centered, `1rem` padding
- Tool pages: `max-w-6xl`, hero `pt-[5.5rem]` for fixed nav

---

# 11. Analytics

### Implementation

| Piece | File | Notes |
|-------|------|-------|
| GA scripts | `components/google-analytics-scripts.tsx` | Server-rendered in `<head>`, CSP nonce |
| Loader gate | `components/analytics.tsx` | Production + measurement ID only |
| Route tracker | `components/analytics-tracker.tsx` | SPA pageView via `gtag('config')` |
| Event API | `lib/analytics.ts` | All `track*` helpers |

### Env

- `NEXT_PUBLIC_GA_MEASUREMENT_ID` (canonical, inlined at build)
- `NEXT_PUBLIC_GA_ID` (fallback alias)
- `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` (optional second analytics)

### Events

| Event | Trigger | Helper |
|-------|---------|--------|
| page_view | SPA navigation | `pageView()` |
| tool_view | Route to `/tools/*` | AnalyticsTracker |
| tool_used | Open, generate, copy, download | `trackToolUsage()` |
| category_view | `/category/*` | AnalyticsTracker |
| blog_view | `/blog/*` | AnalyticsTracker |
| search | Hero submit, tool search debounced | `trackSearch()` |
| file_download | `a[download]` in tool surface | `trackDownload()` |
| click (outbound) | External link clicks | `trackOutboundLink()` |
| page_not_found | 404 UI | `NotFoundAnalytics` |
| copy | CopyButton | `trackEvent('copy')` |

### CSP (middleware)

Allows `googletagmanager.com`, `google-analytics.com`, `*.google-analytics.com`, `www.google.com` for connect/img/script

### Debugging

- Production only — no GA in `npm run dev`
- Check Network: `gtag/js`, `collect` requests
- Console: `window.gtag`, `window.dataLayer`

---

# 12. Performance

### Rendering strategy

| Pattern | Usage |
|---------|-------|
| SSG (`●`) | Tools, conversions, calculators, guides, blog, categories |
| Dynamic (`ƒ`) | Homepage, listings, admin, API |
| Edge | `/api/og` only |

### Code splitting

- Every tool: `dynamic(..., { ssr: false })` in `tool-runner.tsx` — separate chunk per tool
- `experimental.optimizePackageImports: ['lucide-react']` in next.config

### Images

- `next/image` for logo; `formats: ['image/avif', 'image/webp']`
- Tool images: client-side blob/data URLs (compressor, resizer)

### Caching

- Static assets: `_next/static` (immutable)
- Middleware skips nonce for static assets, favicons, sitemap, robots

### No ISR currently

All programmatic pages fully static at build time (`generateStaticParams`)

---

# 13. Important Configuration Files

| File | Role |
|------|------|
| `next.config.mjs` | Security headers (HSTS, X-Frame-Options, etc.), image formats, lucide optimize |
| `tsconfig.json` | Strict TS, `@/*` path alias |
| `middleware.ts` | CSP nonce per request, admin Basic Auth, `x-nonce` header |
| `tailwind.config.ts` | Design tokens, typography plugin, darkMode class |
| `postcss.config.mjs` | Tailwind + autoprefixer |
| `package.json` | Scripts: dev, build, audit:*, generate:* |
| `app/sitemap.ts` | Full URL index |
| `app/robots.ts` | Crawl rules |
| `.env.example` | All env var documentation |

---

# 14. Environment Variables

| Variable | Required | Purpose | Used in |
|----------|----------|---------|---------|
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Optional | GA4 measurement ID | `lib/site.ts` → analytics |
| `NEXT_PUBLIC_GA_ID` | Optional | GA4 fallback alias | `lib/site.ts` |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | Optional | Plausible domain | `components/analytics.tsx` |
| `NEXT_PUBLIC_GSC_VERIFICATION` | Optional | GSC HTML verification | `app/layout.tsx` metadata |
| `ADMIN_USERNAME` | For admin | Basic auth username | `lib/admin-auth.ts` |
| `ADMIN_PASSWORD` | For admin | Basic auth password | `lib/admin-auth.ts` |
| `GOOGLE_CLIENT_ID` | For GSC | OAuth client ID | `lib/gsc/oauth.ts` |
| `GOOGLE_CLIENT_SECRET` | For GSC | OAuth secret | `lib/gsc/oauth.ts` |
| `GOOGLE_OAUTH_REDIRECT_URI` | For GSC | OAuth callback URL | `lib/gsc/config.ts` |
| `GSC_SITE_URL` | For GSC | Search Console property identifier | `lib/gsc/config.ts` |

Production secrets live in a server-side `.env.production` file (never committed).

**Never commit secrets.** Do not paste env values into docs or commits.

---

# 15. Dependency Map

| Package | Why | Where |
|---------|-----|-------|
| `next` 15.5 | App Router, SSG, metadata API | Entire app |
| `react` 19 | UI | Components |
| `tailwindcss` | Utility CSS | `globals.css`, all components |
| `framer-motion` | Homepage/tool animations | `fade-up.tsx`, homepage |
| `next-themes` | Dark/light toggle | `ThemeProvider`, `ThemeToggle` |
| `gray-matter` | Markdown frontmatter | blog, guides, hubs loaders |
| `react-markdown` + `remark-gfm` | Markdown rendering | `BlogContent` |
| `qrcode` | QR code generation | `qr-generator-tool`, `upi-qr-tool` |
| `lucide-react` | Icons | Throughout UI |
| `class-variance-authority` + `clsx` + `tailwind-merge` | `cn()` utility | UI components |
| `@next/third-parties` | Available; GA uses custom implementation | — |
| `playwright` | Visual QA script | `scripts/visual-qa.mjs` |
| `sharp` | Favicon/asset generation | `scripts/` |

---

# 16. Internal Linking Map

```
Homepage
  ├── /tools (directory)
  ├── /conversions (conversion index)
  │     ├── /conversions/{category} (hub)
  │     │     └── /conversions/{from}-to-{to} (leaf)
  ├── /category/{slug}
  │     └── /tools/{slug}
  ├── /finance-tools … /seo-tools (authority hubs)
  │     └── /tools/{slug}, /blog/{slug}
  ├── /blog
  │     └── /blog/{slug} → /tools/{toolSlug}
  ├── /calculators/{slug} → ToolRunner + finance-tools hub
  └── /guides/{slug} → tools, calculators, conversions

Footer (every page)
  ├── Categories → /category/*
  ├── Popular tools → /tools/*
  ├── Resources → hubs, /conversions, /blog

RelatedContentSection (per page type)
  └── lib/related-content.ts bundles cross-links
```

**Conversion topical cluster (new):**

```
/conversions
  → /conversions/area
    → /conversions/square-feet-to-acres (ranking query)
    → siblings + popular block on every leaf
```

---

# 17. Search Indexing Strategy

### Indexed (sitemap + robots allow)

- All tools, blog, guides, calculators, conversions (index + hubs + leaves)
- Authority hubs, categories, marketing pages
- `/launch`, `/free-online-tools`

### Not indexed

- `/admin/*` (robots disallow + Basic Auth + noindex header)
- `/api/*` (robots disallow)

### Canonical strategy

- Self-referential canonical on every page via `buildMetadata`
- No trailing-slash duplication (Next.js default)
- No hreflang (single locale `en_IN`)

### Programmatic scale

- 194 conversion leaves — monitor GSC for thin/duplicate content on reverse pairs (e.g. `km-to-miles` vs `miles-to-km`)
- Hub pages provide unique editorial layer above leaf pages

### Pagination

- None currently (all listings fit on one page)

---

# 18. Future Roadmap

### Completed

- [x] Premium SaaS UI redesign (dark/light)
- [x] Sprint 10: launch hub, backlink tracker, admin SEO
- [x] GA4 implementation + CSP-compatible head scripts
- [x] UPI QR SEO expansion (tool content, 3 blogs, FAQ schema)
- [x] Conversion hub architecture (8 categories, enriched leaves, index)
- [x] Time + data conversion categories
- [x] 393 routes live on AWS

### In progress / next sprint

- [ ] Differentiate reverse conversion pairs (canonical or unique copy)
- [ ] Homepage + `/tools` prominent links to `/conversions`
- [ ] Category-specific guides for time/data
- [ ] Expand units (fluid oz, nautical miles, metric tons)
- [ ] GSC monitoring for new conversion hub indexing

### Future ideas

- Hindi locale / hreflang for India SEO
- User-saved calculator presets (localStorage)
- More authority hubs (conversion-tools hub?)
- Programmatic comparison pages ("X vs Y calculator")

### Technical debt

- `lib/hubs/index.ts` unused `_` destructure (lint warning)
- `categoryHub()` in conversions still returns `business-tools` string for `ProgrammaticLinks` (legacy)
- Some calculator pages duplicate tool embed without full `ToolPage` SEO wrapper
- Lighthouse JSON files untracked in repo (should stay untracked or move to `scripts/output/`)

### SEO opportunities

- Internal links from ranking blogs to conversion hubs
- FAQ rich results on conversion hubs (schema already present)
- CTR metadata for top conversion pages (like tools have in `ctr-metadata.ts`)

### Performance opportunities

- ISR for blog if publish frequency increases
- Shared conversion calculator chunk (already one component)

---

# 19. AI Working Rules

**Bootstrap (every Cursor session):** Read `.cursor/AGENT.md` first, then relevant sections of this file. An always-apply rule lives at `.cursor/rules/merqprime-agent-bootstrap.mdc`.

**DO:**

- Read `.cursor/AGENT.md` and `brain.md` before broad repo searches
- Modify existing components; match naming and patterns
- Add tools via the 3-file pattern (definition, runner registry, impl component)
- Add programmatic pages via data files, not new route folders
- Use `buildMetadata` + appropriate `*JsonLd` on every new page
- Update `app/sitemap.ts` for new public routes
- Update `lib/related-content.ts` when adding cross-linkable page types
- Keep GA in `<head>` via `GoogleAnalyticsScripts` (server-rendered, nonced)
- Run `npm run typecheck` and `npm run build` before deploy
- **Update this `brain.md`** after architecture, routes, SEO, or analytics changes

**DO NOT:**

- Redesign UI unless explicitly requested
- Duplicate analytics script loading
- Remove or skip JSON-LD schema on content pages
- Commit `.env`, `.env.production`, or secrets
- Force-push `main`
- Add database dependencies without explicit approval
- Create hand-written conversion page files (use generators)
- Break CSP nonce flow (middleware → layout → Script components)
- Leave `brain.md` stale after significant changes

**Deploy pattern (generic):**

1. Push to `main` on GitHub.
2. On the production server: pull latest, `npm install`, `npm run build`.
3. Restart the PM2 application process.
4. Verify build route count and spot-check production URLs.

Use private runbooks or local notes for host access — do not store SSH keys, IPs, or server paths in this repo.

---

# 20. Recent Changes Log

### 2026-06-27 — AI bootstrap + project brain

- Added `brain.md` (project memory) and `.cursor/AGENT.md` (agent bootstrap)
- Added `.cursor/rules/merqprime-agent-bootstrap.mdc` (always-apply)

### 2026-06-27 — Conversion hub architecture

- Added `/conversions` index page
- Added 8 conversion category hubs (`/conversions/length` … `/conversions/data`)
- Enriched all 194 conversion leaf pages: whatIs, conversion table, common mistakes
- Added `time` and `data` unit categories (+60 conversion pages)
- Fixed breadcrumbs: Home → Conversions → Category → Page
- Added `collectionPageJsonLd`, `itemListJsonLd` in `lib/seo.ts`
- Footer link to `/conversions`
- Sitemap: conversion index + hubs
- **393 routes** (was 324)

### 2026-06-25 — GA4 fix (head scripts + CSP)

- Moved GA4 to server-rendered `<head>` scripts (`GoogleAnalyticsScripts`)
- Expanded CSP for `google.com`, `*.googletagmanager.com`
- `lib/analytics.ts` event helpers, tool/search/404/outbound tracking

### 2026-06-24 — UPI QR SEO

- Expanded `/tools/upi-qr-generator` content + 3 new blogs
- FAQ schema on blog posts with frontmatter `faqs`
- `lib/tool-content.ts`, `content/tools/upi-qr-generator.md`

### 2026-06 — Premium SaaS redesign

- Design system, glass navbar, homepage animations, tool cards, footer

### 2026-06 — Sprint 10

- Launch hub, backlink tracker, `/llms.txt`, admin tools

---

*End of brain.md — update affected sections when the architecture changes.*
