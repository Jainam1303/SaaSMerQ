import type { ToolMeta } from "../types";

export const jsonToCsvConverter: ToolMeta = {
  slug: "json-to-csv-converter",
  name: "JSON to CSV Converter",
  seoTitle: "JSON to CSV Converter — Free Online Tool",
  shortDescription:
    "Convert JSON arrays to CSV for spreadsheets and data exports.",
  metaDescription:
    "Free JSON to CSV converter. Transform JSON arrays and objects into comma-separated values for Excel, Google Sheets and data exports. Runs privately in your browser.",
  category: "developer",
  icon: "list-tree",
  keywords: [
    "json to csv",
    "json csv converter",
    "convert json to csv",
    "json to spreadsheet",
    "json export csv",
    "json array to csv",
  ],
  addedAt: "2026-06-20",
  intro:
    "Export JSON data as CSV for spreadsheets and reporting tools. Paste a JSON array of objects and get a properly quoted CSV with headers derived from object keys.",
  howItWorks: [
    "Paste your JSON array into the input area.",
    "The converter detects object keys and builds CSV headers automatically.",
    "Review the CSV output with proper quoting and escaping.",
    "Copy the result or download it as a .csv file.",
  ],
  useCases: [
    "Export API response data into Excel or Google Sheets.",
    "Generate CSV reports from application JSON exports.",
    "Create test fixtures from structured JSON datasets.",
    "Share tabular snapshots with non-technical stakeholders.",
  ],
  faqs: [
    {
      question: "What JSON structure is required?",
      answer:
        "The input should be a JSON array of flat objects. Nested objects may be stringified or flattened depending on converter options.",
    },
    {
      question: "Are special characters escaped?",
      answer:
        "Yes. Fields containing commas, quotes or newlines are wrapped in quotes with internal quotes escaped per CSV conventions.",
    },
    {
      question: "Can I customize the delimiter?",
      answer:
        "The default delimiter is a comma, which is compatible with most spreadsheet applications.",
    },
  ],
};
