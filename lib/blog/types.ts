export interface BlogFaqItem {
  question: string;
  answer: string;
}

export interface BlogPostFrontmatter {
  title: string;
  description: string;
  publishedAt: string;
  updatedAt?: string;
  category: string;
  keywords: string[];
  /** Primary tool to promote in the article CTA. */
  toolSlug: string;
  /** Optional explicit related tool slugs (shown besides primary tool). */
  relatedToolSlugs?: string[];
  /** Optional explicit related article slugs. */
  relatedSlugs?: string[];
  /** Optional FAQs for on-page content and FAQ schema. */
  faqs?: BlogFaqItem[];
}

export interface BlogPostMeta extends BlogPostFrontmatter {
  slug: string;
}

export interface BlogPost extends BlogPostMeta {
  content: string;
}

export interface TocItem {
  id: string;
  text: string;
  level: number;
}
