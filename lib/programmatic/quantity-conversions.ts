import type {
  ConversionCategory,
  ConversionTableRow,
  QuantityConversionPage,
} from "./types";
import {
  CONVERSION_CATEGORIES,
  convertUnits,
  getConversionFormula,
  type UnitDef,
} from "./units";

/**
 * Long-tail "N units to X" pages (e.g. `64-acres-to-square-km`,
 * `120-ml-to-cups`, `1-cup-to-ml`). These target proven Search Console
 * queries where users search a specific quantity rather than a generic
 * converter. Each page is an instant-answer page: unique title, computed
 * result, formula, worked example, a nearby-values table and FAQs.
 *
 * Generated from curated seeds — no hand-written page files.
 */
interface QuantitySeed {
  category: ConversionCategory;
  fromUnit: string;
  toUnit: string;
  /** Proven + standard quantities to generate pages for. */
  quantities: number[];
  /** Real-world framing used in intros and FAQs (no trailing period). */
  angle: string;
}

/** Quantity set used by most area seeds (mirrors the proven acre queries). */
const STD = [1, 2, 5, 10, 20, 50, 100, 1000];

const SEEDS: QuantitySeed[] = [
  // --- Area (the "acres in km" cluster already ranking) ---
  {
    category: "area",
    fromUnit: "acre",
    toUnit: "sqkm",
    quantities: [1, 2, 5, 10, 20, 50, 64, 100, 1000],
    angle: "sizing farmland, estates and large plots in square kilometres",
  },
  {
    category: "area",
    fromUnit: "acre",
    toUnit: "sqft",
    quantities: STD,
    angle: "reading land deeds and property listings in square feet",
  },
  {
    category: "area",
    fromUnit: "acre",
    toUnit: "ha",
    quantities: STD,
    angle: "comparing agricultural land in hectares",
  },
  {
    category: "area",
    fromUnit: "ha",
    toUnit: "acre",
    quantities: [1, 2, 5, 10, 20, 50, 100],
    angle: "converting hectares on farm and forestry records to acres",
  },
  {
    category: "area",
    fromUnit: "sqft",
    toUnit: "sqm",
    quantities: [100, 200, 500, 1000, 1500, 2000, 5000],
    angle: "comparing apartment and plot sizes in square metres",
  },
  {
    category: "area",
    fromUnit: "sqm",
    toUnit: "sqft",
    quantities: [1, 10, 50, 100, 200, 500, 1000],
    angle: "matching metric floor area to square-foot listings",
  },
  // --- Volume (cooking + fuel queries) ---
  {
    category: "volume",
    fromUnit: "cup",
    toUnit: "ml",
    quantities: [1, 2, 3, 4],
    angle: "measuring US cup recipe amounts in millilitres",
  },
  {
    category: "volume",
    fromUnit: "ml",
    toUnit: "cup",
    quantities: [50, 100, 120, 150, 200, 250, 500],
    angle: "converting millilitre quantities into US cups for recipes",
  },
  {
    category: "volume",
    fromUnit: "l",
    toUnit: "gal",
    quantities: [1, 2, 5, 10, 20, 50],
    angle: "converting litres of fuel or liquid into US gallons",
  },
  {
    category: "volume",
    fromUnit: "ml",
    toUnit: "l",
    quantities: [100, 250, 500, 750, 1000],
    angle: "checking bottle and container sizes in litres",
  },
  // --- Weight (body weight + recipes) ---
  {
    category: "weight",
    fromUnit: "kg",
    toUnit: "lb",
    quantities: [1, 2, 5, 10, 20, 50, 60, 70, 80, 100],
    angle: "converting body weight and parcel weight into pounds",
  },
  {
    category: "weight",
    fromUnit: "lb",
    toUnit: "kg",
    quantities: [1, 2, 5, 10, 50, 100, 150, 200],
    angle: "converting US pound weights into metric kilograms",
  },
  // --- Length (everyday metric/imperial) ---
  {
    category: "length",
    fromUnit: "cm",
    toUnit: "in",
    quantities: [1, 5, 10, 20, 30, 50, 100, 180],
    angle: "converting body and product measurements into inches",
  },
  {
    category: "length",
    fromUnit: "mm",
    toUnit: "in",
    quantities: [1, 5, 10, 20, 50, 100],
    angle: "matching engineering and hardware sizes in inches",
  },
];

function roundSmart(value: number): number {
  if (!Number.isFinite(value)) return 0;
  if (value === 0) return 0;
  return Math.abs(value) < 0.01
    ? Number(value.toPrecision(4))
    : Number(value.toFixed(4));
}

/** Display word for a unit short label at a given quantity (grammar only). */
const SINGULARS: Record<string, string> = {
  acres: "acre",
  cups: "cup",
  liters: "liter",
  gallons: "gallon",
  hectares: "hectare",
  inches: "inch",
  grams: "gram",
  ounces: "ounce",
  yards: "yard",
};

function unitWord(short: string, quantity: number): string {
  if (quantity === 1 && SINGULARS[short]) return SINGULARS[short];
  return short;
}

function findUnit(category: ConversionCategory, id: string): UnitDef {
  const unit = CONVERSION_CATEGORIES[category].units.find((u) => u.id === id);
  if (!unit) {
    throw new Error(`Unknown unit ${id} in category ${category}`);
  }
  return unit;
}

function buildPage(
  seed: QuantitySeed,
  from: UnitDef,
  to: UnitDef,
  quantity: number,
): QuantityConversionPage {
  const category = seed.category;
  const categoryLabel = CONVERSION_CATEGORIES[category].label;
  const baseSlug = `${from.slug}-to-${to.slug}`;
  const slug = `${quantity}-${from.slug}-to-${to.slug}`;
  const result = roundSmart(convertUnits(category, from.id, to.id, quantity));
  const formula = getConversionFormula(category, from, to);
  const fromWord = unitWord(from.short, quantity);
  const answer = `${quantity} ${fromWord} = ${result} ${to.short}`;

  const siblingQuantities = seed.quantities.filter((q) => q !== quantity);
  const nearbyTable: ConversionTableRow[] = seed.quantities.map((q) => ({
    input: q,
    output: roundSmart(convertUnits(category, from.id, to.id, q)),
  }));

  return {
    slug,
    path: `/conversions/${slug}`,
    category,
    categoryLabel,
    baseSlug,
    fromUnit: from.id,
    toUnit: to.id,
    fromShort: from.short,
    toShort: to.short,
    quantity,
    result,
    title: `${quantity} ${fromWord} to ${to.short}`,
    heading: `${quantity} ${fromWord} to ${to.short}`,
    seoTitle: `${quantity} ${fromWord} to ${to.short} = ${result} ${to.short} | MerQPrime`,
    description: `${quantity} ${fromWord} is equal to ${result} ${to.short}. Free instant ${from.short} to ${to.short} converter with the exact formula, a worked example and a quick reference table.`,
    metaDescription: `What is ${quantity} ${fromWord} in ${to.short}? ${answer}. See the formula, a worked example and nearby values — browser-based and private on MerQPrime.`,
    keywords: [
      `${quantity} ${from.short} to ${to.short}`,
      `${quantity} ${from.short} in ${to.short}`,
      `convert ${quantity} ${from.short} to ${to.short}`,
      `${quantity} ${fromWord} to ${to.short}`,
      `${from.short} to ${to.short}`,
    ],
    formula,
    intro: `Looking for ${quantity} ${fromWord} in ${to.short}? The answer is ${answer}. This is handy when ${seed.angle}. Below you'll find the exact formula, a worked example and a table of nearby values, plus a full converter for any other amount.`,
    explanation: `To convert ${fromWord} to ${to.short} you apply the fixed conversion factor: ${formula}. The relationship is linear, so ${quantity} ${fromWord} maps to exactly ${result} ${to.short} with no rounding tricks. The same factor works for any quantity — just multiply your value by it.`,
    example: `Worked example: ${quantity} × (${from.short} → ${to.short} factor) = ${result} ${to.short}. So ${answer}.`,
    nearbyTable,
    faqs: [
      {
        question: `How many ${to.short} is ${quantity} ${fromWord}?`,
        answer: `${answer}. The conversion uses the standard factor, so the result is exact.`,
      },
      {
        question: `What is the formula to convert ${from.short} to ${to.short}?`,
        answer: `Use ${formula}. Multiply any ${from.short} value by the factor to get the equivalent in ${to.short}.`,
      },
      {
        question: `How do I convert a different ${from.short} value to ${to.short}?`,
        answer: `Open the ${from.short} to ${to.short} converter and type any number — it applies the same formula instantly for amounts above and below ${quantity} ${fromWord}.`,
      },
      {
        question: `Why convert ${from.short} to ${to.short}?`,
        answer: `A common reason is ${seed.angle}. Keeping a precise conversion handy avoids costly measurement mistakes.`,
      },
    ],
    toolSlugs: ["unit-converter", "percentage-calculator"],
    hubSlug: "business-tools",
    siblingQuantities,
  };
}

function generateAll(): QuantityConversionPage[] {
  const pages: QuantityConversionPage[] = [];
  for (const seed of SEEDS) {
    const from = findUnit(seed.category, seed.fromUnit);
    const to = findUnit(seed.category, seed.toUnit);
    for (const quantity of seed.quantities) {
      pages.push(buildPage(seed, from, to, quantity));
    }
  }
  return pages;
}

export const quantityConversionPages: QuantityConversionPage[] = generateAll();

const bySlug = new Map(quantityConversionPages.map((p) => [p.slug, p]));

const byBaseSlug = new Map<string, QuantityConversionPage[]>();
for (const page of quantityConversionPages) {
  const list = byBaseSlug.get(page.baseSlug) ?? [];
  list.push(page);
  byBaseSlug.set(page.baseSlug, list);
}

export function isQuantityConversionSlug(slug: string): boolean {
  return bySlug.has(slug);
}

export function getQuantityConversionBySlug(
  slug: string,
): QuantityConversionPage | undefined {
  return bySlug.get(slug);
}

export function getAllQuantityConversionSlugs(): string[] {
  return quantityConversionPages.map((p) => p.slug);
}

/** All quantity pages for a given base conversion (e.g. `acres-to-square-km`). */
export function getQuantityPagesForConversion(
  baseSlug: string,
): QuantityConversionPage[] {
  return byBaseSlug.get(baseSlug) ?? [];
}

/** Sibling quantity pages (same base conversion), excluding the current slug. */
export function getSiblingQuantityPages(
  slug: string,
  limit = 12,
): QuantityConversionPage[] {
  const page = bySlug.get(slug);
  if (!page) return [];
  return (byBaseSlug.get(page.baseSlug) ?? [])
    .filter((p) => p.slug !== slug)
    .slice(0, limit);
}

/** Featured exact-conversion pages for a category, for hub linking (depth ≤ 3). */
export function getFeaturedQuantityPages(
  category: ConversionCategory,
  limit = 8,
): QuantityConversionPage[] {
  return quantityConversionPages
    .filter((p) => p.category === category)
    .slice(0, limit);
}
