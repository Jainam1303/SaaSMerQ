import Link from "next/link";
import { Wrench, Lock } from "lucide-react";
import { categories } from "@/data/tools/categories";
import { getPopularTools } from "@/data/tools";
import { siteConfig } from "@/lib/site";

export function SiteFooter() {
  const popular = getPopularTools().slice(0, 6);
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border/80 bg-muted/20">
      <div className="container py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-12">
          <div className="space-y-4 lg:col-span-4">
            <Link href="/" className="flex items-center gap-2.5 font-semibold">
              <span className="flex size-9 items-center justify-center rounded-lg border border-border bg-muted/50">
                <Wrench className="size-4" />
              </span>
              <span className="tracking-tight">
                MerQ<span className="text-muted-foreground">Prime</span>
              </span>
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              {siteConfig.description}
            </p>
            <p className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
              <Lock className="size-3.5" /> Private &amp; in-browser
            </p>
          </div>

          <div className="lg:col-span-2">
            <h2 className="mb-3 text-sm font-semibold">Categories</h2>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              {categories.map((category) => (
                <li key={category.slug}>
                  <Link
                    href={`/category/${category.slug}`}
                    className="transition-colors hover:text-foreground"
                  >
                    {category.name.replace(" Tools", "")}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h2 className="mb-3 text-sm font-semibold">Popular Tools</h2>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              {popular.map((tool) => (
                <li key={tool.slug}>
                  <Link
                    href={`/tools/${tool.slug}`}
                    className="transition-colors hover:text-foreground"
                  >
                    {tool.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h2 className="mb-3 text-sm font-semibold">Resources</h2>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/blog"
                  className="transition-colors hover:text-foreground"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/tools"
                  className="transition-colors hover:text-foreground"
                >
                  All Tools
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="transition-colors hover:text-foreground"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="transition-colors hover:text-foreground"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/sitemap.xml"
                  className="transition-colors hover:text-foreground"
                >
                  Sitemap
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-border/70 pt-6 text-sm text-muted-foreground sm:flex-row">
          <p>
            &copy; {year} {siteConfig.name}. All rights reserved.
          </p>
          <p>
            Built for{" "}
            <span className="font-medium text-foreground">
              {siteConfig.domain}
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
