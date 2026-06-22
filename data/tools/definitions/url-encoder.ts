import type { ToolMeta } from "../types";

export const urlEncoder: ToolMeta = {
  slug: "url-encoder",
  name: "URL Encoder",
  seoTitle: "URL Encoder — Percent-Encode Strings Online",
  shortDescription:
    "Percent-encode text and URLs for safe use in query strings and paths.",
  metaDescription:
    "Free online URL encoder. Percent-encode text, query parameters and special characters for safe use in URLs. Supports component and form encoding modes in your browser.",
  category: "developer",
  icon: "arrow-left-right",
  keywords: [
    "url encoder",
    "percent encode",
    "uri encoder",
    "query string encoder",
    "url escape",
    "encodeURIComponent",
  ],
  addedAt: "2026-06-20",
  intro:
    "Encode special characters in URLs and query strings so they transmit safely. Paste any text or partial URL and get a properly percent-encoded result ready for APIs, links and form data.",
  howItWorks: [
    "Paste the text or URL fragment you want to encode.",
    "Choose the encoding mode suited to your use case.",
    "The percent-encoded output is generated instantly.",
    "Copy the encoded string to your clipboard.",
  ],
  useCases: [
    "Encode query parameters before building API request URLs.",
    "Escape special characters in redirect and callback URLs.",
    "Prepare form values for application/x-www-form-urlencoded payloads.",
    "Debug encoding issues in web applications and integrations.",
  ],
  faqs: [
    {
      question: "What is percent-encoding?",
      answer:
        "Percent-encoding replaces unsafe ASCII characters with a percent sign followed by two hexadecimal digits, making strings safe for URLs.",
    },
    {
      question: "Should I encode the entire URL?",
      answer:
        "Usually you encode individual components such as query values or path segments rather than the full URL including the scheme and domain.",
    },
    {
      question: "Is my data uploaded?",
      answer:
        "No. Encoding runs entirely in your browser and your input is never transmitted.",
    },
  ],
};
