import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  getAllConversionSlugs,
  getConversionBySlug,
  getRelatedConversions,
} from "@/lib/programmatic/conversions";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  buildMetadata,
  faqJsonLd,
  programmaticSoftwareJsonLd,
  webPageJsonLd,
} from "@/lib/seo";
import { Breadcrumbs } from "@/components/tool/breadcrumbs";
import { FaqSection } from "@/components/tool/faq-section";
import { JsonLd } from "@/components/json-ld";
import { ProgrammaticLinks } from "@/components/programmatic/programmatic-links";
import { AdSlot } from "@/components/ads/ad-slot";
import { getRelatedContentForConversion } from "@/lib/related-content";
import { RelatedContentSection } from "@/components/seo/related-content-section";
import { EditorialMeta } from "@/components/editorial/editorial-meta";
import { ConversionTool } from "@/components/programmatic/conversion-tool";

export function generateStaticParams() {
  return getAllConversionSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = getConversionBySlug(slug);
  if (!page) return {};
  return buildMetadata({
    title: page.seoTitle,
    description: page.metaDescription,
    path: page.path,
    keywords: page.keywords,
    absoluteTitle: true,
    ogTitle: page.title,
  });
}

export default async function ConversionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = getConversionBySlug(slug);
  if (!page) notFound();

  const related = getRelatedConversions(slug);
  const relatedContent = getRelatedContentForConversion(slug);
  const crumbs = [
    { name: "Home", href: "/" },
    { name: "Conversions", href: "/conversions/km-to-miles" },
    { name: page.title, href: page.path },
  ];

  return (
    <article className="container max-w-6xl py-8 md:py-12">
      <JsonLd data={webPageJsonLd({ title: page.title, description: page.description, path: page.path })} />
      <JsonLd
        data={breadcrumbJsonLd(
          crumbs.map((c) => ({ name: c.name, url: absoluteUrl(c.href) })),
        )}
      />
      <JsonLd data={faqJsonLd(page.faqs)} />
      <JsonLd
        data={programmaticSoftwareJsonLd({
          name: page.title,
          description: page.metaDescription,
          url: absoluteUrl(page.path),
        })}
      />

      <Breadcrumbs items={crumbs} />

      <header className="mt-8 space-y-3 border-b border-border/80 pb-8">
        <p className="text-sm font-medium text-muted-foreground">
          Unit conversion
        </p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          {page.title}
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          {page.description}
        </p>
        <EditorialMeta />
      </header>

      <AdSlot format="leaderboard" className="my-8" />

      <section className="tool-surface p-6 md:p-8">
        <ConversionTool
          category={page.category}
          fromUnit={page.fromUnit}
          toUnit={page.toUnit}
          fromLabel={page.fromShort}
          toLabel={page.toShort}
        />
      </section>

      <div className="mt-16 space-y-12">
        <section className="max-w-3xl space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">Introduction</h2>
          <p className="leading-relaxed text-muted-foreground">{page.intro}</p>
        </section>

        <section className="max-w-3xl space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">Formula</h2>
          <p className="rounded-lg border border-border bg-muted/30 px-4 py-3 font-mono text-sm">
            {page.formula}
          </p>
        </section>

        <section className="max-w-3xl space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">Examples</h2>
          <ul className="space-y-2 text-muted-foreground">
            {page.examples.map((ex) => (
              <li key={ex.label} className="flex gap-2">
                <span className="text-foreground">•</span>
                {ex.label}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold tracking-tight">
            Related conversions
          </h2>
          <div className="grid gap-3 sm:grid-cols-3">
            {related.map((r) => (
              <Link
                key={r.slug}
                href={r.path}
                className="rounded-lg border border-border px-4 py-3 text-sm transition-colors hover:bg-muted/40"
              >
                {r.fromShort} → {r.toShort}
              </Link>
            ))}
          </div>
        </section>

        <FaqSection faqs={page.faqs} />

        <ProgrammaticLinks
          relatedPages={related.map((r) => ({ path: r.path, title: r.title }))}
          toolSlugs={page.toolSlugs}
          hubSlug={page.hubSlug}
        />
        <RelatedContentSection bundle={relatedContent} />
      </div>
    </article>
  );
}
