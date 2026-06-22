import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { RelatedContentBundle } from "@/lib/related-content";

function LinkGroup({
  title,
  links,
}: {
  title: string;
  links: { path: string; title: string }[];
}) {
  if (links.length === 0) return null;
  return (
    <section>
      <h2 className="mb-3 text-sm font-semibold">{title}</h2>
      <ul className="space-y-2 text-sm text-muted-foreground">
        {links.map((item) => (
          <li key={item.path}>
            <Link
              href={item.path}
              className="inline-flex items-center gap-1 transition-colors hover:text-foreground"
            >
              {item.title}
              <ArrowRight className="size-3.5" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function RelatedContentSection({
  bundle,
}: {
  bundle: RelatedContentBundle;
}) {
  if (bundle.total === 0) return null;

  return (
    <section
      aria-label="Related content"
      className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm md:p-8"
    >
      <p className="section-eyebrow">Explore more</p>
      <h2 className="mb-6 text-xl font-semibold tracking-tight">
        Related tools, guides &amp; pages
      </h2>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <LinkGroup title="Related tools" links={bundle.tools} />
        <LinkGroup title="Related guides" links={bundle.guides} />
        <LinkGroup title="Related blogs" links={bundle.blogs} />
        <LinkGroup title="Related conversions" links={bundle.conversions} />
        <LinkGroup title="Related calculators" links={bundle.calculators} />
      </div>
    </section>
  );
}
