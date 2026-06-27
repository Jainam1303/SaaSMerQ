import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { getAllConversionHubs } from "@/lib/programmatic/conversion-hubs";
import {
  getConversionsByCategory,
  getPopularConversions,
} from "@/lib/programmatic/conversions";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  buildMetadata,
  collectionPageJsonLd,
} from "@/lib/seo";
import { Breadcrumbs } from "@/components/tool/breadcrumbs";
import { JsonLd } from "@/components/json-ld";
import { EditorialMeta } from "@/components/editorial/editorial-meta";

const TITLE = "Unit Converters — Length, Weight, Volume, Area & More";
const DESCRIPTION =
  "Free, instant unit converters for length, weight, temperature, volume, area, speed, time and digital storage — each with formulas, tables and examples.";

export function generateMetadata(): Metadata {
  return buildMetadata({
    title: `${TITLE} | MerQPrime`,
    description: DESCRIPTION,
    path: "/conversions",
    keywords: [
      "unit converter",
      "online converter",
      "measurement converter",
      "length weight volume converter",
    ],
    absoluteTitle: true,
    ogTitle: "Unit Converters",
  });
}

export default function ConversionsIndexPage() {
  const hubs = getAllConversionHubs();
  const popular = getPopularConversions(12);

  const crumbs = [
    { name: "Home", href: "/" },
    { name: "Conversions", href: "/conversions" },
  ];

  return (
    <article className="container max-w-6xl py-8 md:py-12">
      <JsonLd
        data={collectionPageJsonLd({
          title: TITLE,
          description: DESCRIPTION,
          path: "/conversions",
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd(
          crumbs.map((c) => ({ name: c.name, url: absoluteUrl(c.href) })),
        )}
      />

      <Breadcrumbs items={crumbs} />

      <header className="mt-8 space-y-3 border-b border-border/80 pb-8">
        <p className="text-sm font-medium text-muted-foreground">Conversions</p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          {TITLE}
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground">{DESCRIPTION}</p>
        <EditorialMeta />
      </header>

      <section className="mt-12 space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight">
          Conversion categories
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {hubs.map((hub) => {
            const count = getConversionsByCategory(hub.category).length;
            return (
              <Link
                key={hub.slug}
                href={hub.path}
                className="group rounded-2xl border border-border/80 bg-card p-6 shadow-sm transition-all hover:border-foreground/15 hover:shadow-premium"
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-semibold tracking-tight">{hub.label}</h3>
                  <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {hub.description}
                </p>
                <p className="mt-3 text-xs font-medium text-muted-foreground">
                  {count} converters
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      {popular.length > 0 && (
        <section className="mt-16 space-y-6">
          <h2 className="text-2xl font-semibold tracking-tight">
            Popular conversions
          </h2>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {popular.map((c) => (
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
      )}
    </article>
  );
}
