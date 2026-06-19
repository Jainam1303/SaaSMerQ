import type { ToolMeta } from "../types";

export const imageResizer: ToolMeta = {
  slug: "image-resizer",
  name: "Image Resizer",
  seoTitle: "Image Resizer — Resize JPG, PNG & WebP by Pixels",
  shortDescription:
    "Resize images to exact dimensions with optional aspect-ratio locking.",
  metaDescription:
    "Resize JPG, PNG and WebP images online for free. Set exact width and height in pixels, preserve aspect ratio, and download — all processed privately in your browser.",
  category: "image",
  icon: "scaling",
  keywords: [
    "image resizer",
    "resize image",
    "resize jpg",
    "change image dimensions",
    "resize png",
  ],
  addedAt: "2026-01-13",
  popular: true,
  intro:
    "Resize images to the exact pixel dimensions you need. Lock the aspect ratio to avoid distortion or set width and height independently, then download the result — no uploads and no quality lost to a slow server round-trip.",
  howItWorks: [
    "Select or drop a JPG, PNG or WebP image (up to 10 MB).",
    "Enter your target width and/or height in pixels.",
    "Keep 'Maintain aspect ratio' on to scale proportionally.",
    "Preview the new dimensions and download the resized image.",
  ],
  useCases: [
    "Fit images to social media and thumbnail dimensions.",
    "Prepare profile pictures and avatars at exact sizes.",
    "Standardize product images for a catalog or store.",
    "Scale down large photos before uploading them.",
  ],
  faqs: [
    {
      question: "Will resizing distort my image?",
      answer:
        "Not if you keep 'Maintain aspect ratio' enabled — the tool scales width and height together. Disable it only when you intentionally want to stretch to exact dimensions.",
    },
    {
      question: "Are my images uploaded?",
      answer:
        "No. Resizing is performed in your browser with the Canvas API, so your images stay on your device.",
    },
    {
      question: "Can I enlarge an image?",
      answer:
        "Yes, though enlarging beyond the original resolution can look soft. For best quality, resize down rather than up.",
    },
  ],
};
