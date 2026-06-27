import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  getAllConversionSlugs,
  getConversionBySlug,
  getRelatedConversions,
  getSameCategoryConversions,
  getPopularConversions,
} from "@/lib/programmatic/conversions";
import {
  getAllConversionHubSlugs,
  getConversionHub,
  isConversionCategory,
} from "@/lib/programmatic/conversion-hubs";
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
import {
  ConversionHubPage,
  buildConversionHubMetadata,
} from "@/components/programmatic/conversion-hub-page";

export function generateStaticParams() {
  return [
    ...getAllConversionHubSlugs().map((slug) => ({ slug })),
    ...getAllConversionSlugs().map((slug) => ({ slug })),
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  if (isConversionCategory(slug)) {
    const hub = getConversionHub(slug);
    if (hub) return buildConversionHubMetadata(hub);
  }

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

  if (isConversionCategory(slug)) {
    const hub = getConversionHub(slug);
    if (hub) return <ConversionHubPage hub={hub} />;
  }

  const page = getConversionBySlug(slug);
  if (!page) notFound();

  const related = getRelatedConversions(slug);
  const sameCategory = getSameCategoryConversions(slug, 8);
  const popular = getPopularConversions(8).filter((p) => p.slug !== slug);
  const relatedContent = getRelatedContentForConversion(slug);
  const categoryPath = `/conversions/${page.category}`;

  const crumbs = [
    { name: "Home", href: "/" },
    { name: "Conversions", href: "/conversions" },
    { name: page.categoryLabel, href: categoryPath },
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
        <Link
          href={categoryPath}
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          {page.categoryLabel} conversion
        </Link>
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
          <h2 className="text-2xl font-semibold tracking-tight">
            What is {page.fromShort} to {page.toShort}?
          </h2>
          <p className="leading-relaxed text-muted-foreground">{page.whatIs}</p>
        </section>

        <section className="max-w-3xl space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">Formula</h2>
          <p className="rounded-lg border border-border bg-muted/30 px-4 py-3 font-mono text-sm">
            {page.formula}
          </p>
        </section>

        <section className="max-w-3xl space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">
            Example calculations
          </h2>
          <ul className="space-y-2 text-muted-foreground">
            {page.examples.map((ex) => (
              <li key={ex.label} className="flex gap-2">
                <span className="text-foreground">•</span>
                {ex.label}
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">
            {page.fromShort} to {page.toShort} conversion table
          </h2>
          <div className="max-w-md overflow-hidden rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-left">
                  <th className="px-4 py-2 font-medium">{page.fromShort}</th>
                  <th className="px-4 py-2 font-medium">{page.toShort}</th>
                </tr>
              </thead>
              <tbody>
                {page.conversionTable.map((row) => (
                  <tr
                    key={row.input}
                    className="border-b border-border/60 last:border-0"
                  >
                    <td className="px-4 py-2">{row.input}</td>
                    <td className="px-4 py-2 text-muted-foreground">
                      {row.output}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="max-w-3xl space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">
            Common mistakes to avoid
          </h2>
          <ul className="space-y-2 text-muted-foreground">
            {page.commonMistakes.map((mistake) => (
              <li key={mistake} className="flex gap-2">
                <span className="text-foreground">•</span>
                {mistake}
              </li>
            ))}
          </ul>
        </section>

        {related.length > 0 && (
          <section>
            <h2 className="mb-4 text-2xl font-semibold tracking-tight">
              Related converters
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
        )}

        {sameCategory.length > 0 && (
          <section>
            <h2 className="mb-4 text-2xl font-semibold tracking-tight">
              More {page.categoryLabel.toLowerCase()} conversions
            </h2>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {sameCategory.map((r) => (
                <Link
                  key={r.slug}
                  href={r.path}
                  className="rounded-md border border-border/70 px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/40 hover:text-foreground"
                >
                  {r.fromShort} → {r.toShort}
                </Link>
              ))}
            </div>
            <p className="mt-4 text-sm">
              <Link
                href={categoryPath}
                className="font-medium text-foreground underline-offset-4 hover:underline"
              >
                View all {page.categoryLabel.toLowerCase()} converters →
              </Link>
            </p>
          </section>
        )}

        {popular.length > 0 && (
          <section>
            <h2 className="mb-4 text-2xl font-semibold tracking-tight">
              Popular conversions
            </h2>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {popular.map((r) => (
                <Link
                  key={r.slug}
                  href={r.path}
                  className="rounded-md border border-border/70 px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/40 hover:text-foreground"
                >
                  {r.fromShort} → {r.toShort}
                </Link>
              ))}
            </div>
          </section>
        )}

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
