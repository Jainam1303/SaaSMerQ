import Link from "next/link";
import type { Metadata } from "next";
import type { QuantityConversionPage } from "@/lib/programmatic/types";
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
import { RelatedContentSection } from "@/components/seo/related-content-section";
import { EditorialMeta } from "@/components/editorial/editorial-meta";
import { ConversionTool } from "@/components/programmatic/conversion-tool";
import { getRelatedContentForConversion } from "@/lib/related-content";
import {
  getConversionBySlug,
  getRelatedConversions,
} from "@/lib/programmatic/conversions";
import { getSiblingQuantityPages } from "@/lib/programmatic/quantity-conversions";

export function buildQuantityConversionMetadata(
  page: QuantityConversionPage,
): Metadata {
  return buildMetadata({
    title: page.seoTitle,
    description: page.metaDescription,
    path: page.path,
    keywords: page.keywords,
    absoluteTitle: true,
    ogTitle: `${page.heading} (exact answer)`,
  });
}

export function QuantityConversionView({
  page,
}: {
  page: QuantityConversionPage;
}) {
  const base = getConversionBySlug(page.baseSlug);
  const siblings = getSiblingQuantityPages(page.slug, 12);
  const related = getRelatedConversions(page.baseSlug, 5);
  const relatedContent = getRelatedContentForConversion(page.baseSlug);
  const categoryPath = `/conversions/${page.category}`;
  const basePath = `/conversions/${page.baseSlug}`;

  const crumbs = [
    { name: "Home", href: "/" },
    { name: "Conversions", href: "/conversions" },
    { name: page.categoryLabel, href: categoryPath },
    { name: page.heading, href: page.path },
  ];

  return (
    <article className="container max-w-6xl py-8 md:py-12">
      <JsonLd
        data={webPageJsonLd({
          title: page.heading,
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
          name: page.heading,
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
          {page.heading}
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground">{page.intro}</p>
        <EditorialMeta />
      </header>

      <section className="mt-8 rounded-2xl border border-border bg-muted/30 p-6 text-center md:p-10">
        <p className="text-sm uppercase tracking-wide text-muted-foreground">
          {page.quantity} {page.fromShort} equals
        </p>
        <p className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
          {page.result} {page.toShort}
        </p>
      </section>

      <div className="mt-16 space-y-12">
        <section className="max-w-3xl space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">
            How {page.quantity} {page.fromShort} converts to {page.toShort}
          </h2>
          <p className="leading-relaxed text-muted-foreground">
            {page.explanation}
          </p>
          <p className="rounded-lg border border-border bg-muted/30 px-4 py-3 font-mono text-sm">
            {page.formula}
          </p>
          <p className="leading-relaxed text-muted-foreground">
            {page.example}
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">
            Convert another {page.fromShort} value
          </h2>
          <div className="tool-surface p-6 md:p-8">
            <ConversionTool
              category={page.category}
              fromUnit={page.fromUnit}
              toUnit={page.toUnit}
              fromLabel={page.fromShort}
              toLabel={page.toShort}
            />
          </div>
          <p className="text-sm">
            <Link
              href={basePath}
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              Open the full {page.fromShort} to {page.toShort} converter →
            </Link>
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">
            {page.fromShort} to {page.toShort} reference table
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
                {page.nearbyTable.map((row) => {
                  const rowPath = `/conversions/${row.input}-${page.baseSlug}`;
                  const isCurrent = row.input === page.quantity;
                  return (
                    <tr
                      key={row.input}
                      className={`border-b border-border/60 last:border-0 ${
                        isCurrent ? "bg-muted/40 font-medium" : ""
                      }`}
                    >
                      <td className="px-4 py-2">
                        {isCurrent ? (
                          row.input
                        ) : (
                          <Link
                            href={rowPath}
                            className="text-foreground underline-offset-4 hover:underline"
                          >
                            {row.input}
                          </Link>
                        )}
                      </td>
                      <td className="px-4 py-2 text-muted-foreground">
                        {row.output}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {siblings.length > 0 && (
          <section>
            <h2 className="mb-4 text-2xl font-semibold tracking-tight">
              Other {page.fromShort} to {page.toShort} amounts
            </h2>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {siblings.map((s) => (
                <Link
                  key={s.slug}
                  href={s.path}
                  className="rounded-md border border-border/70 px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/40 hover:text-foreground"
                >
                  {s.quantity} {s.fromShort} → {s.toShort}
                </Link>
              ))}
            </div>
          </section>
        )}

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

        <FaqSection faqs={page.faqs} />

        <ProgrammaticLinks
          relatedPages={[
            ...(base
              ? [{ path: basePath, title: `${base.title}` }]
              : []),
            ...related.map((r) => ({ path: r.path, title: r.title })),
          ]}
          toolSlugs={page.toolSlugs}
          hubSlug={page.hubSlug}
        />
        <RelatedContentSection bundle={relatedContent} />
      </div>
    </article>
  );
}
