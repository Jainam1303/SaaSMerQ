import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getAllToolSlugs,
  getToolBySlug,
} from "@/data/tools";
import { getToolCtrMetadata } from "@/data/seo/ctr-metadata";
import { buildMetadata } from "@/lib/seo";
import { ToolPage } from "@/components/tool/tool-page";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllToolSlugs().map((slug) => ({ slug }));
}

// Pre-render tool pages; revalidate occasionally for any future data changes.
export const dynamicParams = false;
export const revalidate = 86400;

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) return {};

  const ctr = getToolCtrMetadata(slug);

  return buildMetadata({
    title: ctr?.seoTitle ?? tool.seoTitle ?? tool.name,
    description: ctr?.metaDescription ?? tool.metaDescription,
    path: `/tools/${tool.slug}`,
    keywords: tool.keywords,
    ogType: "article",
    absoluteTitle: Boolean(ctr),
  });
}

export default async function ToolSlugPage({ params }: PageProps) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) notFound();

  return <ToolPage tool={tool} />;
}
