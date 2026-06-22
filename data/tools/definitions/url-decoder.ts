import type { ToolMeta } from "../types";

export const urlDecoder: ToolMeta = {
  slug: "url-decoder",
  name: "URL Decoder",
  seoTitle: "URL Decoder — Decode Percent-Encoded Strings",
  shortDescription:
    "Decode percent-encoded URLs and query strings back to readable text.",
  metaDescription:
    "Free online URL decoder. Convert percent-encoded strings and query parameters back to readable text. Decode URI components safely and privately in your browser.",
  category: "developer",
  icon: "arrow-left-right",
  keywords: [
    "url decoder",
    "percent decode",
    "uri decoder",
    "decodeURIComponent",
    "query string decoder",
    "url unescape",
  ],
  addedAt: "2026-06-20",
  intro:
    "Turn percent-encoded URLs back into readable text. Paste an encoded query string, path segment or full URL fragment and instantly see the decoded result.",
  howItWorks: [
    "Paste the percent-encoded string or URL component.",
    "The decoded readable text appears immediately.",
    "Invalid sequences are reported with a clear error message.",
    "Copy the decoded output when you're done.",
  ],
  useCases: [
    "Read encoded query parameters from analytics and server logs.",
    "Decode redirect URLs returned by OAuth and SSO flows.",
    "Inspect encoded API payloads during integration debugging.",
    "Recover human-readable text from copied encoded links.",
  ],
  faqs: [
    {
      question: "Can I decode a full URL at once?",
      answer:
        "You can paste encoded components or full query strings. Decoding an entire URL with scheme and domain may require decoding individual parts separately.",
    },
    {
      question: "What if decoding fails?",
      answer:
        "Malformed percent sequences trigger an error explaining which part of the input could not be decoded.",
    },
    {
      question: "Does it handle plus signs as spaces?",
      answer:
        "In form-encoded contexts, plus signs are treated as spaces. The tool supports standard URI component decoding.",
    },
  ],
};
