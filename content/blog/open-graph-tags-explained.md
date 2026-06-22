---
title: "Open Graph Tags Explained — Social Previews That Convert"
description: "Master Open Graph meta tags for Facebook, LinkedIn and messaging apps — image sizes, required properties and generate OG markup with MerQPrime."
publishedAt: "2026-06-20"
category: "SEO"
keywords:
  - open graph tags
  - og meta tags
  - open graph generator
  - social media preview
  - og image size
  - facebook link preview
toolSlug: open-graph-generator
relatedToolSlugs:
  - meta-tag-generator
  - schema-markup-generator
  - slug-generator
relatedSlugs:
  - meta-tags-for-seo
  - what-is-schema-markup
---

When someone shares your link on WhatsApp, LinkedIn, Slack or iMessage, the preview card — title, description, image — often comes from Open Graph (OG) tags, not from your visible page hero. Missing or wrong OG markup means ugly defaults, wrong crops and lost clicks. Open Graph is the social layer of your `<head>`; it complements classic meta tags and JSON-LD schema without replacing them.

This guide explains core OG properties, platform behavior, image guidelines and how to generate tags with MerQPrime's [Open Graph Generator](/tools/open-graph-generator) alongside [SEO Tools](/seo-tools) utilities.

## What is Open Graph?

Open Graph protocol defines `<meta property="og:...">` tags Facebook published for richer link objects. Other platforms adopted the same tags for preview scrapers. Twitter/X historically used `twitter:` tags but often falls back to OG when Twitter Card tags are absent.

OG tells scrapers:

- Page title for the card (`og:title`)
- Summary text (`og:description`)
- Canonical share URL (`og:url`)
- Preview image (`og:image`)
- Content type (`og:type`) — website, article, product, etc.

Without OG, scrapers guess from `<title>` and first large image — unreliable for SPAs and lazy-loaded heroes.

## Essential Open Graph tags

| Property | Purpose |
| --- | --- |
| `og:title` | Headline in preview — often matches or extends `<title>` |
| `og:description` | Supporting text — may differ from meta description |
| `og:url` | Preferred canonical URL for shares |
| `og:image` | Absolute URL to preview image |
| `og:type` | Object type — `website`, `article`, `product` |
| `og:site_name` | Brand name beside title |
| `og:locale` | e.g. `en_IN` for Indian English context |

Articles add `article:published_time`, `article:author` on some platforms. Products map to commerce-specific extensions — align with [What Is Schema Markup](/blog/what-is-schema-markup) Product JSON-LD for consistency.

Generate a baseline set with the [Open Graph Generator](/tools/open-graph-generator), then customize per campaign.

## og:image dimensions and quality

Recommended general size: **1200 × 630 pixels** (1.91:1 aspect ratio). Facebook and LinkedIn crop differently on mobile — keep critical text and logos centered in a safe zone.

Use HTTPS absolute URLs pointing to CDN or origin — scrapers must fetch without auth cookies. JPEG or PNG; avoid tiny favicons stretched as OG images.

For tool sites like MerQPrime, branded OG images per major hub ([Developer Tools](/developer-tools), [SEO Tools](/seo-tools)) improve recognition in group chats common in Indian startup communities.

Image file size affects scrape speed — compress marketing assets (see image tools on other hubs) without illegible text.

## Open Graph vs Twitter Cards

Twitter Card tags (`twitter:card`, `twitter:title`, `twitter:image`) customize X previews. `summary_large_image` mirrors OG large cards. MerQPrime's generator can include Twitter fallbacks when you want one copy-paste block.

If only OG is present, many networks use OG — still verify on each platform you care about.

## Open Graph vs standard meta tags

[Meta Tags for SEO](/blog/meta-tags-for-seo) covers `<title>` and `<meta name="description">` for search snippets. OG targets social scrapers — overlapping but not identical audiences.

Strategies:

- **Unified messaging** — same campaign hook in title and `og:title` for small teams.
- **Social hook variant** — punchier `og:title` for shares while SERP title stays keyword-focused.
- **Description tuning** — `og:description` can be conversational; meta description may include price or legal qualifiers.

Use the [Word Counter](/tools/word-counter) for character limits on both — see [Best Free Word Counter Tool](/blog/best-free-word-counter-tool).

Generate search meta via [Meta Tag Generator](/tools/meta-tag-generator) in the same session as OG.

## Debugging link previews

### Facebook Sharing Debugger

Forces rescrape after OG fixes — caches are sticky without refresh.

### LinkedIn Post Inspector

Validates professional network previews.

### Slack and Discord

Unfurl URLs in a test channel after deploy.

Common failures:

- `og:image` relative URL (`/images/og.png`) — must be absolute.
- Redirect chains on image URLs — simplify.
- `robots` blocking scrapers — rare but possible on staging.
- SPA without SSR — scrapers see empty shell; prerender or edge OG for critical routes.

Developers serving JWT-protected staging should not expect public scrapers to authenticate — use public staging URLs for OG validation.

## og:url and slug consistency

Set `og:url` to the canonical user-facing URL. Match slug patterns from the [Slug Generator](/tools/slug-generator) — avoid sharing URLs with tracking params as canonical OG unless campaigns require UTM-tagged canonicalization strategy (usually prefer clean canonical + UTMs only in share links).

Read [URL Encoding Explained](/blog/url-encoding-explained) when query strings appear in shared links — encoding affects analytics, not OG property values themselves.

## og:type selection

- `website` — homepages and tool indexes.
- `article` — blog posts with publish dates visible.
- `product` — SKU pages with price on-page.

Wrong type rarely breaks previews but affects platform analytics categorization.

## Open Graph for single-page applications

React/Vue client-rendered pages may omit OG in initial HTML. Solutions:

- Server-side rendering (Next.js, Nuxt)
- Prerender for bots
- Edge middleware injecting head per route

JSON-LD Article schema from [Schema Markup Generator](/tools/schema-markup-generator) faces the same SSR requirement — coordinate frontend architecture.

## International and Indian audiences

`og:locale` and `og:locale:alternate` signal language variants for multi-language sites — English plus Hindi pages on Indian SaaS products. WhatsApp dominates link sharing in India; OG image legibility on small screens matters more than desktop polish.

## Workflow with MerQPrime SEO hub

1. Finalize page URL slug.
2. Write body; count words if needed.
3. Create meta tags.
4. Create OG tags with 1200×630 image URL.
5. Add JSON-LD if applicable.
6. Update sitemap.
7. Debug previews on Facebook and LinkedIn tools.

Compare generated tag blocks in [Text Diff Checker](/tools/text-diff-checker) on [Developer Tools](/developer-tools) when iterating copy.

## Security and privacy

OG tags are public — never embed secrets in descriptions. Tokens in share URLs leak via referrer logs — design marketing links carefully.

## Measuring impact

Track social referral traffic in analytics separately from organic search. A/B test OG titles on high-share pages (tools, calculators on [Finance Tools](/finance-tools)) — watch bounce rate, not just click-through on previews.

## Frequently asked questions

### Are Open Graph tags required?

Not strictly, but strongly recommended for any page you expect users to share.

### Why does WhatsApp show the wrong image?

Often first large image heuristic before OG fix, or cached old scrape — update OG and wait for cache expiry; some users re-share with debugger-refreshed URLs.

### Can I use different OG images per network?

Possible with platform-specific tags or server user-agent logic — usually one strong OG image suffices for SMB sites.

### Does MerQPrime store my OG fields?

The [Open Graph Generator](/tools/open-graph-generator) runs in-browser — your draft campaign copy stays local until you deploy.

Pair this guide with [Meta Tags for SEO](/blog/meta-tags-for-seo) and [What Is Schema Markup](/blog/what-is-schema-markup). Bookmark [SEO Tools](/seo-tools) for generators and [Developer Tools](/developer-tools) when your stack needs JSON formatting or URL encoding alongside social metadata — ship previews that match the quality of your product pages.

## Campaign-specific Open Graph variants

Product launches sometimes need distinct OG images per channel — LinkedIn professional tone versus WhatsApp-friendly bold text. Maintain a spreadsheet mapping URL paths to image assets and regenerate OG tags when creative updates. Version image filenames (`og-home-v2.jpg`) to bust CDN caches without changing page slugs.

Employee advocacy programs fail when staff share links before OG tags deploy — add OG verification to release checklists alongside unit tests. Staging environments with `noindex` can still host public OG images on production CDN paths for debugger tools to fetch.

Video OG (`og:video`) extends previews for demo pages — less common on calculator sites but relevant for SaaS onboarding flows. Ensure poster image fallback exists when platforms ignore video tags on slow networks common in mobile-first markets.
