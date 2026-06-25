"use client";

import * as React from "react";
import { Search } from "lucide-react";
import type { ToolMeta } from "@/data/tools/types";
import { Input } from "@/components/ui/input";
import { ToolCard } from "@/components/tool/tool-card";
import { trackSearch } from "@/lib/analytics";

function filterTools(tools: ToolMeta[], query: string): ToolMeta[] {
  const q = query.trim().toLowerCase();
  if (!q) return tools;
  return tools.filter((tool) =>
    [tool.name, tool.shortDescription, tool.category, ...tool.keywords]
      .join(" ")
      .toLowerCase()
      .includes(q),
  );
}

export function ToolSearch({
  tools,
  initialQuery = "",
}: {
  tools: ToolMeta[];
  initialQuery?: string;
}) {
  const [query, setQuery] = React.useState(initialQuery);
  const results = React.useMemo(
    () => filterTools(tools, query),
    [tools, query],
  );

  React.useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) return;
    const timer = setTimeout(() => trackSearch(trimmed, "tools_page"), 600);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="space-y-6">
      <div className="relative max-w-xl">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search tools…"
          className="pl-9"
          aria-label="Search tools"
        />
      </div>

      {results.length === 0 ? (
        <p className="text-muted-foreground">
          No tools match “{query}”. Try a different search.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      )}
    </div>
  );
}
