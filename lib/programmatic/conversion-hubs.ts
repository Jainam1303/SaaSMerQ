import type { FaqItem } from "@/data/tools/types";
import type { ConversionCategory, ConversionHub } from "./types";

/**
 * Topical-authority hub copy for each conversion category. Hubs sit between
 * the /conversions index and the individual converter leaf pages, giving every
 * category a crawlable, internally-linked landing page with unique editorial
 * content (intro, formulas, examples, FAQs) distinct from the leaf pages.
 */
const HUBS: Record<
  ConversionCategory,
  Omit<ConversionHub, "slug" | "path" | "faqs">
> = {
  length: {
    category: "length",
    label: "Length",
    title: "Length & Distance Converters",
    seoTitle: "Length Converters — km, miles, meters, feet & more | MerQPrime",
    description:
      "Convert between kilometres, miles, metres, feet, inches and more. Instant length converters with formulas, tables and worked examples.",
    metaDescription:
      "Free length & distance converters — km to miles, meters to feet, cm to inches and more. Formulas, conversion tables and examples on MerQPrime.",
    keywords: [
      "length converter",
      "distance converter",
      "km to miles",
      "meters to feet",
      "cm to inches",
      "unit converter",
    ],
    intro: [
      "Length and distance are measured in two parallel systems: the metric system (millimetres, centimetres, metres and kilometres) and the imperial/US system (inches, feet, yards and miles). Because product specs, maps, travel directions and academic work mix both, converting accurately between them is one of the most common everyday calculations.",
      "Every length conversion is linear — a single fixed factor maps one unit to another. Below you'll find the key factors, the metric base relationships and instant converters for each popular pair, so you can move between km, miles, metres, feet, inches and centimetres without rounding errors.",
    ],
    formulas: [
      { label: "Kilometres to miles", expression: "miles = km × 0.621371" },
      { label: "Miles to kilometres", expression: "km = miles × 1.609344" },
      { label: "Metres to feet", expression: "feet = m × 3.28084" },
      { label: "Centimetres to inches", expression: "inches = cm × 0.393701" },
      { label: "Metric base", expression: "1 m = 100 cm = 1000 mm = 0.001 km" },
    ],
    examples: [
      "A 5 km run is about 3.11 miles.",
      "A 6 ft person is roughly 1.83 metres tall.",
      "A 30 cm ruler is about 11.81 inches.",
    ],
    popularSlugs: [
      "km-to-miles",
      "miles-to-km",
      "meters-to-feet",
      "feet-to-meters",
      "cm-to-inches",
      "inches-to-cm",
    ],
    relatedToolSlugs: ["unit-converter", "percentage-calculator"],
    relatedGuideSlugs: ["km-to-miles-guide", "unit-conversion-basics"],
  },
  weight: {
    category: "weight",
    label: "Weight",
    title: "Weight & Mass Converters",
    seoTitle: "Weight Converters — kg, lbs, grams, ounces & stone | MerQPrime",
    description:
      "Convert between kilograms, pounds, grams, ounces and stone. Instant weight converters with formulas, tables and examples.",
    metaDescription:
      "Free weight & mass converters — kg to lbs, grams to ounces, stone to kg and more. Formulas, conversion tables and examples on MerQPrime.",
    keywords: [
      "weight converter",
      "mass converter",
      "kg to lbs",
      "grams to ounces",
      "stone to kg",
    ],
    intro: [
      "Weight is quoted in metric units (grams and kilograms) almost everywhere, but pounds, ounces and stone remain standard in the US and UK for body weight, cooking and shipping. Converting between these systems is essential for recipes, fitness, parcels and product labels.",
      "All weight conversions here use precise international factors based on the kilogram. Use the converters below to move between kg, lbs, grams, ounces and stone instantly.",
    ],
    formulas: [
      { label: "Kilograms to pounds", expression: "lbs = kg × 2.204623" },
      { label: "Pounds to kilograms", expression: "kg = lbs × 0.453592" },
      { label: "Grams to ounces", expression: "oz = g × 0.035274" },
      { label: "Stone to kilograms", expression: "kg = stone × 6.350293" },
    ],
    examples: [
      "70 kg is about 154.3 lbs.",
      "500 g is roughly 17.6 ounces.",
      "11 stone equals about 69.9 kg.",
    ],
    popularSlugs: [
      "kg-to-lbs",
      "lbs-to-kg",
      "grams-to-ounces",
      "ounces-to-grams",
      "stone-to-kg",
      "kg-to-grams",
    ],
    relatedToolSlugs: ["unit-converter", "percentage-calculator"],
    relatedGuideSlugs: ["kg-to-lbs-guide", "unit-conversion-basics"],
  },
  temperature: {
    category: "temperature",
    label: "Temperature",
    title: "Temperature Converters",
    seoTitle: "Temperature Converters — Celsius, Fahrenheit & Kelvin | MerQPrime",
    description:
      "Convert between Celsius, Fahrenheit and Kelvin. Instant temperature converters with formulas, reference points and examples.",
    metaDescription:
      "Free temperature converters — Celsius to Fahrenheit, Fahrenheit to Celsius, Kelvin and more. Formulas, tables and worked examples on MerQPrime.",
    keywords: [
      "temperature converter",
      "celsius to fahrenheit",
      "fahrenheit to celsius",
      "kelvin converter",
    ],
    intro: [
      "Temperature conversions are unusual because the scales do not share a zero point. Celsius and Fahrenheit need an offset (the 32° term) as well as a scaling factor, while Kelvin shifts Celsius by 273.15. That makes a reliable converter especially valuable for cooking, weather, science and travel.",
      "The converters below apply the exact formulas for every Celsius, Fahrenheit and Kelvin pair, with reference points (freezing, body temperature, boiling) so you can sanity-check results at a glance.",
    ],
    formulas: [
      { label: "Celsius to Fahrenheit", expression: "°F = (°C × 9/5) + 32" },
      { label: "Fahrenheit to Celsius", expression: "°C = (°F − 32) × 5/9" },
      { label: "Celsius to Kelvin", expression: "K = °C + 273.15" },
      { label: "Kelvin to Celsius", expression: "°C = K − 273.15" },
    ],
    examples: [
      "Water freezes at 0°C = 32°F = 273.15 K.",
      "Body temperature 37°C is about 98.6°F.",
      "Water boils at 100°C = 212°F.",
    ],
    popularSlugs: [
      "celsius-to-fahrenheit",
      "fahrenheit-to-celsius",
      "celsius-to-kelvin",
      "kelvin-to-celsius",
      "fahrenheit-to-kelvin",
      "kelvin-to-fahrenheit",
    ],
    relatedToolSlugs: ["unit-converter", "percentage-calculator"],
    relatedGuideSlugs: ["celsius-fahrenheit-guide", "unit-conversion-basics"],
  },
  volume: {
    category: "volume",
    label: "Volume",
    title: "Volume & Capacity Converters",
    seoTitle: "Volume Converters — litres, gallons, ml, cups & m³ | MerQPrime",
    description:
      "Convert between litres, gallons, millilitres, cups and cubic metres. Instant volume converters with formulas, tables and examples.",
    metaDescription:
      "Free volume & capacity converters — liters to gallons, cups to ml, ml to liters and more. Formulas, conversion tables and examples on MerQPrime.",
    keywords: [
      "volume converter",
      "liters to gallons",
      "cups to ml",
      "ml to liters",
      "capacity converter",
    ],
    intro: [
      "Volume is where measurement systems diverge the most: litres and millilitres dominate the metric world, while US gallons and cups are standard in American recipes — and an imperial gallon is different again. Accurate volume conversion keeps recipes, fuel calculations and lab work correct.",
      "Use the converters below to move between litres, gallons, millilitres, cups and cubic metres. Each uses the precise US definition where applicable, with worked examples for the most common cooking and fuel conversions.",
    ],
    formulas: [
      { label: "Litres to US gallons", expression: "gal = L × 0.264172" },
      { label: "US gallons to litres", expression: "L = gal × 3.785412" },
      { label: "Cups to millilitres", expression: "ml = cups × 236.588" },
      { label: "Litres to millilitres", expression: "ml = L × 1000" },
    ],
    examples: [
      "1 litre is about 0.264 US gallons.",
      "1 US cup is roughly 236.6 ml.",
      "5 litres equals 5000 ml.",
    ],
    popularSlugs: [
      "liters-to-gallons",
      "gallons-to-liters",
      "cups-to-ml",
      "ml-to-cups",
      "liters-to-ml",
      "ml-to-liters",
    ],
    relatedToolSlugs: ["unit-converter", "percentage-calculator"],
    relatedGuideSlugs: ["liters-to-gallons-guide", "unit-conversion-basics"],
  },
  area: {
    category: "area",
    label: "Area",
    title: "Area & Land Converters",
    seoTitle: "Area Converters — sq ft, sq m, acres & hectares | MerQPrime",
    description:
      "Convert between square feet, square metres, acres, hectares and square kilometres. Instant area converters with formulas, tables and examples.",
    metaDescription:
      "Free area & land converters — sq ft to acres, acres to sq ft, sq ft to sq m and more. Formulas, conversion tables and examples on MerQPrime.",
    keywords: [
      "area converter",
      "square feet to acres",
      "acres to square feet",
      "sq ft to sq m",
      "land area converter",
    ],
    intro: [
      "Area conversion is essential for real estate, construction, agriculture and land deals — especially in India where plots are quoted in square feet, square metres, acres and hectares interchangeably. Because area scales with the square of length, the factors are larger and easier to get wrong without a converter.",
      "The tools below convert between square feet, square metres, acres, hectares and square kilometres using exact factors, with land-sized worked examples so you can verify large plots quickly.",
    ],
    formulas: [
      { label: "Square feet to acres", expression: "acres = sq ft × 0.0000229568" },
      { label: "Acres to square feet", expression: "sq ft = acres × 43560" },
      { label: "Square feet to square metres", expression: "sq m = sq ft × 0.092903" },
      { label: "Hectares to acres", expression: "acres = hectares × 2.471054" },
    ],
    examples: [
      "1 acre equals 43,560 square feet.",
      "1000 sq ft is about 92.9 sq m.",
      "1 hectare equals about 2.47 acres.",
    ],
    popularSlugs: [
      "square-feet-to-acres",
      "acres-to-square-feet",
      "square-feet-to-square-meters",
      "square-meters-to-square-feet",
      "acres-to-hectares",
      "hectares-to-acres",
    ],
    relatedToolSlugs: ["unit-converter", "percentage-calculator"],
    relatedGuideSlugs: [
      "square-feet-to-square-meters-guide",
      "unit-conversion-basics",
    ],
  },
  speed: {
    category: "speed",
    label: "Speed",
    title: "Speed & Velocity Converters",
    seoTitle: "Speed Converters — km/h, mph, m/s & knots | MerQPrime",
    description:
      "Convert between km/h, mph, m/s and knots. Instant speed converters with formulas, tables and worked examples.",
    metaDescription:
      "Free speed & velocity converters — km/h to mph, mph to km/h, m/s and knots. Formulas, conversion tables and examples on MerQPrime.",
    keywords: [
      "speed converter",
      "km/h to mph",
      "mph to km/h",
      "m/s converter",
      "knots converter",
    ],
    intro: [
      "Speed is reported in km/h on most road signs, mph in the US and UK, m/s in physics, and knots in aviation and sailing. Converting between them matters for driving abroad, science homework and marine or flight planning.",
      "The converters below handle every km/h, mph, m/s and knot pair with exact factors. Remember the most common pitfall: km/h and m/s differ by a factor of 3.6, not 1000.",
    ],
    formulas: [
      { label: "km/h to mph", expression: "mph = km/h × 0.621371" },
      { label: "mph to km/h", expression: "km/h = mph × 1.609344" },
      { label: "m/s to km/h", expression: "km/h = m/s × 3.6" },
      { label: "Knots to km/h", expression: "km/h = knots × 1.852" },
    ],
    examples: [
      "100 km/h is about 62.1 mph.",
      "10 m/s equals 36 km/h.",
      "20 knots is about 37 km/h.",
    ],
    popularSlugs: [
      "kmh-to-mph",
      "mph-to-kmh",
      "mps-to-kmh",
      "kmh-to-mps",
      "knots-to-kmh",
      "knots-to-mph",
    ],
    relatedToolSlugs: ["unit-converter", "percentage-calculator"],
    relatedGuideSlugs: ["unit-conversion-basics"],
  },
  time: {
    category: "time",
    label: "Time",
    title: "Time Converters",
    seoTitle: "Time Converters — seconds, minutes, hours, days & weeks | MerQPrime",
    description:
      "Convert between milliseconds, seconds, minutes, hours, days and weeks. Instant time converters with formulas, tables and examples.",
    metaDescription:
      "Free time converters — seconds to minutes, hours to days, minutes to seconds and more. Formulas, conversion tables and examples on MerQPrime.",
    keywords: [
      "time converter",
      "seconds to minutes",
      "hours to days",
      "minutes to hours",
      "milliseconds converter",
    ],
    intro: [
      "Time conversions appear constantly in programming, project planning, fitness and billing — wherever a duration in one unit needs restating in another. While seconds, minutes, hours and days have fixed ratios, longer spans are best computed through a common base of seconds for accuracy.",
      "The converters below move between milliseconds, seconds, minutes, hours, days and weeks using exact factors, so durations stay precise from sub-second timing to multi-week schedules.",
    ],
    formulas: [
      { label: "Minutes to seconds", expression: "s = min × 60" },
      { label: "Hours to minutes", expression: "min = hr × 60" },
      { label: "Days to hours", expression: "hr = days × 24" },
      { label: "Weeks to days", expression: "days = weeks × 7" },
    ],
    examples: [
      "1 hour equals 3600 seconds.",
      "1 day equals 1440 minutes.",
      "2 weeks equals 14 days.",
    ],
    popularSlugs: [
      "seconds-to-minutes",
      "minutes-to-seconds",
      "minutes-to-hours",
      "hours-to-minutes",
      "hours-to-days",
      "days-to-hours",
    ],
    relatedToolSlugs: ["unit-converter", "age-calculator"],
    relatedGuideSlugs: ["unit-conversion-basics"],
  },
  data: {
    category: "data",
    label: "Data",
    title: "Digital Storage Converters",
    seoTitle: "Data Converters — bits, bytes, KB, MB, GB & TB | MerQPrime",
    description:
      "Convert between bits, bytes, kilobytes, megabytes, gigabytes and terabytes. Instant data storage converters with formulas, tables and examples.",
    metaDescription:
      "Free data storage converters — MB to GB, GB to TB, KB to MB and more. Formulas, conversion tables and worked examples on MerQPrime.",
    keywords: [
      "data converter",
      "mb to gb",
      "gb to tb",
      "kb to mb",
      "bytes to bits",
      "storage converter",
    ],
    intro: [
      "Digital storage and bandwidth are quoted in bits and bytes and their multiples — KB, MB, GB and TB. Converting between them is everyday work for developers, IT admins and anyone managing files, downloads or disk space. The key rule: 1 byte = 8 bits.",
      "These converters use the decimal (SI) convention where 1 KB = 1000 bytes, matching how drive and bandwidth capacities are marketed. Use them to move between bits, bytes, KB, MB, GB and TB instantly.",
    ],
    formulas: [
      { label: "Bytes to bits", expression: "bits = bytes × 8" },
      { label: "Kilobytes to megabytes", expression: "MB = KB ÷ 1000" },
      { label: "Megabytes to gigabytes", expression: "GB = MB ÷ 1000" },
      { label: "Gigabytes to terabytes", expression: "TB = GB ÷ 1000" },
    ],
    examples: [
      "1 byte equals 8 bits.",
      "1000 MB equals 1 GB.",
      "1 TB equals 1000 GB.",
    ],
    popularSlugs: [
      "mb-to-gb",
      "gb-to-mb",
      "gb-to-tb",
      "tb-to-gb",
      "kb-to-mb",
      "bytes-to-bits",
    ],
    relatedToolSlugs: ["unit-converter", "percentage-calculator"],
    relatedGuideSlugs: ["unit-conversion-basics"],
  },
};

function buildHubFaqs(
  hub: Omit<ConversionHub, "slug" | "path" | "faqs">,
): FaqItem[] {
  const noun = hub.label.toLowerCase();
  const firstFormula = hub.formulas[0];
  return [
    {
      question: `How do I convert ${noun} units?`,
      answer: `Pick the ${noun} converter you need below, type a value, and the result appears instantly in your browser. Each pair uses the exact international factor — for example, ${firstFormula.label.toLowerCase()}: ${firstFormula.expression}.`,
    },
    {
      question: `Which ${noun} conversions are most common?`,
      answer: `The most-used ${noun} conversions are ${hub.popularSlugs
        .slice(0, 3)
        .map((s) => s.replace(/-/g, " "))
        .join(", ")}. Each has a dedicated page with a calculator, formula, conversion table and FAQs.`,
    },
    {
      question: `Are these ${noun} converters accurate?`,
      answer:
        "Yes. Every conversion uses standard international factors and precise floating-point math, suitable for everyday, academic and professional use.",
    },
    {
      question: "Is my data sent to a server?",
      answer:
        "No. All conversions run locally in your browser on MerQPrime. Nothing you type is uploaded.",
    },
  ];
}

export const CONVERSION_HUBS: ConversionHub[] = Object.values(HUBS).map(
  (hub) => ({
    ...hub,
    slug: hub.category,
    path: `/conversions/${hub.category}`,
    faqs: buildHubFaqs(hub),
  }),
);

const hubBySlug = new Map(CONVERSION_HUBS.map((h) => [h.slug, h]));

export function isConversionCategory(slug: string): slug is ConversionCategory {
  return hubBySlug.has(slug);
}

export function getConversionHub(slug: string): ConversionHub | undefined {
  return hubBySlug.get(slug);
}

export function getAllConversionHubs(): ConversionHub[] {
  return CONVERSION_HUBS;
}

export function getAllConversionHubSlugs(): string[] {
  return CONVERSION_HUBS.map((h) => h.slug);
}
