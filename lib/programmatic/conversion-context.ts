import type { ConversionCategory } from "./types";

/**
 * Per-unit editorial context used to differentiate conversion pages.
 *
 * The generator (`conversions.ts`) builds intros, "what is", use cases,
 * examples and FAQs primarily from the FROM unit's context. Because the
 * source unit drives the wording, reverse pairs (e.g. km→miles vs miles→km)
 * read very differently: different audiences, scenarios, examples and FAQs.
 *
 * Keyed by `${category}:${unitId}` because unit ids are NOT globally unique
 * (e.g. `ms` = millisecond in `time` and metre/second in `speed`).
 */
export interface UnitContext {
  /** Real-world situations where a value typically STARTS in this unit. */
  useCases: string[];
  /** Who most often works in this unit (used in intros / FAQs). */
  audience: string;
  /** Meaningful sample inputs for worked examples in this unit. */
  exampleValues: number[];
  /** Optional framing clause for the page intro (no trailing period). */
  lead?: string;
  /** One unit-specific FAQ injected to reduce templated repetition. */
  faq?: { question: string; answer: string };
}

function ctxKey(category: ConversionCategory, id: string): string {
  return `${category}:${id}`;
}

export const UNIT_CONTEXT: Record<string, UnitContext> = {
  // ---- Length ----
  "length:km": {
    useCases: [
      "planning road trips and reading distance on highway signs",
      "logging running and cycling distances from a GPS watch",
      "checking map and navigation distances abroad",
      "converting marathon and race distances for training",
    ],
    audience: "travellers, runners and anyone using metric maps",
    exampleValues: [5, 10, 42, 100],
    lead: "You have a distance in kilometres and want it in miles",
    faq: {
      question: "How many miles is a 5K or 10K run?",
      answer:
        "A 5K is about 3.11 miles and a 10K is about 6.21 miles. Multiply any kilometre distance by 0.621371 to get miles.",
    },
  },
  "length:mi": {
    useCases: [
      "converting US and UK road distances into the metric system",
      "interpreting scientific and academic figures given in miles",
      "helping students learn metric equivalents",
      "comparing international travel distances",
    ],
    audience: "students, scientists and metric-system users",
    exampleValues: [1, 3, 26.2, 100],
    lead: "You have a distance in miles and need the metric equivalent in kilometres",
    faq: {
      question: "How many kilometres is a marathon (26.2 miles)?",
      answer:
        "A full marathon of 26.2 miles is about 42.2 kilometres. Multiply any mile distance by 1.609344 to get kilometres.",
    },
  },
  "length:m": {
    useCases: [
      "converting room, plot and building dimensions",
      "reading athletics track and field measurements",
      "checking construction and DIY measurements",
      "understanding height and depth specifications",
    ],
    audience: "builders, athletes and DIY users",
    exampleValues: [1, 10, 100, 1000],
    lead: "You have a measurement in metres and want it in feet",
  },
  "length:ft": {
    useCases: [
      "converting US property and ceiling heights to metric",
      "reading aviation altitude given in feet",
      "checking furniture and appliance clearances",
      "understanding height in metric for forms and IDs",
    ],
    audience: "US users, pilots and anyone filling metric forms",
    exampleValues: [1, 6, 10, 100],
  },
  "length:cm": {
    useCases: [
      "converting body measurements for clothing and fitness",
      "checking screen, paper and print sizes",
      "reading furniture dimensions for small spaces",
      "school and craft measurements",
    ],
    audience: "shoppers, crafters and students",
    exampleValues: [1, 10, 30, 100],
  },
  "length:in": {
    useCases: [
      "converting screen and TV sizes to metric",
      "reading US product dimensions for shipping",
      "matching tyre, pipe and hardware sizes",
      "understanding inch measurements on rulers",
    ],
    audience: "online shoppers and DIY buyers",
    exampleValues: [1, 6, 12, 36],
  },
  "length:mm": {
    useCases: [
      "reading precise engineering and machining tolerances",
      "checking jewellery, screw and component sizes",
      "converting rainfall and small dimensions",
      "matching print bleed and design specs",
    ],
    audience: "engineers, makers and designers",
    exampleValues: [1, 10, 100, 1000],
  },
  "length:yd": {
    useCases: [
      "converting fabric and textile lengths",
      "measuring sports fields and pitches",
      "reading landscaping and fencing quantities",
      "understanding US measurements in metric",
    ],
    audience: "tailors, gardeners and sports fans",
    exampleValues: [1, 10, 50, 100],
  },

  // ---- Weight ----
  "weight:kg": {
    useCases: [
      "converting body weight for US and UK forms",
      "reading recipe quantities in pounds and ounces",
      "checking parcel and luggage weight limits",
      "comparing gym and fitness loads",
    ],
    audience: "travellers, cooks and fitness users",
    exampleValues: [1, 5, 70, 100],
    faq: {
      question: "What is 70 kg in pounds?",
      answer:
        "70 kg is about 154.3 lbs. Multiply any kilogram value by 2.204623 to convert to pounds.",
    },
  },
  "weight:lb": {
    useCases: [
      "converting US body weight into metric kilograms",
      "reading nutrition and gym data for metric users",
      "checking shipping weights against metric limits",
      "scaling US recipes to grams and kilograms",
    ],
    audience: "metric-system users and international shoppers",
    exampleValues: [1, 10, 150, 200],
    faq: {
      question: "What is 150 lbs in kg?",
      answer:
        "150 lbs is about 68 kg. Multiply any pound value by 0.453592 to convert to kilograms.",
    },
  },
  "weight:g": {
    useCases: [
      "converting recipe ingredients to ounces",
      "weighing postage and small parcels",
      "measuring coffee, spices and supplements",
      "checking product net weights",
    ],
    audience: "cooks, baristas and home shippers",
    exampleValues: [1, 100, 500, 1000],
  },
  "weight:oz": {
    useCases: [
      "converting US recipe amounts to grams",
      "reading food packaging in metric",
      "weighing letters and small items",
      "measuring precious metals and ingredients",
    ],
    audience: "bakers and metric cooks",
    exampleValues: [1, 8, 16, 32],
  },
  "weight:st": {
    useCases: [
      "converting UK body weight to kilograms",
      "tracking fitness progress in metric",
      "comparing weight on medical charts",
      "understanding stone measurements abroad",
    ],
    audience: "UK users and fitness trackers",
    exampleValues: [1, 8, 11, 14],
  },

  // ---- Temperature ----
  "temperature:c": {
    useCases: [
      "reading US weather forecasts in Fahrenheit",
      "following American oven and cooking temperatures",
      "checking body temperature on US thermometers",
      "understanding travel weather in the United States",
    ],
    audience: "travellers to the US and home cooks",
    exampleValues: [0, 25, 37, 100],
    faq: {
      question: "What is a normal body temperature in Fahrenheit?",
      answer:
        "Normal body temperature of 37°C is about 98.6°F. Use °F = (°C × 9/5) + 32 for any value.",
    },
  },
  "temperature:f": {
    useCases: [
      "following metric recipes and oven settings",
      "reading international weather forecasts",
      "understanding science and lab temperatures",
      "checking body temperature on metric thermometers",
    ],
    audience: "metric users, students and cooks",
    exampleValues: [32, 72, 98.6, 212],
    faq: {
      question: "What is 98.6°F in Celsius?",
      answer:
        "98.6°F equals 37°C, the typical body temperature. Use °C = (°F − 32) × 5/9 for any value.",
    },
  },
  "temperature:k": {
    useCases: [
      "converting laboratory and physics data",
      "reading scientific and astronomy figures",
      "understanding thermodynamics coursework",
      "calibrating sensors and instruments",
    ],
    audience: "scientists and students",
    exampleValues: [0, 273.15, 300, 373.15],
  },

  // ---- Volume ----
  "volume:l": {
    useCases: [
      "converting fuel economy and tank sizes to gallons",
      "scaling drink and recipe volumes",
      "checking bottle and container capacities",
      "comparing US product sizes",
    ],
    audience: "drivers, cooks and shoppers",
    exampleValues: [1, 5, 10, 50],
  },
  "volume:gal": {
    useCases: [
      "converting US fuel volumes to litres",
      "reading American recipe quantities in metric",
      "checking tank and drum capacities",
      "comparing fuel prices internationally",
    ],
    audience: "metric drivers and cooks",
    exampleValues: [1, 5, 10, 55],
  },
  "volume:ml": {
    useCases: [
      "measuring US cup quantities in recipes",
      "dosing medicine and supplements",
      "mixing drinks and cocktails accurately",
      "converting small bottle sizes",
    ],
    audience: "home cooks, parents and bartenders",
    exampleValues: [120, 250, 500, 1000],
    faq: {
      question: "How many cups is 250 ml?",
      answer:
        "250 ml is about 1.06 US cups (roughly one cup). Divide millilitres by 236.588 to get US cups.",
    },
  },
  "volume:m3": {
    useCases: [
      "calculating water tank and pool volumes",
      "estimating concrete and material quantities",
      "reading gas and utility meter readings",
      "sizing shipping container loads",
    ],
    audience: "builders and engineers",
    exampleValues: [1, 5, 10, 100],
  },
  "volume:cup": {
    useCases: [
      "scaling US recipes for metric kitchens",
      "measuring flour, sugar and liquids precisely",
      "converting drink recipes to millilitres",
      "following American baking instructions",
    ],
    audience: "bakers and home cooks",
    exampleValues: [1, 2, 4, 8],
    faq: {
      question: "How many ml is 1 US cup?",
      answer:
        "1 US cup is about 236.6 ml. Multiply the number of cups by 236.588 for an exact millilitre value.",
    },
  },

  // ---- Area ----
  "area:sqft": {
    useCases: [
      "comparing apartment and plot sizes in metric",
      "calculating flooring, tiling and paint coverage",
      "reading real-estate listings abroad",
      "estimating carpet and material area",
    ],
    audience: "home buyers and renovators",
    exampleValues: [100, 500, 1000, 5000],
  },
  "area:sqm": {
    useCases: [
      "converting metric floor area to square feet",
      "comparing property sizes with US listings",
      "planning office and retail space",
      "estimating land and garden area",
    ],
    audience: "property buyers and planners",
    exampleValues: [1, 50, 100, 500],
  },
  "area:acre": {
    useCases: [
      "sizing farmland and agricultural plots",
      "reading land deeds and property documents",
      "comparing real-estate land area",
      "planning development and survey work",
    ],
    audience: "farmers, builders and land buyers",
    exampleValues: [1, 2, 5, 10],
    faq: {
      question: "How big is 1 acre?",
      answer:
        "1 acre equals 43,560 square feet, about 4,047 square metres or roughly 0.405 hectares.",
    },
  },
  "area:ha": {
    useCases: [
      "measuring large farms and estates",
      "reading agricultural and forestry data",
      "comparing land area in acres",
      "planning land use and zoning",
    ],
    audience: "agriculture and land-use professionals",
    exampleValues: [1, 2, 5, 10],
  },
  "area:sqkm": {
    useCases: [
      "comparing city, region and country areas",
      "reading geography and census data",
      "estimating large land and water areas",
      "understanding map scales",
    ],
    audience: "students and analysts",
    exampleValues: [1, 2, 5, 10],
  },

  // ---- Speed ----
  "speed:kmh": {
    useCases: [
      "reading US speed limits in mph",
      "converting vehicle speeds while driving abroad",
      "comparing running and cycling pace",
      "understanding wind and weather speeds",
    ],
    audience: "drivers and athletes",
    exampleValues: [10, 50, 100, 120],
  },
  "speed:mph": {
    useCases: [
      "converting US speeds to metric km/h",
      "reading speedometers while driving abroad",
      "comparing sports and vehicle speeds",
      "understanding weather reports in metric",
    ],
    audience: "metric drivers and sports fans",
    exampleValues: [10, 30, 60, 100],
  },
  "speed:ms": {
    useCases: [
      "converting physics velocity to everyday km/h",
      "reading scientific and engineering data",
      "understanding free-fall and motion problems",
      "calibrating sensors and instruments",
    ],
    audience: "students and engineers",
    exampleValues: [1, 5, 10, 20],
  },
  "speed:knot": {
    useCases: [
      "converting marine and aviation speeds",
      "reading weather and wind data at sea",
      "planning sailing and flight routes",
      "understanding boat and ship specs",
    ],
    audience: "sailors and pilots",
    exampleValues: [1, 10, 20, 50],
  },

  // ---- Time ----
  "time:ms": {
    useCases: [
      "measuring code execution and latency",
      "reading network ping and response times",
      "timing animations and frame rates",
      "analysing performance benchmarks",
    ],
    audience: "developers and performance engineers",
    exampleValues: [100, 500, 1000, 5000],
  },
  "time:s": {
    useCases: [
      "converting durations for billing and timers",
      "reading workout and interval times",
      "scheduling timeouts and delays in code",
      "measuring process and task duration",
    ],
    audience: "developers and planners",
    exampleValues: [30, 60, 300, 3600],
  },
  "time:min": {
    useCases: [
      "converting meeting and task durations",
      "planning workouts and cooking times",
      "scheduling and time-tracking",
      "estimating commute and travel time",
    ],
    audience: "planners and project managers",
    exampleValues: [1, 15, 60, 120],
  },
  "time:hr": {
    useCases: [
      "converting work and billing hours",
      "planning project timelines and shifts",
      "estimating travel and delivery times",
      "tracking screen and study time",
    ],
    audience: "freelancers and project managers",
    exampleValues: [1, 8, 24, 100],
  },
  "time:day": {
    useCases: [
      "converting project and leave durations",
      "planning schedules and deadlines",
      "calculating subscription and rental periods",
      "estimating delivery windows",
    ],
    audience: "planners and operations teams",
    exampleValues: [1, 7, 30, 365],
  },
  "time:week": {
    useCases: [
      "planning sprints and project phases",
      "scheduling courses and programmes",
      "calculating pregnancy and growth timelines",
      "estimating delivery and lead times",
    ],
    audience: "project and programme managers",
    exampleValues: [1, 2, 4, 52],
  },

  // ---- Data ----
  "data:bit": {
    useCases: [
      "calculating bandwidth and transfer rates",
      "reading network throughput specs",
      "understanding encoding and compression",
      "sizing data streams",
    ],
    audience: "network and systems engineers",
    exampleValues: [8, 64, 1000, 8000],
  },
  "data:byte": {
    useCases: [
      "sizing files and memory usage",
      "calculating storage requirements",
      "reading API payload sizes",
      "understanding character and buffer sizes",
    ],
    audience: "developers and IT admins",
    exampleValues: [1024, 1000000, 1000000000, 5000000],
  },
  "data:kb": {
    useCases: [
      "checking document and image file sizes",
      "estimating page weight for performance",
      "reading email attachment limits",
      "sizing configuration and text files",
    ],
    audience: "developers and content creators",
    exampleValues: [1, 100, 500, 1024],
  },
  "data:mb": {
    useCases: [
      "checking photo, song and app sizes",
      "estimating mobile data usage",
      "reading upload and download limits",
      "sizing media files for the web",
    ],
    audience: "everyday users and creators",
    exampleValues: [1, 100, 500, 1024],
  },
  "data:gb": {
    useCases: [
      "checking storage and RAM capacity",
      "estimating monthly data plans",
      "sizing video and backup files",
      "comparing drive and cloud storage",
    ],
    audience: "shoppers and IT admins",
    exampleValues: [1, 16, 256, 1024],
  },
  "data:tb": {
    useCases: [
      "sizing hard drives and NAS storage",
      "planning backup and archive capacity",
      "estimating data-centre storage",
      "comparing large cloud plans",
    ],
    audience: "IT admins and power users",
    exampleValues: [1, 2, 4, 10],
  },
};

const FALLBACK: UnitContext = {
  useCases: [
    "everyday measurement and comparison tasks",
    "study, homework and reference",
    "professional and engineering work",
    "travel and shopping abroad",
  ],
  audience: "students, professionals and everyday users",
  exampleValues: [1, 10, 100],
  lead: "You have a value in one unit and need it in another",
};

export function getUnitContext(
  category: ConversionCategory,
  unitId: string,
): UnitContext {
  return UNIT_CONTEXT[ctxKey(category, unitId)] ?? FALLBACK;
}

/** Deterministic small hash so wording varies but stays stable per slug. */
export function variantIndex(slug: string, mod: number): number {
  let h = 0;
  for (let i = 0; i < slug.length; i += 1) {
    h = (h * 31 + slug.charCodeAt(i)) >>> 0;
  }
  return h % mod;
}

/** Direction-aware intro paragraph driven by the FROM unit's context. */
export function buildConversionIntro(opts: {
  slug: string;
  fromShort: string;
  toShort: string;
  fromCtx: UnitContext;
}): string {
  const { slug, fromShort, toShort, fromCtx } = opts;
  const useCase = fromCtx.useCases[variantIndex(slug, fromCtx.useCases.length)];
  const lead =
    fromCtx.lead ?? `You have a value in ${fromShort} and need it in ${toShort}`;
  const templates = [
    `${lead}? This page turns ${fromShort} into ${toShort} instantly. It is built for ${fromCtx.audience} — common when ${useCase}. Below you get a live calculator, the exact formula, worked examples, a reference table and answers to the questions people ask most.`,
    `Converting ${fromShort} to ${toShort} comes up constantly for ${fromCtx.audience}, especially when ${useCase}. Enter any ${fromShort} value for an instant ${toShort} result, then use the formula, examples and table below to understand and double-check the maths.`,
    `Need ${fromShort} in ${toShort}? ${lead}. This is a frequent task when ${useCase}. The calculator gives you an immediate answer, and the formula, examples and conversion table explain exactly how the result is reached.`,
  ];
  return templates[variantIndex(slug, templates.length)];
}

/** Direction-aware "what is" explanation. */
export function buildConversionWhatIs(opts: {
  slug: string;
  categoryLabel: string;
  fromLabel: string;
  toLabel: string;
  fromShort: string;
  toShort: string;
  formula: string;
  fromCtx: UnitContext;
}): string {
  const {
    slug,
    categoryLabel,
    fromLabel,
    toLabel,
    fromShort,
    toShort,
    formula,
    fromCtx,
  } = opts;
  const noun = categoryLabel.toLowerCase();
  const templates = [
    `${fromLabel} and ${toLabel} both measure ${noun}, so converting ${fromShort} to ${toShort} restates the same quantity in a different unit. ${capitalize(
      fromCtx.audience,
    )} reach for this conversion regularly. The relationship is fixed and linear, which means one factor (${formula}) maps every ${fromShort} value to its exact ${toShort} equivalent.`,
    `Going from ${fromShort} to ${toShort} keeps the underlying ${noun} the same — only the unit changes. Because ${fromShort} is the unit ${fromCtx.audience} tend to start with, this direction is especially useful. Apply ${formula} and the result is precise every time.`,
    `${fromShort} to ${toShort} is a ${noun} conversion: the measured amount does not change, just the way it is expressed. It matters most to ${fromCtx.audience}. A single conversion factor (${formula}) handles any value, large or small.`,
  ];
  return templates[variantIndex(slug + "w", templates.length)];
}

/** Use-case bullets, drawn from the FROM unit so reverse pairs differ. */
export function buildUseCases(opts: {
  fromCtx: UnitContext;
  toCtx: UnitContext;
  slug: string;
}): string[] {
  const { fromCtx, toCtx, slug } = opts;
  const primary = fromCtx.useCases.map((u) => capitalize(u) + ".");
  // Add one bridging use case from the target unit for variety.
  const bridge = toCtx.useCases[variantIndex(slug, toCtx.useCases.length)];
  return [...primary.slice(0, 4), `${capitalize(bridge)}.`];
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
