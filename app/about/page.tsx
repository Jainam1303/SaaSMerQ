import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/tool/breadcrumbs";

export const metadata: Metadata = buildMetadata({
  title: "About Us",
  description: `Learn about ${siteConfig.name}, our mission, and our commitment to providing fast, privacy-first, in-browser tools.`,
  path: "/about",
});

export default function AboutPage() {
  return (
    <div className="container max-w-3xl space-y-6 py-8 md:py-12">
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "About", href: "/about" },
        ]}
      />
      <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
        About {siteConfig.name}
      </h1>
      <div className="space-y-6 leading-relaxed text-muted-foreground">
        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">Our Mission</h2>
          <p>
            At {siteConfig.name}, our mission is to provide high-quality, 
            lightning-fast, and completely free online tools for developers, 
            students, and professionals. We believe that everyday utilities 
            should not require you to sign up, pay subscriptions, or sacrifice 
            your privacy.
          </p>
        </section>
        
        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">
            Privacy-First Technology
          </h2>
          <p>
            Unlike many online tool suites that upload your data to remote 
            servers for processing, {siteConfig.name} is engineered to perform 
            calculations, conversions, and data generation entirely within your 
            browser. This means your text, files, and images remain completely 
            private and never touch our servers.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">
            Commitment to Quality
          </h2>
          <p>
            Every tool on our platform is carefully crafted to be accurate, 
            responsive, and accessible. From complex financial calculators to 
            simple text utilities, we prioritize a clean user experience free 
            from deceptive navigation or intrusive layouts.
          </p>
        </section>
      </div>
    </div>
  );
}
