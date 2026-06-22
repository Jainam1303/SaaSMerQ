import type { ToolMeta } from "../types";

export const wordCounter: ToolMeta = {
  slug: "word-counter",
  name: "Word Counter",
  seoTitle: "Word Counter — Characters, Words & Reading Time",
  shortDescription:
    "Count words, characters, sentences and estimate reading time instantly.",
  metaDescription:
    "Free online word counter. Count words, characters, sentences and paragraphs, plus estimated reading time. Paste any text and get instant stats in your browser.",
  category: "text",
  icon: "type",
  keywords: [
    "word counter",
    "character count",
    "word count tool",
    "text statistics",
    "reading time calculator",
    "sentence counter",
  ],
  addedAt: "2026-06-20",
  featured: true,
  popular: true,
  intro:
    "Need a quick word count for an essay, blog post or social caption? Paste your text and instantly see words, characters, sentences, paragraphs and an estimated reading time — no signup required.",
  howItWorks: [
    "Paste or type your text into the input area.",
    "Statistics update in real time as you edit.",
    "View word count, character count (with and without spaces), sentences and paragraphs.",
    "Check the estimated reading time based on average reading speed.",
  ],
  useCases: [
    "Hit word limits for essays, articles or academic submissions.",
    "Check social media character limits before posting.",
    "Estimate reading time for blog posts and newsletters.",
    "Track writing progress during drafts and revisions.",
  ],
  faqs: [
    {
      question: "Is my text sent to a server?",
      answer:
        "No. All counting happens locally in your browser. Your text never leaves your device.",
    },
    {
      question: "How is reading time calculated?",
      answer:
        "Reading time is estimated using an average speed of roughly 200 words per minute, which is typical for adult readers.",
    },
    {
      question: "Does it count characters with or without spaces?",
      answer:
        "Both. You can see the total character count including spaces and a separate count excluding spaces.",
    },
  ],
};
