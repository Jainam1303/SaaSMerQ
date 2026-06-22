import type { ToolMeta } from "../types";

export const xmlFormatter: ToolMeta = {
  slug: "xml-formatter",
  name: "XML Formatter",
  seoTitle: "XML Formatter & Validator — Pretty-Print XML",
  shortDescription:
    "Format, validate and minify XML with clear error reporting.",
  metaDescription:
    "Free online XML formatter and validator. Pretty-print XML with indentation, validate structure, catch syntax errors and minify for production — all in your browser.",
  category: "developer",
  icon: "braces",
  keywords: [
    "xml formatter",
    "xml validator",
    "xml beautifier",
    "format xml online",
    "xml pretty print",
    "xml minify",
  ],
  addedAt: "2026-06-20",
  intro:
    "Clean up XML documents in seconds. Paste your markup to beautify it with consistent indentation, validate its structure with helpful errors, or minify it for compact storage and transport.",
  howItWorks: [
    "Paste or type your XML into the input area.",
    "Choose Format to pretty-print, Minify to compress, or Validate to check syntax.",
    "Syntax errors are reported with a clear, human-readable message.",
    "Copy the result to your clipboard when you're done.",
  ],
  useCases: [
    "Debug API responses and configuration files in XML format.",
    "Beautify minified XML exports for easier reading.",
    "Validate XML before importing into another system.",
    "Shrink XML payloads before shipping to production.",
  ],
  faqs: [
    {
      question: "Is my XML uploaded anywhere?",
      answer:
        "No. All parsing, formatting and validation happen locally in your browser.",
    },
    {
      question: "Does it support namespaces?",
      answer:
        "Yes. Standard XML with namespaces is supported for formatting and validation.",
    },
    {
      question: "Why does it say my XML is invalid?",
      answer:
        "Common causes include unclosed tags, mismatched opening and closing elements, invalid characters or malformed attributes. The error message indicates what went wrong.",
    },
  ],
};
