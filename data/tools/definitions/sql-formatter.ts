import type { ToolMeta } from "../types";

export const sqlFormatter: ToolMeta = {
  slug: "sql-formatter",
  name: "SQL Formatter",
  seoTitle: "SQL Formatter — Beautify & Format Queries",
  shortDescription:
    "Format and beautify SQL queries with consistent indentation and casing.",
  metaDescription:
    "Free online SQL formatter. Beautify SQL queries with proper indentation, keyword casing and line breaks. Supports common dialects and runs privately in your browser.",
  category: "developer",
  icon: "list-tree",
  keywords: [
    "sql formatter",
    "sql beautifier",
    "format sql online",
    "sql pretty print",
    "sql indenter",
    "sql query formatter",
  ],
  addedAt: "2026-06-20",
  intro:
    "Turn messy one-line SQL into readable, consistently formatted queries. Paste your statement to apply indentation, line breaks and keyword casing so reviews and debugging are easier.",
  howItWorks: [
    "Paste your SQL query into the input area.",
    "Choose formatting options such as indentation size and keyword case.",
    "Click format to beautify the query instantly.",
    "Copy the formatted SQL to your editor or documentation.",
  ],
  useCases: [
    "Clean up SQL copied from logs, ORMs or database clients.",
    "Prepare readable queries for code reviews and documentation.",
    "Standardize formatting across a team's SQL style guide.",
    "Make complex joins and subqueries easier to understand.",
  ],
  faqs: [
    {
      question: "Which SQL dialects are supported?",
      answer:
        "The formatter handles common ANSI SQL syntax used across PostgreSQL, MySQL, SQLite and SQL Server, though dialect-specific features may vary.",
    },
    {
      question: "Will formatting change query results?",
      answer:
        "No. Formatting only adjusts whitespace and casing. The logical meaning of the query stays the same.",
    },
    {
      question: "Is my SQL sent to a server?",
      answer:
        "No. Formatting runs entirely in your browser.",
    },
  ],
};
