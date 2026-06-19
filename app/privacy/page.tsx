import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/tool/breadcrumbs";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy",
  description: `Privacy policy for ${siteConfig.name}. Learn how our privacy-first, in-browser tools handle your data.`,
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <div className="container max-w-3xl space-y-6 py-8 md:py-12">
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Privacy Policy", href: "/privacy" },
        ]}
      />
      <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
        Privacy Policy
      </h1>
      <div className="space-y-6 leading-relaxed text-muted-foreground">
        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">
            In-browser processing
          </h2>
          <p>
            The vast majority of {siteConfig.name} tools process your data
            entirely within your browser. Text, files and images you provide are
            not uploaded to or stored on our servers.
          </p>
        </section>
        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">
            Analytics
          </h2>
          <p>
            We may use privacy-respecting analytics to understand aggregate
            usage and improve the platform. Analytics are only enabled when
            explicitly configured, and we anonymise IP addresses where
            supported.
          </p>
        </section>
        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">Cookies</h2>
          <p>
            The platform uses minimal cookies or local storage strictly for
            essential functionality such as remembering your light/dark theme
            preference.
          </p>
        </section>
        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">Contact</h2>
          <p>
            For any privacy questions, please reach out via {siteConfig.domain}.
          </p>
        </section>
      </div>
    </div>
  );
}
