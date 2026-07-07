import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/tool/breadcrumbs";
import { Mail } from "lucide-react";

export const metadata: Metadata = buildMetadata({
  title: "Contact Us",
  description: `Get in touch with ${siteConfig.name}. We welcome feedback, feature requests, and technical inquiries.`,
  path: "/contact",
});

export default function ContactPage() {
  return (
    <div className="container max-w-3xl space-y-6 py-8 md:py-12">
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Contact", href: "/contact" },
        ]}
      />
      <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
        Contact Us
      </h1>
      <div className="space-y-6 leading-relaxed text-muted-foreground">
        <section className="space-y-4">
          <p>
            We are always looking to improve {siteConfig.name}. Whether you have 
            a question about one of our tools, want to suggest a new feature, 
            or need to report an issue, we would love to hear from you.
          </p>
          
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-foreground">
              Email Support
            </h2>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Reach us directly at:</p>
                <a 
                  href="mailto:merqprime@gmail.com" 
                  className="text-primary hover:underline"
                >
                  merqprime@gmail.com
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">
            Response Times
          </h2>
          <p>
            We aim to respond to all inquiries within 24-48 hours. For technical 
            issues, please include as much detail as possible, such as your 
            browser version and the exact tool you were using.
          </p>
        </section>
      </div>
    </div>
  );
}
