import type { ToolMeta } from "../types";

export const timestampConverter: ToolMeta = {
  slug: "timestamp-converter",
  name: "Timestamp Converter",
  seoTitle: "Unix Timestamp Converter — Epoch to Date",
  shortDescription:
    "Convert Unix timestamps to human-readable dates and back.",
  metaDescription:
    "Free Unix timestamp converter. Convert epoch seconds and milliseconds to readable dates and times, or turn any datetime into a Unix timestamp. Supports time zones in your browser.",
  category: "developer",
  icon: "clock",
  keywords: [
    "timestamp converter",
    "unix timestamp",
    "epoch converter",
    "unix time to date",
    "date to timestamp",
    "epoch milliseconds",
  ],
  addedAt: "2026-06-20",
  featured: true,
  intro:
    "Debug timestamps without mental math. Paste a Unix epoch value to see the corresponding date and time, or pick a datetime to get its epoch in seconds and milliseconds.",
  howItWorks: [
    "Enter a Unix timestamp in seconds or milliseconds.",
    "View the converted local and UTC datetime instantly.",
    "Alternatively, select or enter a date to get the epoch value.",
    "Copy either the timestamp or formatted date as needed.",
  ],
  useCases: [
    "Decode timestamps from API responses and server logs.",
    "Verify expiry times on JWTs, cookies and cache headers.",
    "Convert database epoch columns to readable dates during debugging.",
    "Generate timestamps for test fixtures and scheduled jobs.",
  ],
  faqs: [
    {
      question: "Does it support milliseconds?",
      answer:
        "Yes. The tool detects whether your input is in seconds (10 digits) or milliseconds (13 digits) and converts accordingly.",
    },
    {
      question: "Which time zone is used?",
      answer:
        "Converted dates are shown in your browser's local time zone, with UTC displayed alongside for reference.",
    },
    {
      question: "What is a Unix timestamp?",
      answer:
        "A Unix timestamp is the number of seconds (or milliseconds) elapsed since 1 January 1970 00:00:00 UTC, also known as the Unix epoch.",
    },
  ],
};
