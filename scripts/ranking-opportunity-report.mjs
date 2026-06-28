/**
 * Sprint 12 Phase 2 — Ranking Opportunity + Technical Audit.
 *
 * Scores already-published pages (tools, finance calculators, blogs, guides
 * and the highest-demand conversion leaves) by how likely they are to move
 * from SERP positions ~11–30 into the top 10, then runs a static technical
 * audit (duplicate titles/descriptions, weak/short metadata, thin content,
 * missing CTR overrides).
 *
 * No live GSC export is required — demand weights come from the documented
 * Search Console ranking themes (brain.md §SEO + Sprint history). Update the
 * DEMAND map as fresh Search Console data arrives at /admin/seo.
 *
 * Usage: npm run audit:ranking
 */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const ROOT = process.cwd();
const OUT = path.join(ROOT, "reports/ranking-opportunity-report.json");

const DEFS_DIR = path.join(ROOT, "data/tools/definitions");
const BLOG_DIR = path.join(ROOT, "content/blog");
const GUIDES_DIR = path.join(ROOT, "content/guides");
const CTR_FILE = path.join(ROOT, "data/seo/ctr-metadata.ts");
const CALC_FILE = path.join(ROOT, "data/programmatic/calculators.ts");

/**
 * Demand weight (0–10) for documented Search Console themes. Higher = more
 * impressions / commercial intent already landing on positions 11–30.
 */
const DEMAND = {
  // Finance — strongest India intent
  "emi-calculator": 10,
  "gst-calculator": 10,
  "upi-qr-generator": 9,
  "sip-calculator": 9,
  "profit-margin-calculator": 8,
  "fd-calculator": 8,
  "ppf-calculator": 8,
  "hra-calculator": 7,
  "loan-calculator": 7,
  "rd-calculator": 6,
  "percentage-calculator": 7,
  "age-calculator": 6,
  "unit-converter": 7,
  "discount-calculator": 5,
  "break-even-calculator": 4,
  "gst-invoice-generator": 6,
  "invoice-generator": 5,
  // Calculator landing pages
  "home-loan-calculator": 8,
  "car-loan-calculator": 6,
  "personal-loan-calculator": 6,
  "emi-calculator-india": 7,
  "gst-calculator-india": 8,
  // Conversions (leaf slugs) — proven long-tail intent
  "km-to-miles": 9,
  "miles-to-km": 8,
  "kg-to-lbs": 9,
  "lbs-to-kg": 8,
  "cm-to-inches": 8,
  "inches-to-cm": 7,
  "celsius-to-fahrenheit": 8,
  "fahrenheit-to-celsius": 7,
  "meters-to-feet": 7,
  "feet-to-meters": 6,
  "ml-to-cups": 7,
  "cups-to-ml": 6,
  "liters-to-gallons": 6,
  "acres-to-square-km": 6,
};

/** Content themes for blogs/guides keyed by slug substring → demand weight. */
const CONTENT_DEMAND = [
  [/gst/i, 9],
  [/emi/i, 9],
  [/sip/i, 8],
  [/ppf/i, 7],
  [/\bfd\b|fixed-deposit|fd-/i, 7],
  [/\brd\b|recurring/i, 6],
  [/hra/i, 7],
  [/loan/i, 7],
  [/upi|qr/i, 8],
  [/profit|margin|markup/i, 7],
  [/percentage/i, 6],
  [/km-to-miles|kg-to-lbs|celsius|liters-to-gallons|square-feet|unit-conversion/i, 6],
];

function readFile(p) {
  return fs.readFileSync(p, "utf8");
}

function words(s) {
  return (s ?? "").split(/\s+/).filter(Boolean).length;
}

/* ----------------------------- Loaders ----------------------------- */

function loadCtrOverrides() {
  const raw = readFile(CTR_FILE);
  const slugs = new Set();
  const re = /"?([a-z0-9-]+)"?\s*:\s*\{\s*\n\s*seoTitle:/g;
  let m;
  while ((m = re.exec(raw))) slugs.add(m[1]);
  return slugs;
}

function loadTools(ctrSlugs) {
  return fs
    .readdirSync(DEFS_DIR)
    .filter((f) => f.endsWith(".ts"))
    .map((file) => {
      const raw = readFile(path.join(DEFS_DIR, file));
      const slug = raw.match(/slug:\s*"([^"]+)"/)?.[1];
      const seoTitle = raw.match(/seoTitle:\s*\n?\s*"([^"]+)"/)?.[1];
      const metaDescription = raw.match(/metaDescription:\s*\n?\s*"([^"]+)"/)?.[1];
      const intro = raw.match(/intro:\s*\n?\s*"([^"]+)"/)?.[1] ?? "";
      const faqCount = (raw.match(/question:/g) ?? []).length;
      // Approximate rendered word count: intro + howItWorks + useCases + FAQ
      // answers (tool pages render all of these), not just the intro field.
      const stepsWords = (raw.match(/howItWorks:[\s\S]*?\]/)?.[0] ?? "")
        .split(/\s+/).length;
      const useCaseWords = (raw.match(/useCases:[\s\S]*?\]/)?.[0] ?? "")
        .split(/\s+/).length;
      const answerWords = (raw.match(/answer:\s*\n?\s*"[^"]+"/g) ?? [])
        .join(" ")
        .split(/\s+/).length;
      return {
        type: "tool",
        slug,
        path: `/tools/${slug}`,
        seoTitle,
        metaDescription,
        faqCount,
        wordCount: words(intro) + stepsWords + useCaseWords + answerWords,
        hasCtr: ctrSlugs.has(slug),
      };
    })
    .filter((t) => t.slug);
}

function loadCalculators() {
  const raw = readFile(CALC_FILE);
  const out = [];
  const re =
    /slug:\s*"([^"]+)",[\s\S]*?seoTitle:\s*\n?\s*"([^"]+)",[\s\S]*?metaDescription:\s*\n?\s*"([^"]+)"/g;
  let m;
  while ((m = re.exec(raw))) {
    out.push({
      type: "calculator",
      slug: m[1],
      path: `/calculators/${m[1]}`,
      seoTitle: m[2],
      metaDescription: m[3],
      faqCount: 3,
      wordCount: 320,
      hasCtr: true,
    });
  }
  return out;
}

function loadMarkdown(dir, type, base) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((file) => {
      const slug = file.replace(/\.md$/, "");
      const { data, content } = matter(readFile(path.join(dir, file)));
      return {
        type,
        slug,
        path: `${base}/${slug}`,
        seoTitle: data.seoTitle ?? data.title,
        metaDescription: data.metaDescription ?? data.description,
        faqCount: (data.faqs ?? []).length,
        wordCount: words(content),
        hasCtr: true,
      };
    });
}

function loadConversions() {
  // Conversion leaf titles follow a deterministic generator pattern, so they
  // are unique by construction. We only score the demand-listed leaves here.
  return Object.keys(DEMAND)
    .filter((s) => s.includes("-to-"))
    .map((slug) => ({
      type: "conversion",
      slug,
      path: `/conversions/${slug}`,
      seoTitle: `${slug} Converter (Instant & Free) | MerQPrime`,
      metaDescription: `Convert ${slug.replace(/-to-/, " to ")} instantly.`,
      faqCount: 6,
      wordCount: 700,
      hasCtr: false,
    }));
}

/* --------------------------- Scoring ------------------------------- */

function demandFor(node) {
  if (DEMAND[node.slug] != null) return DEMAND[node.slug];
  if (node.type === "blog" || node.type === "guide") {
    for (const [re, w] of CONTENT_DEMAND) if (re.test(node.slug)) return w;
    return 3;
  }
  return 2;
}

/** CTR gap: how much headroom the current metadata leaves (0–1, higher=worse). */
function ctrGap(node) {
  let gap = 0;
  const title = node.seoTitle ?? "";
  const desc = node.metaDescription ?? "";
  if (!node.hasCtr && node.type === "tool") gap += 0.3;
  if (!/\d/.test(title)) gap += 0.2; // no number in title
  if (title.length < 30 || title.length > 60) gap += 0.2;
  if (!desc || desc.length < 120 || desc.length > 165) gap += 0.2;
  if (node.type === "conversion") gap += 0.25; // generic generated metadata
  return Math.min(1, gap);
}

/** Content readiness: pages with enough depth/FAQ are ready to rank higher. */
function readiness(node) {
  let r = 0.5;
  if (node.wordCount >= 400) r += 0.25;
  if (node.faqCount >= 5) r += 0.25;
  return Math.min(1, r);
}

function opportunityScore(node) {
  const demand = demandFor(node); // 0–10
  const gap = ctrGap(node); // 0–1
  const ready = readiness(node); // 0–1
  // Opportunity favours high demand + improvable metadata + ready content.
  return Math.round(demand * (0.6 + 0.4 * gap) * (0.6 + 0.4 * ready) * 10);
}

/* ------------------------ Technical audit -------------------------- */

function technicalAudit(nodes) {
  const titleMap = new Map();
  const descMap = new Map();
  for (const n of nodes) {
    if (n.seoTitle) {
      const key = n.seoTitle.trim().toLowerCase();
      titleMap.set(key, [...(titleMap.get(key) ?? []), n.path]);
    }
    if (n.metaDescription) {
      const key = n.metaDescription.trim().toLowerCase();
      descMap.set(key, [...(descMap.get(key) ?? []), n.path]);
    }
  }
  const duplicateTitles = [...titleMap.entries()]
    .filter(([, paths]) => paths.length > 1)
    .map(([title, paths]) => ({ title, paths }));
  const duplicateDescriptions = [...descMap.entries()]
    .filter(([, paths]) => paths.length > 1)
    .map(([description, paths]) => ({ description, paths }));

  const missingMetadata = nodes
    .filter((n) => !n.seoTitle || !n.metaDescription)
    .map((n) => n.path);
  const titleLengthIssues = nodes
    .filter((n) => n.seoTitle && (n.seoTitle.length < 30 || n.seoTitle.length > 62))
    .map((n) => ({ path: n.path, length: n.seoTitle.length, title: n.seoTitle }));
  const descriptionLengthIssues = nodes
    .filter(
      (n) =>
        n.metaDescription &&
        (n.metaDescription.length < 110 || n.metaDescription.length > 165),
    )
    .map((n) => ({ path: n.path, length: n.metaDescription.length }));
  const thinPages = nodes
    .filter((n) => n.wordCount < 300)
    .map((n) => ({ path: n.path, words: n.wordCount }));
  const toolsMissingCtr = nodes
    .filter((n) => n.type === "tool" && !n.hasCtr)
    .map((n) => n.path);

  return {
    duplicateTitles,
    duplicateDescriptions,
    missingMetadata,
    titleLengthIssues,
    descriptionLengthIssues,
    thinPages,
    toolsMissingCtr,
  };
}

/* ------------------------------ Main ------------------------------- */

function main() {
  const ctrSlugs = loadCtrOverrides();
  const tools = loadTools(ctrSlugs);
  const calculators = loadCalculators();
  const blogs = loadMarkdown(BLOG_DIR, "blog", "/blog");
  const guides = loadMarkdown(GUIDES_DIR, "guide", "/guides");
  const conversions = loadConversions();

  const all = [...tools, ...calculators, ...blogs, ...guides, ...conversions];

  const scored = all
    .map((n) => ({
      path: n.path,
      type: n.type,
      slug: n.slug,
      demand: demandFor(n),
      ctrGap: Number(ctrGap(n).toFixed(2)),
      readiness: Number(readiness(n).toFixed(2)),
      opportunityScore: opportunityScore(n),
      hasCtr: n.hasCtr,
      titleLength: n.seoTitle?.length ?? 0,
      descLength: n.metaDescription?.length ?? 0,
      faqCount: n.faqCount,
    }))
    .sort((a, b) => b.opportunityScore - a.opportunityScore);

  const tech = technicalAudit(all);

  const topCandidates = scored.filter((s) => s.opportunityScore >= 40);

  const report = {
    generatedAt: new Date().toISOString(),
    sprint: "Sprint 12 Phase 2 — Ranking Optimization",
    method:
      "Opportunity = demand (documented GSC themes) × CTR gap × content readiness. Replace DEMAND weights with live Search Console position 11–30 data when available.",
    summary: {
      pagesScored: scored.length,
      highOpportunityPages: topCandidates.length,
      duplicateTitleGroups: tech.duplicateTitles.length,
      duplicateDescriptionGroups: tech.duplicateDescriptions.length,
      thinPages: tech.thinPages.length,
      toolsMissingCtr: tech.toolsMissingCtr.length,
    },
    rankingOpportunities: scored.slice(0, 40),
    technicalAudit: tech,
  };

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(report, null, 2));

  console.log(`\u2713 Wrote ${path.relative(ROOT, OUT)}`);
  console.log(`  Pages scored: ${scored.length}`);
  console.log(`  High-opportunity (score >= 40): ${topCandidates.length}`);
  console.log(`  Duplicate titles: ${tech.duplicateTitles.length} group(s)`);
  console.log(
    `  Duplicate descriptions: ${tech.duplicateDescriptions.length} group(s)`,
  );
  console.log(`  Thin pages (<300 words): ${tech.thinPages.length}`);
  console.log(`  Tools missing CTR override: ${tech.toolsMissingCtr.length}`);
  console.log("\n  Top 12 ranking opportunities:");
  for (const s of scored.slice(0, 12)) {
    console.log(
      `   ${String(s.opportunityScore).padStart(3)}  ${s.type.padEnd(11)} ${s.path}`,
    );
  }
}

main();
