import type { ToolMeta } from "../types";

export const uuidGenerator: ToolMeta = {
  slug: "uuid-generator",
  name: "UUID Generator",
  seoTitle: "UUID Generator — Bulk v4 UUIDs",
  shortDescription:
    "Generate one or many RFC 4122 version 4 UUIDs and copy them instantly.",
  metaDescription:
    "Free online UUID generator. Create single or bulk RFC 4122 version 4 UUIDs instantly, with one-click copy. Cryptographically random and fully client-side.",
  category: "developer",
  icon: "fingerprint",
  keywords: [
    "uuid generator",
    "guid generator",
    "uuid v4",
    "bulk uuid",
    "random uuid",
  ],
  addedAt: "2026-01-07",
  popular: true,
  intro:
    "Generate universally unique identifiers (UUID v4) for databases, APIs, message queues and distributed systems. Produce a single ID or thousands at once, then copy them all with a click.",
  howItWorks: [
    "Choose how many UUIDs you want to generate.",
    "Click Generate to create cryptographically random version 4 UUIDs.",
    "Copy a single UUID or the entire list to your clipboard.",
    "Regenerate as often as you like — each ID is unique.",
  ],
  useCases: [
    "Primary keys for database records without coordination.",
    "Idempotency keys for API requests and webhooks.",
    "Correlation IDs for tracing requests across microservices.",
    "Unique filenames, session tokens and test fixtures.",
  ],
  faqs: [
    {
      question: "Which UUID version is generated?",
      answer:
        "Version 4 (random) UUIDs as defined by RFC 4122. They are generated using the secure crypto.randomUUID API where available.",
    },
    {
      question: "How likely are collisions?",
      answer:
        "Astronomically unlikely. A v4 UUID has 122 random bits, so the probability of generating two identical IDs is negligible for any realistic workload.",
    },
    {
      question: "Can I generate UUIDs in bulk?",
      answer:
        "Yes. Set the quantity and generate hundreds or thousands at once, then copy the whole list.",
    },
  ],
};
