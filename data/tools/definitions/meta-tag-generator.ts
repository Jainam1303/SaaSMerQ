import type { ToolMeta } from "../types";

export const metaTagGenerator: ToolMeta = {
  slug: "meta-tag-generator",
  name: "Meta Tag Generator",
  seoTitle: "Meta Tag Generator — HTML SEO Tags",
  shortDescription:
    "Generate essential HTML meta tags for title, description and robots.",
  metaDescription:
    "Free meta tag generator. Create HTML title, description, robots and viewport meta tags for better SEO. Copy ready-to-paste markup instantly in your browser.",
  category: "seo",
  icon: "file-text",
  keywords: [
    "meta tag generator",
    "html meta tags",
    "seo meta tags",
    "title tag generator",
    "meta description generator",
    "robots meta tag",
  ],
  addedAt: "2026-06-20",
  featured: true,
  intro:
    "Build the core HTML meta tags every page needs. Enter your title, description and SEO settings to generate copy-paste-ready markup for your site's head section.",
  howItWorks: [
    "Fill in your page title, meta description and target URL.",
    "Configure robots, viewport and other optional SEO directives.",
    "Preview the generated HTML meta tags in real time.",
    "Copy the complete snippet into your page's head element.",
  ],
  useCases: [
    "Bootstrap SEO markup for new landing pages and blog posts.",
    "Standardize meta tags across a static site or CMS theme.",
    "Preview how title and description lengths look before publishing.",
    "Generate robots directives for staging vs production environments.",
  ],
  faqs: [
    {
      question: "What is the ideal meta description length?",
      answer:
        "Aim for roughly 150–160 characters so search engines display the full description without truncation.",
    },
    {
      question: "Do meta tags alone guarantee rankings?",
      answer:
        "No. Meta tags help search engines understand your page, but rankings depend on content quality, relevance and many other factors.",
    },
    {
      question: "Should every page have unique meta tags?",
      answer:
        "Yes. Each page should have a unique title and description that accurately reflects its content.",
    },
  ],
};
