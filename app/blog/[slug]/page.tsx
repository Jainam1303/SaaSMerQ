import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Calendar } from "lucide-react";
import {
  extractToc,
  getAllPostSlugs,
  getPostBySlug,
} from "@/lib/blog";
import { getToolBySlug } from "@/data/tools";
import {
  getRelatedPostsForBlog,
  getRelatedToolsForPost,
} from "@/lib/internal-links";
import { getHubsForBlog, getHubsForTool } from "@/lib/hubs";
import {
  absoluteUrl,
  articleJsonLd,
  breadcrumbJsonLd,
  buildMetadata,
  faqJsonLd,
} from "@/lib/seo";
import { Breadcrumbs } from "@/components/tool/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { BlogContent } from "@/components/blog/blog-content";
import { BlogToc } from "@/components/blog/blog-toc";
import {
  RelatedPosts,
  ToolCta,
} from "@/components/blog/related-posts";
import { RelatedTools } from "@/components/tool/related-tools";
import { getRelatedContentForBlog } from "@/lib/related-content";
import { RelatedContentSection } from "@/components/seo/related-content-section";
import { EditorialMeta } from "@/components/editorial/editorial-meta";
import { HubLinks } from "@/components/hub/hub-links";
import { FaqSection } from "@/components/tool/faq-section";

interface PageProps {
  params: Promise<{ slug: string }>;
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-IN", { dateStyle: "long" }).format(
    new Date(date),
  );
}

export function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  return buildMetadata({
    title: post.title,
    description: post.description,
    path: `/blog/${post.slug}`,
    keywords: post.keywords,
    ogType: "article",
    ogTitle: post.title,
  });
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const tool = getToolBySlug(post.toolSlug);
  const toc = extractToc(post.content);
  const relatedTools = getRelatedToolsForPost(slug, 3);
  const related = getRelatedPostsForBlog(slug, 2);
  const hubs = [
    ...getHubsForBlog(slug),
    ...(tool ? getHubsForTool(tool.slug) : []),
  ].filter((h, i, arr) => arr.findIndex((x) => x.slug === h.slug) === i);

  const relatedContent = getRelatedContentForBlog(slug);

  const crumbs = [
    { name: "Home", href: "/" },
    { name: "Blog", href: "/blog" },
    { name: post.title, href: `/blog/${post.slug}` },
  ];

  return (
    <article className="container max-w-6xl py-8 md:py-12 lg:py-14">
      <JsonLd
        data={articleJsonLd({
          title: post.title,
          description: post.description,
          slug: post.slug,
          publishedAt: post.publishedAt,
          updatedAt: post.updatedAt,
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd(
          crumbs.map((c) => ({ name: c.name, url: absoluteUrl(c.href) })),
        )}
      />
      {post.faqs?.length ? <JsonLd data={faqJsonLd(post.faqs)} /> : null}

      <Breadcrumbs items={crumbs} />

      <header className="mt-8 max-w-3xl space-y-4 border-b border-border/80 pb-8">
        <p className="section-eyebrow">{post.category}</p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-[2.75rem] lg:leading-tight">
          {post.title}
        </h1>
        <p className="text-lg leading-relaxed text-muted-foreground">
          {post.description}
        </p>
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Calendar className="size-4" aria-hidden />
          <time dateTime={post.publishedAt}>
            Published {formatDate(post.publishedAt)}
          </time>
        </div>
        <EditorialMeta
          lastUpdated={post.updatedAt ?? post.publishedAt}
        />
      </header>

      <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_240px] lg:gap-12">
        <div className="min-w-0 space-y-10">
          {tool && (
            <ToolCta toolSlug={tool.slug} toolName={tool.name} />
          )}
          <BlogContent content={post.content} />
          {post.faqs?.length ? (
            <FaqSection faqs={post.faqs} title="Frequently asked questions" />
          ) : null}
          {tool && (
            <ToolCta toolSlug={tool.slug} toolName={tool.name} />
          )}
        </div>
        <aside className="hidden lg:block">
          <BlogToc items={toc} />
        </aside>
      </div>

      {toc.length > 0 && (
        <div className="mt-10 lg:hidden">
          <BlogToc items={toc} />
        </div>
      )}

      <div className="mt-16 space-y-16 border-t border-border/80 pt-16">
        {hubs.length > 0 && <HubLinks hubs={hubs} />}
        {relatedTools.length > 0 && (
          <RelatedTools tools={relatedTools} />
        )}
        <RelatedPosts posts={related} />
        <RelatedContentSection bundle={relatedContent} />
      </div>
    </article>
  );
}
