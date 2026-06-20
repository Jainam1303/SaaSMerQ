import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import type { ToolMeta } from "@/data/tools/types";
import { categoryMap } from "@/data/tools/categories";
import { getRelatedTools } from "@/data/tools";
import { getPostsForTool } from "@/lib/internal-links";
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
import { RelatedBlogPosts } from "@/components/tool/related-blog-posts";
import { JsonLd } from "@/components/json-ld";
import { AdSlot } from "@/components/ads/ad-slot";
import { getHubsForTool } from "@/lib/hubs";
import { HubLinks } from "@/components/hub/hub-links";
import { ToolRunner } from "@/components/tools/tool-runner";

export function ToolPage({ tool }: { tool: ToolMeta }) {
  const category = categoryMap[tool.category];
  const related = getRelatedTools(tool.slug, 5);
  const relatedPosts = getPostsForTool(tool.slug, 2);
  const hubs = getHubsForTool(tool.slug);

  const crumbs = [
    { name: "Home", href: "/" },
    { name: category.name, href: `/category/${category.slug}` },
    { name: tool.name, href: `/tools/${tool.slug}` },
  ];

  return (
    <article className="container max-w-6xl py-8 md:py-12 lg:py-14">
      <JsonLd data={softwareApplicationJsonLd(tool)} />
      <JsonLd
        data={breadcrumbJsonLd(
          crumbs.map((c) => ({ name: c.name, url: absoluteUrl(c.href) })),
        )}
      />
      <JsonLd data={faqJsonLd(tool.faqs)} />

      <Breadcrumbs items={crumbs} />

      <header className="mt-8 flex flex-col gap-6 border-b border-border/80 pb-8 sm:flex-row sm:items-start">
        <span className="flex size-16 shrink-0 items-center justify-center rounded-2xl border border-border/80 bg-muted/40 shadow-sm">
          <Icon name={tool.icon} className="size-8" />
        </span>
        <div className="space-y-3">
          <Link href={`/category/${category.slug}`}>
            <Badge variant="secondary" className="font-medium">
              {category.name}
            </Badge>
          </Link>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-[2.75rem] lg:leading-tight">
            {tool.name}
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
            {tool.shortDescription}
          </p>
        </div>
      </header>

      <AdSlot format="leaderboard" className="my-8" />

      {/* Interactive tool — larger workspace card */}
      <section
        aria-label={`${tool.name} tool`}
        className="tool-surface p-6 md:p-8 lg:p-10"
      >
        <ToolRunner slug={tool.slug} />
      </section>

      {/* Long-form content for SEO + users */}
      <div className="mt-16 space-y-16 md:mt-20">
        <section className="space-y-4 max-w-3xl">
          <p className="section-eyebrow">Overview</p>
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
            About the {tool.name}
          </h2>
          <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
            {tool.intro}
          </p>
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm md:p-8">
            <h2 className="text-xl font-semibold tracking-tight">
              How it works
            </h2>
            <ol className="mt-6 space-y-5">
              {tool.howItWorks.map((step, index) => (
                <li key={index} className="flex gap-4">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border bg-muted/50 text-xs font-semibold tabular-nums">
                    {index + 1}
                  </span>
                  <span className="pt-0.5 text-sm leading-relaxed text-muted-foreground md:text-base">
                    {step}
                  </span>
                </li>
              ))}
            </ol>
          </section>

          <section className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm md:p-8">
            <h2 className="text-xl font-semibold tracking-tight">Use cases</h2>
            <ul className="mt-6 space-y-5">
              {tool.useCases.map((useCase, index) => (
                <li key={index} className="flex gap-3">
                  <CheckCircle2 className="size-5 shrink-0 text-muted-foreground" />
                  <span className="text-sm leading-relaxed text-muted-foreground md:text-base">
                    {useCase}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <AdSlot format="native" />

        <FaqSection faqs={tool.faqs} />

        {hubs.length > 0 && <HubLinks hubs={hubs} />}

        <RelatedTools tools={related} />
        <RelatedBlogPosts posts={relatedPosts} />
      </div>
    </article>
  );
}
