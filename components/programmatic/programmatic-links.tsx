import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getToolBySlug } from "@/data/tools";
import { getHubBySlug } from "@/lib/hubs";
import { absoluteUrl } from "@/lib/seo";

export function ProgrammaticLinks({
  relatedPages,
  toolSlugs,
  hubSlug,
}: {
  relatedPages: { path: string; title: string }[];
  toolSlugs: string[];
  hubSlug: string;
}) {
  const tools = toolSlugs
    .map((s) => getToolBySlug(s))
    .filter((t): t is NonNullable<typeof t> => Boolean(t));
  const hub = getHubBySlug(hubSlug);

  return (
    <div className="grid gap-8 md:grid-cols-3">
      <section>
        <h2 className="mb-3 text-sm font-semibold">Related pages</h2>
        <ul className="space-y-2 text-sm text-muted-foreground">
          {relatedPages.map((p) => (
            <li key={p.path}>
              <Link
                href={p.path}
                className="inline-flex items-center gap-1 transition-colors hover:text-foreground"
              >
                {p.title}
                <ArrowRight className="size-3.5" />
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h2 className="mb-3 text-sm font-semibold">Tools</h2>
        <ul className="space-y-2 text-sm text-muted-foreground">
          {tools.map((t) => (
            <li key={t.slug}>
              <Link
                href={`/tools/${t.slug}`}
                className="transition-colors hover:text-foreground"
              >
                {t.name}
              </Link>
            </li>
          ))}
        </ul>
      </section>
      {hub && (
        <section>
          <h2 className="mb-3 text-sm font-semibold">Authority hub</h2>
          <Link
            href={hub.path}
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            {hub.title}
          </Link>
        </section>
      )}
    </div>
  );
}

export function hubPath(hubSlug: string): string {
  return absoluteUrl(`/${hubSlug}`);
}
