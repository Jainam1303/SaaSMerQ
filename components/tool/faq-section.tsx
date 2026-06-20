import { ChevronDown } from "lucide-react";
import type { FaqItem } from "@/data/tools/types";

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
    <section aria-labelledby="faq-heading" className="space-y-6">
      <div className="space-y-2">
        <p className="section-eyebrow">Support</p>
        <h2 id="faq-heading" className="text-2xl font-semibold tracking-tight md:text-3xl">
          {title}
        </h2>
      </div>
      <div className="space-y-3">
        {faqs.map((faq, index) => (
          <details
            key={index}
            className="group rounded-2xl border border-border/80 bg-card shadow-sm transition-colors open:bg-muted/20"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-medium tracking-tight hover:bg-muted/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring [&::-webkit-details-marker]:hidden">
              {faq.question}
              <ChevronDown
                className="size-5 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180"
              />
            </summary>
            <div className="border-t border-border/60 px-5 pb-5 pt-3 text-sm leading-relaxed text-muted-foreground">
              {faq.answer}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
