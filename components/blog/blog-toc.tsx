import Link from "next/link";
import type { TocItem } from "@/lib/blog/types";

export function BlogToc({ items }: { items: TocItem[] }) {
  if (items.length === 0) return null;

  return (
    <nav
      aria-label="Table of contents"
      className="rounded-2xl border border-border/80 bg-muted/20 p-5 lg:sticky lg:top-24"
    >
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        On this page
      </p>
      <ol className="mt-4 space-y-2 text-sm">
        {items.map((item) => (
          <li
            key={item.id}
            className={item.level === 3 ? "pl-3" : undefined}
          >
            <Link
              href={`#${item.id}`}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.text}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}
