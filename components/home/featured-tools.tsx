import type { ToolMeta } from "@/data/tools/types";
import { ToolCard } from "@/components/tool/tool-card";
import { FadeUp } from "@/components/motion/fade-up";
import { SectionHeading } from "@/components/layout/section-heading";

export function FeaturedTools({
  tools,
  eyebrow = "Popular",
  title = "Featured tools",
  subtitle = "What people open again and again — EMI, SIP, GST and more.",
  href = "/tools",
}: {
  tools: ToolMeta[];
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  href?: string;
}) {
  return (
    <section className="space-y-10 md:space-y-12">
      <FadeUp>
        <SectionHeading
          eyebrow={eyebrow}
          title={title}
          subtitle={subtitle}
          href={href}
        />
      </FadeUp>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {tools.map((tool, index) => (
          <FadeUp key={tool.slug} delay={index * 0.05} className="h-full">
            <ToolCard tool={tool} />
          </FadeUp>
        ))}
      </div>
    </section>
  );
}
