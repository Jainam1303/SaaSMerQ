import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";
import { buildMetadata } from "@/lib/seo";
import { Breadcrumbs } from "@/components/tool/breadcrumbs";

export const metadata: Metadata = buildMetadata({
  title: "Disclaimer",
  description: `General disclaimer for ${siteConfig.name}. Understanding the limitations and educational nature of our tools and calculators.`,
  path: "/disclaimer",
});

export default function DisclaimerPage() {
  return (
    <div className="container max-w-3xl space-y-6 py-8 md:py-12">
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Disclaimer", href: "/disclaimer" },
        ]}
      />
      <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
        Disclaimer
      </h1>
      <div className="space-y-6 leading-relaxed text-muted-foreground">
        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">
            General Information Only
          </h2>
          <p>
            All tools, calculators, information, and content provided on {siteConfig.name} 
            are intended for general educational and informational purposes only. 
            They should not be construed as professional, legal, financial, or tax advice.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">
            Financial & Tax Calculators
          </h2>
          <p>
            The financial and tax calculators (including GST, EMI, SIP, FD, RD, and 
            HRA calculators) are designed to provide estimates based on the data you 
            input. These results are illustrative and may not reflect your actual 
            financial situation, bank policies, or the latest tax laws. Always 
            consult a qualified financial advisor or certified accountant before 
            making any financial or tax-related decisions.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">
            Developer & Cryptographic Tools
          </h2>
          <p>
            Our developer tools (such as hashing generators, Base64 encoders, and 
            password generators) run locally in your browser. While they utilize 
            standard algorithms, they are provided for convenience and testing. 
            We do not guarantee the cryptographic security of outputs for 
            production environments. Always follow industry-standard security 
            practices for sensitive applications.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">
            No Liability
          </h2>
          <p>
            By using {siteConfig.name}, you acknowledge that you are using the tools 
            at your own risk. The administrators and owners of this site will not 
            be liable for any errors, omissions, or any losses, injuries, or 
            damages arising from the display or use of this information.
          </p>
        </section>
      </div>
    </div>
  );
}
