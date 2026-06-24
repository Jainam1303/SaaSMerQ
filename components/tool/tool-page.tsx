import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import type { ToolMeta } from "@/data/tools/types";
import { categoryMap } from "@/data/tools/categories";
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
import { getRelatedContentForTool } from "@/lib/related-content";
import { RelatedContentSection } from "@/components/seo/related-content-section";
import { EditorialMeta } from "@/components/editorial/editorial-meta";
import { ToolRunner } from "@/components/tools/tool-runner";
import { getRelatedTools } from "@/data/tools";
import { getPostsForTool } from "@/lib/internal-links";
import { TrustBadges } from "@/components/tool/trust-badges";
import { FadeUp } from "@/components/motion/fade-up";

export function ToolPage({ tool }: { tool: ToolMeta }) {
  const category = categoryMap[tool.category];
  const related = getRelatedTools(tool.slug, 5);
  const relatedPosts = getPostsForTool(tool.slug, 2);
  const hubs = getHubsForTool(tool.slug);
  const relatedContent = getRelatedContentForTool(tool.slug);

  const crumbs = [
    { name: "Home", href: "/" },
    { name: category.name, href: `/category/${category.slug}` },
    { name: tool.name, href: `/tools/${tool.slug}` },
  ];

  return (
    <article>
      <JsonLd data={softwareApplicationJsonLd(tool)} />
      <JsonLd
        data={breadcrumbJsonLd(
          crumbs.map((c) => ({ name: c.name, url: absoluteUrl(c.href) })),
        )}
      />
      <JsonLd data={faqJsonLd(tool.faqs)} />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/40">
        <div aria-hidden className="pointer-events-none absolute inset-0 hero-glow opacity-80" />
        <div className="container relative max-w-6xl py-10 md:py-14 lg:py-16">
          <Breadcrumbs items={crumbs} />

          <FadeUp>
            <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-10">
              <span
                className="flex size-16 shrink-0 items-center justify-center rounded-2xl border border-border/60 bg-surface text-primary shadow-premium lg:size-20"
              >
                <Icon name={tool.icon} className="size-8 lg:size-9" />
              </span>
              <div className="min-w-0 flex-1 space-y-5">
                <Link href={`/category/${category.slug}`}>
                  <Badge
                    variant="secondary"
                    className="rounded-md border border-border/60 bg-surface/80 font-medium"
                  >
                    {category.name}
                  </Badge>
                </Link>
                <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl lg:leading-tight">
                  {tool.name}
                </h1>
                <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
                  {tool.shortDescription}
                </p>
                <TrustBadges />
                <EditorialMeta />
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      <div className="container max-w-6xl space-y-16 py-10 md:space-y-20 md:py-14 lg:py-16">
        <AdSlot format="leaderboard" />

        <FadeUp>
          <section
            aria-label={`${tool.name} tool`}
            className="tool-surface p-6 md:p-8 lg:p-10"
          >
            <ToolRunner slug={tool.slug} />
          </section>
        </FadeUp>

        <div className="space-y-16 md:space-y-20">
          <FadeUp>
            <section className="space-y-4 max-w-3xl">
              <p className="section-eyebrow">Overview</p>
              <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
                About the {tool.name}
              </h2>
              <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
                {tool.intro}
              </p>
            </section>
          </FadeUp>

          <div className="grid gap-6 lg:grid-cols-2">
            <FadeUp>
              <section
                className="rounded-2xl border border-border/60 bg-card p-6 shadow-premium md:p-8"
              >
                <p className="section-eyebrow">Benefits</p>
                <h2 className="mt-2 text-xl font-semibold tracking-tight md:text-2xl">
                  How it works
                </h2>
                <ol className="mt-6 space-y-5">
                  {tool.howItWorks.map((step, index) => (
                    <li key={index} className="flex gap-4">
                      <span
                        className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-surface text-xs font-semibold tabular-nums text-primary"
                      >
                        {index + 1}
                      </span>
                      <span className="pt-0.5 text-sm leading-relaxed text-muted-foreground md:text-base">
                        {step}
                      </span>
                    </li>
                  ))}
                </ol>
              </section>
            </FadeUp>

            <FadeUp delay={0.1}>
              <section
                className="rounded-2xl border border-border/60 bg-card p-6 shadow-premium md:p-8"
              >
                <p className="section-eyebrow">Applications</p>
                <h2 className="mt-2 text-xl font-semibold tracking-tight md:text-2xl">
                  Use cases
                </h2>
                <ul className="mt-6 space-y-5">
                  {tool.useCases.map((useCase, index) => (
                    <li key={index} className="flex gap-3">
                      <CheckCircle2
                        className="size-5 shrink-0 text-primary"
                        aria-hidden
                      />
                      <span className="text-sm leading-relaxed text-muted-foreground md:text-base">
                        {useCase}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            </FadeUp>
          </div>

          <AdSlot format="native" />

          <FaqSection faqs={tool.faqs} />

          {hubs.length > 0 && <HubLinks hubs={hubs} />}

          <RelatedTools tools={related} />
          <RelatedBlogPosts posts={relatedPosts} />
          <RelatedContentSection bundle={relatedContent} />
        </div>
      </div>
    </article>
  );
}
