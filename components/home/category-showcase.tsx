import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { categories } from "@/data/tools/categories";
import { getToolsByCategory } from "@/data/tools";
import { Icon } from "@/components/icon";
import { Badge } from "@/components/ui/badge";
import { FadeUp } from "@/components/motion/fade-up";
import { SectionHeading } from "@/components/layout/section-heading";

export function CategoryShowcase() {
  return (
    <section className="space-y-10 md:space-y-12">
      <FadeUp>
        <SectionHeading
          eyebrow="Browse"
          title="Tool categories"
          subtitle="Organized by what you need — business, developer, image, SEO and text."
        />
      </FadeUp>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category, index) => {
          const count = getToolsByCategory(category.slug).length;
          return (
            <FadeUp key={category.slug} delay={index * 0.06}>
              <Link
                href={`/category/${category.slug}`}
                className="group flex h-full flex-col gap-5 rounded-2xl elevated-card category-card-surface p-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring hover:border-primary/25"
              >
                <div className="flex items-start justify-between gap-3">
                  <span
                    className="flex size-12 items-center justify-center rounded-xl border border-border/60 bg-surface text-primary transition-colors group-hover:border-primary/30 group-hover:bg-primary/10"
                  >
                    <Icon name={category.icon} className="size-5" />
                  </span>
                  <Badge
                    variant="secondary"
                    className="rounded-md border border-border/60 bg-surface/80 font-mono text-[10px]"
                  >
                    {count}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <h3 className="font-heading text-lg font-semibold tracking-tight">
                    {category.name}
                  </h3>
                  <p className="text-sm leading-relaxed text-card-secondary">
                    {category.description}
                  </p>
                </div>
                <span
                  className="inline-flex items-center gap-1 text-sm font-medium text-primary"
                >
                  Browse category
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            </FadeUp>
          );
        })}
      </div>
    </section>
  );
}
