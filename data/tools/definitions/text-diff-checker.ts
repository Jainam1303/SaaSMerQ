import type { ToolMeta } from "../types";

export const textDiffChecker: ToolMeta = {
  slug: "text-diff-checker",
  name: "Text Diff Checker",
  seoTitle: "Text Diff Checker — Compare Two Texts Online",
  shortDescription:
    "Compare two text blocks side by side and highlight additions and deletions.",
  metaDescription:
    "Free online text diff checker. Compare two texts side by side with highlighted additions, deletions and changes. Ideal for code, documents and config files — all in your browser.",
  category: "developer",
  icon: "git-compare",
  keywords: [
    "text diff",
    "diff checker",
    "compare text online",
    "text comparison tool",
    "side by side diff",
    "document diff",
  ],
  addedAt: "2026-06-20",
  intro:
    "Spot differences between two versions of any text. Paste an original and a revised version to see additions, deletions and changes highlighted — perfect for code, configs and copy edits.",
  howItWorks: [
    "Paste the original text in the left input area.",
    "Paste the revised text in the right input area.",
    "Differences are highlighted automatically as you edit.",
    "Review added, removed and unchanged lines in the diff view.",
  ],
  useCases: [
    "Compare config file versions before deploying changes.",
    "Review document revisions during editing and proofreading.",
    "Verify output from formatters, minifiers or converters.",
    "Debug unexpected changes in logs, scripts or templates.",
  ],
  faqs: [
    {
      question: "Is my text sent to a server?",
      answer:
        "No. Diff computation runs entirely in your browser.",
    },
    {
      question: "Does it work line by line or word by word?",
      answer:
        "The diff view highlights changes at the line level, with inline highlighting for changed portions within lines where supported.",
    },
    {
      question: "Is there a size limit?",
      answer:
        "There is no server-side limit because processing is local. Very large texts may take longer depending on your device.",
    },
  ],
};
