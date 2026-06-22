import type { ToolMeta } from "../types";

export const slugGenerator: ToolMeta = {
  slug: "slug-generator",
  name: "Slug Generator",
  seoTitle: "URL Slug Generator — SEO-Friendly Slugs",
  shortDescription:
    "Turn titles into clean, SEO-friendly URL slugs automatically.",
  metaDescription:
    "Free URL slug generator. Convert titles and phrases into lowercase, hyphenated, SEO-friendly slugs for blog posts, products and pages. Works instantly in your browser.",
  category: "text",
  icon: "link",
  keywords: [
    "slug generator",
    "url slug",
    "seo slug",
    "permalink generator",
    "url friendly slug",
    "hyphenated slug",
  ],
  addedAt: "2026-06-20",
  intro:
    "Turn any title or phrase into a clean URL slug. Special characters are stripped, spaces become hyphens and the result is lowercase and ready for blog posts, product pages or CMS permalinks.",
  howItWorks: [
    "Enter your title, heading or phrase in the input field.",
    "The slug is generated automatically as you type.",
    "Review the cleaned, hyphenated, lowercase output.",
    "Copy the slug and use it in your URL or CMS.",
  ],
  useCases: [
    "Create SEO-friendly permalinks for blog posts and articles.",
    "Generate consistent slugs for product or category pages.",
    "Normalize filenames and route segments in web apps.",
    "Preview how a headline will look as a URL path.",
  ],
  faqs: [
    {
      question: "What characters are removed?",
      answer:
        "Special characters, punctuation and symbols are stripped. Spaces and underscores are converted to hyphens, and the result is lowercased.",
    },
    {
      question: "Are accented characters handled?",
      answer:
        "Accented letters are typically transliterated to their ASCII equivalents so slugs remain URL-safe.",
    },
    {
      question: "Can I customize the separator?",
      answer:
        "The default separator is a hyphen, which is the most common convention for SEO-friendly URLs.",
    },
  ],
};
