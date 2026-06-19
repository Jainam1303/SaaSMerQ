import type { ToolMeta } from "../types";

export const imageCompressor: ToolMeta = {
  slug: "image-compressor",
  name: "Image Compressor",
  seoTitle: "Image Compressor — Shrink JPG, PNG & WebP",
  shortDescription:
    "Compress JPG, PNG and WebP images in your browser without uploading them.",
  metaDescription:
    "Compress JPG, PNG and WebP images online for free. Reduce file size with adjustable quality, all processed privately in your browser — no uploads, no waiting.",
  category: "image",
  icon: "file-archive",
  keywords: [
    "image compressor",
    "compress jpg",
    "compress png",
    "reduce image size",
    "webp compressor",
  ],
  addedAt: "2026-01-12",
  featured: true,
  popular: true,
  intro:
    "Reduce image file sizes without sending your photos to a server. Adjust the quality, preview the savings, and download smaller JPG, PNG or WebP files — perfect for faster websites and smaller email attachments.",
  howItWorks: [
    "Select or drop a JPG, PNG or WebP image (up to 10 MB).",
    "Choose an output format and adjust the quality slider.",
    "Compression runs instantly in your browser using the Canvas API.",
    "Compare original vs compressed size, then download the result.",
  ],
  useCases: [
    "Speed up web pages with lighter images and better Core Web Vitals.",
    "Fit photos under email and upload size limits.",
    "Reduce storage and bandwidth costs.",
    "Prepare optimized assets for apps and marketplaces.",
  ],
  faqs: [
    {
      question: "Are my images uploaded to a server?",
      answer:
        "No. All compression happens locally in your browser. Your images never leave your device, which keeps them private and makes the process instant.",
    },
    {
      question: "Which formats are supported?",
      answer:
        "You can compress and convert between JPG, PNG and WebP. WebP usually offers the best size-to-quality ratio.",
    },
    {
      question: "Is there a file size limit?",
      answer:
        "For performance and safety, uploads are capped at 10 MB and validated by type before processing.",
    },
  ],
};
