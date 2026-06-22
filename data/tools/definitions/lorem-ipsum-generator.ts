import type { ToolMeta } from "../types";

export const loremIpsumGenerator: ToolMeta = {
  slug: "lorem-ipsum-generator",
  name: "Lorem Ipsum Generator",
  seoTitle: "Lorem Ipsum Generator — Placeholder Text",
  shortDescription:
    "Generate placeholder Lorem Ipsum text by words, sentences or paragraphs.",
  metaDescription:
    "Free Lorem Ipsum generator. Create placeholder text by words, sentences or paragraphs for mockups, wireframes and design prototypes. Copy instantly in your browser.",
  category: "text",
  icon: "file-text",
  keywords: [
    "lorem ipsum generator",
    "placeholder text",
    "dummy text generator",
    "lorem ipsum paragraph",
    "fake text generator",
    "design placeholder",
  ],
  addedAt: "2026-06-20",
  intro:
    "Fill layouts and mockups with classic Lorem Ipsum placeholder text. Specify how many words, sentences or paragraphs you need and copy the result straight into your design or document.",
  howItWorks: [
    "Choose whether to generate by words, sentences or paragraphs.",
    "Enter the quantity you need.",
    "Click generate to create fresh Lorem Ipsum text.",
    "Copy the output and paste it into your project.",
  ],
  useCases: [
    "Populate wireframes and UI mockups with realistic-looking text.",
    "Fill document templates before final copy is ready.",
    "Test typography, line height and layout with varied text lengths.",
    "Create sample content for presentations and demos.",
  ],
  faqs: [
    {
      question: "What is Lorem Ipsum?",
      answer:
        "Lorem Ipsum is standard placeholder text derived from a Latin passage. Designers and developers use it to focus on layout without distracting readable content.",
    },
    {
      question: "Can I generate a specific number of words?",
      answer:
        "Yes. You can specify an exact word, sentence or paragraph count depending on the generation mode you choose.",
    },
    {
      question: "Is the text random each time?",
      answer:
        "Each generation produces varied combinations of classic Lorem Ipsum phrases so your placeholders do not look identical every time.",
    },
  ],
};
