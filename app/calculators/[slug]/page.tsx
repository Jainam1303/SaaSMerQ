import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  getAllCalculatorSlugs,
  getCalculatorBySlug,
  getRelatedCalculators,
} from "@/data/programmatic/calculators";
import { getGuideBySlug } from "@/lib/programmatic/guides";
import { getToolBySlug } from "@/data/tools";
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
import { ToolRunner } from "@/components/tools/tool-runner";
import { getRelatedContentForCalculator } from "@/lib/related-content";
import { RelatedContentSection } from "@/components/seo/related-content-section";
import { EditorialMeta } from "@/components/editorial/editorial-meta";
import { AdSlot } from "@/components/ads/ad-slot";

export function generateStaticParams() {
  return getAllCalculatorSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = getCalculatorBySlug(slug);
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

export default async function CalculatorLandingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = getCalculatorBySlug(slug);
  if (!page) notFound();

  const tool = getToolBySlug(page.toolSlug);
  const related = getRelatedCalculators(slug);
  const guideLinks = page.relatedGuideSlugs
    .map((s) => getGuideBySlug(s))
    .filter((g): g is NonNullable<typeof g> => Boolean(g));

  const relatedContent = getRelatedContentForCalculator(slug);

  const crumbs = [
    { name: "Home", href: "/" },
    { name: "Calculators", href: "/calculators/home-loan-calculator" },
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
      {tool && (
        <JsonLd
          data={programmaticSoftwareJsonLd({
            name: tool.name,
            description: tool.metaDescription,
            url: absoluteUrl(`/tools/${tool.slug}`),
          })}
        />
      )}

      <Breadcrumbs items={crumbs} />

      <header className="mt-8 space-y-3 border-b border-border/80 pb-8">
        <p className="text-sm font-medium text-muted-foreground">Calculator</p>
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
        <ToolRunner slug={page.toolSlug} />
      </section>

      <div className="mt-16 space-y-12">
        <section className="max-w-3xl space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">Overview</h2>
          <p className="leading-relaxed text-muted-foreground">{page.intro}</p>
        </section>

        <section className="max-w-3xl space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">Examples</h2>
          <ul className="space-y-3">
            {page.examples.map((ex) => (
              <li
                key={ex.label}
                className="rounded-lg border border-border px-4 py-3"
              >
                <p className="font-medium">{ex.label}</p>
                <p className="text-sm text-muted-foreground">{ex.detail}</p>
              </li>
            ))}
          </ul>
        </section>

        {guideLinks.length > 0 && (
          <section>
            <h2 className="mb-4 text-2xl font-semibold tracking-tight">
              Related guides
            </h2>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {guideLinks.map((g) => (
                <li key={g.slug}>
                  <Link
                    href={g.path}
                    className="transition-colors hover:text-foreground"
                  >
                    {g.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section>
          <h2 className="mb-4 text-2xl font-semibold tracking-tight">
            Related calculators
          </h2>
          <div className="grid gap-3 sm:grid-cols-3">
            {related.map((r) => (
              <Link
                key={r.slug}
                href={r.path}
                className="rounded-lg border border-border px-4 py-3 text-sm transition-colors hover:bg-muted/40"
              >
                {r.title}
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
