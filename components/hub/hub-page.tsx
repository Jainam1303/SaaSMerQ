import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Hub } from "@/lib/hubs/types";
import { getHubBySlug } from "@/lib/hubs";
import { getToolBySlug } from "@/data/tools";
import { getPostBySlug } from "@/lib/blog";
import { categoryMap } from "@/data/tools/categories";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  faqJsonLd,
  buildMetadata,
} from "@/lib/seo";
import type { Metadata } from "next";
import { Icon } from "@/components/icon";
import { Breadcrumbs } from "@/components/tool/breadcrumbs";
import { ToolCard } from "@/components/tool/tool-card";
import { BlogCard } from "@/components/blog/blog-card";
import { BlogContent } from "@/components/blog/blog-content";
import { FaqSection } from "@/components/tool/faq-section";
import { JsonLd } from "@/components/json-ld";

export function buildHubMetadata(hub: Hub): Metadata {
  return buildMetadata({
    title: hub.seoTitle,
    description: hub.metaDescription,
    path: hub.path,
    keywords: hub.keywords,
    absoluteTitle: true,
    ogTitle: hub.title,
  });
}

export function HubPage({ hub }: { hub: Hub }) {
  const tools = hub.toolSlugs
    .map((slug) => getToolBySlug(slug))
    .filter((t): t is NonNullable<typeof t> => Boolean(t));

  const posts = hub.blogSlugs
    .map((slug) => getPostBySlug(slug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  const relatedHubs = hub.relatedHubSlugs
    .map((slug) => getHubBySlug(slug))
    .filter((h): h is Hub => Boolean(h));

  const crumbs = [
    { name: "Home", href: "/" },
    { name: hub.title, href: hub.path },
  ];

  return (
    <article className="container max-w-6xl py-8 md:py-12 lg:py-14">
      <JsonLd
        data={breadcrumbJsonLd(
          crumbs.map((c) => ({ name: c.name, url: absoluteUrl(c.href) })),
        )}
      />
      <JsonLd data={faqJsonLd(hub.faqs)} />

      <Breadcrumbs items={crumbs} />

      <header className="mt-8 flex flex-col gap-6 border-b border-border/80 pb-8 sm:flex-row sm:items-start">
        <span className="flex size-16 shrink-0 items-center justify-center rounded-2xl border border-border/80 bg-muted/40 shadow-sm">
          <Icon name={hub.icon} className="size-8" />
        </span>
        <div className="space-y-3 max-w-3xl">
          <p className="section-eyebrow">Authority hub</p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-[2.75rem] lg:leading-tight">
            {hub.title}
          </h1>
          <p className="text-lg leading-relaxed text-muted-foreground">
            {hub.description}
          </p>
        </div>
      </header>

      <div className="mt-12 max-w-3xl">
        <BlogContent content={hub.content} />
      </div>

      {hub.categorySummaries.length > 0 && (
        <section className="mt-16 space-y-8">
          <div className="space-y-2">
            <p className="section-eyebrow">Browse by category</p>
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
              Platform categories
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {hub.categorySummaries.map((item) => {
              const category = categoryMap[item.slug];
              return (
                <Link
                  key={item.slug}
                  href={`/category/${item.slug}`}
                  className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm transition-all hover:border-foreground/15 hover:shadow-premium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex size-10 items-center justify-center rounded-lg border border-border/80 bg-muted/50">
                      <Icon name={category.icon} className="size-5" />
                    </span>
                    <h3 className="font-semibold tracking-tight">
                      {category.name}
                    </h3>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {item.summary}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {tools.length > 0 && (
        <section className="mt-16 space-y-8" aria-labelledby="hub-tools-heading">
          <div className="space-y-2">
            <p className="section-eyebrow">Free tools</p>
            <h2
              id="hub-tools-heading"
              className="text-2xl font-semibold tracking-tight md:text-3xl"
            >
              Tools in this collection
            </h2>
            <p className="max-w-2xl text-muted-foreground leading-relaxed">
              Open any calculator below — instant results in your browser, no
              sign-up required.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((tool) => <ToolCard key={tool.slug} tool={tool} />)}
          </div>
        </section>
      )}

      {posts.length > 0 && (
        <section className="mt-16 space-y-8" aria-labelledby="hub-blog-heading">
          <div className="space-y-2">
            <p className="section-eyebrow">Guides</p>
            <h2
              id="hub-blog-heading"
              className="text-2xl font-semibold tracking-tight md:text-3xl"
            >
              Related articles
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <BlogCard
                key={post.slug}
                post={{
                  slug: post.slug,
                  title: post.title,
                  description: post.description,
                  publishedAt: post.publishedAt,
                  updatedAt: post.updatedAt,
                  category: post.category,
                  keywords: post.keywords,
                  toolSlug: post.toolSlug,
                  relatedSlugs: post.relatedSlugs,
                  relatedToolSlugs: post.relatedToolSlugs,
                }}
              />
            ))}
          </div>
        </section>
      )}

      {relatedHubs.length > 0 && (
        <section className="mt-16 space-y-6">
          <div className="space-y-2">
            <p className="section-eyebrow">More hubs</p>
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
              Explore related collections
            </h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {relatedHubs.map((related) => (
              <Link
                key={related.slug}
                href={related.path}
                className="group flex items-center justify-between gap-4 rounded-2xl border border-border/80 bg-muted/20 p-5 transition-all hover:border-foreground/15 hover:bg-muted/40"
              >
                <div>
                  <h3 className="font-semibold tracking-tight group-hover:text-foreground">
                    {related.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                    {related.description}
                  </p>
                </div>
                <ArrowRight className="size-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="mt-16">
        <FaqSection faqs={hub.faqs} />
      </div>
    </article>
  );
}
