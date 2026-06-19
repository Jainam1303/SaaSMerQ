import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { categories, categoryMap } from "@/data/tools/categories";
import { getToolsByCategory } from "@/data/tools";
import type { CategorySlug } from "@/data/tools/types";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  buildMetadata,
} from "@/lib/seo";
import { Icon } from "@/components/icon";
import { Breadcrumbs } from "@/components/tool/breadcrumbs";
import { ToolCard } from "@/components/tool/tool-card";
import { JsonLd } from "@/components/json-ld";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = categoryMap[slug as CategorySlug];
  if (!category) return {};

  return buildMetadata({
    title: category.name,
    description: category.description,
    path: `/category/${category.slug}`,
  });
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const category = categoryMap[slug as CategorySlug];
  if (!category) notFound();

  const categoryTools = getToolsByCategory(category.slug);
  const crumbs = [
    { name: "Home", href: "/" },
    { name: category.name, href: `/category/${category.slug}` },
  ];

  return (
    <div className="container space-y-8 py-8 md:py-12">
      <JsonLd
        data={breadcrumbJsonLd(
          crumbs.map((c) => ({ name: c.name, url: absoluteUrl(c.href) })),
        )}
      />
      <Breadcrumbs items={crumbs} />

      <header className="flex items-start gap-4">
        <span className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon name={category.icon} className="size-7" />
        </span>
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            {category.name}
          </h1>
          <p className="max-w-2xl text-muted-foreground">
            {category.description}
          </p>
        </div>
      </header>

      {categoryTools.length === 0 ? (
        <p className="text-muted-foreground">
          No tools in this category yet — check back soon.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categoryTools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      )}
    </div>
  );
}
