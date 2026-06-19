/**
 * Tool data contract. Every tool on the platform is described by a single
 * `ToolMeta` object. Adding a new tool = adding one metadata object + one
 * client component, so the platform scales to hundreds/thousands of tools
 * without architectural changes.
 */

export type CategorySlug =
  | "business"
  | "developer"
  | "image"
  | "seo"
  | "text";

export interface Category {
  slug: CategorySlug;
  name: string;
  description: string;
  /** lucide-react icon name (resolved by the icon registry). */
  icon: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface ToolMeta {
  /** URL-safe unique identifier, used as the route segment. */
  slug: string;
  /** Display name, e.g. "QR Code Generator". */
  name: string;
  /** Optional SEO title override. Falls back to `name`. */
  seoTitle?: string;
  /** One-line summary used on cards and listings. */
  shortDescription: string;
  /** Meta description (~150-160 chars) for search engines. */
  metaDescription: string;
  category: CategorySlug;
  /** lucide-react icon name. */
  icon: string;
  keywords: string[];
  /** ISO date the tool was added (drives "Recently added"). */
  addedAt: string;
  featured?: boolean;
  popular?: boolean;
  /** Intro paragraph rendered above the tool UI. */
  intro: string;
  /** Step-by-step "How it works" content. */
  howItWorks: string[];
  /** Practical use cases / scenarios. */
  useCases: string[];
  faqs: FaqItem[];
}
