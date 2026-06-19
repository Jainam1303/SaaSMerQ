import type { Metadata } from "next";
import { tools } from "@/data/tools";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/tool/breadcrumbs";
import { ToolSearch } from "@/components/search/tool-search";

export const metadata: Metadata = buildMetadata({
  title: "All Tools",
  description:
    "Browse every free online tool on MerQPrime — QR & UPI generators, password & UUID tools, JSON & Base64 utilities, GST calculator, image compressor and more.",
  path: "/tools",
});

export default async function ToolsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  return (
    <div className="container space-y-8 py-8 md:py-12">
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "All Tools", href: "/tools" },
        ]}
      />
      <header className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-wider text-primary">
          Tool library
        </p>
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          All Tools
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          {tools.length} free, fast and secure tools — search to find exactly
          what you need.
        </p>
      </header>

      <ToolSearch tools={tools} initialQuery={q ?? ""} />
    </div>
  );
}
