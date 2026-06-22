import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getAllGuideSlugs,
  getGuideBySlug,
  getRelatedGuides,
} from "@/lib/programmatic/guides";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  buildMetadata,
  faqJsonLd,
  guideArticleJsonLd,
  webPageJsonLd,
} from "@/lib/seo";
import { Breadcrumbs } from "@/components/tool/breadcrumbs";
import { FaqSection } from "@/components/tool/faq-section";
import { JsonLd } from "@/components/json-ld";
import { ProgrammaticLinks } from "@/components/programmatic/programmatic-links";
import { BlogContent } from "@/components/blog/blog-content";
import { AdSlot } from "@/components/ads/ad-slot";

export function generateStaticParams() {
  return getAllGuideSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = getGuideBySlug(slug);
  if (!page) return {};
  return buildMetadata({
    title: page.seoTitle,
    description: page.metaDescription,
    path: page.path,
    keywords: page.keywords,
    ogType: "article",
    absoluteTitle: true,
    ogTitle: page.title,
  });
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = getGuideBySlug(slug);
  if (!page) notFound();

  const related = getRelatedGuides(slug);
  const crumbs = [
    { name: "Home", href: "/" },
    { name: "Guides", href: "/guides/how-to-calculate-emi" },
    { name: page.title, href: page.path },
  ];

  return (
    <article className="container max-w-6xl py-8 md:py-12">
      <JsonLd
        data={webPageJsonLd({
          title: page.title,
          description: page.description,
          path: page.path,
        })}
      />
      <JsonLd
        data={guideArticleJsonLd({
          title: page.title,
          description: page.description,
          slug: page.slug,
          publishedAt: page.publishedAt,
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd(
          crumbs.map((c) => ({ name: c.name, url: absoluteUrl(c.href) })),
        )}
      />
      <JsonLd data={faqJsonLd(page.faqs)} />

      <Breadcrumbs items={crumbs} />

      <header className="mt-8 space-y-3 border-b border-border/80 pb-8">
        <p className="text-sm font-medium text-muted-foreground">
          {page.category} guide
        </p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          {page.title}
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          {page.description}
        </p>
      </header>

      <AdSlot format="leaderboard" className="my-8" />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <BlogContent content={page.content} />
      </div>

      <div className="mt-16 space-y-12">
        <FaqSection faqs={page.faqs} />

        <ProgrammaticLinks
          relatedPages={related.map((r) => ({
            path: r.path,
            title: r.title,
          }))}
          toolSlugs={page.toolSlugs}
          hubSlug={page.hubSlug}
        />
      </div>
    </article>
  );
}
