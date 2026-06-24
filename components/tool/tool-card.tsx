import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ToolMeta } from "@/data/tools/types";
import { categoryMap } from "@/data/tools/categories";
import { Icon } from "@/components/icon";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function ToolCard({
  tool,
  className,
}: {
  tool: ToolMeta;
  className?: string;
}) {
  const category = categoryMap[tool.category];

  return (
    <Link
      href={`/tools/${tool.slug}`}
      className={cn(
        "group relative flex h-full flex-col gap-5 overflow-hidden rounded-2xl elevated-card p-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:p-6",
        "hover:border-primary/25",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <Badge
          variant="secondary"
          className="rounded-md border border-border bg-surface px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground"
        >
          {category.name.replace(" Tools", "")}
        </Badge>
        <span
          className="flex size-11 items-center justify-center rounded-xl border border-border bg-surface text-primary transition-colors group-hover:border-primary/30 group-hover:bg-primary/10"
        >
          <Icon name={tool.icon} className="size-5" />
        </span>
      </div>

      <div className="space-y-2">
        <h3 className="font-heading text-lg font-semibold leading-snug tracking-tight">
          {tool.name}
        </h3>
        <p className="text-sm leading-relaxed text-card-secondary line-clamp-2">
          {tool.shortDescription}
        </p>
      </div>

      <div className="mt-auto pt-2">
        <div
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-background/50 px-3 py-2 text-sm font-medium text-foreground transition-colors group-hover:border-primary/40 group-hover:bg-primary/10"
        >
          Open tool
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </div>
      </div>
    </Link>
  );
}
