import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ToolMeta } from "@/data/tools/types";
import { categoryMap } from "@/data/tools/categories";
import { Icon } from "@/components/icon";

export function ToolCard({ tool }: { tool: ToolMeta }) {
  const category = categoryMap[tool.category];

  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="group relative flex h-full flex-col gap-4 overflow-hidden rounded-2xl border border-border/80 bg-card p-5 shadow-sm transition-all duration-200 hover:border-foreground/20 hover:shadow-premium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="flex size-12 items-center justify-center rounded-xl border border-border/80 bg-muted/50 text-foreground transition-colors group-hover:bg-muted">
          <Icon name={tool.icon} className="size-5" />
        </span>
        <ArrowUpRight
          className="size-4 shrink-0 text-muted-foreground/40 transition-all duration-200 group-hover:text-foreground"
        />
      </div>
      <div className="space-y-2">
        <h3 className="font-semibold leading-snug tracking-tight">
          {tool.name}
        </h3>
        <p className="text-sm leading-relaxed text-card-secondary line-clamp-2">
          {tool.shortDescription}
        </p>
      </div>
      <div className="mt-auto pt-2">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-card-secondary">
          {category.name.replace(" Tools", "")}
        </span>
      </div>
    </Link>
  );
}
