import type { ToolMeta } from "../types";

export const loanCalculator: ToolMeta = {
  slug: "loan-calculator",
  name: "Loan Calculator",
  seoTitle: "Loan Calculator India — EMI, Interest & Repayment",
  shortDescription:
    "Calculate loan EMI, total interest, processing fees and full repayment for any Indian loan.",
  metaDescription:
    "Free loan calculator for India. Enter amount, rate, tenure and optional processing fee to get monthly EMI, total interest, fees and complete repayment schedule.",
  category: "business",
  icon: "calculator",
  keywords: [
    "loan calculator",
    "loan calculator india",
    "personal loan calculator",
    "emi loan calculator",
    "loan repayment calculator",
  ],
  addedAt: "2026-06-20",
  featured: false,
  popular: true,
  intro:
    "A complete loan repayment planner for Indian borrowers. Enter loan amount, interest rate, tenure and optional processing fee to see monthly EMI, total interest, fees and the full cost of borrowing — with an amortization summary table.",
  howItWorks: [
    "Enter the loan amount you want to borrow.",
    "Set the annual interest rate and tenure in years or months.",
    "Add an optional processing fee (flat or percentage).",
    "View EMI, total interest, fees and total repayment.",
    "Review the amortization table for principal vs interest each month.",
  ],
  useCases: [
    "Compare personal loan offers from banks and NBFCs.",
    "See true cost including processing fees.",
    "Check if a longer tenure is worth the extra interest.",
    "Plan education or business loan repayments.",
  ],
  faqs: [
    {
      question: "How is loan EMI calculated?",
      answer:
        "EMI uses the reducing balance formula on the principal. Processing fees are added separately to show total borrowing cost — they do not change the EMI formula unless rolled into the loan.",
    },
    {
      question: "What is a processing fee on loans?",
      answer:
        "Banks charge a one-time fee (often 0.5%–2% of loan amount) for processing your application. This calculator adds it to total cost for a realistic picture.",
    },
    {
      question: "Is this different from an EMI calculator?",
      answer:
        "Both use the same EMI math. This loan calculator additionally includes processing fees and labels results for general-purpose loans beyond home and car loans.",
    },
  ],
};
