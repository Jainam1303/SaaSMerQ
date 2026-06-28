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
import {
  buildConversionIntro,
  buildConversionWhatIs,
  buildHowCalculated,
  buildQuickAnswer,
  buildRealWorldUses,
  buildUnitHistory,
  buildUseCases,
  getCategoryQuestions,
  getUnitContext,
  getUnitEeat,
  variantIndex,
  type UnitContext,
} from "./conversion-context";

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

/**
 * Quick reference ladder (Sprint 12). A consistent set of round inputs so every
 * conversion page carries a substantial, auto-calculated lookup table.
 */
const QUICK_REFERENCE_INPUTS = [
  10, 25, 50, 100, 250, 500, 1000, 2500, 5000, 10000,
];

function buildQuickReference(
  category: ConversionCategory,
  fromId: string,
  toId: string,
): ConversionTableRow[] {
  return QUICK_REFERENCE_INPUTS.map((input) => ({
    input,
    output: roundSmart(convertUnits(category, fromId, toId, input)),
  }));
}

function buildCommonMistakes(
  category: ConversionCategory,
  fromShort: string,
  toShort: string,
  slug: string,
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

  const directionTips = [
    `Converting in the wrong direction — multiplying when you should divide (or vice versa). Sanity-check whether ${toShort} should come out larger or smaller than ${fromShort}.`,
    `Reading the result the wrong way round. Confirm the answer is in ${toShort}, not ${fromShort}, before you rely on it.`,
  ];
  const precisionTips = [
    `Rounding too early. Keep full precision during the calculation and round only the final ${toShort} value.`,
    `Truncating instead of rounding, which compounds error across larger ${fromShort} values.`,
  ];
  return [
    directionTips[variantIndex(slug, directionTips.length)],
    precisionTips[variantIndex(slug + "p", precisionTips.length)],
    specific[category],
  ];
}

function buildFaqs(opts: {
  category: ConversionCategory;
  fromId: string;
  toId: string;
  fromShort: string;
  toShort: string;
  formula: string;
  slug: string;
  fromCtx: UnitContext;
}): ConversionPage["faqs"] {
  const { category, fromId, toId, fromShort, toShort, formula, slug, fromCtx } =
    opts;
  const useCase = fromCtx.useCases[variantIndex(slug, fromCtx.useCases.length)];
  const one = roundSmart(convertUnits(category, fromId, toId, 1));
  const ten = roundSmart(convertUnits(category, fromId, toId, 10));

  const faqs: ConversionPage["faqs"] = [
    {
      question: `How do I convert ${fromShort} to ${toShort}?`,
      answer: `Multiply your ${fromShort} value by the conversion factor, or use the formula ${formula}. The calculator above applies this instantly in your browser.`,
    },
    {
      question: `What is 1 ${fromShort} in ${toShort}?`,
      answer: `1 ${fromShort} equals ${one} ${toShort}, and 10 ${fromShort} equals ${ten} ${toShort}. Scale linearly for any other amount, or type a value into the calculator.`,
    },
  ];

  // Unit-specific FAQ from the source unit's context (differs by direction).
  if (fromCtx.faq) faqs.push(fromCtx.faq);

  faqs.push(
    {
      question: `How do I convert ${toShort} back to ${fromShort}?`,
      answer: `Swap the units in the calculator, or open our dedicated ${toShort}-to-${fromShort} page for the inverse formula, worked examples and a reference table.`,
    },
    {
      question: `When would I need to convert ${fromShort} to ${toShort}?`,
      answer: `A common situation is ${useCase}. It is especially useful for ${fromCtx.audience}. Bookmark this page for quick ${fromShort} to ${toShort} lookups.`,
    },
    {
      question: `Is the ${fromShort} to ${toShort} factor exact?`,
      answer: `Yes — it is based on the internationally agreed definition of each unit, so results are precise to the decimals shown. See "How the conversion is calculated" above for the full derivation.`,
    },
    {
      question: `Is my data private when I use this ${fromShort} to ${toShort} converter?`,
      answer:
        "Completely. The conversion runs locally in your browser on MerQPrime — nothing you type is uploaded or stored.",
    },
  );

  return faqs;
}

function buildExamples(
  category: ConversionPage["category"],
  fromId: string,
  toId: string,
  fromShort: string,
  toShort: string,
  fromCtx: UnitContext,
): ConversionPage["examples"] {
  const inputs = fromCtx.exampleValues.slice(0, 3);
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

/**
 * CTR-optimized title/description overrides for the highest-demand conversion
 * leaves (Sprint 12 Phase 2). These pages already earn impressions around SERP
 * positions 11–30; sharper titles with the exact factor and intent-specific
 * descriptions lift click-through without changing the page or its schema.
 * Any slug not listed keeps the generic generated metadata.
 */
const CONVERSION_CTR: Record<
  string,
  { seoTitle: string; metaDescription: string }
> = {
  "km-to-miles": {
    seoTitle: "Km to Miles Converter — 1 km = 0.621 Miles | MerQPrime",
    metaDescription:
      "Convert kilometres to miles instantly. 1 km = 0.621371 miles. Free km to miles calculator with formula and chart for road trips, running and GPS distances.",
  },
  "miles-to-km": {
    seoTitle: "Miles to Km Converter — 1 Mile = 1.609 Km | MerQPrime",
    metaDescription:
      "Convert miles to kilometres instantly. 1 mile = 1.60934 km. Free miles to km calculator with formula and chart for metric, science and study work.",
  },
  "kg-to-lbs": {
    seoTitle: "Kg to Lbs Converter — 1 kg = 2.205 Pounds | MerQPrime",
    metaDescription:
      "Convert kilograms to pounds instantly. 1 kg = 2.20462 lb. Free kg to lbs calculator with formula and weight chart for fitness, shipping and recipes.",
  },
  "lbs-to-kg": {
    seoTitle: "Lbs to Kg Converter — 1 Pound = 0.454 Kg | MerQPrime",
    metaDescription:
      "Convert pounds to kilograms instantly. 1 lb = 0.453592 kg. Free lbs to kg calculator with formula and chart for body weight, gym plates and parcels.",
  },
  "cm-to-inches": {
    seoTitle: "Cm to Inches Converter — 1 cm = 0.394 in | MerQPrime",
    metaDescription:
      "Convert centimetres to inches instantly. 1 cm = 0.393701 in. Free cm to inches calculator with formula and chart for height, screens and clothing sizes.",
  },
  "inches-to-cm": {
    seoTitle: "Inches to Cm Converter — 1 inch = 2.54 cm | MerQPrime",
    metaDescription:
      "Convert inches to centimetres instantly. 1 inch = 2.54 cm exactly. Free inches to cm calculator with formula and chart for height, TVs and DIY measurements.",
  },
  "celsius-to-fahrenheit": {
    seoTitle: "Celsius to Fahrenheit — °C to °F Formula & Chart | MerQPrime",
    metaDescription:
      "Convert Celsius to Fahrenheit instantly. °F = (°C × 9/5) + 32, so 37°C = 98.6°F. Free °C to °F calculator with formula and temperature chart.",
  },
  "fahrenheit-to-celsius": {
    seoTitle: "Fahrenheit to Celsius — °F to °C Formula & Chart | MerQPrime",
    metaDescription:
      "Convert Fahrenheit to Celsius instantly. °C = (°F − 32) × 5/9, so 98.6°F = 37°C. Free °F to °C calculator with formula and temperature chart.",
  },
  "meters-to-feet": {
    seoTitle: "Meters to Feet Converter — 1 m = 3.281 ft | MerQPrime",
    metaDescription:
      "Convert metres to feet instantly. 1 m = 3.28084 ft. Free meters to feet calculator with formula and chart for height, rooms and construction plans.",
  },
  "feet-to-meters": {
    seoTitle: "Feet to Meters Converter — 1 ft = 0.305 m | MerQPrime",
    metaDescription:
      "Convert feet to metres instantly. 1 ft = 0.3048 m exactly. Free feet to meters calculator with formula and chart for height, land and building plans.",
  },
  "ml-to-cups": {
    seoTitle: "ML to Cups Converter — Kitchen Measurement Chart | MerQPrime",
    metaDescription:
      "Convert millilitres to US cups instantly. 240 ml is about 1 cup. Free ml to cups calculator with formula and chart for recipes, baking and cooking.",
  },
  "cups-to-ml": {
    seoTitle: "Cups to ML Converter — 1 US Cup = 236.6 ml | MerQPrime",
    metaDescription:
      "Convert US cups to millilitres instantly. 1 cup = 236.588 ml. Free cups to ml calculator with formula and chart for recipes, baking and cooking.",
  },
  "liters-to-gallons": {
    seoTitle: "Liters to Gallons — 1 L = 0.264 US Gallon | MerQPrime",
    metaDescription:
      "Convert litres to US gallons instantly. 1 L = 0.264172 gallon. Free liters to gallons calculator with formula and chart for fuel, water and tanks.",
  },
  "acres-to-square-km": {
    seoTitle: "Acres to Square Km Converter — Land Area Chart | MerQPrime",
    metaDescription:
      "Convert acres to square kilometres instantly. 1 acre = 0.00404686 km². Free acres to sq km calculator with formula and chart for land and farm area.",
  },
};

function buildPage(
  category: ConversionPage["category"],
  from: (typeof CONVERSION_CATEGORIES)[ConversionCategory]["units"][0],
  to: (typeof CONVERSION_CATEGORIES)[ConversionCategory]["units"][0],
): ConversionPage {
  const slug = buildSlug(from.slug, to.slug);
  const formula = getConversionFormula(category, from, to);
  const categoryLabel = CONVERSION_CATEGORIES[category].label;
  const fromCtx = getUnitContext(category, from.id);
  const toCtx = getUnitContext(category, to.id);
  const fromEeat = getUnitEeat(category, from.id, from.short);
  const toEeat = getUnitEeat(category, to.id, to.short);
  const title = `${from.label.split(" (")[0]} to ${to.label.split(" (")[0]} Converter`;
  const description = `Convert ${from.short} to ${to.short} instantly. Free ${from.short} to ${to.short} calculator with formula, examples and FAQs.`;
  const ctr = CONVERSION_CTR[slug];
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
    seoTitle:
      ctr?.seoTitle ??
      `${from.label.split(" (")[0]} to ${to.label.split(" (")[0]} Converter (Instant & Free) | MerQPrime`,
    description,
    metaDescription:
      ctr?.metaDescription ??
      `Convert ${from.short} to ${to.short} instantly — free online converter with formula, examples and FAQs. Private, browser-based tool on MerQPrime.`,
    keywords: [
      `${from.short} to ${to.short}`,
      `convert ${from.short} to ${to.short}`,
      `${from.short} ${to.short} converter`,
      `${from.short} conversion`,
      `${category} converter`,
    ],
    formula,
    whatIs: buildConversionWhatIs({
      slug,
      categoryLabel,
      fromLabel: from.label.split(" (")[0],
      toLabel: to.label.split(" (")[0],
      fromShort: from.short,
      toShort: to.short,
      formula,
      fromCtx,
    }),
    useCases: buildUseCases({ fromCtx, toCtx, slug }),
    examples: buildExamples(category, from.id, to.id, from.short, to.short, fromCtx),
    conversionTable: buildConversionTable(category, from.id, to.id),
    commonMistakes: buildCommonMistakes(category, from.short, to.short, slug),
    faqs: buildFaqs({
      category,
      fromId: from.id,
      toId: to.id,
      fromShort: from.short,
      toShort: to.short,
      formula,
      slug,
      fromCtx,
    }),
    relatedSlugs: [],
    toolSlugs: categoryTools(category),
    hubSlug: categoryHub(),
    intro: buildConversionIntro({
      slug,
      fromShort: from.short,
      toShort: to.short,
      fromCtx,
    }),
    realWorldUses: buildRealWorldUses({
      slug,
      fromShort: from.short,
      toShort: to.short,
      fromCtx,
      toCtx,
      fromEeat,
      toEeat,
    }),
    quickReference: buildQuickReference(category, from.id, to.id),
    commonQuestions: getCategoryQuestions(category),
    howCalculated: buildHowCalculated({
      category,
      fromUnit: from.id,
      toUnit: to.id,
      fromShort: from.short,
      toShort: to.short,
      formula,
    }),
    unitHistory: buildUnitHistory(fromEeat, toEeat),
    quickAnswer: buildQuickAnswer({
      category,
      fromUnit: from.id,
      toUnit: to.id,
      fromShort: from.short,
      toShort: to.short,
      formula,
    }),
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
