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
    <section aria-labelledby="faq-heading" className="space-y-4">
      <h2 id="faq-heading" className="text-2xl font-semibold tracking-tight">
        {title}
      </h2>
      <div className="divide-y divide-border overflow-hidden rounded-xl border border-border">
        {faqs.map((faq, index) => (
          <details key={index} className="group">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-4 font-medium hover:bg-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring">
              {faq.question}
              <ChevronDown className="size-5 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
            </summary>
            <div className="px-4 pb-4 text-sm leading-relaxed text-muted-foreground">
              {faq.answer}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
