import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/site";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/tool/breadcrumbs";
import { EditorialMeta } from "@/components/editorial/editorial-meta";
import { getAllHubs } from "@/lib/hubs";

export const metadata: Metadata = buildMetadata({
  title: "About MerQPrime — Free Online Tools & Calculators",
  description: `Learn about ${siteConfig.brandName}: India-first free online tools, calculators and guides reviewed by the MerQPrime Editorial Team.`,
  path: "/about",
});

export default function AboutPage() {
  const hubs = getAllHubs();

  return (
    <div className="container max-w-3xl space-y-8 py-8 md:py-12">
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "About", href: "/about" },
        ]}
      />
      <header className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          About {siteConfig.brandName}
        </h1>
        <EditorialMeta />
      </header>
      <div className="space-y-4 leading-relaxed text-muted-foreground">
        <p>
          {siteConfig.brandName} is a growing collection of fast, free and secure
          online tools designed for developers, businesses, investors and
          creators in India and beyond. Our mission is to provide reliable
          everyday utilities that respect your privacy and your time.
        </p>
        <p>
          Wherever possible, our tools run entirely in your browser. Text, files
          and images you work with never leave your device — making the platform
          both private and remarkably fast.
        </p>
        <p>
          Content on {siteConfig.domain} is researched and reviewed by the{" "}
          <strong className="text-foreground">MerQPrime Editorial Team</strong>
          . We focus on accurate formulas, India-specific tax and finance
          conventions, and practical examples you can verify with our embedded
          calculators.
        </p>
        <p>
          The platform includes {siteConfig.brandName} tools, programmatic
          calculators, unit conversion pages and in-depth guides — all designed
          for mobile-first access across India.
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Authority hubs</h2>
        <ul className="grid gap-2 sm:grid-cols-2">
          {hubs.map((hub) => (
            <li key={hub.slug}>
              <Link
                href={hub.path}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {hub.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Trust &amp; transparency</h2>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>
            <Link href="/editorial-policy" className="hover:text-foreground">
              Editorial policy
            </Link>
          </li>
          <li>
            <Link href="/methodology" className="hover:text-foreground">
              Methodology
            </Link>
          </li>
          <li>
            <Link href="/privacy" className="hover:text-foreground">
              Privacy policy
            </Link>
          </li>
          <li>
            <Link href="/free-online-tools" className="hover:text-foreground">
              Free online tools directory
            </Link>
          </li>
        </ul>
      </section>
    </div>
  );
}
