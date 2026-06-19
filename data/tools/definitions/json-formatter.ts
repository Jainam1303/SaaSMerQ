import type { ToolMeta } from "../types";

export const jsonFormatter: ToolMeta = {
  slug: "json-formatter",
  name: "JSON Formatter & Validator",
  seoTitle: "JSON Formatter, Validator & Minifier",
  shortDescription:
    "Beautify, validate and minify JSON with clear error reporting.",
  metaDescription:
    "Format, validate and minify JSON online. Pretty-print with custom indentation, catch syntax errors with precise messages, and minify for production. Private and in-browser.",
  category: "developer",
  icon: "braces",
  keywords: [
    "json formatter",
    "json validator",
    "json beautifier",
    "json minify",
    "format json online",
  ],
  addedAt: "2026-01-08",
  featured: true,
  popular: true,
  intro:
    "Clean up messy JSON in an instant. Paste your data to beautify it with consistent indentation, validate its structure with precise error messages, or minify it to the smallest possible size for production.",
  howItWorks: [
    "Paste or type your JSON into the input area.",
    "Choose Format to pretty-print, Minify to compress, or Validate to check syntax.",
    "Any syntax errors are reported with a clear, human-readable message.",
    "Copy the result to your clipboard when you're done.",
  ],
  useCases: [
    "Debug API responses and configuration files.",
    "Beautify minified JSON for easier reading and review.",
    "Shrink JSON payloads before shipping to production.",
    "Validate JSON before importing it into another system.",
  ],
  faqs: [
    {
      question: "Is my JSON uploaded anywhere?",
      answer:
        "No. All parsing, formatting and validation happen locally in your browser. Your data is never transmitted.",
    },
    {
      question: "What indentation options are available?",
      answer:
        "You can format with 2 spaces, 4 spaces or tabs to match your project's style.",
    },
    {
      question: "Why does it say my JSON is invalid?",
      answer:
        "Common causes include trailing commas, single quotes instead of double quotes, missing brackets, or comments (which standard JSON does not allow). The error message points to what went wrong.",
    },
  ],
};
