"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatNumber } from "@/lib/format";
import { ResultActions } from "@/components/tools/result-actions";
import { ResultPanel } from "@/components/tools/result-panel";
import {
  ToolInputs,
  ToolResults,
  ToolWorkspace,
} from "@/components/tools/tool-workspace";

type Category = "length" | "weight" | "temperature" | "area" | "volume" | "speed";

interface UnitDef {
  id: string;
  label: string;
}

const CATEGORIES: Record<
  Category,
  { label: string; units: UnitDef[] }
> = {
  length: {
    label: "Length",
    units: [
      { id: "m", label: "Metre (m)" },
      { id: "km", label: "Kilometre (km)" },
      { id: "cm", label: "Centimetre (cm)" },
      { id: "mm", label: "Millimetre (mm)" },
      { id: "in", label: "Inch (in)" },
      { id: "ft", label: "Foot (ft)" },
      { id: "mi", label: "Mile (mi)" },
    ],
  },
  weight: {
    label: "Weight",
    units: [
      { id: "kg", label: "Kilogram (kg)" },
      { id: "g", label: "Gram (g)" },
      { id: "lb", label: "Pound (lb)" },
      { id: "oz", label: "Ounce (oz)" },
    ],
  },
  temperature: {
    label: "Temperature",
    units: [
      { id: "c", label: "Celsius (°C)" },
      { id: "f", label: "Fahrenheit (°F)" },
      { id: "k", label: "Kelvin (K)" },
    ],
  },
  area: {
    label: "Area",
    units: [
      { id: "sqm", label: "Square metre (m²)" },
      { id: "sqkm", label: "Square kilometre (km²)" },
      { id: "sqft", label: "Square foot (ft²)" },
      { id: "acre", label: "Acre" },
      { id: "ha", label: "Hectare" },
    ],
  },
  volume: {
    label: "Volume",
    units: [
      { id: "l", label: "Litre (L)" },
      { id: "ml", label: "Millilitre (mL)" },
      { id: "gal", label: "US Gallon" },
      { id: "m3", label: "Cubic metre (m³)" },
    ],
  },
  speed: {
    label: "Speed",
    units: [
      { id: "kmh", label: "Kilometre/hour (km/h)" },
      { id: "ms", label: "Metre/second (m/s)" },
      { id: "mph", label: "Mile/hour (mph)" },
    ],
  },
};

function toBase(category: Category, unit: string, value: number): number {
  switch (category) {
    case "length": {
      const factors: Record<string, number> = {
        m: 1,
        km: 1000,
        cm: 0.01,
        mm: 0.001,
        in: 0.0254,
        ft: 0.3048,
        mi: 1609.344,
      };
      return value * (factors[unit] ?? 1);
    }
    case "weight": {
      const factors: Record<string, number> = {
        kg: 1000,
        g: 1,
        lb: 453.59237,
        oz: 28.349523125,
      };
      return value * (factors[unit] ?? 1);
    }
    case "temperature": {
      if (unit === "c") return value;
      if (unit === "f") return (value - 32) * (5 / 9);
      if (unit === "k") return value - 273.15;
      return value;
    }
    case "area": {
      const factors: Record<string, number> = {
        sqm: 1,
        sqkm: 1e6,
        sqft: 0.09290304,
        acre: 4046.8564224,
        ha: 10000,
      };
      return value * (factors[unit] ?? 1);
    }
    case "volume": {
      const factors: Record<string, number> = {
        l: 1,
        ml: 0.001,
        gal: 3.785411784,
        m3: 1000,
      };
      return value * (factors[unit] ?? 1);
    }
    case "speed": {
      const factors: Record<string, number> = {
        ms: 1,
        kmh: 1 / 3.6,
        mph: 0.44704,
      };
      return value * (factors[unit] ?? 1);
    }
    default:
      return value;
  }
}

function fromBase(category: Category, unit: string, base: number): number {
  switch (category) {
    case "length": {
      const factors: Record<string, number> = {
        m: 1,
        km: 1000,
        cm: 0.01,
        mm: 0.001,
        in: 0.0254,
        ft: 0.3048,
        mi: 1609.344,
      };
      return base / (factors[unit] ?? 1);
    }
    case "weight": {
      const factors: Record<string, number> = {
        kg: 1000,
        g: 1,
        lb: 453.59237,
        oz: 28.349523125,
      };
      return base / (factors[unit] ?? 1);
    }
    case "temperature": {
      const c = base;
      if (unit === "c") return c;
      if (unit === "f") return c * (9 / 5) + 32;
      if (unit === "k") return c + 273.15;
      return c;
    }
    case "area": {
      const factors: Record<string, number> = {
        sqm: 1,
        sqkm: 1e6,
        sqft: 0.09290304,
        acre: 4046.8564224,
        ha: 10000,
      };
      return base / (factors[unit] ?? 1);
    }
    case "volume": {
      const factors: Record<string, number> = {
        l: 1,
        ml: 0.001,
        gal: 3.785411784,
        m3: 1000,
      };
      return base / (factors[unit] ?? 1);
    }
    case "speed": {
      const factors: Record<string, number> = {
        ms: 1,
        kmh: 1 / 3.6,
        mph: 0.44704,
      };
      return base / (factors[unit] ?? 1);
    }
    default:
      return base;
  }
}

function convert(
  category: Category,
  fromUnit: string,
  toUnit: string,
  value: number,
): number {
  const base = toBase(category, fromUnit, value);
  return fromBase(category, toUnit, base);
}

export function UnitConverterTool() {
  const [category, setCategory] = React.useState<Category>("length");
  const units = CATEGORIES[category].units;
  const [fromUnit, setFromUnit] = React.useState(units[0].id);
  const [toUnit, setToUnit] = React.useState(units[1]?.id ?? units[0].id);
  const [amount, setAmount] = React.useState("1");

  React.useEffect(() => {
    const u = CATEGORIES[category].units;
    setFromUnit(u[0].id);
    setToUnit(u[1]?.id ?? u[0].id);
  }, [category]);

  const value = Number(amount);
  const invalid = !Number.isFinite(value);

  const result = invalid
    ? 0
    : convert(category, fromUnit, toUnit, value);

  const fromLabel =
    units.find((u) => u.id === fromUnit)?.label ?? fromUnit;
  const toLabel = units.find((u) => u.id === toUnit)?.label ?? toUnit;

  const shareText = invalid
    ? ""
    : `${formatNumber(value)} ${fromLabel} = ${formatNumber(result)} ${toLabel}`;

  return (
    <div className="space-y-6">
      <Tabs value={category} onValueChange={(v) => setCategory(v as Category)}>
        <TabsList className="grid w-full grid-cols-2 gap-1 sm:grid-cols-3 lg:grid-cols-6">
          {(Object.keys(CATEGORIES) as Category[]).map((key) => (
            <TabsTrigger key={key} value={key} className="text-xs sm:text-sm">
              {CATEGORIES[key].label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <ToolWorkspace>
        <ToolInputs>
            <div className="space-y-2">
              <Label htmlFor="unit-value">Value</Label>
              <Input
                id="unit-value"
                type="number"
                inputMode="decimal"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                aria-invalid={invalid}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit-from">From</Label>
              <Select
                id="unit-from"
                value={fromUnit}
                onChange={(e) => setFromUnit(e.target.value)}
              >
                {units.map((u) => (
                  <option key={u.id} value={u.id}>{u.label}</option>
                ))}
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit-to">To</Label>
              <Select
                id="unit-to"
                value={toUnit}
                onChange={(e) => setToUnit(e.target.value)}
              >
                {units.map((u) => (
                  <option key={u.id} value={u.id}>{u.label}</option>
                ))}
              </Select>
            </div>
        </ToolInputs>

        <ToolResults>
          <ResultPanel title="Result" highlight={formatNumber(result)}>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {formatNumber(value)} {fromLabel} = {formatNumber(result)}{" "}
              {toLabel}
            </p>
          </ResultPanel>
          <ResultActions text={shareText} />
        </ToolResults>
      </ToolWorkspace>
    </div>
  );
}
