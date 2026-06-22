import type { ToolMeta } from "../types";

export const schemaMarkupGenerator: ToolMeta = {
  slug: "schema-markup-generator",
  name: "Schema Markup Generator",
  seoTitle: "Schema Markup Generator — JSON-LD Structured Data",
  shortDescription:
    "Generate JSON-LD structured data for rich search results.",
  metaDescription:
    "Free schema markup generator. Create JSON-LD structured data for articles, products, FAQs, organizations and more. Copy valid markup for Google rich results.",
  category: "seo",
  icon: "list-tree",
  keywords: [
    "schema markup generator",
    "json-ld generator",
    "structured data generator",
    "schema.org generator",
    "rich snippets markup",
    "seo structured data",
  ],
  addedAt: "2026-06-20",
  popular: true,
  intro:
    "Create valid JSON-LD structured data without memorizing schema.org types. Choose a schema type, fill in the fields, and copy production-ready markup for richer search engine results.",
  howItWorks: [
    "Select a schema type such as Article, Product, FAQ or Organization.",
    "Fill in the required and recommended properties for that type.",
    "Preview the generated JSON-LD script block.",
    "Copy and paste the markup into your page HTML.",
  ],
  useCases: [
    "Add FAQ rich results markup to support and documentation pages.",
    "Mark up products with price, availability and review data.",
    "Define organization and local business details for knowledge panels.",
    "Implement Article schema for blog posts and news content.",
  ],
  faqs: [
    {
      question: "What format does this generate?",
      answer:
        "The tool outputs JSON-LD wrapped in a script tag, which is Google's recommended format for structured data.",
    },
    {
      question: "Will schema markup guarantee rich results?",
      answer:
        "No. Rich results are not guaranteed. Google decides eligibility based on guidelines, content quality and policy compliance.",
    },
    {
      question: "How do I validate the output?",
      answer:
        "After deploying, test your URL with Google's Rich Results Test or Schema Markup Validator to check for errors.",
    },
  ],
};
