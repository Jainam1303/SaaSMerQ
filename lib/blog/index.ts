import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { BlogPost, BlogPostMeta, TocItem } from "./types";

const BLOG_DIR = path.join(process.cwd(), "content/blog");

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

/** Extract h2/h3 headings for the table of contents. IDs match rehype-slug output. */
export function extractToc(content: string): TocItem[] {
  const items: TocItem[] = [];
  for (const line of content.split("\n")) {
    const match = line.match(/^(#{2,3})\s+(.+)$/);
    if (!match) continue;
    const level = match[1].length;
    const text = match[2].trim();
    items.push({ level, text, id: slugify(text) });
  }
  return items;
}

function parseFile(slug: string): BlogPost {
  const filePath = path.join(BLOG_DIR, `${slug}.md`);
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);

  return {
    slug,
    title: data.title as string,
    description: data.description as string,
    publishedAt: data.publishedAt as string,
    updatedAt: data.updatedAt as string | undefined,
    category: data.category as string,
    keywords: (data.keywords as string[]) ?? [],
    toolSlug: data.toolSlug as string,
    relatedToolSlugs: data.relatedToolSlugs as string[] | undefined,
    relatedSlugs: data.relatedSlugs as string[] | undefined,
    content,
  };
}

export function getAllPostSlugs(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

function toMeta(post: BlogPost): BlogPostMeta {
  return {
    slug: post.slug,
    title: post.title,
    description: post.description,
    publishedAt: post.publishedAt,
    updatedAt: post.updatedAt,
    category: post.category,
    keywords: post.keywords,
    toolSlug: post.toolSlug,
    relatedToolSlugs: post.relatedToolSlugs,
    relatedSlugs: post.relatedSlugs,
  };
}

export function getAllPosts(): BlogPostMeta[] {
  return getAllPostSlugs()
    .map((slug) => toMeta(parseFile(slug)))
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    );
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  const filePath = path.join(BLOG_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return undefined;
  return parseFile(slug);
}

export function getRelatedPosts(slug: string, limit = 3): BlogPostMeta[] {
  const current = getPostBySlug(slug);
  if (!current) return [];

  const all = getAllPosts().filter((p) => p.slug !== slug);
  const bySlug = new Map(all.map((p) => [p.slug, p]));

  const explicit = (current.relatedSlugs ?? [])
    .map((s) => bySlug.get(s))
    .filter((p): p is BlogPostMeta => Boolean(p));

  const sameCategory = all.filter(
    (p) =>
      p.category === current.category &&
      !explicit.some((e) => e.slug === p.slug),
  );

  return [...explicit, ...sameCategory].slice(0, limit);
}

export type { BlogPost, BlogPostMeta, TocItem } from "./types";
