import type { ConversionCategory } from "./types";

export interface UnitDef {
  id: string;
  label: string;
  short: string;
  slug: string;
}

export const CONVERSION_CATEGORIES: Record<
  ConversionCategory,
  { label: string; units: UnitDef[] }
> = {
  length: {
    label: "Length",
    units: [
      { id: "km", label: "Kilometre (km)", short: "km", slug: "km" },
      { id: "mi", label: "Mile (mi)", short: "miles", slug: "miles" },
      { id: "m", label: "Metre (m)", short: "meters", slug: "meters" },
      { id: "ft", label: "Foot (ft)", short: "feet", slug: "feet" },
      { id: "cm", label: "Centimetre (cm)", short: "cm", slug: "cm" },
      { id: "in", label: "Inch (in)", short: "inches", slug: "inches" },
      { id: "mm", label: "Millimetre (mm)", short: "mm", slug: "mm" },
      { id: "yd", label: "Yard (yd)", short: "yards", slug: "yards" },
    ],
  },
  weight: {
    label: "Weight",
    units: [
      { id: "kg", label: "Kilogram (kg)", short: "kg", slug: "kg" },
      { id: "lb", label: "Pound (lb)", short: "lbs", slug: "lbs" },
      { id: "g", label: "Gram (g)", short: "grams", slug: "grams" },
      { id: "oz", label: "Ounce (oz)", short: "ounces", slug: "ounces" },
      { id: "st", label: "Stone (st)", short: "stone", slug: "stone" },
    ],
  },
  temperature: {
    label: "Temperature",
    units: [
      { id: "c", label: "Celsius (°C)", short: "celsius", slug: "celsius" },
      {
        id: "f",
        label: "Fahrenheit (°F)",
        short: "fahrenheit",
        slug: "fahrenheit",
      },
      { id: "k", label: "Kelvin (K)", short: "kelvin", slug: "kelvin" },
    ],
  },
  volume: {
    label: "Volume",
    units: [
      { id: "l", label: "Litre (L)", short: "liters", slug: "liters" },
      { id: "gal", label: "US Gallon", short: "gallons", slug: "gallons" },
      { id: "ml", label: "Millilitre (mL)", short: "ml", slug: "ml" },
      { id: "m3", label: "Cubic metre (m³)", short: "m3", slug: "cubic-meters" },
      { id: "cup", label: "US Cup", short: "cups", slug: "cups" },
    ],
  },
  area: {
    label: "Area",
    units: [
      {
        id: "sqft",
        label: "Square foot (ft²)",
        short: "sq ft",
        slug: "square-feet",
      },
      {
        id: "sqm",
        label: "Square metre (m²)",
        short: "sq m",
        slug: "square-meters",
      },
      { id: "acre", label: "Acre", short: "acres", slug: "acres" },
      { id: "ha", label: "Hectare", short: "hectares", slug: "hectares" },
      {
        id: "sqkm",
        label: "Square kilometre (km²)",
        short: "sq km",
        slug: "square-km",
      },
    ],
  },
  speed: {
    label: "Speed",
    units: [
      { id: "kmh", label: "Kilometre/hour", short: "km/h", slug: "kmh" },
      { id: "mph", label: "Mile/hour", short: "mph", slug: "mph" },
      { id: "ms", label: "Metre/second", short: "m/s", slug: "mps" },
      { id: "knot", label: "Knot", short: "knots", slug: "knots" },
    ],
  },
};

function toBase(category: ConversionCategory, unit: string, value: number): number {
  switch (category) {
    case "length": {
      const f: Record<string, number> = {
        km: 1000,
        mi: 1609.344,
        m: 1,
        ft: 0.3048,
        cm: 0.01,
        in: 0.0254,
        mm: 0.001,
        yd: 0.9144,
      };
      return value * (f[unit] ?? 1);
    }
    case "weight": {
      const f: Record<string, number> = {
        kg: 1000,
        lb: 453.59237,
        g: 1,
        oz: 28.349523125,
        st: 6350.29318,
      };
      return value * (f[unit] ?? 1);
    }
    case "temperature": {
      if (unit === "c") return value;
      if (unit === "f") return (value - 32) * (5 / 9);
      if (unit === "k") return value - 273.15;
      return value;
    }
    case "volume": {
      const f: Record<string, number> = {
        l: 1,
        gal: 3.785411784,
        ml: 0.001,
        m3: 1000,
        cup: 0.2365882365,
      };
      return value * (f[unit] ?? 1);
    }
    case "area": {
      const f: Record<string, number> = {
        sqft: 0.09290304,
        sqm: 1,
        acre: 4046.8564224,
        ha: 10000,
        sqkm: 1e6,
      };
      return value * (f[unit] ?? 1);
    }
    case "speed": {
      const f: Record<string, number> = {
        kmh: 1 / 3.6,
        mph: 0.44704,
        ms: 1,
        knot: 0.514444,
      };
      return value * (f[unit] ?? 1);
    }
    default:
      return value;
  }
}

function fromBase(category: ConversionCategory, unit: string, base: number): number {
  switch (category) {
    case "length": {
      const f: Record<string, number> = {
        km: 1000,
        mi: 1609.344,
        m: 1,
        ft: 0.3048,
        cm: 0.01,
        in: 0.0254,
        mm: 0.001,
        yd: 0.9144,
      };
      return base / (f[unit] ?? 1);
    }
    case "weight": {
      const f: Record<string, number> = {
        kg: 1000,
        lb: 453.59237,
        g: 1,
        oz: 28.349523125,
        st: 6350.29318,
      };
      return base / (f[unit] ?? 1);
    }
    case "temperature": {
      const c = base;
      if (unit === "c") return c;
      if (unit === "f") return c * (9 / 5) + 32;
      if (unit === "k") return c + 273.15;
      return c;
    }
    case "volume": {
      const f: Record<string, number> = {
        l: 1,
        gal: 3.785411784,
        ml: 0.001,
        m3: 1000,
        cup: 0.2365882365,
      };
      return base / (f[unit] ?? 1);
    }
    case "area": {
      const f: Record<string, number> = {
        sqft: 0.09290304,
        sqm: 1,
        acre: 4046.8564224,
        ha: 10000,
        sqkm: 1e6,
      };
      return base / (f[unit] ?? 1);
    }
    case "speed": {
      const f: Record<string, number> = {
        kmh: 1 / 3.6,
        mph: 0.44704,
        ms: 1,
        knot: 0.514444,
      };
      return base / (f[unit] ?? 1);
    }
    default:
      return base;
  }
}

export function convertUnits(
  category: ConversionCategory,
  fromUnit: string,
  toUnit: string,
  value: number,
): number {
  return fromBase(category, toUnit, toBase(category, fromUnit, value));
}

export function getConversionFormula(
  category: ConversionCategory,
  from: UnitDef,
  to: UnitDef,
): string {
  if (category === "temperature") {
    if (from.id === "c" && to.id === "f")
      return "°F = (°C × 9/5) + 32";
    if (from.id === "f" && to.id === "c")
      return "°C = (°F − 32) × 5/9";
    if (from.id === "c" && to.id === "k") return "K = °C + 273.15";
    if (from.id === "k" && to.id === "c") return "°C = K − 273.15";
    if (from.id === "f" && to.id === "k")
      return "K = (°F − 32) × 5/9 + 273.15";
    if (from.id === "k" && to.id === "f")
      return "°F = (K − 273.15) × 9/5 + 32";
    return `Convert via Celsius as intermediate scale`;
  }
  const factor = convertUnits(category, from.id, to.id, 1);
  const rounded =
    factor >= 0.01 && factor < 10000
      ? Number(factor.toPrecision(6))
      : factor;
  return `${to.short} = ${from.short} × ${rounded}`;
}
