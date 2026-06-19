import type { ToolMeta } from "@/data/tools/types";
import { ToolCard } from "@/components/tool/tool-card";

export function RelatedTools({ tools }: { tools: ToolMeta[] }) {
  if (!tools.length) return null;

  return (
    <section aria-labelledby="related-heading" className="space-y-4">
      <h2
        id="related-heading"
        className="text-2xl font-semibold tracking-tight"
      >
        Related tools
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {tools.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </div>
    </section>
  );
}
