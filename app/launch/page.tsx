import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ExternalLink, Rocket } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import { Breadcrumbs } from "@/components/tool/breadcrumbs";
import { EditorialMeta } from "@/components/editorial/editorial-meta";
import { DIRECTORY_CHECKLIST } from "@/lib/backlinks/directories";
import { categories } from "@/data/tools/categories";
import { tools } from "@/data/tools";

export const metadata: Metadata = buildMetadata({
  title: "MerQPrime Launch — Free Online Tools for India",
  description:
    "Launch hub for MerQPrime: 45+ free browser-based tools, 300+ SEO pages, link-friendly directory for partners, journalists and startup listings.",
  path: "/launch",
  keywords: [
    "merqprime launch",
    "free online tools india",
    "saas directory submission",
    "product hunt launch",
  ],
});

const LAUNCH_STATS = [
  { label: "Free tools", value: String(tools.length) },
  { label: "Tool categories", value: String(categories.length) },
  { label: "Indexed pages", value: "300+" },
  { label: "Pricing", value: "Free" },
];

const LINK_TARGETS = [
  {
    title: "Tool directory (link-friendly)",
    href: "/free-online-tools",
    description: "Curated list of every tool — ideal for partners and bloggers.",
  },
  {
    title: "About MerQPrime",
    href: "/about",
    description: "Who we are, editorial standards, and contact context.",
  },
  {
    title: "Methodology",
    href: "/methodology",
    description: "How calculators and utilities are built and reviewed.",
  },
  {
    title: "Editorial policy",
    href: "/editorial-policy",
    description: "E-E-A-T transparency for journalists and directories.",
  },
];

export default function LaunchPage() {
  return (
    <div className="container max-w-6xl space-y-12 py-8 md:py-12">
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Launch", href: "/launch" },
        ]}
      />

      <header className="max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/40 px-3 py-1 text-xs font-medium text-muted-foreground">
          <Rocket className="size-3.5" />
          Public launch hub
        </div>
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          MerQPrime — fast, free online tools
        </h1>
        <p className="text-lg text-muted-foreground">
          MerQPrime is a privacy-first collection of free utilities for India —
          finance calculators, GST & UPI tools, developer utilities, image
          compression, SEO helpers and more. Everything runs in the browser with
          no sign-up.
        </p>
        <EditorialMeta />
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {LAUNCH_STATS.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-border bg-card p-4 shadow-sm"
          >
            <p className="text-xs text-muted-foreground">{stat.label}</p>
            <p className="mt-1 text-2xl font-semibold">{stat.value}</p>
          </div>
        ))}
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Why link to MerQPrime</h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          <li className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
            <strong className="text-foreground">Useful &amp; specific.</strong>{" "}
            EMI, SIP, FD, GST, salary and developer tools — not generic
            AI wrappers.
          </li>
          <li className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
            <strong className="text-foreground">India-first context.</strong>{" "}
            Locale, currency and regulatory framing where it matters.
          </li>
          <li className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
            <strong className="text-foreground">No account required.</strong>{" "}
            Tools work instantly; privacy-first by design.
          </li>
          <li className="rounded-xl border border-border p-4 text-sm text-muted-foreground">
            <strong className="text-foreground">Editorial transparency.</strong>{" "}
            Methodology and policy pages for trust signals.
          </li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Suggested link targets</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {LINK_TARGETS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-start justify-between gap-4 rounded-xl border border-border px-4 py-3 transition-colors hover:bg-muted/40"
            >
              <div>
                <p className="font-medium">{item.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {item.description}
                </p>
              </div>
              <ArrowRight className="mt-1 size-4 shrink-0 text-muted-foreground" />
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Directory submission checklist</h2>
        <p className="max-w-3xl text-sm text-muted-foreground">
          Primary launch and listing targets for MerQPrime. Submit the homepage
          or the{" "}
          <Link href="/free-online-tools" className="text-primary hover:underline">
            free online tools directory
          </Link>{" "}
          depending on each platform&apos;s form.
        </p>
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-border bg-muted/30 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Platform</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Submit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {DIRECTORY_CHECKLIST.map((item) => (
                <tr key={item.websiteName} className="hover:bg-muted/20">
                  <td className="px-4 py-3 font-medium">{item.websiteName}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {item.category}
                  </td>
                  <td className="px-4 py-3">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-primary hover:underline"
                    >
                      Open
                      <ExternalLink className="size-3" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-xl border border-border bg-muted/20 p-6 space-y-3">
        <h2 className="text-lg font-semibold">Press &amp; partners</h2>
        <p className="text-sm text-muted-foreground">
          Canonical site:{" "}
          <a
            href={siteConfig.url}
            className="text-primary hover:underline"
          >
            {siteConfig.url}
          </a>
          . Suggested anchor text: &quot;MerQPrime free online tools&quot; or
          &quot;MerQPrime EMI / GST calculators&quot;. For structured data and
          sitemap coverage, see our{" "}
          <Link href="/methodology" className="text-primary hover:underline">
            methodology
          </Link>
          .
        </p>
        <Link
          href="/tools"
          className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
        >
          Browse all tools
          <ArrowRight className="size-4" />
        </Link>
      </section>
    </div>
  );
}
