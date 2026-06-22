import type { ToolMeta } from "../types";

export const md5Generator: ToolMeta = {
  slug: "md5-generator",
  name: "MD5 Generator",
  seoTitle: "MD5 Hash Generator — Text & File Checksums",
  shortDescription:
    "Generate MD5 hashes from text or files for checksums and lookups.",
  metaDescription:
    "Free MD5 hash generator. Compute MD5 checksums from text or files instantly in your browser. Useful for file integrity checks and legacy system compatibility.",
  category: "developer",
  icon: "hash",
  keywords: [
    "md5 generator",
    "md5 hash",
    "md5 checksum",
    "md5 online",
    "file md5 hash",
    "md5 calculator",
  ],
  addedAt: "2026-06-20",
  intro:
    "Compute MD5 hashes from any string or file in seconds. While MD5 is not suitable for password storage or modern security, it remains useful for checksums, cache keys and legacy integrations.",
  howItWorks: [
    "Enter text or upload a file to hash.",
    "The MD5 digest is computed locally in your browser.",
    "View the 32-character hexadecimal hash output.",
    "Copy the hash to your clipboard with one click.",
  ],
  useCases: [
    "Verify file integrity against published MD5 checksums.",
    "Generate cache keys or deduplication fingerprints for content.",
    "Compare outputs with legacy systems that still rely on MD5.",
    "Quickly fingerprint strings during development and debugging.",
  ],
  faqs: [
    {
      question: "Is MD5 secure for passwords?",
      answer:
        "No. MD5 is cryptographically broken and should never be used for password hashing. Use SHA-256 or dedicated password hashing algorithms instead.",
    },
    {
      question: "Are files uploaded to a server?",
      answer:
        "No. File hashing happens entirely in your browser using the Web Crypto API or an equivalent local implementation.",
    },
    {
      question: "What format is the output?",
      answer:
        "The hash is displayed as a 32-character lowercase hexadecimal string, which is the standard MD5 representation.",
    },
  ],
};
