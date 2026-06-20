import type { CategorySlug, ToolMeta } from "./types";
import { qrGenerator } from "./definitions/qr-generator";
import { passwordGenerator } from "./definitions/password-generator";
import { uuidGenerator } from "./definitions/uuid-generator";
import { jsonFormatter } from "./definitions/json-formatter";
import { base64Tool } from "./definitions/base64";
import { gstCalculator } from "./definitions/gst-calculator";
import { upiQrGenerator } from "./definitions/upi-qr-generator";
import { imageCompressor } from "./definitions/image-compressor";
import { imageResizer } from "./definitions/image-resizer";
import { sitemapGenerator } from "./definitions/sitemap-generator";
import { emiCalculator } from "./definitions/emi-calculator";
import { sipCalculator } from "./definitions/sip-calculator";
import { percentageCalculator } from "./definitions/percentage-calculator";
import { ageCalculator } from "./definitions/age-calculator";
import { unitConverter } from "./definitions/unit-converter";
import { fdCalculator } from "./definitions/fd-calculator";
import { rdCalculator } from "./definitions/rd-calculator";
import { ppfCalculator } from "./definitions/ppf-calculator";
import { hraCalculator } from "./definitions/hra-calculator";
import { loanCalculator } from "./definitions/loan-calculator";
import { discountCalculator } from "./definitions/discount-calculator";
import { profitMarginCalculator } from "./definitions/profit-margin-calculator";
import { breakEvenCalculator } from "./definitions/break-even-calculator";
import { invoiceGenerator } from "./definitions/invoice-generator";
import { gstInvoiceGenerator } from "./definitions/gst-invoice-generator";

/**
 * The single source of truth for every tool on the platform.
 * To add a tool: create its metadata definition, import it here, and add the
 * matching client component in `components/tools/tool-runner.tsx`.
 */
export const tools: ToolMeta[] = [
  qrGenerator,
  passwordGenerator,
  uuidGenerator,
  jsonFormatter,
  base64Tool,
  gstCalculator,
  upiQrGenerator,
  imageCompressor,
  imageResizer,
  sitemapGenerator,
  emiCalculator,
  sipCalculator,
  percentageCalculator,
  ageCalculator,
  unitConverter,
  fdCalculator,
  rdCalculator,
  ppfCalculator,
  hraCalculator,
  loanCalculator,
  discountCalculator,
  profitMarginCalculator,
  breakEvenCalculator,
  invoiceGenerator,
  gstInvoiceGenerator,
];

const toolBySlug = new Map(tools.map((tool) => [tool.slug, tool]));

export function getToolBySlug(slug: string): ToolMeta | undefined {
  return toolBySlug.get(slug);
}

export function getAllToolSlugs(): string[] {
  return tools.map((tool) => tool.slug);
}

export function getToolsByCategory(category: CategorySlug): ToolMeta[] {
  return tools.filter((tool) => tool.category === category);
}

export function getFeaturedTools(): ToolMeta[] {
  return tools.filter((tool) => tool.featured);
}

export function getPopularTools(): ToolMeta[] {
  return tools.filter((tool) => tool.popular);
}

export function getRecentlyAddedTools(limit = 6): ToolMeta[] {
  return [...tools]
    .sort(
      (a, b) =>
        new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime(),
    )
    .slice(0, limit);
}

/**
 * Related tools: prefer same-category tools, then fill from other categories.
 */
export function getRelatedTools(slug: string, limit = 5): ToolMeta[] {
  const current = getToolBySlug(slug);
  if (!current) return [];

  const sameCategory = tools.filter(
    (tool) => tool.category === current.category && tool.slug !== slug,
  );
  const others = tools.filter(
    (tool) => tool.category !== current.category && tool.slug !== slug,
  );

  return [...sameCategory, ...others].slice(0, limit);
}

export function searchTools(query: string): ToolMeta[] {
  const q = query.trim().toLowerCase();
  if (!q) return tools;
  return tools.filter((tool) => {
    const haystack = [
      tool.name,
      tool.shortDescription,
      tool.category,
      ...tool.keywords,
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  });
}

export type { ToolMeta, CategorySlug };
