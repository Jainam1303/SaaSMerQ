import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { FaqItem } from "@/data/tools/types";
import type { GuidePage } from "./types";

const GUIDES_DIR = path.join(process.cwd(), "content/guides");

function parseGuide(slug: string): GuidePage {
  const filePath = path.join(GUIDES_DIR, `${slug}.md`);
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);

  const faqs = (data.faqs as FaqItem[]) ?? [];
  const relatedTools = (data.relatedToolSlugs as string[]) ?? [];
  const primary = data.toolSlug as string;
  const secondary =
    relatedTools.find((s) => s !== primary) ?? relatedTools[0] ?? primary;
  const toolSlugs = [primary, secondary] as [string, string];

  return {
    slug,
    path: `/guides/${slug}`,
    title: data.title as string,
    seoTitle: (data.seoTitle as string) ?? (data.title as string),
    description: data.description as string,
    metaDescription: (data.metaDescription as string) ?? (data.description as string),
    keywords: (data.keywords as string[]) ?? [],
    category: data.category as string,
    publishedAt: data.publishedAt as string,
    lastUpdated: (data.lastUpdated as string) ?? (data.publishedAt as string),
    lastReviewed: (data.lastReviewed as string) ?? (data.publishedAt as string),
    toolSlugs,
    hubSlug: data.hubSlug as string,
    relatedSlugs: (data.relatedPageSlugs as string[]) ??
      (data.relatedGuideSlugs as string[]) ?? [],
    relatedGuideSlugs: (data.relatedGuideSlugs as string[]) ?? [],
    faqs,
    content,
  };
}

export function getAllGuideSlugs(): string[] {
  if (!fs.existsSync(GUIDES_DIR)) return [];
  return fs
    .readdirSync(GUIDES_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

export function getGuideBySlug(slug: string): GuidePage | undefined {
  const filePath = path.join(GUIDES_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return undefined;
  return parseGuide(slug);
}

export function getAllGuides(): GuidePage[] {
  return getAllGuideSlugs().map((slug) => parseGuide(slug));
}

export function getRelatedGuides(slug: string, limit = 3): GuidePage[] {
  const guide = getGuideBySlug(slug);
  if (!guide) return [];
  return guide.relatedGuideSlugs
    .map((s) => getGuideBySlug(s))
    .filter((g): g is GuidePage => Boolean(g))
    .slice(0, limit);
}
