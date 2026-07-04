import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { Hub, HubMeta } from "./types";

const HUBS_DIR = path.join(process.cwd(), "content/hubs");

export const hubPaths = [
  "/finance-tools",
  "/investment-tools",
  "/gst-tools",
  "/business-tools",
  "/developer-tools",
  "/seo-tools",
] as const;

export type HubSlug =
  | "finance-tools"
  | "investment-tools"
  | "gst-tools"
  | "business-tools"
  | "developer-tools"
  | "seo-tools";

function parseHub(slug: string): Hub {
  const filePath = path.join(HUBS_DIR, `${slug}.md`);
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);

  return {
    slug,
    path: data.path as string,
    title: data.title as string,
    seoTitle: data.seoTitle as string,
    description: data.description as string,
    metaDescription: data.metaDescription as string,
    keywords: (data.keywords as string[]) ?? [],
    icon: data.icon as string,
    toolSlugs: (data.toolSlugs as string[]) ?? [],
    blogSlugs: (data.blogSlugs as string[]) ?? [],
    relatedHubSlugs: (data.relatedHubSlugs as string[]) ?? [],
    categorySummaries: (data.categorySummaries as Hub["categorySummaries"]) ?? [],
    faqs: (data.faqs as Hub["faqs"]) ?? [],
    content,
  };
}

export function getAllHubSlugs(): HubSlug[] {
  if (!fs.existsSync(HUBS_DIR)) return [];
  return fs
    .readdirSync(HUBS_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, "") as HubSlug);
}

export function getHubBySlug(slug: string): Hub | undefined {
  const filePath = path.join(HUBS_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return undefined;
  return parseHub(slug);
}

export function getAllHubs(): HubMeta[] {
  return getAllHubSlugs().map((slug) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { content: _, ...meta } = parseHub(slug);
    return meta;
  });
}

export function getHubsForTool(toolSlug: string): HubMeta[] {
  return getAllHubs().filter((h) => h.toolSlugs.includes(toolSlug));
}

export function getHubsForBlog(blogSlug: string): HubMeta[] {
  return getAllHubs().filter((h) => h.blogSlugs.includes(blogSlug));
}

export function getHubsForPost(postSlug: string, toolSlug?: string): HubMeta[] {
  const seen = new Set<string>();
  const result: HubMeta[] = [];
  for (const hub of [...getHubsForBlog(postSlug), ...getHubsForTool(toolSlug ?? "")]) {
    if (seen.has(hub.slug)) continue;
    seen.add(hub.slug);
    result.push(hub);
  }
  return result;
}
