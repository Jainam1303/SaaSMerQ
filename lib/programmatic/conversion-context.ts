import type { FaqItem } from "@/data/tools/types";
import type { ConversionCategory } from "./types";
import {
  convertUnits,
  getBaseUnitName,
  unitToBaseFactor,
} from "./units";

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

/* ------------------------------------------------------------------ *
 * Sprint 12 — E-E-A-T upgrade
 *
 * Per-unit authority content (name, measurement system, audience roles,
 * history) and per-category conceptual content (common questions, precision
 * notes). All deterministic and build-time — no client state, so the rendered
 * sections are hydration-safe.
 * ------------------------------------------------------------------ */

export interface UnitEeat {
  /** Full singular noun, e.g. "kilometre", "acre", "US gallon". */
  name: string;
  /** Measurement system label shown to the reader. */
  system: string;
  /** Roles/people who commonly work in this unit (Real World Uses). */
  whoUsesIt: string[];
  /** Two-to-three sentence origin/history of the unit. */
  history: string;
}

const UNIT_EEAT: Record<string, UnitEeat> = {
  // ---- Length ----
  "length:km": {
    name: "kilometre",
    system: "metric",
    whoUsesIt: ["Drivers", "Runners", "Cartographers", "Logistics planners", "Students"],
    history:
      "The kilometre arrived with the metric system in 1790s France as 1,000 metres, the metre itself first defined as one ten-millionth of the distance from the equator to the North Pole. It is now the standard unit for road distance across most of the world.",
  },
  "length:mi": {
    name: "mile",
    system: "imperial / US customary",
    whoUsesIt: ["US & UK drivers", "Athletes", "Aviators", "Surveyors", "Students"],
    history:
      "The mile descends from the Roman mille passus — 'a thousand paces', roughly 1,480 metres. The modern international mile was fixed at exactly 1,609.344 metres in 1959 and remains standard for road distance in the US and UK.",
  },
  "length:m": {
    name: "metre",
    system: "metric (SI base unit)",
    whoUsesIt: ["Engineers", "Builders", "Architects", "Athletes", "Scientists"],
    history:
      "The metre is the SI base unit of length. First defined in 1793 from the Earth's meridian, it is today defined by the distance light travels in a vacuum in 1/299,792,458 of a second.",
  },
  "length:ft": {
    name: "foot",
    system: "imperial / US customary",
    whoUsesIt: ["Builders", "Architects", "Pilots", "Tradespeople", "Students"],
    history:
      "The foot has roots in the length of a human foot and varied widely before standardisation. The international foot is now exactly 0.3048 metres and stays common in US construction and aviation altitude.",
  },
  "length:cm": {
    name: "centimetre",
    system: "metric",
    whoUsesIt: ["Tailors", "Designers", "Students", "Healthcare workers", "Shoppers"],
    history:
      "The centimetre — one-hundredth of a metre — is part of the metric system formalised after the French Revolution. It is the everyday unit for body measurements, stationery and small objects in most of the world.",
  },
  "length:in": {
    name: "inch",
    system: "imperial / US customary",
    whoUsesIt: ["Carpenters", "Manufacturers", "Screen makers", "Shoppers", "Engineers"],
    history:
      "The inch traditionally matched the width of a thumb and was later set at 1/12 of a foot. Since 1959 it is exactly 25.4 millimetres and remains common for screen sizes, hardware and US dimensions.",
  },
  "length:mm": {
    name: "millimetre",
    system: "metric",
    whoUsesIt: ["Engineers", "Machinists", "Jewellers", "Designers", "Manufacturers"],
    history:
      "The millimetre is one-thousandth of a metre. As metric precision spread through engineering in the 19th and 20th centuries, it became the default unit for technical drawings and machined tolerances.",
  },
  "length:yd": {
    name: "yard",
    system: "imperial / US customary",
    whoUsesIt: ["Tailors", "Groundskeepers", "Football fans", "Landscapers", "Builders"],
    history:
      "The yard has medieval English origins linked to a standard rod and to the length from nose to fingertip. It is now defined as exactly 0.9144 metres and survives in textiles, landscaping and American football.",
  },

  // ---- Weight ----
  "weight:kg": {
    name: "kilogram",
    system: "metric (SI base unit)",
    whoUsesIt: ["Scientists", "Shippers", "Athletes", "Doctors", "Shoppers"],
    history:
      "The kilogram is the SI base unit of mass. Once defined by a physical platinum-iridium cylinder near Paris, it was redefined in 2019 in terms of the Planck constant for permanent stability.",
  },
  "weight:lb": {
    name: "pound",
    system: "imperial / US customary",
    whoUsesIt: ["Shoppers", "Dieticians", "Shippers", "Athletes", "Cooks"],
    history:
      "The pound traces back to the Roman libra, which is why its symbol is 'lb'. The international avoirdupois pound is now defined as exactly 0.45359237 kilograms and is standard for body weight and groceries in the US.",
  },
  "weight:g": {
    name: "gram",
    system: "metric",
    whoUsesIt: ["Cooks", "Pharmacists", "Jewellers", "Scientists", "Shippers"],
    history:
      "The gram was originally defined as the mass of one cubic centimetre of water. It became the base of the metric mass system and is the everyday unit for food, medicine and small quantities.",
  },
  "weight:oz": {
    name: "ounce",
    system: "imperial / US customary",
    whoUsesIt: ["Cooks", "Bakers", "Jewellers", "Shippers", "Shoppers"],
    history:
      "The ounce comes from the Roman uncia, one-twelfth of a pound. The avoirdupois ounce is now 1/16 of a pound — about 28.35 grams — and is common in US recipes and postage.",
  },
  "weight:st": {
    name: "stone",
    system: "imperial",
    whoUsesIt: ["UK adults", "Fitness trackers", "Doctors", "Slimming groups", "Athletes"],
    history:
      "The stone was historically used for trade weights and varied by commodity before being fixed at 14 pounds. It remains an everyday unit for body weight in the UK and Ireland.",
  },

  // ---- Temperature ----
  "temperature:c": {
    name: "degree Celsius",
    system: "metric",
    whoUsesIt: ["Meteorologists", "Cooks", "Students", "Doctors", "Travellers"],
    history:
      "The Celsius scale was proposed by Anders Celsius in 1742 — originally inverted — with 0 and 100 fixed to water's freezing and boiling points. It is the standard temperature scale across most of the world.",
  },
  "temperature:f": {
    name: "degree Fahrenheit",
    system: "imperial / US customary",
    whoUsesIt: ["US residents", "Cooks", "HVAC technicians", "Meteorologists", "Students"],
    history:
      "Daniel Gabriel Fahrenheit devised his scale in 1724 using a brine mixture and body temperature as reference points. It remains the everyday temperature scale in the United States.",
  },
  "temperature:k": {
    name: "kelvin",
    system: "metric (SI base unit)",
    whoUsesIt: ["Physicists", "Chemists", "Engineers", "Astronomers", "Students"],
    history:
      "The kelvin, named after Lord Kelvin, sets zero at absolute zero — the coldest temperature possible. It is the SI base unit of temperature and shares its degree size with Celsius.",
  },

  // ---- Volume ----
  "volume:l": {
    name: "litre",
    system: "metric",
    whoUsesIt: ["Drivers", "Cooks", "Scientists", "Brewers", "Shoppers"],
    history:
      "The litre was introduced in France in 1795 as the volume of one kilogram of water. It is the standard metric unit for liquids worldwide, from fuel to beverages.",
  },
  "volume:gal": {
    name: "US gallon",
    system: "US customary",
    whoUsesIt: ["US drivers", "Farmers", "Brewers", "Painters", "Shippers"],
    history:
      "The US gallon derives from the English wine gallon of 231 cubic inches, fixed at about 3.785 litres. It is standard for fuel and large liquid volumes in the United States.",
  },
  "volume:ml": {
    name: "millilitre",
    system: "metric",
    whoUsesIt: ["Cooks", "Pharmacists", "Bartenders", "Lab technicians", "Parents"],
    history:
      "The millilitre is one-thousandth of a litre and equal to one cubic centimetre. It is the everyday unit for medicine doses, recipes and small liquid measures.",
  },
  "volume:m3": {
    name: "cubic metre",
    system: "metric (SI derived)",
    whoUsesIt: ["Engineers", "Builders", "Utilities", "Logisticians", "Scientists"],
    history:
      "The cubic metre is the SI derived unit of volume — the space inside a cube one metre on each side. It is used for water, gas, concrete and freight volumes.",
  },
  "volume:cup": {
    name: "US cup",
    system: "US customary",
    whoUsesIt: ["Home cooks", "Bakers", "Recipe writers", "Students", "Parents"],
    history:
      "The US customary cup was standardised at 8 US fluid ounces — about 236.6 ml — for cooking. It is the dominant volume measure in American recipes.",
  },

  // ---- Area ----
  "area:sqft": {
    name: "square foot",
    system: "imperial / US customary",
    whoUsesIt: ["Realtors", "Architects", "Renovators", "Flooring fitters", "Tenants"],
    history:
      "The square foot is the area of a one-foot square. As the foot standardised to 0.3048 m, the square foot followed, and it remains the dominant unit for floor area in the US and India.",
  },
  "area:sqm": {
    name: "square metre",
    system: "metric (SI derived)",
    whoUsesIt: ["Architects", "Planners", "Realtors", "Builders", "Students"],
    history:
      "The square metre is the SI derived unit of area — a one-metre square. It is the global standard for floor space, land plots and material coverage.",
  },
  "area:acre": {
    name: "acre",
    system: "imperial / US customary",
    whoUsesIt: ["Farmers", "Surveyors", "Government bodies", "Realtors", "GIS professionals"],
    history:
      "The acre originally represented the area a yoke of oxen could plough in a day, later fixed at 43,560 square feet. It remains a key unit for land and agriculture in the US, UK and India.",
  },
  "area:ha": {
    name: "hectare",
    system: "metric",
    whoUsesIt: ["Farmers", "Foresters", "Governments", "Ecologists", "Surveyors"],
    history:
      "The hectare — 10,000 square metres — was introduced with the metric system for land measurement. It is the international standard for agricultural and forestry area.",
  },
  "area:sqkm": {
    name: "square kilometre",
    system: "metric",
    whoUsesIt: ["Geographers", "Governments", "Urban planners", "Ecologists", "Statisticians"],
    history:
      "The square kilometre — one million square metres — became standard for measuring regions, cities and countries as metric mapping spread worldwide.",
  },

  // ---- Speed ----
  "speed:kmh": {
    name: "kilometre per hour",
    system: "metric",
    whoUsesIt: ["Drivers", "Cyclists", "Meteorologists", "Engineers", "Students"],
    history:
      "Kilometres per hour became the standard road-speed unit as the metric system and motoring spread in the 20th century. It appears on most of the world's speed limits and speedometers.",
  },
  "speed:mph": {
    name: "mile per hour",
    system: "imperial / US customary",
    whoUsesIt: ["US & UK drivers", "Athletes", "Meteorologists", "Engineers", "Students"],
    history:
      "Miles per hour grew out of railway and early road travel in Britain and America. It remains the legal speed unit on US and UK roads.",
  },
  "speed:ms": {
    name: "metre per second",
    system: "metric (SI coherent)",
    whoUsesIt: ["Physicists", "Engineers", "Athletes", "Meteorologists", "Students"],
    history:
      "The metre per second is the SI coherent unit of speed, central to physics since the metric system's adoption. It is used in science, engineering and athletics timing.",
  },
  "speed:knot": {
    name: "knot",
    system: "nautical",
    whoUsesIt: ["Sailors", "Pilots", "Meteorologists", "Navigators", "Coast guards"],
    history:
      "The knot — one nautical mile per hour — comes from sailors counting knots on a log line trailed behind a ship to gauge speed. It is still standard in marine and air navigation.",
  },

  // ---- Time ----
  "time:ms": {
    name: "millisecond",
    system: "metric (SI-derived)",
    whoUsesIt: ["Developers", "Engineers", "Gamers", "Scientists", "Network admins"],
    history:
      "The millisecond — one-thousandth of a second — gained importance with electronics and computing, where fast events must be timed. It is the default unit for latency and response times.",
  },
  "time:s": {
    name: "second",
    system: "metric (SI base unit)",
    whoUsesIt: ["Scientists", "Developers", "Athletes", "Engineers", "Everyone"],
    history:
      "The second is the SI base unit of time. Once defined as a fraction of a day, it is now defined by 9,192,631,770 oscillations of a caesium-133 atom.",
  },
  "time:min": {
    name: "minute",
    system: "sexagesimal time",
    whoUsesIt: ["Planners", "Cooks", "Commuters", "Teachers", "Everyone"],
    history:
      "The minute as 1/60 of an hour descends from the Babylonian base-60 system passed down through Greek and Islamic astronomy. It remains a universal unit for short durations.",
  },
  "time:hr": {
    name: "hour",
    system: "sexagesimal time",
    whoUsesIt: ["Workers", "Planners", "Travellers", "Freelancers", "Everyone"],
    history:
      "The hour as 1/24 of a day comes from ancient Egyptian timekeeping that split day and night into twelve parts each. It is the backbone of schedules and pay.",
  },
  "time:day": {
    name: "day",
    system: "calendar time",
    whoUsesIt: ["Planners", "Schedulers", "Travellers", "Project managers", "Everyone"],
    history:
      "The day reflects one rotation of the Earth and is humanity's oldest natural time unit. It anchors calendars, billing and scheduling everywhere.",
  },
  "time:week": {
    name: "week",
    system: "calendar time",
    whoUsesIt: ["Project managers", "Schedulers", "Students", "Planners", "Everyone"],
    history:
      "The seven-day week has ancient Babylonian and Judaic roots tied to lunar phases and creation narratives. It is the standard cycle for work and planning worldwide.",
  },

  // ---- Data ----
  "data:bit": {
    name: "bit",
    system: "digital information",
    whoUsesIt: ["Developers", "Network engineers", "Cryptographers", "Students", "Hardware designers"],
    history:
      "The bit — a single binary digit — was named by statistician John Tukey and popularised by Claude Shannon's 1948 information theory. It is the smallest unit of digital information.",
  },
  "data:byte": {
    name: "byte",
    system: "digital information",
    whoUsesIt: ["Developers", "IT admins", "Storage vendors", "Students", "Engineers"],
    history:
      "The byte, standardised at 8 bits, emerged with early computers as the space needed for one character. It is the foundation of file and memory sizing.",
  },
  "data:kb": {
    name: "kilobyte",
    system: "digital information",
    whoUsesIt: ["Developers", "Web builders", "IT admins", "Students", "Designers"],
    history:
      "The kilobyte — 1,000 bytes in SI terms — was once ample for a whole program. It now measures small files such as documents and icons.",
  },
  "data:mb": {
    name: "megabyte",
    system: "digital information",
    whoUsesIt: ["Everyday users", "Developers", "Photographers", "IT admins", "Students"],
    history:
      "The megabyte — one million bytes — defined storage in the floppy-disk and early-CD era. It is still used for photos, songs and app sizes.",
  },
  "data:gb": {
    name: "gigabyte",
    system: "digital information",
    whoUsesIt: ["Shoppers", "IT admins", "Gamers", "Photographers", "Developers"],
    history:
      "The gigabyte — one billion bytes — became the standard storage and memory unit as hard drives and RAM grew. Data plans and devices are commonly quoted in GB.",
  },
  "data:tb": {
    name: "terabyte",
    system: "digital information",
    whoUsesIt: ["IT admins", "Creators", "Data engineers", "Gamers", "Businesses"],
    history:
      "The terabyte — one trillion bytes — arrived as consumer hard drives crossed the gigabyte ceiling in the 2000s. It now measures drives, backups and large media libraries.",
  },
};

function eeatFallback(unitShort: string): UnitEeat {
  return {
    name: unitShort,
    system: "standard measurement",
    whoUsesIt: ["Engineers", "Students", "Professionals", "Everyday users"],
    history: `The ${unitShort} is a widely used unit of measurement, applied consistently across science, industry and everyday life through internationally agreed definitions.`,
  };
}

export function getUnitEeat(
  category: ConversionCategory,
  unitId: string,
  unitShort: string,
): UnitEeat {
  return UNIT_EEAT[ctxKey(category, unitId)] ?? eeatFallback(unitShort);
}

/** Category-level conceptual Q&A ("Common Questions" — unique per category). */
const CATEGORY_QUESTIONS: Record<ConversionCategory, FaqItem[]> = {
  length: [
    {
      question: "Is this length conversion exact?",
      answer:
        "Yes. Factors such as 1 inch = 25.4 mm and 1 mile = 1,609.344 m are exact by international agreement, so the only rounding is in how many decimals we display.",
    },
    {
      question: "Why do my results differ slightly from another tool?",
      answer:
        "Almost always because the other tool rounds the factor (e.g. 0.62 instead of 0.621371) or rounds partway through. We keep full precision and round only the final value.",
    },
    {
      question: "Metric or imperial — which should I use?",
      answer:
        "Use metric (m, cm, km) for science and most countries, and imperial (ft, in, miles) for US and UK everyday distances. This page bridges the two exactly.",
    },
    {
      question: "Can I round the answer?",
      answer:
        "Yes. For everyday use one or two decimals is plenty; engineering and science may need more. Round only at the end to avoid cumulative error.",
    },
  ],
  weight: [
    {
      question: "Is this weight conversion exact?",
      answer:
        "Yes. Mass definitions such as 1 lb = 0.45359237 kg and 1 oz = 28.349523 g are exact, so results are precise to the decimals shown.",
    },
    {
      question: "Why do my results differ slightly?",
      answer:
        "Usually because of a rounded factor (2.2 instead of 2.204623) or mixing mass with force. We use the full-precision international factors.",
    },
    {
      question: "Metric or imperial for weight?",
      answer:
        "Metric (kg, g) dominates science and most of the world; imperial (lb, oz, stone) is common for US and UK body weight and cooking. Convert exactly here rather than estimating.",
    },
    {
      question: "Can I round the result?",
      answer:
        "Yes — kitchen and body-weight values rarely need more than one decimal. Keep more precision for lab or trade use and round last.",
    },
  ],
  temperature: [
    {
      question: "Is this temperature conversion exact?",
      answer:
        "Yes. The Celsius, Fahrenheit and Kelvin relationships are exact formulas, not approximations; only the displayed decimals are rounded.",
    },
    {
      question: "Why do my results differ?",
      answer:
        "Most errors come from dropping the offset (the +32 or 273.15 term) or rounding too early. Temperature is not a simple ratio, so the offset matters.",
    },
    {
      question: "Celsius, Fahrenheit or Kelvin — which is standard?",
      answer:
        "Celsius is used almost everywhere, Kelvin in science, and Fahrenheit mainly in the US. This converter applies the exact formula for whichever pair you need.",
    },
    {
      question: "Can I round the answer?",
      answer:
        "Yes. Weather and cooking need only whole degrees; scientific work may keep decimals. Rounding the display never changes the underlying formula.",
    },
  ],
  volume: [
    {
      question: "Is this volume conversion exact?",
      answer:
        "Yes for defined units — 1 US gallon = 3.785411784 L and 1 US cup = 236.5882365 ml are exact. Just note that US and imperial gallons and cups are different sizes.",
    },
    {
      question: "Why do my results differ?",
      answer:
        "The biggest cause is confusing US, imperial and metric measures, or using a rounded factor. We apply the exact US definitions throughout.",
    },
    {
      question: "Metric or US units for volume?",
      answer:
        "Metric (litres, ml) is global; US customary (gallons, cups) is American. Always check whether a recipe means a US cup or a metric cup.",
    },
    {
      question: "Can I round the result?",
      answer:
        "Yes — cooking tolerates rounding to whole ml or a fraction of a cup. Fuel and laboratory volumes may need more precision.",
    },
  ],
  area: [
    {
      question: "Is this area conversion exact?",
      answer:
        "Yes. Area factors derive from exact length definitions — for example 1 acre = 43,560 ft² exactly — so conversions are precise to the decimals shown.",
    },
    {
      question: "Why do my results differ slightly?",
      answer:
        "Usually from squaring a rounded length factor or mixing local land units. We square the exact factors so nothing drifts.",
    },
    {
      question: "Metric or imperial for area?",
      answer:
        "Metric (m², hectares, km²) is the global standard; imperial (ft², acres) persists in US, UK and Indian real estate. This page converts both exactly.",
    },
    {
      question: "Can I round the answer?",
      answer:
        "Yes. Property listings round to whole units; surveying and legal documents may keep more decimals. Round only at the end.",
    },
  ],
  speed: [
    {
      question: "Is this speed conversion exact?",
      answer:
        "Yes. Speed factors such as 1 mph = 1.609344 km/h and 1 knot = 1.852 km/h are exact definitions.",
    },
    {
      question: "Why do my results differ?",
      answer:
        "A common error is assuming km/h and m/s differ by 1,000; they differ by 3.6. Using rounded factors also causes small drift.",
    },
    {
      question: "Which speed unit is standard?",
      answer:
        "km/h is used on most roads, mph in the US and UK, m/s in physics, and knots at sea and in the air. Pick the unit your context expects.",
    },
    {
      question: "Can I round the answer?",
      answer:
        "Yes — speedometers and forecasts use whole units. Keep decimals for physics or precise engineering work.",
    },
  ],
  time: [
    {
      question: "Is this time conversion exact?",
      answer:
        "Yes for fixed units: 1 minute = 60 s, 1 hour = 3,600 s and 1 day = 86,400 s. Calendar months and years vary, so we convert through seconds.",
    },
    {
      question: "Why do my results differ?",
      answer:
        "Differences appear when months or years are assumed to be a fixed length, or with leap seconds. For sub-day units the conversions are exact.",
    },
    {
      question: "Do time units have a metric or imperial version?",
      answer:
        "No — time units are shared worldwide with no metric/imperial split. The second is the SI base unit; minutes, hours and days build on it.",
    },
    {
      question: "Can I round the answer?",
      answer:
        "Yes. Everyday scheduling rounds to whole minutes or hours; performance work may keep milliseconds. Round only the final value.",
    },
  ],
  data: [
    {
      question: "Is this data conversion exact?",
      answer:
        "Yes, using the SI (decimal) convention where 1 KB = 1,000 bytes. Some systems use the binary convention (1 KiB = 1,024 bytes), which gives slightly different numbers.",
    },
    {
      question: "Why do my results differ from my operating system?",
      answer:
        "Because of decimal (1,000) versus binary (1,024) units — drive makers use decimal while operating systems often display binary. This page uses the decimal convention.",
    },
    {
      question: "Are data units metric or imperial?",
      answer:
        "Neither — the real choice is decimal (KB, MB, GB) versus binary (KiB, MiB, GiB). We use the decimal SI convention here.",
    },
    {
      question: "Can I round the answer?",
      answer:
        "Yes — file and storage sizes are routinely rounded to one or two decimals. Keep more precision when totalling many small files.",
    },
  ],
};

const PRECISION_NOTE: Record<ConversionCategory, string> = {
  length:
    "The conversion factor is exact by international definition, so the result is an exact rational number. We display it rounded to four decimal places (or four significant figures for very small values).",
  weight:
    "Mass factors are exact by definition, so no precision is lost in the maths. The displayed value is rounded to four decimal places for readability.",
  temperature:
    "The formula is exact; only the displayed result is rounded to four decimal places. No precision is lost in the underlying calculation.",
  volume:
    "The US unit definitions used here are exact, so the result is exact. We round the displayed figure to four decimal places.",
  area:
    "Area factors are exact (they are squared length definitions), so the result carries no approximation beyond the four-decimal display rounding.",
  speed:
    "The speed factor is exact by definition, so the result is exact and only the displayed value is rounded to four decimal places.",
  time:
    "Sub-day factors (seconds, minutes, hours, days, weeks) are exact integers, so results carry no approximation. We round only for display.",
  data:
    "Using the decimal SI convention the factors are exact powers of ten, so the result is exact and rounded only for display.",
};

export function getCategoryQuestions(category: ConversionCategory): FaqItem[] {
  return CATEGORY_QUESTIONS[category];
}

export interface RealWorldUses {
  why: string;
  whoUsesIt: string[];
}

/** "Real World Uses" — direction-aware reason + merged audience roles. */
export function buildRealWorldUses(opts: {
  slug: string;
  fromShort: string;
  toShort: string;
  fromCtx: UnitContext;
  toCtx: UnitContext;
  fromEeat: UnitEeat;
  toEeat: UnitEeat;
}): RealWorldUses {
  const { slug, fromShort, toShort, fromCtx, toCtx, fromEeat, toEeat } = opts;
  const reasonA = fromCtx.useCases[variantIndex(slug + "r", fromCtx.useCases.length)];
  const reasonB = toCtx.useCases[variantIndex(slug + "r2", toCtx.useCases.length)];
  const why = `Converting ${fromShort} to ${toShort} bridges two ways of measuring the same thing. People do it most often when ${reasonA}, and on the receiving side when ${reasonB}. Having the exact value — not a rough estimate — prevents costly mistakes in paperwork, purchases and planning.`;

  const seen = new Set<string>();
  const whoUsesIt: string[] = [];
  for (const role of [...fromEeat.whoUsesIt, ...toEeat.whoUsesIt]) {
    const key = role.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    whoUsesIt.push(role);
    if (whoUsesIt.length >= 6) break;
  }
  return { why, whoUsesIt };
}

export interface HowCalculated {
  steps: string[];
  precision: string;
}

/** "How it's calculated" — formula, derivation steps and precision note. */
export function buildHowCalculated(opts: {
  category: ConversionCategory;
  fromUnit: string;
  toUnit: string;
  fromShort: string;
  toShort: string;
  formula: string;
}): HowCalculated {
  const { category, fromUnit, toUnit, fromShort, toShort, formula } = opts;

  if (category === "temperature") {
    return {
      steps: [
        "Celsius is the reference scale, and Fahrenheit and Kelvin are defined relative to it.",
        "The conversion is not a simple ratio — it includes an offset (a fixed term) as well as a scale factor, which is why you cannot just multiply.",
        `Applying the exact relationship gives the formula: ${formula}.`,
        `Substitute any ${fromShort} value into that formula to get the ${toShort} result.`,
      ],
      precision: PRECISION_NOTE[category],
    };
  }

  const base = getBaseUnitName(category);
  const fromFactor = unitToBaseFactor(category, fromUnit);
  const toFactor = unitToBaseFactor(category, toUnit);
  const factor = convertUnits(category, fromUnit, toUnit, 1);
  const factorText =
    factor >= 0.0001 && factor < 1e7
      ? Number(factor.toPrecision(7)).toString()
      : factor.toExponential(4);

  return {
    steps: [
      `Both ${fromShort} and ${toShort} are defined in terms of the same base unit, the ${base}.`,
      `1 ${fromShort} = ${trimFactor(fromFactor)} ${base}, and 1 ${toShort} = ${trimFactor(toFactor)} ${base}.`,
      `Divide one definition by the other to get the conversion factor: ${trimFactor(fromFactor)} ÷ ${trimFactor(toFactor)} = ${factorText}.`,
      `So ${formula}. Multiply any ${fromShort} value by ${factorText} to get the result in ${toShort}.`,
    ],
    precision: PRECISION_NOTE[category],
  };
}

function trimFactor(value: number): string {
  if (value >= 0.0001 && value < 1e7) {
    return Number(value.toPrecision(8)).toString();
  }
  return value.toExponential(4);
}

export interface UnitHistoryEntry {
  name: string;
  system: string;
  text: string;
}

/** "History" — origin notes for both units involved in the conversion. */
export function buildUnitHistory(
  fromEeat: UnitEeat,
  toEeat: UnitEeat,
): UnitHistoryEntry[] {
  return [
    { name: fromEeat.name, system: fromEeat.system, text: fromEeat.history },
    { name: toEeat.name, system: toEeat.system, text: toEeat.history },
  ];
}
