import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  Lock,
  Sparkles,
  Gauge,
  CircleDollarSign,
} from "lucide-react";
import {
  getFeaturedTools,
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
import { faqJsonLd } from "@/lib/seo";

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

const highlights = [
  {
    icon: Zap,
    title: "Instant results",
    text: "Everything runs in-browser — no waiting, no servers.",
  },
  {
    icon: Lock,
    title: "Privacy-first",
    text: "Your data never leaves your device. Nothing is uploaded.",
  },
  {
    icon: ShieldCheck,
    title: "Secure by design",
    text: "Hardened with strict CSP and validated inputs.",
  },
];

const trustStats = [
  { value: `${tools.length}+`, label: "Free tools" },
  { value: "100%", label: "In-browser" },
  { value: "0", label: "Uploads" },
  { value: "₹0", label: "Forever free" },
];

export default function HomePage() {
  const featured = getFeaturedTools();
  const popular = getPopularTools();
  const recent = getRecentlyAddedTools(6);

  return (
    <>
      <JsonLd data={faqJsonLd(homeFaqs)} />

      {/* ───────────────── Hero ───────────────── */}
      <section className="relative overflow-hidden border-b border-border/70">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-grid mask-fade opacity-60"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-[-12rem] -z-10 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-primary/20 blur-[140px]"
        />

        <div className="container py-20 text-center md:py-28">
          <Link
            href="/tools"
            className="mx-auto inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/60 px-3.5 py-1.5 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur transition-colors hover:text-foreground"
          >
            <Sparkles className="size-3.5 text-primary" />
            {tools.length}+ tools live · privacy-first &amp; free
            <ArrowRight className="size-3.5" />
          </Link>

          <h1 className="mx-auto mt-6 max-w-3xl text-balance text-4xl font-bold tracking-tight md:text-6xl md:leading-[1.05]">
            Premium online tools,
            <br className="hidden sm:block" />{" "}
            <span className="text-gradient">without the bloat</span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-balance text-lg leading-relaxed text-muted-foreground">
            {siteConfig.name} unifies developer, business, image and SEO
            utilities in one fast, beautiful workspace. No sign-up, no uploads —
            everything runs instantly in your browser.
          </p>

          <div className="mt-9">
            <HeroSearch />
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Gauge className="size-4 text-primary" /> Lightning fast
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Lock className="size-4 text-primary" /> 100% private
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CircleDollarSign className="size-4 text-primary" /> Always free
            </span>
          </div>

          {/* Trust stats */}
          <div className="mx-auto mt-14 grid max-w-3xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border/70 bg-border/70 sm:grid-cols-4">
            {trustStats.map((stat) => (
              <div key={stat.label} className="bg-card px-4 py-5">
                <div className="text-2xl font-bold tracking-tight md:text-3xl">
                  {stat.value}
                </div>
                <div className="mt-0.5 text-xs text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="container space-y-20 py-20 md:space-y-24 md:py-24">
        {/* ───────────── Highlights ───────────── */}
        <section className="grid gap-4 md:grid-cols-3">
          {highlights.map((h) => (
            <div
              key={h.title}
              className="group rounded-2xl border border-border/80 bg-card p-6 transition-colors hover:border-primary/30"
            >
              <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <h.icon className="size-5" />
              </span>
              <h3 className="mt-4 font-semibold tracking-tight">{h.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {h.text}
              </p>
            </div>
          ))}
        </section>

        {/* ───────────── Categories ───────────── */}
        <section className="space-y-8">
          <SectionHeading
            eyebrow="Categories"
            title="Everything in one place"
            subtitle="Browse our growing library by what you need to get done."
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => {
              const count = getToolsByCategory(category.slug).length;
              return (
                <Link
                  key={category.slug}
                  href={`/category/${category.slug}`}
                  className="group relative flex items-start gap-4 overflow-hidden rounded-2xl border border-border/80 bg-card p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-premium-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-gradient text-primary-foreground shadow-premium">
                    <Icon name={category.icon} className="size-5" />
                  </span>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold tracking-tight">
                        {category.name}
                      </h3>
                      <Badge variant="secondary">{count}</Badge>
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

        {/* ───────────── Featured ───────────── */}
        <section className="space-y-8">
          <SectionHeading
            eyebrow="Featured"
            title="Popular with our users"
            subtitle="Hand-picked utilities people reach for every day."
            href="/tools"
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        </section>

        {/* ───────────── Popular ───────────── */}
        <section className="space-y-8">
          <SectionHeading
            eyebrow="Most used"
            title="Trending tools"
            subtitle="The tools getting the most love right now."
            href="/tools"
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {popular.slice(0, 8).map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        </section>

        {/* ───────────── Recently added ───────────── */}
        <section className="space-y-8">
          <SectionHeading
            eyebrow="What's new"
            title="Recently added"
            subtitle="Fresh tools, just shipped."
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recent.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        </section>

        {/* ───────────── CTA band ───────────── */}
        <section className="relative overflow-hidden rounded-3xl border border-border/70 bg-brand-gradient px-6 py-14 text-center text-primary-foreground md:px-12 md:py-16">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-dots opacity-20"
          />
          <div className="relative">
            <h2 className="mx-auto max-w-2xl text-balance text-3xl font-bold tracking-tight md:text-4xl">
              Get more done with the right tool
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-balance text-primary-foreground/80">
              Free, fast and private. No account, no installs — open a tool and
              start in seconds.
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <Button
                asChild
                size="lg"
                className="bg-background text-foreground shadow-premium hover:bg-background/90"
              >
                <Link href="/tools">
                  Explore all tools
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
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
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-2">
        {eyebrow && (
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            {eyebrow}
          </p>
        )}
        <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
          {title}
        </h2>
        {subtitle && (
          <p className="max-w-xl text-muted-foreground">{subtitle}</p>
        )}
      </div>
      {href && (
        <Link
          href={href}
          className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-primary hover:gap-1.5"
        >
          View all <ArrowRight className="size-4 transition-all" />
        </Link>
      )}
    </div>
  );
}
