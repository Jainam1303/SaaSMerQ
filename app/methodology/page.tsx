import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/tool/breadcrumbs";
import { EditorialMeta } from "@/components/editorial/editorial-meta";

export const metadata: Metadata = buildMetadata({
  title: "Methodology — How MerQPrime Builds Tools & Guides",
  description:
    "MerQPrime methodology for calculator accuracy, privacy-first architecture, SEO content and quality review.",
  path: "/methodology",
});

export default function MethodologyPage() {
  return (
    <div className="container max-w-3xl space-y-8 py-8 md:py-12">
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Methodology", href: "/methodology" },
        ]}
      />
      <header className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          Methodology
        </h1>
        <EditorialMeta />
      </header>
      <div className="space-y-6 leading-relaxed text-muted-foreground">
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">
            Calculator &amp; conversion accuracy
          </h2>
          <p>
            Each tool implements published formulas with unit tests and manual
            spot checks against spreadsheet references. Unit conversions use
            international standard factors. Financial tools default to
            reducing-balance EMI and Indian compounding conventions unless noted.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">
            Privacy-first execution
          </h2>
          <p>
            Client-side processing is the default. Inputs are not logged or
            transmitted for core calculators, converters and developer utilities.
            This reduces latency and keeps salary, loan and business figures on
            your device.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">
            Content &amp; SEO quality
          </h2>
          <p>
            Programmatic pages include unique introductions, worked examples,
            five or more intent-based FAQs and structured data (FAQ, Breadcrumb,
            Article or SoftwareApplication schema). Internal links connect tools,
            guides, blogs and conversion pages into topical clusters.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">
            Review cadence
          </h2>
          <p>
            High-traffic finance and tax pages are reviewed quarterly or when RBI,
            GST Council or major algorithm guidance changes. Last reviewed dates
            appear on trust and guide pages.
          </p>
        </section>
      </div>
    </div>
  );
}
