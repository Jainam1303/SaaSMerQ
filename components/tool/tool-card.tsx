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
      className="group relative flex h-full flex-col gap-4 overflow-hidden rounded-2xl border border-border/80 bg-card p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-premium-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {/* subtle gradient wash on hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100"
      />
      <div className="relative flex items-center justify-between">
        <span className="flex size-11 items-center justify-center rounded-xl border border-border/70 bg-secondary/60 text-primary transition-colors group-hover:border-primary/30 group-hover:bg-primary/10">
          <Icon name={tool.icon} className="size-5" />
        </span>
        <ArrowUpRight className="size-5 text-muted-foreground/50 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
      </div>
      <div className="relative space-y-1.5">
        <h3 className="font-semibold leading-tight tracking-tight">
          {tool.name}
        </h3>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {tool.shortDescription}
        </p>
      </div>
      <div className="relative mt-auto pt-1">
        <span className="text-xs font-medium text-muted-foreground/80">
          {category.name.replace(" Tools", "")}
        </span>
      </div>
    </Link>
  );
}
