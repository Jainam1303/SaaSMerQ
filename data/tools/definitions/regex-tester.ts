import type { ToolMeta } from "../types";

export const regexTester: ToolMeta = {
  slug: "regex-tester",
  name: "Regex Tester",
  seoTitle: "Regex Tester — Test Regular Expressions Online",
  shortDescription:
    "Test regular expressions against sample text with live match highlighting.",
  metaDescription:
    "Free online regex tester. Write and debug regular expressions with live match highlighting, capture groups and flag support. All processing happens privately in your browser.",
  category: "developer",
  icon: "search",
  keywords: [
    "regex tester",
    "regular expression tester",
    "regex online",
    "regex debugger",
    "pattern matcher",
    "regex validator",
  ],
  addedAt: "2026-06-20",
  popular: true,
  intro:
    "Build and debug regular expressions with instant feedback. Enter your pattern and test string to see matches highlighted, groups extracted and errors explained — all without leaving your browser.",
  howItWorks: [
    "Enter your regular expression pattern in the input field.",
    "Paste or type the text you want to test against.",
    "Toggle flags such as global, case-insensitive and multiline.",
    "Review matches, capture groups and any syntax errors in real time.",
  ],
  useCases: [
    "Validate form input patterns before deploying to production.",
    "Extract structured data from logs and unstructured text.",
    "Debug complex regex used in search-and-replace workflows.",
    "Learn regex syntax by experimenting with live examples.",
  ],
  faqs: [
    {
      question: "Which regex flavor is supported?",
      answer:
        "This tool uses JavaScript's built-in regular expression engine, which follows ECMAScript syntax.",
    },
    {
      question: "Can I test capture groups?",
      answer:
        "Yes. Matched groups are listed so you can verify named and numbered captures.",
    },
    {
      question: "Why does my pattern show an error?",
      answer:
        "Common issues include unescaped special characters, unclosed groups or brackets, and invalid quantifiers. The error message describes what went wrong.",
    },
  ],
};
