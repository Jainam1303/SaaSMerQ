import Link from "next/link";
import { Github, Lock } from "lucide-react";
import { SiteLogo } from "@/components/brand/site-logo";
import { categories } from "@/data/tools/categories";
import { getPopularTools } from "@/data/tools";
import { siteConfig } from "@/lib/site";

const legalLinks = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
  { href: "/disclaimer", label: "Disclaimer" },
  { href: "/editorial-policy", label: "Editorial Policy" },
  { href: "/methodology", label: "Methodology" },
  { href: "/sitemap.xml", label: "Sitemap" },
];

const resourceLinks = [
  { href: "/blog", label: "Blog" },
  { href: "/launch", label: "Launch Hub" },
  { href: "/free-online-tools", label: "Free Online Tools" },
  { href: "/conversions", label: "Unit Converters" },
  { href: "/finance-tools", label: "Finance Tools" },
  { href: "/investment-tools", label: "Investment Tools" },
  { href: "/gst-tools", label: "GST Tools" },
  { href: "/developer-tools", label: "Developer Tools" },
  { href: "/seo-tools", label: "SEO Tools" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function SiteFooter() {
  const popular = getPopularTools().slice(0, 6);
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-surface">
      <div className="container py-14 md:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <div className="space-y-5 lg:col-span-4">
            <SiteLogo />
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              {siteConfig.description}
            </p>
            <p
              className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card/60 px-3.5 py-1.5 text-xs font-medium text-muted-foreground"
            >
              <Lock className="size-3.5 text-primary" aria-hidden />
              Private &amp; in-browser
            </p>
            <div className="flex items-center gap-3">
              <a
                href={`https://twitter.com/${siteConfig.twitter.replace("@", "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-border/60 px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
              >
                {siteConfig.twitter}
              </a>
              <a
                href="https://github.com/Jainam1303/SaaSMerQ"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
              >
                <Github className="size-3.5" aria-hidden />
                GitHub
              </a>
            </div>
          </div>

          <div className="lg:col-span-2">
            <h2 className="mb-4 text-sm font-semibold text-foreground">
              Categories
            </h2>
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
            <h2 className="mb-4 text-sm font-semibold text-foreground">
              Popular tools
            </h2>
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
            <h2 className="mb-4 text-sm font-semibold text-foreground">
              Resources
            </h2>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              {resourceLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 grid gap-6 border-t border-border/50 pt-8 md:grid-cols-2">
          <div>
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Legal
            </h2>
            <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col items-start justify-between gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center">
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
      </div>
    </footer>
  );
}
