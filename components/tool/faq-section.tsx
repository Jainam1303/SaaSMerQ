import { ChevronDown } from "lucide-react";
import type { FaqItem } from "@/data/tools/types";
import { FadeUp } from "@/components/motion/fade-up";

/**
 * FAQ accordion built on native <details>/<summary> elements: accessible,
 * keyboard-friendly and works even before hydration.
 */
export function FaqSection({
  faqs,
  title = "Frequently asked questions",
}: {
  faqs: FaqItem[];
  title?: string;
}) {
  if (!faqs.length) return null;

  return (
    <section aria-labelledby="faq-heading" className="space-y-8">
      <FadeUp>
        <div className="space-y-3">
          <p className="section-eyebrow">Support</p>
          <h2
            id="faq-heading"
            className="text-2xl font-semibold tracking-tight md:text-3xl lg:text-4xl"
          >
            {title}
          </h2>
        </div>
      </FadeUp>
      <div className="space-y-3">
        {faqs.map((faq, index) => (
          <FadeUp key={index} delay={index * 0.05}>
            <details
              className="group elevated-card rounded-2xl open:border-primary/25 open:bg-surface/80"
            >
              <summary
                className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-medium tracking-tight hover:bg-accent/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring sm:px-6 sm:py-5 [&::-webkit-details-marker]:hidden"
              >
                {faq.question}
                <ChevronDown
                  className="size-5 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180"
                />
              </summary>
              <div className="border-t border-border/50 px-5 pb-5 pt-3 text-sm leading-relaxed text-muted-foreground sm:px-6 sm:pb-6 sm:text-base">
                {faq.answer}
              </div>
            </details>
          </FadeUp>
        ))}
      </div>
    </section>
  );
}
