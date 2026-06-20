import type { CategorySlug, FaqItem } from "@/data/tools/types";

export interface HubCategorySummary {
  slug: CategorySlug;
  summary: string;
}

export interface HubMeta {
  slug: string;
  path: string;
  title: string;
  seoTitle: string;
  description: string;
  metaDescription: string;
  keywords: string[];
  icon: string;
  toolSlugs: string[];
  blogSlugs: string[];
  relatedHubSlugs: string[];
  categorySummaries: HubCategorySummary[];
  faqs: FaqItem[];
}

export interface Hub extends HubMeta {
  content: string;
}
