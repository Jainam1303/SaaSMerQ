import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/tool/breadcrumbs";
import { EditorialMeta } from "@/components/editorial/editorial-meta";
import { editorialConfig } from "@/lib/editorial";

export const metadata: Metadata = buildMetadata({
  title: "Editorial Policy — MerQPrime",
  description:
    "How MerQPrime Editorial Team researches, writes, reviews and updates tools, guides and calculators.",
  path: "/editorial-policy",
});

export default function EditorialPolicyPage() {
  return (
    <div className="container max-w-3xl space-y-8 py-8 md:py-12">
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Editorial Policy", href: "/editorial-policy" },
        ]}
      />
      <header className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          Editorial Policy
        </h1>
        <EditorialMeta />
      </header>
      <div className="space-y-6 leading-relaxed text-muted-foreground">
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">
            Who writes our content
          </h2>
          <p>
            Tools, guides, calculator landing pages and blog posts are produced
            and reviewed by the {editorialConfig.author}. We combine product
            engineering expertise with finance, tax and SEO research focused on
            Indian users.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">
            Accuracy &amp; updates
          </h2>
          <p>
            Formulas follow widely accepted standards (reducing-balance EMI, GST
            splits, compounding rules). Rates and regulatory thresholds change —
            our tools let you enter current values rather than locking outdated
            figures. Pages display last updated and last reviewed dates.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">
            Independence
          </h2>
          <p>
            MerQPrime does not sell financial products. Calculator outputs are
            educational. We do not accept payment to rank or favour specific
            lenders, funds or vendors in editorial content.
          </p>
        </section>
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-foreground">
            Corrections
          </h2>
          <p>
            Report factual errors to {editorialConfig.contactEmail}. We aim to
            review and correct material issues within five business days.
          </p>
        </section>
      </div>
    </div>
  );
}
