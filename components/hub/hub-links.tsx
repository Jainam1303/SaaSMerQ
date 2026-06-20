import Link from "next/link";
import { ArrowRight, Layers } from "lucide-react";
import type { HubMeta } from "@/lib/hubs/types";

export function HubLinks({ hubs }: { hubs: HubMeta[] }) {
  if (!hubs.length) return null;

  return (
    <aside
      className="rounded-2xl border border-border/80 bg-muted/30 p-6 shadow-sm"
      aria-label="Authority hub collections"
    >
      <div className="flex items-start gap-4">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-border/80 bg-background">
          <Layers className="size-5" aria-hidden />
        </span>
        <div className="space-y-3 min-w-0">
          <h2 className="font-semibold tracking-tight">Authority hubs</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Explore curated tool and guide collections for this topic.
          </p>
          <ul className="space-y-2">
            {hubs.map((hub) => (
              <li key={hub.slug}>
                <Link
                  href={hub.path}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-[hsl(var(--accent-link))] hover:underline"
                >
                  {hub.title.replace(/ —.*/, "")}
                  <ArrowRight className="size-3.5" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  );
}
