import type { FaqItem } from "@/data/tools/types";

export type ConversionCategory =
  | "length"
  | "weight"
  | "temperature"
  | "volume"
  | "area"
  | "speed"
  | "time"
  | "data";

export interface ConversionTableRow {
  input: number;
  output: number;
}

export interface ConversionPage {
  slug: string;
  path: string;
  category: ConversionCategory;
  categoryLabel: string;
  fromUnit: string;
  toUnit: string;
  fromLabel: string;
  toLabel: string;
  fromShort: string;
  toShort: string;
  title: string;
  seoTitle: string;
  description: string;
  metaDescription: string;
  keywords: string[];
  formula: string;
  whatIs: string;
  examples: { input: number; output: number; label: string }[];
  conversionTable: ConversionTableRow[];
  commonMistakes: string[];
  faqs: FaqItem[];
  relatedSlugs: string[];
  toolSlugs: [string, string];
  hubSlug: string;
  intro: string;
}

export interface ConversionHubFormula {
  label: string;
  expression: string;
}

export interface ConversionHub {
  category: ConversionCategory;
  slug: string;
  path: string;
  label: string;
  title: string;
  seoTitle: string;
  description: string;
  metaDescription: string;
  keywords: string[];
  intro: string[];
  formulas: ConversionHubFormula[];
  examples: string[];
  faqs: FaqItem[];
  popularSlugs: string[];
  relatedToolSlugs: string[];
  relatedGuideSlugs: string[];
}

export interface CalculatorLandingPage {
  slug: string;
  path: string;
  title: string;
  seoTitle: string;
  description: string;
  metaDescription: string;
  keywords: string[];
  toolSlug: string;
  hubSlug: string;
  intro: string;
  examples: { label: string; detail: string }[];
  faqs: FaqItem[];
  relatedSlugs: string[];
  toolSlugs: [string, string];
  relatedGuideSlugs: string[];
}

export interface GuidePage {
  slug: string;
  path: string;
  title: string;
  seoTitle: string;
  description: string;
  metaDescription: string;
  keywords: string[];
  category: string;
  publishedAt: string;
  lastUpdated: string;
  lastReviewed: string;
  toolSlugs: [string, string];
  hubSlug: string;
  relatedSlugs: string[];
  relatedGuideSlugs: string[];
  faqs: FaqItem[];
  content: string;
}

export interface ProgrammaticLinkSet {
  relatedPages: { slug: string; path: string; title: string }[];
  tools: { slug: string; name: string }[];
  hub: { slug: string; path: string; title: string };
}
