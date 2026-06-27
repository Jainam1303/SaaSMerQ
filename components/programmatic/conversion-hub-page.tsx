import Link from "next/link";
import { ArrowRight, ArrowRightLeft } from "lucide-react";
import type { Metadata } from "next";
import type { ConversionHub } from "@/lib/programmatic/types";
import {
  getConversionBySlug,
  getConversionsByCategory,
} from "@/lib/programmatic/conversions";
import { getToolBySlug } from "@/data/tools";
import { getGuideBySlug } from "@/lib/programmatic/guides";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  buildMetadata,
  collectionPageJsonLd,
  faqJsonLd,
  itemListJsonLd,
} from "@/lib/seo";
import { Breadcrumbs } from "@/components/tool/breadcrumbs";
import { FaqSection } from "@/components/tool/faq-section";
import { JsonLd } from "@/components/json-ld";
import { EditorialMeta } from "@/components/editorial/editorial-meta";

export function buildConversionHubMetadata(hub: ConversionHub): Metadata {
  return buildMetadata({
    title: hub.seoTitle,
    description: hub.metaDescription,
    path: hub.path,
    keywords: hub.keywords,
    absoluteTitle: true,
    ogTitle: hub.title,
  });
}

export function ConversionHubPage({ hub }: { hub: ConversionHub }) {
  const allConversions = getConversionsByCategory(hub.category);

  const popular = hub.popularSlugs
    .map((slug) => getConversionBySlug(slug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  const tools = hub.relatedToolSlugs
    .map((slug) => getToolBySlug(slug))
    .filter((t): t is NonNullable<typeof t> => Boolean(t));

  const guides = hub.relatedGuideSlugs
    .map((slug) => getGuideBySlug(slug))
    .filter((g): g is NonNullable<typeof g> => Boolean(g));

  const crumbs = [
    { name: "Home", href: "/" },
    { name: "Conversions", href: "/conversions" },
    { name: hub.label, href: hub.path },
  ];

  return (
    <article className="container max-w-6xl py-8 md:py-12">
      <JsonLd
        data={collectionPageJsonLd({
          title: hub.title,
          description: hub.description,
          path: hub.path,
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd(
          crumbs.map((c) => ({ name: c.name, url: absoluteUrl(c.href) })),
        )}
      />
      <JsonLd
        data={itemListJsonLd(
          allConversions.map((c) => ({ name: c.title, path: c.path })),
          `${hub.label} conversions`,
        )}
      />
      <JsonLd data={faqJsonLd(hub.faqs)} />

      <Breadcrumbs items={crumbs} />

      <header className="mt-8 space-y-3 border-b border-border/80 pb-8">
        <p className="text-sm font-medium text-muted-foreground">
          Conversion hub
        </p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          {hub.title}
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          {hub.description}
        </p>
        <EditorialMeta />
      </header>

      <div className="mt-12 space-y-12">
        <section className="max-w-3xl space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">
            About {hub.label.toLowerCase()} conversions
          </h2>
          {hub.intro.map((para, i) => (
            <p key={i} className="leading-relaxed text-muted-foreground">
              {para}
            </p>
          ))}
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">
            Key formulas
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {hub.formulas.map((f) => (
              <div
                key={f.label}
                className="rounded-lg border border-border bg-muted/30 px-4 py-3"
              >
                <p className="text-sm font-medium">{f.label}</p>
                <p className="mt-1 font-mono text-sm text-muted-foreground">
                  {f.expression}
                </p>
              </div>
            ))}
          </div>
        </section>

        {popular.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight">
              Popular {hub.label.toLowerCase()} conversions
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {popular.map((c) => (
                <Link
                  key={c.slug}
                  href={c.path}
                  className="group flex items-center justify-between gap-3 rounded-lg border border-border px-4 py-3 text-sm transition-colors hover:border-foreground/20 hover:bg-muted/40"
                >
                  <span className="inline-flex items-center gap-2">
                    <ArrowRightLeft className="size-4 text-muted-foreground" />
                    {c.fromShort} to {c.toShort}
                  </span>
                  <ArrowRight className="size-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">
            Worked examples
          </h2>
          <ul className="space-y-2 text-muted-foreground">
            {hub.examples.map((ex) => (
              <li key={ex} className="flex gap-2">
                <span className="text-foreground">•</span>
                {ex}
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">
            All {hub.label.toLowerCase()} converters
          </h2>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {allConversions.map((c) => (
              <Link
                key={c.slug}
                href={c.path}
                className="rounded-md border border-border/70 px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/40 hover:text-foreground"
              >
                {c.fromShort} → {c.toShort}
              </Link>
            ))}
          </div>
        </section>

        {(tools.length > 0 || guides.length > 0) && (
          <section className="grid gap-8 border-t border-border/60 pt-10 md:grid-cols-2">
            {tools.length > 0 && (
              <div>
                <h2 className="mb-3 text-sm font-semibold">Related tools</h2>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {tools.map((t) => (
                    <li key={t.slug}>
                      <Link
                        href={`/tools/${t.slug}`}
                        className="inline-flex items-center gap-1 transition-colors hover:text-foreground"
                      >
                        {t.name}
                        <ArrowRight className="size-3.5" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {guides.length > 0 && (
              <div>
                <h2 className="mb-3 text-sm font-semibold">Related guides</h2>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {guides.map((g) => (
                    <li key={g.slug}>
                      <Link
                        href={g.path}
                        className="inline-flex items-center gap-1 transition-colors hover:text-foreground"
                      >
                        {g.title}
                        <ArrowRight className="size-3.5" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        )}

        <FaqSection faqs={hub.faqs} />
      </div>
    </article>
  );
}
