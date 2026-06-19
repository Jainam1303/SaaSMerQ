import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import type { ToolMeta } from "@/data/tools/types";
import { categoryMap } from "@/data/tools/categories";
import { getRelatedTools } from "@/data/tools";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  faqJsonLd,
  softwareApplicationJsonLd,
} from "@/lib/seo";
import { Icon } from "@/components/icon";
import { Badge } from "@/components/ui/badge";
import { Breadcrumbs } from "@/components/tool/breadcrumbs";
import { FaqSection } from "@/components/tool/faq-section";
import { RelatedTools } from "@/components/tool/related-tools";
import { JsonLd } from "@/components/json-ld";
import { AdSlot } from "@/components/ads/ad-slot";
import { ToolRunner } from "@/components/tools/tool-runner";

export function ToolPage({ tool }: { tool: ToolMeta }) {
  const category = categoryMap[tool.category];
  const related = getRelatedTools(tool.slug);

  const crumbs = [
    { name: "Home", href: "/" },
    { name: category.name, href: `/category/${category.slug}` },
    { name: tool.name, href: `/tools/${tool.slug}` },
  ];

  return (
    <article className="container max-w-5xl py-8 md:py-12">
      <JsonLd data={softwareApplicationJsonLd(tool)} />
      <JsonLd
        data={breadcrumbJsonLd(
          crumbs.map((c) => ({ name: c.name, url: absoluteUrl(c.href) })),
        )}
      />
      <JsonLd data={faqJsonLd(tool.faqs)} />

      <Breadcrumbs items={crumbs} />

      <header className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-start">
        <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-brand-gradient text-primary-foreground shadow-premium">
          <Icon name={tool.icon} className="size-7" />
        </span>
        <div className="space-y-3">
          <Link href={`/category/${category.slug}`}>
            <Badge variant="secondary">{category.name}</Badge>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {tool.name}
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
            {tool.shortDescription}
          </p>
        </div>
      </header>

      <AdSlot format="leaderboard" className="my-8" />

      {/* Interactive tool */}
      <section aria-label={`${tool.name} tool`} className="mt-8">
        <ToolRunner slug={tool.slug} />
      </section>

      {/* Long-form content for SEO + users */}
      <div className="mt-12 space-y-12">
        <section className="space-y-3">
          <h2 className="text-2xl font-semibold tracking-tight">
            About the {tool.name}
          </h2>
          <p className="max-w-3xl leading-relaxed text-muted-foreground">
            {tool.intro}
          </p>
        </section>

        <div className="grid gap-5 md:grid-cols-2">
          <section className="space-y-5 rounded-2xl border border-border/80 bg-card p-6">
            <h2 className="text-xl font-semibold tracking-tight">
              How it works
            </h2>
            <ol className="space-y-4">
              {tool.howItWorks.map((step, index) => (
                <li key={index} className="flex gap-3">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-brand-gradient text-xs font-semibold text-primary-foreground">
                    {index + 1}
                  </span>
                  <span className="pt-0.5 text-sm leading-relaxed text-muted-foreground">
                    {step}
                  </span>
                </li>
              ))}
            </ol>
          </section>

          <section className="space-y-5 rounded-2xl border border-border/80 bg-card p-6">
            <h2 className="text-xl font-semibold tracking-tight">Use cases</h2>
            <ul className="space-y-4">
              {tool.useCases.map((useCase, index) => (
                <li key={index} className="flex gap-3">
                  <CheckCircle2 className="size-5 shrink-0 text-primary" />
                  <span className="text-sm leading-relaxed text-muted-foreground">
                    {useCase}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <AdSlot format="native" />

        <FaqSection faqs={tool.faqs} />

        <RelatedTools tools={related} />
      </div>
    </article>
  );
}
