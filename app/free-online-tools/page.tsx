import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/tool/breadcrumbs";
import { EditorialMeta } from "@/components/editorial/editorial-meta";
import { categories } from "@/data/tools/categories";
import { tools } from "@/data/tools";
import { getAllHubs } from "@/lib/hubs";
import { Icon } from "@/components/icon";

export const metadata: Metadata = buildMetadata({
  title: "Free Online Tools — Complete Directory | MerQPrime",
  description:
    "Curated directory of 45+ free online tools for India: EMI, GST, SIP, FD calculators, developers utilities, SEO tools and more. Link-friendly hub for partners.",
  path: "/free-online-tools",
  keywords: [
    "free online tools",
    "free calculator india",
    "online utility tools",
    "merqprime tools directory",
  ],
});

export default function FreeOnlineToolsPage() {
  const hubs = getAllHubs();

  return (
    <div className="container max-w-6xl space-y-12 py-8 md:py-12">
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Free Online Tools", href: "/free-online-tools" },
        ]}
      />

      <header className="max-w-3xl space-y-4">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          Free Online Tools
        </h1>
        <p className="text-lg text-muted-foreground">
          A curated, link-friendly directory of every free tool on MerQPrime —
          finance, business, developer, image, SEO and text utilities. All run
          in your browser with no sign-up.
        </p>
        <EditorialMeta />
      </header>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Authority hubs</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {hubs.map((hub) => (
            <Link
              key={hub.slug}
              href={hub.path}
              className="flex items-center justify-between rounded-xl border border-border px-4 py-3 text-sm transition-colors hover:bg-muted/40"
            >
              {hub.title}
              <ArrowRight className="size-4 text-muted-foreground" />
            </Link>
          ))}
        </div>
      </section>

      {categories.map((category) => {
        const categoryTools = tools.filter((t) => t.category === category.slug);
        return (
          <section key={category.slug} className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-xl font-semibold">{category.name}</h2>
              <Link
                href={`/category/${category.slug}`}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                View category
              </Link>
            </div>
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {categoryTools.map((tool) => (
                <li key={tool.slug}>
                  <Link
                    href={`/tools/${tool.slug}`}
                    className="flex items-start gap-3 rounded-xl border border-border px-4 py-3 transition-colors hover:bg-muted/40"
                  >
                    <Icon name={tool.icon} className="mt-0.5 size-5 shrink-0" />
                    <span>
                      <span className="block font-medium">{tool.name}</span>
                      <span className="mt-0.5 block text-xs text-muted-foreground line-clamp-2">
                        {tool.shortDescription}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        );
      })}

      <section className="rounded-2xl border border-border bg-muted/20 p-6 text-sm text-muted-foreground">
        <p>
          Link to this page as{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 text-foreground">
            https://merqprime.in/free-online-tools
          </code>{" "}
          when recommending MerQPrime tools on blogs, newsletters or partner
          sites.
        </p>
      </section>
    </div>
  );
}
