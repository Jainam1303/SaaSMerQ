import type { ToolMeta } from "../types";

export const base64Tool: ToolMeta = {
  slug: "base64-encoder-decoder",
  name: "Base64 Encoder / Decoder",
  seoTitle: "Base64 Encoder & Decoder — Text & Files",
  shortDescription:
    "Encode and decode Base64 for text and files, with full Unicode support.",
  metaDescription:
    "Free online Base64 encoder and decoder. Convert text and files to and from Base64 with full UTF-8 support, all processed privately in your browser.",
  category: "developer",
  icon: "binary",
  keywords: [
    "base64 encoder",
    "base64 decoder",
    "encode base64",
    "decode base64",
    "base64 file",
  ],
  addedAt: "2026-01-09",
  popular: true,
  intro:
    "Convert text and files to and from Base64 instantly. Encode binary or Unicode text for safe transport in URLs, JSON or data URIs, then decode it back whenever you need — entirely within your browser.",
  howItWorks: [
    "Choose Encode or Decode.",
    "Paste your text, or select a file to convert to a Base64 data string.",
    "The result is produced instantly with full UTF-8 support.",
    "Copy the output or download it as needed.",
  ],
  useCases: [
    "Embed images and fonts directly in CSS or HTML as data URIs.",
    "Encode credentials for HTTP Basic Authorization headers.",
    "Transport binary data safely inside JSON or XML.",
    "Inspect and decode JWT segments and API payloads.",
  ],
  faqs: [
    {
      question: "Does Base64 encrypt my data?",
      answer:
        "No. Base64 is an encoding, not encryption. It makes binary data text-safe but provides no security — anyone can decode it.",
    },
    {
      question: "Does it handle Unicode and emoji?",
      answer:
        "Yes. Text is encoded as UTF-8 first, so accented characters, non-Latin scripts and emoji all encode and decode correctly.",
    },
    {
      question: "Can I encode files?",
      answer:
        "Yes. Select any file and it will be converted to a Base64 string in your browser. Files are processed in memory and never uploaded.",
    },
  ],
};
