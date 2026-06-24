"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { tools } from "@/data/tools";
import { HeroSearch } from "@/components/search/hero-search";
import { FadeUp } from "@/components/motion/fade-up";
import { Button } from "@/components/ui/button";

const stats = [
  { value: "45+", label: "Tools" },
  { value: "300+", label: "SEO pages" },
  { value: "100%", label: "Free" },
  { value: "Privacy", label: "First" },
];

export function PremiumHero() {
  return (
    <section className="relative overflow-hidden border-b border-border/40">
      <div aria-hidden className="pointer-events-none absolute inset-0 hero-glow" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-grid opacity-[0.35] mask-fade"
      />

      <div className="container relative py-16 md:py-24 lg:py-28">
        <div className="mx-auto max-w-4xl text-center">
          <FadeUp>
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-1.5 text-xs font-medium text-muted-foreground shadow-premium">
              <Sparkles className="size-3.5 text-primary" aria-hidden />
              {tools.length}+ tools · No sign-up · In-browser
            </div>
          </FadeUp>

          <FadeUp delay={0.08}>
            <h1 className="mt-6 text-balance text-4xl font-semibold tracking-tight md:text-6xl lg:text-[4.25rem] lg:leading-[1.05]">
              Premium utilities
              <br className="hidden sm:block" />
              <span className="text-gradient"> built for clarity</span>
            </h1>
          </FadeUp>

          <FadeUp delay={0.14}>
            <p className="mx-auto mt-6 max-w-2xl text-balance text-lg leading-relaxed text-muted-foreground md:text-xl">
              Finance calculators, developer tools and SEO utilities in one
              refined workspace. Fast, private and free — the quality you expect
              from a modern SaaS product.
            </p>
          </FadeUp>

          <FadeUp delay={0.2}>
            <div className="mt-10 md:mt-12">
              <HeroSearch />
            </div>
          </FadeUp>

          <FadeUp delay={0.26}>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <Button size="lg" asChild className="h-12 rounded-xl px-8 shadow-sm">
                <Link href="/tools">
                  Explore all tools
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="h-12 rounded-xl border-border bg-surface px-8 shadow-premium"
              >
                <Link href="/free-online-tools">View directory</Link>
              </Button>
            </div>
          </FadeUp>

          <FadeUp delay={0.32}>
            <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-border bg-card px-4 py-5 shadow-premium"
                >
                  <div className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
