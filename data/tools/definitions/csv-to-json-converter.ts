import type { ToolMeta } from "../types";

export const csvToJsonConverter: ToolMeta = {
  slug: "csv-to-json-converter",
  name: "CSV to JSON Converter",
  seoTitle: "CSV to JSON Converter — Free Online Tool",
  shortDescription:
    "Convert CSV data to JSON arrays with configurable delimiter options.",
  metaDescription:
    "Free CSV to JSON converter. Transform comma-separated values into JSON arrays and objects with header detection and delimiter options. Private, in-browser conversion.",
  category: "developer",
  icon: "list-tree",
  keywords: [
    "csv to json",
    "csv json converter",
    "convert csv to json",
    "csv parser online",
    "csv to json array",
    "spreadsheet to json",
  ],
  addedAt: "2026-06-20",
  intro:
    "Turn spreadsheet exports and CSV files into JSON in one step. Paste your CSV data, choose delimiter and header options, and get clean JSON ready for APIs, scripts and databases.",
  howItWorks: [
    "Paste CSV text or upload a .csv file.",
    "Configure delimiter, quote character and whether the first row is a header.",
    "The JSON output is generated instantly in the output panel.",
    "Copy or download the JSON result.",
  ],
  useCases: [
    "Import spreadsheet data into JavaScript applications and APIs.",
    "Convert exported reports to JSON for testing and fixtures.",
    "Migrate tabular data into document stores and NoSQL databases.",
    "Prototype data pipelines without writing a custom parser.",
  ],
  faqs: [
    {
      question: "Does the first row become JSON keys?",
      answer:
        "When header mode is enabled, the first row is used as property names for each object in the resulting JSON array.",
    },
    {
      question: "Can I use semicolon delimiters?",
      answer:
        "Yes. You can configure the delimiter to match comma, semicolon, tab or other separators used in your file.",
    },
    {
      question: "Is my data uploaded?",
      answer:
        "No. Conversion happens entirely in your browser.",
    },
  ],
};
