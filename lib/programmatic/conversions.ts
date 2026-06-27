import type {
  ConversionPage,
  ConversionCategory,
  ConversionTableRow,
} from "./types";
import {
  CONVERSION_CATEGORIES,
  convertUnits,
  getConversionFormula,
} from "./units";

function buildSlug(fromSlug: string, toSlug: string): string {
  return `${fromSlug}-to-${toSlug}`;
}

function roundSmart(value: number): number {
  if (!Number.isFinite(value)) return 0;
  if (value === 0) return 0;
  return Math.abs(value) < 0.01
    ? Number(value.toPrecision(4))
    : Number(value.toFixed(4));
}

function tableInputs(category: ConversionCategory): number[] {
  switch (category) {
    case "temperature":
      return [-40, 0, 10, 20, 25, 37, 50, 100];
    case "data":
      return [1, 8, 64, 128, 256, 512, 1024];
    case "time":
      return [1, 5, 10, 30, 60, 100, 1000];
    default:
      return [1, 2, 5, 10, 20, 25, 50, 100, 500, 1000];
  }
}

function buildConversionTable(
  category: ConversionCategory,
  fromId: string,
  toId: string,
): ConversionTableRow[] {
  return tableInputs(category).map((input) => ({
    input,
    output: roundSmart(convertUnits(category, fromId, toId, input)),
  }));
}

function buildWhatIs(
  categoryLabel: string,
  fromLabel: string,
  toLabel: string,
  fromShort: string,
  toShort: string,
  formula: string,
): string {
  const noun = categoryLabel.toLowerCase();
  return `${fromLabel} and ${toLabel} are both units of ${noun}. Converting ${fromShort} to ${toShort} means expressing the same ${noun} measurement in a different unit without changing the underlying quantity. This is useful whenever a value is given in one system but you need it in another — for travel, study, engineering, cooking or international specifications. The relationship is fixed and linear, so a single conversion factor (${formula}) maps every ${fromShort} value to its exact ${toShort} equivalent.`;
}

function buildCommonMistakes(
  category: ConversionCategory,
  fromShort: string,
  toShort: string,
): string[] {
  const specific: Record<ConversionCategory, string> = {
    length:
      "Mixing metric and imperial units midway through a multi-step conversion instead of converting to a single base unit first.",
    weight:
      "Confusing mass units (kg, g) with imperial weight (lb, oz) and applying the wrong base factor.",
    temperature:
      "Treating temperature like a simple ratio. Celsius and Fahrenheit need an offset (the 32° term), not just multiplication.",
    volume:
      "Confusing US and metric measures — a US cup, US gallon and imperial gallon are all different sizes.",
    area:
      "Forgetting that area scales with the square of the linear factor, so the area ratio is not the same as the length ratio.",
    speed:
      "Assuming km/h and m/s differ by 1000. They actually differ by a factor of 3.6.",
    time:
      "Assuming every month or year is a fixed length. Convert through seconds for an exact result.",
    data:
      "Mixing bits and bytes — 1 byte = 8 bits, and storage is usually quoted in bytes while bandwidth is often in bits.",
  };

  return [
    `Converting in the wrong direction — multiplying when you should divide (or vice versa). Sanity-check whether ${toShort} should come out larger or smaller than ${fromShort}.`,
    `Rounding too early. Keep full precision during the calculation and round only the final ${toShort} value.`,
    specific[category],
  ];
}

function buildFaqs(
  fromShort: string,
  toShort: string,
  formula: string,
  category: ConversionPage["category"],
): ConversionPage["faqs"] {
  return [
    {
      question: `How do I convert ${fromShort} to ${toShort}?`,
      answer: `Multiply your ${fromShort} value by the conversion factor, or use the formula: ${formula}. Our calculator applies this instantly in your browser.`,
    },
    {
      question: `What is the formula for ${fromShort} to ${toShort}?`,
      answer: `The standard conversion is: ${formula}. Enter any ${fromShort} value above and the calculator returns the equivalent in ${toShort} immediately.`,
    },
    {
      question: `How do I convert ${toShort} back to ${fromShort}?`,
      answer: `Reverse the conversion by swapping the units in the calculator, or visit our dedicated ${toShort}-to-${fromShort} page for the inverse formula and examples.`,
    },
    {
      question: `Is this ${fromShort} to ${toShort} converter accurate?`,
      answer:
        "Yes. Conversions use standard international factors and precise floating-point math. Results are suitable for everyday, engineering and travel use.",
    },
    {
      question: `When would I need a ${category} conversion like ${fromShort} to ${toShort}?`,
      answer: `Common uses include travel planning, shipping labels, school coursework, recipe scaling and reading international product specs. Bookmark this page for quick ${fromShort} to ${toShort} lookups.`,
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

function categoryHub(): string {
  return "business-tools";
}

function categoryTools(
  category: ConversionPage["category"],
): [string, string] {
  if (category === "length" || category === "weight" || category === "area") {
    return ["unit-converter", "percentage-calculator"];
  }
  if (category === "temperature" || category === "volume") {
    return ["unit-converter", "age-calculator"];
  }
  return ["unit-converter", "percentage-calculator"];
}

function pickRelated(
  all: ConversionPage[],
  current: string,
  category: ConversionPage["category"],
  count = 5,
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
  const categoryLabel = CONVERSION_CATEGORIES[category].label;
  const title = `${from.label.split(" (")[0]} to ${to.label.split(" (")[0]} Converter`;
  const description = `Convert ${from.short} to ${to.short} instantly. Free ${from.short} to ${to.short} calculator with formula, examples and FAQs.`;
  return {
    slug,
    path: `/conversions/${slug}`,
    category,
    categoryLabel,
    fromUnit: from.id,
    toUnit: to.id,
    fromLabel: from.label,
    toLabel: to.label,
    fromShort: from.short,
    toShort: to.short,
    title,
    seoTitle: `${from.label.split(" (")[0]} to ${to.label.split(" (")[0]} Converter (Instant & Free) | MerQPrime`,
    description,
    metaDescription: `Convert ${from.short} to ${to.short} instantly — free online converter with formula, examples and FAQs. Private, browser-based tool on MerQPrime.`,
    keywords: [
      `${from.short} to ${to.short}`,
      `convert ${from.short} to ${to.short}`,
      `${from.short} ${to.short} converter`,
      `${from.short} conversion`,
      `${category} converter`,
    ],
    formula,
    whatIs: buildWhatIs(
      categoryLabel,
      from.label.split(" (")[0],
      to.label.split(" (")[0],
      from.short,
      to.short,
      formula,
    ),
    examples: buildExamples(category, from.id, to.id, from.short, to.short),
    conversionTable: buildConversionTable(category, from.id, to.id),
    commonMistakes: buildCommonMistakes(category, from.short, to.short),
    faqs: buildFaqs(from.short, to.short, formula, category),
    relatedSlugs: [],
    toolSlugs: categoryTools(category),
    hubSlug: categoryHub(),
    intro: `Need to convert ${from.short} to ${to.short}? This page gives you an instant calculator, the exact conversion formula, a full conversion table, worked examples and answers to common questions. Whether you are studying, travelling, shipping goods or checking specifications, accurate unit conversion saves costly mistakes.`,
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

export function getRelatedConversions(slug: string, limit = 5): ConversionPage[] {
  const page = bySlug.get(slug);
  if (!page) return [];
  return page.relatedSlugs
    .map((s) => bySlug.get(s))
    .filter((p): p is ConversionPage => Boolean(p))
    .slice(0, limit);
}

/** All conversions belonging to a single category (for hub pages). */
export function getConversionsByCategory(
  category: ConversionCategory,
): ConversionPage[] {
  return conversionPages.filter((p) => p.category === category);
}

/** Same-category conversions excluding the current page. */
export function getSameCategoryConversions(
  slug: string,
  limit = 8,
): ConversionPage[] {
  const page = bySlug.get(slug);
  if (!page) return [];
  return conversionPages
    .filter((p) => p.category === page.category && p.slug !== slug)
    .slice(0, limit);
}

/**
 * Curated high-intent conversions surfaced sitewide. These match strong
 * long-tail demand (area, volume, length, weight, temperature).
 */
export const POPULAR_CONVERSION_SLUGS: string[] = [
  "km-to-miles",
  "miles-to-km",
  "meters-to-feet",
  "feet-to-meters",
  "cm-to-inches",
  "kg-to-lbs",
  "lbs-to-kg",
  "celsius-to-fahrenheit",
  "fahrenheit-to-celsius",
  "liters-to-gallons",
  "cups-to-ml",
  "ml-to-cups",
  "square-feet-to-acres",
  "acres-to-square-feet",
  "square-feet-to-square-meters",
];

export function getPopularConversions(limit = 12): ConversionPage[] {
  return POPULAR_CONVERSION_SLUGS.map((s) => bySlug.get(s))
    .filter((p): p is ConversionPage => Boolean(p))
    .slice(0, limit);
}
