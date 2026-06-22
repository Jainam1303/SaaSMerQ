import type { ToolMeta } from "../types";

export const sha256Generator: ToolMeta = {
  slug: "sha256-generator",
  name: "SHA-256 Generator",
  seoTitle: "SHA-256 Hash Generator — Secure Checksums",
  shortDescription:
    "Generate SHA-256 hashes from text or files for secure checksums.",
  metaDescription:
    "Free SHA-256 hash generator. Compute secure SHA-256 checksums from text or files instantly in your browser. Private, fast and ideal for integrity verification.",
  category: "developer",
  icon: "fingerprint",
  keywords: [
    "sha256 generator",
    "sha-256 hash",
    "sha256 checksum",
    "sha256 online",
    "file sha256 hash",
    "sha256 calculator",
  ],
  addedAt: "2026-06-20",
  featured: true,
  popular: true,
  intro:
    "Generate SHA-256 hashes from text or files with one click. SHA-256 is widely used for checksums, content verification and blockchain applications — and everything runs locally in your browser.",
  howItWorks: [
    "Enter text or select a file to hash.",
    "SHA-256 is computed locally using your browser's crypto capabilities.",
    "The 64-character hexadecimal digest is displayed instantly.",
    "Copy the hash for verification or further use.",
  ],
  useCases: [
    "Verify downloads against published SHA-256 checksums.",
    "Fingerprint content for deduplication and cache invalidation.",
    "Generate test vectors for cryptographic integrations.",
    "Compare hashed values in blockchain and API workflows.",
  ],
  faqs: [
    {
      question: "Is SHA-256 suitable for password storage?",
      answer:
        "SHA-256 alone is not recommended for passwords. Use dedicated password hashing functions like bcrypt, scrypt or Argon2 that include salting and key stretching.",
    },
    {
      question: "Does my file leave my device?",
      answer:
        "No. All hashing is performed locally in your browser. Files are never uploaded.",
    },
    {
      question: "Will the same input always produce the same hash?",
      answer:
        "Yes. SHA-256 is deterministic — identical input always yields the same 64-character hexadecimal output.",
    },
  ],
};
