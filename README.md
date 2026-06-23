# MerQPrime

🌐 Website: https://merqprime.in

MerQPrime is a collection of 45+ free online tools for developers, businesses, marketers and creators.

## Popular Tools

- EMI Calculator
- GST Calculator
- SIP Calculator
- FD Calculator
- QR Code Generator
- SHA256 Generator
- JSON Formatter
- Invoice Generator

## Categories

- Finance Calculators
- GST Tools
- Business Tools
- Developer Utilities
- SEO Tools
- QR & Payment Tools
- Image Tools

Built with Next.js 15, TypeScript and Tailwind CSS.

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run start    # serve the production build
npm run lint     # ESLint
npm run typecheck
```

Optional environment variables (see `.env.example`) enable analytics and Search Console verification. The platform runs fully without them.

## Project structure

```
app/                     # App Router routes
  layout.tsx             # Root layout, metadata, theme, CSP nonce
  page.tsx               # Homepage
  tools/                 # Tools index + dynamic [slug] landing pages
  category/[slug]/       # Category listing pages
  api/og/                # Dynamic Open Graph image
  sitemap.ts robots.ts manifest.ts
components/
  ui/                    # shadcn-style primitives (button, card, tabs, …)
  tool/                  # Tool landing framework (breadcrumbs, FAQ, related, page)
  tools/                 # tool-runner registry + impl/ (one file per tool UI)
  layout/                # Header & footer
  search/                # Hero + tools search
data/tools/              # Tool data model, categories and registry
  definitions/           # One metadata file per tool
lib/                     # site config, SEO, security, image, utils
middleware.ts            # CSP + nonce
```

## Adding a new tool

1. Create `data/tools/definitions/my-tool.ts` exporting a `ToolMeta` object.
2. Register it in `data/tools/index.ts`.
3. Create the UI in `components/tools/impl/my-tool-tool.tsx`.
4. Map the slug in `components/tools/tool-runner.tsx`.

The landing page, SEO metadata, schema markup, breadcrumbs, FAQ, related tools, sitemap entry and routing are all generated automatically.

## Security

- Strict CSP (`script-src 'self' 'nonce-…' 'strict-dynamic'`) via `middleware.ts`
- Security headers (HSTS, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy) via `next.config.mjs`
- Image uploads validated by extension, MIME type, size (10 MB) and magic-byte signature; processed in-memory and never uploaded
- Input sanitization helpers and safe-URL / UPI-ID validation in `lib/security.ts`
