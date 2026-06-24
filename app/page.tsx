import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  getPopularTools,
  getRecentlyAddedTools,
  tools,
} from "@/data/tools";
import { siteConfig } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { FaqSection } from "@/components/tool/faq-section";
import { AdSlot } from "@/components/ads/ad-slot";
import { JsonLd } from "@/components/json-ld";
import { buildMetadata, faqJsonLd } from "@/lib/seo";
import { PremiumHero } from "@/components/home/premium-hero";
import { CategoryShowcase } from "@/components/home/category-showcase";
import { FeaturedTools } from "@/components/home/featured-tools";
import { TrustAuthoritySection } from "@/components/home/trust-authority";
import { FadeUp } from "@/components/motion/fade-up";

export const metadata: Metadata = buildMetadata({
  title: `${siteConfig.name} — ${siteConfig.tagline}`,
  description: siteConfig.description,
  path: "/",
  absoluteTitle: true,
  ogTitle: siteConfig.name,
  keywords: [
    "free online tools",
    "QR code generator",
    "password generator",
    "UUID generator",
    "JSON formatter",
    "Base64 encoder",
    "GST calculator",
    "UPI QR generator",
    "image compressor",
    "image resizer",
  ],
});

const homeFaqs = [
  {
    question: "Are MerQPrime tools free to use?",
    answer:
      "Yes. Every tool on MerQPrime is completely free to use, with no sign-up required and no limits on how often you use them.",
  },
  {
    question: "Is my data safe?",
    answer:
      "Absolutely. Our tools run entirely in your browser wherever possible, which means your text, files and images never leave your device or get uploaded to a server.",
  },
  {
    question: "Do I need to create an account?",
    answer:
      "No account is needed. Just open a tool and start using it immediately.",
  },
  {
    question: "Will more tools be added?",
    answer:
      "Yes. MerQPrime is built to grow. We are continuously adding new utilities across developer, business, image, SEO and text categories.",
  },
  {
    question: "Do the tools work on mobile?",
    answer:
      "Yes. The entire platform is mobile-first and fully responsive, so every tool works smoothly on phones, tablets and desktops.",
  },
];

export default function HomePage() {
  const popular = getPopularTools();
  const recent = getRecentlyAddedTools(6);

  return (
    <>
      <JsonLd data={faqJsonLd(homeFaqs)} />

      <PremiumHero />

      <div className="container space-y-20 py-16 md:space-y-28 md:py-24">
        <CategoryShowcase />

        <AdSlot format="leaderboard" />

        <FeaturedTools
          tools={popular.slice(0, 8)}
          eyebrow="Popular"
          title="Featured tools"
          subtitle="What people open again and again — EMI, SIP, GST and more."
        />

        <FeaturedTools
          tools={recent}
          eyebrow="New"
          title="Recently added"
          subtitle="Fresh calculators and utilities, just shipped."
          href="/tools"
        />

        <TrustAuthoritySection />

        <FadeUp>
          <section
            className="relative overflow-hidden rounded-3xl elevated-card px-6 py-14 text-center md:px-12 md:py-16"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 hero-glow opacity-60"
            />
            <div className="relative">
              <h2 className="mx-auto max-w-2xl text-balance text-3xl font-semibold tracking-tight md:text-4xl">
                Start with search
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-balance text-muted-foreground md:text-lg">
                No account, no installs. Find a tool and get your answer in
                seconds.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Button asChild size="lg" className="h-12 rounded-xl px-8">
                  <Link href="/tools">
                    Browse all {tools.length} tools
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </section>
        </FadeUp>

        <FaqSection faqs={homeFaqs} />
      </div>
    </>
  );
}
