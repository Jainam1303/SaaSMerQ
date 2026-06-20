import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  Lock,
  Gauge,
} from "lucide-react";
import {
  getPopularTools,
  getRecentlyAddedTools,
  getToolsByCategory,
  tools,
} from "@/data/tools";
import { categories } from "@/data/tools/categories";
import { siteConfig } from "@/lib/site";
import { Icon } from "@/components/icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HeroSearch } from "@/components/search/hero-search";
import { ToolCard } from "@/components/tool/tool-card";
import { FaqSection } from "@/components/tool/faq-section";
import { AdSlot } from "@/components/ads/ad-slot";
import { JsonLd } from "@/components/json-ld";
import { buildMetadata, faqJsonLd } from "@/lib/seo";

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

const whyMerQPrime = [
  {
    icon: Zap,
    title: "Instant results",
    text: "Every tool runs in your browser. No queues, no uploads, no waiting on a server.",
  },
  {
    icon: Lock,
    title: "Privacy-first",
    text: "Your numbers, text and files stay on your device. We don't store what you calculate.",
  },
  {
    icon: ShieldCheck,
    title: "Built for trust",
    text: "Strict security headers, validated inputs and a clean interface you can rely on daily.",
  },
  {
    icon: Gauge,
    title: "Fast on every device",
    text: "Mobile-first layouts that feel native on phones, tablets and desktops.",
  },
];

const trustStats = [
  { value: `${tools.length}+`, label: "Free tools" },
  { value: "100%", label: "In-browser" },
  { value: "0", label: "Uploads" },
  { value: "₹0", label: "Forever free" },
];

export default function HomePage() {
  const popular = getPopularTools();
  const recent = getRecentlyAddedTools(6);

  return (
    <>
      <JsonLd data={faqJsonLd(homeFaqs)} />

      {/* ───────────────── Hero (search-first) ───────────────── */}
      <section className="relative border-b border-border/80 bg-muted/20">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-grid opacity-40"
        />
        <div className="container relative py-16 md:py-24 lg:py-28">
          <div className="mx-auto max-w-4xl text-center">
            <p className="section-eyebrow">
              {tools.length}+ tools · Free · No sign-up
            </p>

            <h1 className="mt-4 text-balance text-4xl font-semibold tracking-tight md:text-6xl lg:text-[4rem] lg:leading-[1.05]">
              The utility platform
              <br className="hidden sm:block" />
              <span className="text-muted-foreground"> built for clarity</span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-balance text-lg leading-relaxed text-muted-foreground md:text-xl">
              Calculators, converters and developer tools in one refined
              workspace. Search, open, and get answers instantly — private and
              free.
            </p>

            <div className="mt-10 md:mt-12">
              <HeroSearch />
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-muted-foreground">
              {trustStats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-xl font-semibold tracking-tight text-foreground md:text-2xl">
                    {stat.value}
                  </div>
                  <div className="mt-0.5 text-xs uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="container space-y-24 py-20 md:space-y-28 md:py-28">
        {/* ───────────── Categories ───────────── */}
        <section className="space-y-10">
          <SectionHeading
            eyebrow="Browse"
            title="Tool categories"
            subtitle="Organized by what you need — business, developer, image, SEO and text."
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => {
              const count = getToolsByCategory(category.slug).length;
              return (
                <Link
                  key={category.slug}
                  href={`/category/${category.slug}`}
                  className="group flex items-start gap-4 rounded-2xl border border-border/80 bg-card p-6 shadow-sm transition-all hover:border-foreground/15 hover:shadow-premium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-border/80 bg-muted/50 text-foreground">
                    <Icon name={category.icon} className="size-5" />
                  </span>
                  <div className="min-w-0 space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold tracking-tight">
                        {category.name}
                      </h3>
                      <Badge variant="secondary" className="font-mono text-[10px]">
                        {count}
                      </Badge>
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {category.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        <AdSlot format="leaderboard" />

        {/* ───────────── Popular ───────────── */}
        <section className="space-y-10">
          <SectionHeading
            eyebrow="Popular"
            title="Most-used tools"
            subtitle="What people open again and again — EMI, SIP, GST and more."
            href="/tools"
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {popular.slice(0, 8).map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        </section>

        {/* ───────────── Recently added ───────────── */}
        <section className="space-y-10">
          <SectionHeading
            eyebrow="New"
            title="Recently added"
            subtitle="Fresh calculators and utilities, just shipped."
            href="/tools"
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recent.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        </section>

        {/* ───────────── Why MerQPrime ───────────── */}
        <section className="space-y-10">
          <SectionHeading
            eyebrow="Why MerQPrime"
            title="Quality you can feel"
            subtitle="A focused utility platform — not a cluttered link farm."
          />
          <div className="grid gap-4 sm:grid-cols-2">
            {whyMerQPrime.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm"
              >
                <span className="flex size-10 items-center justify-center rounded-lg border border-border/80 bg-muted/40">
                  <item.icon className="size-5 text-foreground" />
                </span>
                <h3 className="mt-4 font-semibold tracking-tight">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ───────────── CTA band ───────────── */}
        <section className="rounded-3xl border border-border bg-muted/30 px-6 py-14 text-center md:px-12 md:py-16">
          <h2 className="mx-auto max-w-2xl text-balance text-3xl font-semibold tracking-tight md:text-4xl">
            Start with search
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-balance text-muted-foreground">
            No account, no installs. Find a tool and get your answer in seconds.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg" className="h-12 px-8">
              <Link href="/tools">
                Browse all tools
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </section>

        {/* ───────────── FAQ ───────────── */}
        <FaqSection faqs={homeFaqs} />
      </div>
    </>
  );
}

function SectionHeading({
  eyebrow,
  title,
  subtitle,
  href,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  href?: string;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-2">
        {eyebrow && <p className="section-eyebrow">{eyebrow}</p>}
        <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
          {title}
        </h2>
        {subtitle && (
          <p className="max-w-2xl text-muted-foreground leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
      {href && (
        <Link
          href={href}
          className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-accent-link hover:underline"
        >
          View all <ArrowRight className="size-4" />
        </Link>
      )}
    </div>
  );
}
