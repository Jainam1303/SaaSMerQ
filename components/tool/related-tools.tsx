import type { ToolMeta } from "@/data/tools/types";
import { ToolCard } from "@/components/tool/tool-card";

export function RelatedTools({ tools }: { tools: ToolMeta[] }) {
  if (!tools.length) return null;

  return (
    <section aria-labelledby="related-heading" className="space-y-6">
      <div className="space-y-2">
        <p className="section-eyebrow">Explore more</p>
        <h2
          id="related-heading"
          className="text-2xl font-semibold tracking-tight md:text-3xl"
        >
          Related tools
        </h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {tools.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </div>
    </section>
  );
}
