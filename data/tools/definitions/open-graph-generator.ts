import type { ToolMeta } from "../types";

export const openGraphGenerator: ToolMeta = {
  slug: "open-graph-generator",
  name: "Open Graph Generator",
  seoTitle: "Open Graph Tag Generator — Social Share Preview",
  shortDescription:
    "Generate Open Graph meta tags for rich social media link previews.",
  metaDescription:
    "Free Open Graph tag generator. Create og:title, og:description, og:image and og:url meta tags for Facebook, LinkedIn and other platforms. Copy HTML instantly.",
  category: "seo",
  icon: "share-2",
  keywords: [
    "open graph generator",
    "og tags generator",
    "social meta tags",
    "og:image generator",
    "facebook preview tags",
    "linkedin share tags",
  ],
  addedAt: "2026-06-20",
  intro:
    "Control how your links look when shared on social networks. Enter your page details to generate Open Graph meta tags that define the title, description, image and URL shown in link previews.",
  howItWorks: [
    "Enter your page title, description, canonical URL and image URL.",
    "Choose the content type and optional locale settings.",
    "Preview the generated Open Graph meta tag snippet.",
    "Copy the HTML into your page head section.",
  ],
  useCases: [
    "Improve link preview appearance on Facebook, LinkedIn and Slack.",
    "Add og:image tags so shares show a branded preview image.",
    "Fix missing or incorrect social previews after site launches.",
    "Generate OG tags for static pages, blogs and product landing pages.",
  ],
  faqs: [
    {
      question: "What image size works best for og:image?",
      answer:
        "A common recommendation is 1200×630 pixels with a 1.91:1 aspect ratio for broad compatibility across platforms.",
    },
    {
      question: "Are Open Graph tags the same as Twitter Cards?",
      answer:
        "They overlap but are not identical. Twitter/X also supports Twitter Card tags, though many platforms fall back to Open Graph properties.",
    },
    {
      question: "Why doesn't my preview update immediately?",
      answer:
        "Social platforms cache link previews. Use each platform's debugging or sharing tool to refresh cached metadata after you deploy changes.",
    },
  ],
};
