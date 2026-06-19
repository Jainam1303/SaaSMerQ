import type { ToolMeta } from "../types";

export const sitemapGenerator: ToolMeta = {
  slug: "sitemap-generator",
  name: "XML Sitemap Generator",
  seoTitle: "XML Sitemap Generator — Build sitemap.xml",
  shortDescription:
    "Turn a list of URLs into a valid XML sitemap and download it instantly.",
  metaDescription:
    "Generate a valid XML sitemap from a list of URLs. Set priority, change frequency and last-modified dates, then download sitemap.xml for Google Search Console.",
  category: "seo",
  icon: "list-tree",
  keywords: [
    "sitemap generator",
    "xml sitemap",
    "sitemap.xml generator",
    "create sitemap",
    "seo sitemap",
  ],
  addedAt: "2026-01-14",
  featured: true,
  intro:
    "Build a search-engine-ready XML sitemap in seconds. Paste your URLs, set optional priority, change frequency and last-modified values, and download a standards-compliant sitemap.xml to submit to Google Search Console and Bing Webmaster Tools.",
  howItWorks: [
    "Paste your URLs, one per line.",
    "Optionally set default change frequency, priority and last-modified date.",
    "A valid XML sitemap is generated and previewed instantly.",
    "Download sitemap.xml and upload it to your site root, then submit it to search engines.",
  ],
  useCases: [
    "Help search engines discover and crawl every important page.",
    "Create a sitemap for a static site or landing pages.",
    "Generate a quick sitemap for a new microsite or campaign.",
    "Provide last-modified hints to speed up re-crawling.",
  ],
  faqs: [
    {
      question: "What is an XML sitemap for?",
      answer:
        "A sitemap lists the URLs you want search engines to crawl, along with optional metadata like priority and last-modified date. It helps search engines discover content faster, especially on large or new sites.",
    },
    {
      question: "Where do I put the sitemap?",
      answer:
        "Upload the downloaded sitemap.xml to the root of your domain (e.g. https://example.com/sitemap.xml) and reference it in your robots.txt, then submit it in Google Search Console.",
    },
    {
      question: "Is there a URL limit?",
      answer:
        "The XML sitemap standard allows up to 50,000 URLs (or 50 MB) per file. For larger sites, split URLs across multiple sitemaps and use a sitemap index.",
    },
  ],
};
