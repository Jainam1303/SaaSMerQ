import type { ToolMeta } from "../types";

export const caseConverter: ToolMeta = {
  slug: "case-converter",
  name: "Case Converter",
  seoTitle: "Case Converter — Upper, Lower, Title & More",
  shortDescription:
    "Convert text to uppercase, lowercase, title case, camelCase and more.",
  metaDescription:
    "Free online case converter. Transform text to uppercase, lowercase, title case, sentence case, camelCase, snake_case and kebab-case instantly in your browser.",
  category: "text",
  icon: "align-left",
  keywords: [
    "case converter",
    "uppercase converter",
    "lowercase converter",
    "title case",
    "camelCase converter",
    "snake_case converter",
  ],
  addedAt: "2026-06-20",
  intro:
    "Switch text between common casing styles in one click. Whether you need ALL CAPS, Title Case, camelCase for code or snake_case for variables, paste your text and convert instantly.",
  howItWorks: [
    "Paste or type the text you want to convert.",
    "Choose a target case style from the available options.",
    "The converted result appears immediately in the output area.",
    "Copy the result to your clipboard with one click.",
  ],
  useCases: [
    "Format headings and titles consistently across documents.",
    "Convert variable names between camelCase and snake_case in code.",
    "Normalize user input to uppercase or lowercase for comparisons.",
    "Prepare slugs and identifiers in kebab-case or PascalCase.",
  ],
  faqs: [
    {
      question: "What case styles are supported?",
      answer:
        "Common styles include uppercase, lowercase, title case, sentence case, camelCase, PascalCase, snake_case and kebab-case.",
    },
    {
      question: "Will special characters be affected?",
      answer:
        "Only letter casing changes. Numbers, punctuation and symbols remain untouched unless the chosen style specifically transforms word boundaries.",
    },
    {
      question: "Is there a character limit?",
      answer:
        "There is no hard server-side limit because processing happens in your browser. Very large texts may slow down depending on your device.",
    },
  ],
};
