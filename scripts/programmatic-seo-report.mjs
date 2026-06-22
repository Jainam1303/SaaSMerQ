/**
 * Programmatic SEO audit report.
 * Usage: node scripts/programmatic-seo-report.mjs
 */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const ROOT = process.cwd();
const REPORT = path.join(ROOT, "reports/programmatic-seo-report.json");

function countWords(text) {
  return text.split(/\s+/).filter(Boolean).length;
}

function countConversionSlugs() {
  const raw = fs.readFileSync(
    path.join(ROOT, "lib/programmatic/units.ts"),
    "utf8",
  );
  const categories = [
    "length",
    "weight",
    "temperature",
    "volume",
    "area",
    "speed",
  ];
  let total = 0;
  for (const cat of categories) {
    const block = raw.match(
      new RegExp(`${cat}:\\s*\\{[\\s\\S]*?units:\\s*\\[([\\s\\S]*?)\\]`, "m"),
    );
    if (!block) continue;
    const ids = [...block[1].matchAll(/id:\s*"([^"]+)"/g)].map((m) => m[1]);
    total += ids.length * (ids.length - 1);
  }
  return total;
}

function loadCalculatorSlugs() {
  const raw = fs.readFileSync(
    path.join(ROOT, "data/programmatic/calculators.ts"),
    "utf8",
  );
  return [...raw.matchAll(/slug:\s*"([^"]+)"/g)].map((m) => m[1]);
}

function loadGuides() {
  const guideDir = path.join(ROOT, "content/guides");
  return fs
    .readdirSync(guideDir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const slug = f.replace(/\.md$/, "");
      const { data, content } = matter(
        fs.readFileSync(path.join(guideDir, f), "utf8"),
      );
      return {
        slug,
        path: `/guides/${slug}`,
        title: data.title,
        category: data.category,
        hubSlug: data.hubSlug,
        wordCount: countWords(content),
        toolSlug: data.toolSlug,
        keywords: data.keywords ?? [],
      };
    });
}

function clusterByCategory(items, key) {
  const map = {};
  for (const item of items) {
    const k = item[key] ?? "other";
    map[k] = (map[k] ?? 0) + 1;
  }
  return map;
}

const conversionCount = countConversionSlugs();
const calculatorSlugs = loadCalculatorSlugs();
const calculatorCount = calculatorSlugs.length;
const guides = loadGuides();
const guideCount = guides.length;

const staticBase = 5;
const hubs = 6;
const categories = 5;
const tools = 45;
const blogs = 24;

const totalUrls =
  staticBase +
  hubs +
  categories +
  tools +
  blogs +
  conversionCount +
  calculatorCount +
  guideCount;

const programmaticPages = conversionCount + calculatorCount + guideCount;
const internalLinksPerPage = 6;
const estimatedNewEdges =
  programmaticPages * internalLinksPerPage + conversionCount * 3;

const report = {
  generatedAt: new Date().toISOString(),
  summary: {
    totalUrls,
    previousUrls: 85,
    urlGrowth: totalUrls - 85,
    conversionPages: conversionCount,
    calculatorPages: calculatorCount,
    guidePages: guideCount,
    programmaticPages,
    estimatedIndexedGrowth: `${Math.round(((totalUrls - 85) / 85) * 100)}%`,
  },
  sitemapBreakdown: {
    static: staticBase,
    hubs,
    categories,
    tools,
    blogs,
    conversions: conversionCount,
    calculators: calculatorCount,
    guides: guideCount,
  },
  internalLinking: {
    linksPerProgrammaticPage: {
      relatedPages: 3,
      tools: 2,
      hub: 1,
    },
    estimatedNewEdges,
    note: "Each conversion, calculator, and guide page links 3 related pages, 2 tools, and 1 hub.",
  },
  keywordClusters: {
    conversions: {
      count: conversionCount,
      clusters: [
        "length",
        "weight",
        "temperature",
        "volume",
        "area",
        "speed",
      ],
      examples: [
        "km to miles",
        "kg to lbs",
        "celsius to fahrenheit",
        "liters to gallons",
        "square feet to square meters",
      ],
    },
    calculators: {
      count: calculatorCount,
      clusters: {
        loans: calculatorSlugs.filter((s) => s.includes("loan")).length,
        investment: calculatorSlugs.filter((s) =>
          ["sip", "fd", "rd", "ppf", "mutual", "compound"].some((k) =>
            s.includes(k),
          ),
        ).length,
        business: calculatorSlugs.filter((s) =>
          ["gst", "profit", "break", "discount", "percentage"].some((k) =>
            s.includes(k),
          ),
        ).length,
      },
      examples: calculatorSlugs.slice(0, 10),
    },
    guides: {
      count: guideCount,
      byCategory: clusterByCategory(guides, "category"),
      avgWordCount: Math.round(
        guides.reduce((s, g) => s + g.wordCount, 0) / guides.length,
      ),
      examples: guides.slice(0, 10).map((g) => g.slug),
    },
  },
  generatedPages: {
    conversionsSample: [
      "km-to-miles",
      "miles-to-km",
      "kg-to-lbs",
      "celsius-to-fahrenheit",
      "liters-to-gallons",
      "square-feet-to-square-meters",
    ],
    calculators: calculatorSlugs,
    guides: guides.map((g) => ({
      slug: g.slug,
      wordCount: g.wordCount,
      hubSlug: g.hubSlug,
    })),
  },
  topInboundAuthorityTargets: [
    "/finance-tools",
    "/developer-tools",
    "/seo-tools",
    "/tools/unit-converter",
    "/tools/emi-calculator",
    "/tools/loan-calculator",
    "/conversions/km-to-miles",
    "/calculators/home-loan-calculator",
    "/guides/how-to-calculate-emi",
  ],
};

fs.mkdirSync(path.dirname(REPORT), { recursive: true });
fs.writeFileSync(REPORT, JSON.stringify(report, null, 2));

console.log("=== PROGRAMMATIC SEO REPORT ===");
console.log(`Total URLs: ${totalUrls} (was 85, +${totalUrls - 85})`);
console.log(`Conversions: ${conversionCount}`);
console.log(`Calculators: ${calculatorCount}`);
console.log(`Guides: ${guideCount} (avg ${report.keywordClusters.guides.avgWordCount} words)`);
console.log(`Estimated new internal edges: ${estimatedNewEdges}`);
console.log(`\nReport: ${REPORT}`);
