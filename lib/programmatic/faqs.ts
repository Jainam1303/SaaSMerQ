import type { FaqItem } from "@/data/tools/types";

/** Ensures at least `min` FAQs by appending contextual fallbacks without duplicating questions. */
export function ensureMinFaqs(
  base: FaqItem[],
  extras: FaqItem[],
  min = 5,
): FaqItem[] {
  const seen = new Set(base.map((f) => f.question.toLowerCase()));
  const result = [...base];
  for (const faq of extras) {
    if (result.length >= min) break;
    const key = faq.question.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(faq);
  }
  return result;
}
