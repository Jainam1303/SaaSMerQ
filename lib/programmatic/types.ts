import type { FaqItem } from "@/data/tools/types";

export type ConversionCategory =
  | "length"
  | "weight"
  | "temperature"
  | "volume"
  | "area"
  | "speed";

export interface ConversionPage {
  slug: string;
  path: string;
  category: ConversionCategory;
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
  examples: { input: number; output: number; label: string }[];
  faqs: FaqItem[];
  relatedSlugs: string[];
  toolSlugs: [string, string];
  hubSlug: string;
  intro: string;
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
