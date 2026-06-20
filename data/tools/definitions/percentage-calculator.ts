import type { ToolMeta } from "../types";

export const percentageCalculator: ToolMeta = {
  slug: "percentage-calculator",
  name: "Percentage Calculator",
  seoTitle: "Percentage Calculator — % of, Increase, Decrease & Difference",
  shortDescription:
    "Find X% of Y, percentage increase, decrease and difference between two values.",
  metaDescription:
    "Free percentage calculator. Compute X% of Y, percentage increase or decrease, and percentage difference between two numbers — instant results for exams, business and shopping.",
  category: "business",
  icon: "percent",
  keywords: [
    "percentage calculator",
    "percent calculator",
    "percentage increase calculator",
    "percentage decrease",
    "percentage difference",
    "what is x percent of y",
  ],
  addedAt: "2026-06-20",
  featured: true,
  popular: true,
  intro:
    "Solve everyday percentage problems in seconds. Find what X% of a number is, calculate percentage increase or decrease, or compare two values with percentage difference — no formulas needed.",
  howItWorks: [
    "Choose the calculation type: % of, increase, decrease or difference.",
    "Enter the required values (percent and base, or old and new values).",
    "See the result instantly with a clear explanation line.",
    "Copy or share your result for homework, invoices or reports.",
  ],
  useCases: [
    "Calculate discounts and markups on products.",
    "Measure growth or decline in sales or metrics.",
    "Solve school and exam percentage problems.",
    "Compare price changes between two amounts.",
  ],
  faqs: [
    {
      question: "How do I find X% of Y?",
      answer:
        "Multiply Y by X and divide by 100. For example, 15% of 200 = 200 × 15 ÷ 100 = 30.",
    },
    {
      question: "How is percentage increase calculated?",
      answer:
        "Percentage increase = ((New value − Old value) ÷ Old value) × 100. A positive result means growth; negative means decline.",
    },
    {
      question: "What is percentage difference?",
      answer:
        "Percentage difference compares two values relative to their average: |A − B| ÷ ((A + B) ÷ 2) × 100. It shows how far apart two numbers are.",
    },
  ],
};
