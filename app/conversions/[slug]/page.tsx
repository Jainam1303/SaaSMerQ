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
  getAllQuantityConversionSlugs,
  getQuantityConversionBySlug,
  getQuantityPagesForConversion,
  isQuantityConversionSlug,
} from "@/lib/programmatic/quantity-conversions";
import {
  QuantityConversionView,
  buildQuantityConversionMetadata,
} from "@/components/programmatic/quantity-conversion-page";
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
    ...getAllQuantityConversionSlugs().map((slug) => ({ slug })),
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

  if (isQuantityConversionSlug(slug)) {
    const qty = getQuantityConversionBySlug(slug);
    if (qty) return buildQuantityConversionMetadata(qty);
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

  if (isQuantityConversionSlug(slug)) {
    const qty = getQuantityConversionBySlug(slug);
    if (qty) return <QuantityConversionView page={qty} />;
  }

  const page = getConversionBySlug(slug);
  if (!page) notFound();

  const related = getRelatedConversions(slug);
  const sameCategory = getSameCategoryConversions(slug, 8);
  const popular = getPopularConversions(8).filter((p) => p.slug !== slug);
  const relatedContent = getRelatedContentForConversion(slug);
  const quantityPages = getQuantityPagesForConversion(slug);
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

        <section className="max-w-3xl space-y-5">
          <h2 className="text-2xl font-semibold tracking-tight">
            Real-world uses: why convert {page.fromShort} to {page.toShort}?
          </h2>
          <p className="leading-relaxed text-muted-foreground">
            {page.realWorldUses.why}
          </p>
          {page.useCases.length > 0 && (
            <ul className="space-y-2 text-muted-foreground">
              {page.useCases.map((useCase) => (
                <li key={useCase} className="flex gap-2">
                  <span className="text-foreground">•</span>
                  {useCase}
                </li>
              ))}
            </ul>
          )}
          {page.realWorldUses.whoUsesIt.length > 0 && (
            <div className="space-y-3 pt-2">
              <h3 className="text-sm font-semibold">
                Who uses this conversion?
              </h3>
              <div className="flex flex-wrap gap-2">
                {page.realWorldUses.whoUsesIt.map((role) => (
                  <span
                    key={role}
                    className="rounded-full border border-border/70 bg-muted/30 px-3 py-1 text-sm text-muted-foreground"
                  >
                    {role}
                  </span>
                ))}
              </div>
            </div>
          )}
        </section>

        <section className="max-w-3xl space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">
            How the {page.fromShort} to {page.toShort} conversion is calculated
          </h2>
          <p className="leading-relaxed text-muted-foreground">
            This is the same arithmetic that calculators and search engines use
            — no rounded shortcuts.
          </p>
          <p className="rounded-lg border border-border bg-muted/30 px-4 py-3 font-mono text-sm">
            {page.formula}
          </p>
          <ol className="list-decimal space-y-2 pl-5 text-muted-foreground">
            {page.howCalculated.steps.map((step) => (
              <li key={step} className="pl-1 leading-relaxed">
                {step}
              </li>
            ))}
          </ol>
          <p className="text-sm leading-relaxed text-muted-foreground">
            <span className="font-medium text-foreground">Precision:</span>{" "}
            {page.howCalculated.precision}
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
            {page.fromShort} to {page.toShort} quick reference table
          </h2>
          <p className="max-w-2xl text-muted-foreground">
            Common {page.fromShort} values converted to {page.toShort}, each
            calculated with the exact factor.
          </p>
          <div className="max-w-md overflow-hidden rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-left">
                  <th className="px-4 py-2 font-medium">{page.fromShort}</th>
                  <th className="px-4 py-2 font-medium">{page.toShort}</th>
                </tr>
              </thead>
              <tbody>
                {page.quickReference.map((row) => (
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

        <section className="max-w-3xl space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">
            Common questions about {page.categoryLabel.toLowerCase()} conversions
          </h2>
          <div className="space-y-3">
            {page.commonQuestions.map((q) => (
              <div
                key={q.question}
                className="rounded-lg border border-border/70 bg-muted/20 p-4"
              >
                <p className="font-medium">{q.question}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {q.answer}
                </p>
              </div>
            ))}
          </div>
        </section>

        {page.unitHistory.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight">
              History of these units
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {page.unitHistory.map((h) => (
                <div
                  key={h.name}
                  className="rounded-lg border border-border/70 p-5"
                >
                  <h3 className="text-base font-semibold capitalize">
                    History of the {h.name}
                  </h3>
                  <p className="mt-1 text-xs uppercase tracking-wide text-muted-foreground">
                    {h.system}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {h.text}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {quantityPages.length > 0 && (
          <section>
            <h2 className="mb-4 text-2xl font-semibold tracking-tight">
              Popular {page.fromShort} to {page.toShort} amounts
            </h2>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {quantityPages.map((q) => (
                <Link
                  key={q.slug}
                  href={q.path}
                  className="rounded-md border border-border/70 px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/40 hover:text-foreground"
                >
                  {q.quantity} {q.fromShort} → {q.toShort}
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

        <section
          aria-label="Related measurement guides"
          className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm md:p-8"
        >
          <p className="section-eyebrow">Learn more</p>
          <h2 className="mb-6 text-xl font-semibold tracking-tight">
            Related measurement guides
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <h3 className="mb-3 text-sm font-semibold">Conversion hub</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link
                    href={categoryPath}
                    className="inline-flex items-center gap-1 transition-colors hover:text-foreground"
                  >
                    All {page.categoryLabel.toLowerCase()} converters
                  </Link>
                </li>
                <li>
                  <Link
                    href="/conversions"
                    className="inline-flex items-center gap-1 transition-colors hover:text-foreground"
                  >
                    All conversion categories
                  </Link>
                </li>
              </ul>
            </div>
            {relatedContent.guides.length > 0 && (
              <div>
                <h3 className="mb-3 text-sm font-semibold">Guides</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {relatedContent.guides.map((g) => (
                    <li key={g.path}>
                      <Link
                        href={g.path}
                        className="inline-flex items-center gap-1 transition-colors hover:text-foreground"
                      >
                        {g.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {relatedContent.blogs.length > 0 && (
              <div>
                <h3 className="mb-3 text-sm font-semibold">Articles</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {relatedContent.blogs.map((b) => (
                    <li key={b.path}>
                      <Link
                        href={b.path}
                        className="inline-flex items-center gap-1 transition-colors hover:text-foreground"
                      >
                        {b.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {relatedContent.tools.length > 0 && (
              <div>
                <h3 className="mb-3 text-sm font-semibold">Related tools</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {relatedContent.tools.map((t) => (
                    <li key={t.path}>
                      <Link
                        href={t.path}
                        className="inline-flex items-center gap-1 transition-colors hover:text-foreground"
                      >
                        {t.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>

        <ProgrammaticLinks
          relatedPages={related.map((r) => ({ path: r.path, title: r.title }))}
          toolSlugs={page.toolSlugs}
          hubSlug={page.hubSlug}
        />
      </div>
    </article>
  );
}
