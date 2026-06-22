import type { ConversionPage, ConversionCategory } from "./types";
import {
  CONVERSION_CATEGORIES,
  convertUnits,
  getConversionFormula,
} from "./units";

function buildSlug(fromSlug: string, toSlug: string): string {
  return `${fromSlug}-to-${toSlug}`;
}

function buildFaqs(
  fromShort: string,
  toShort: string,
  formula: string,
): ConversionPage["faqs"] {
  return [
    {
      question: `How do I convert ${fromShort} to ${toShort}?`,
      answer: `Multiply your ${fromShort} value by the conversion factor, or use the formula: ${formula}. Our calculator applies this instantly in your browser.`,
    },
    {
      question: `Is this ${fromShort} to ${toShort} converter accurate?`,
      answer:
        "Yes. Conversions use standard international factors and precise floating-point math. Results are suitable for everyday, engineering and travel use.",
    },
    {
      question: `Is my data sent to a server?`,
      answer:
        "No. The conversion runs locally in your browser on MerQPrime. Values are never uploaded.",
    },
  ];
}

function buildExamples(
  category: ConversionPage["category"],
  fromId: string,
  toId: string,
  fromShort: string,
  toShort: string,
): ConversionPage["examples"] {
  const inputs =
    category === "temperature" ? [0, 25, 100] : [1, 10, 100];
  return inputs.map((input) => {
    const output = convertUnits(category, fromId, toId, input);
    const rounded =
      Math.abs(output) < 0.01
        ? Number(output.toPrecision(4))
        : Number(output.toFixed(4));
    return {
      input,
      output: rounded,
      label: `${input} ${fromShort} = ${rounded} ${toShort}`,
    };
  });
}

function pickRelated(
  all: ConversionPage[],
  current: string,
  category: ConversionPage["category"],
  count = 3,
): string[] {
  const same = all.filter(
    (p) => p.category === category && p.slug !== current,
  );
  const other = all.filter(
    (p) => p.category !== category && p.slug !== current,
  );
  return [...same, ...other]
    .slice(0, count)
    .map((p) => p.slug);
}

function buildPage(
  category: ConversionPage["category"],
  from: (typeof CONVERSION_CATEGORIES)[ConversionCategory]["units"][0],
  to: (typeof CONVERSION_CATEGORIES)[ConversionCategory]["units"][0],
): ConversionPage {
  const slug = buildSlug(from.slug, to.slug);
  const formula = getConversionFormula(category, from, to);
  const title = `${from.label.split(" (")[0]} to ${to.label.split(" (")[0]} Converter`;
  const description = `Convert ${from.short} to ${to.short} instantly. Free ${from.short} to ${to.short} calculator with formula, examples and FAQs.`;
  return {
    slug,
    path: `/conversions/${slug}`,
    category,
    fromUnit: from.id,
    toUnit: to.id,
    fromLabel: from.label,
    toLabel: to.label,
    fromShort: from.short,
    toShort: to.short,
    title,
    seoTitle: `${from.short} to ${to.short} — Free Online Converter`,
    description,
    metaDescription: `Free ${from.short} to ${to.short} converter. Formula, examples and instant results. Private, browser-based conversion on MerQPrime.`,
    keywords: [
      `${from.short} to ${to.short}`,
      `convert ${from.short} to ${to.short}`,
      `${from.short} ${to.short} converter`,
      `${from.short} conversion`,
      `${category} converter`,
    ],
    formula,
    examples: buildExamples(category, from.id, to.id, from.short, to.short),
    faqs: buildFaqs(from.short, to.short, formula),
    relatedSlugs: [],
    toolSlugs: ["unit-converter", "percentage-calculator"],
    hubSlug: "business-tools",
    intro: `Need to convert ${from.short} to ${to.short}? This page gives you an instant calculator, the exact conversion formula, worked examples and answers to common questions. Whether you are studying, travelling, shipping goods or checking specifications, accurate unit conversion saves costly mistakes.`,
  };
}

function generateAll(): ConversionPage[] {
  const pages: ConversionPage[] = [];
  for (const [cat, def] of Object.entries(CONVERSION_CATEGORIES)) {
    const category = cat as ConversionPage["category"];
    for (const from of def.units) {
      for (const to of def.units) {
        if (from.id === to.id) continue;
        pages.push(buildPage(category, from, to));
      }
    }
  }
  return pages.map((page) => ({
    ...page,
    relatedSlugs: pickRelated(pages, page.slug, page.category),
  }));
}

export const conversionPages: ConversionPage[] = generateAll();

const bySlug = new Map(conversionPages.map((p) => [p.slug, p]));

export function getConversionBySlug(slug: string): ConversionPage | undefined {
  return bySlug.get(slug);
}

export function getAllConversionSlugs(): string[] {
  return conversionPages.map((p) => p.slug);
}

export function getRelatedConversions(slug: string, limit = 3): ConversionPage[] {
  const page = bySlug.get(slug);
  if (!page) return [];
  return page.relatedSlugs
    .map((s) => bySlug.get(s))
    .filter((p): p is ConversionPage => Boolean(p))
    .slice(0, limit);
}
