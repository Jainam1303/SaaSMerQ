"use client";

import { ConversionCalculator } from "./conversion-calculator";
import type { ConversionCategory } from "@/lib/programmatic/types";

export function ConversionTool(props: {
  category: ConversionCategory;
  fromUnit: string;
  toUnit: string;
  fromLabel: string;
  toLabel: string;
}) {
  return <ConversionCalculator {...props} />;
}
