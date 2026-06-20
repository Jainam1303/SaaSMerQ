import type { ToolMeta } from "../types";

export const rdCalculator: ToolMeta = {
  slug: "rd-calculator",
  name: "RD Calculator",
  seoTitle: "RD Calculator India — Recurring Deposit Maturity Amount",
  shortDescription:
    "Calculate recurring deposit maturity value and total interest for monthly RD instalments in India.",
  metaDescription:
    "Free RD calculator for India. Enter monthly deposit, interest rate and tenure to get maturity amount, total deposits and interest earned on your recurring deposit.",
  category: "business",
  icon: "piggy-bank",
  keywords: [
    "rd calculator",
    "recurring deposit calculator india",
    "rd maturity calculator",
    "monthly deposit calculator",
    "bank rd calculator",
  ],
  addedAt: "2026-06-20",
  featured: true,
  popular: true,
  intro:
    "Plan your recurring deposit with confidence. Enter your monthly instalment, bank interest rate and tenure to see the maturity amount, total money deposited and interest earned — using the standard Indian RD formula banks apply.",
  howItWorks: [
    "Enter the monthly RD instalment amount.",
    "Set the annual interest rate from your bank.",
    "Choose tenure in years or months.",
    "View maturity value, total deposits and interest earned.",
    "Copy or share results for budgeting discussions.",
  ],
  useCases: [
    "Save monthly for a wedding, travel or gadget purchase.",
    "Compare RD vs SIP for disciplined savings.",
    "Estimate post office or bank RD returns.",
    "Teach children about regular saving habits.",
  ],
  faqs: [
    {
      question: "How is RD maturity calculated?",
      answer:
        "Indian banks use the formula M = R × [(1+i)^n − 1] / i × (1+i), where R is monthly deposit, i is monthly interest rate (annual ÷ 12) and n is number of months.",
    },
    {
      question: "What is the minimum RD amount in India?",
      answer:
        "Most banks allow RDs from ₹100–₹500 per month. Post office RD minimum is typically ₹100 per month for a 5-year scheme.",
    },
    {
      question: "Is RD better than FD?",
      answer:
        "RDs suit monthly savers; FDs suit lump sums. RD interest rates are often similar to FDs but compounding works on growing balances each month.",
    },
  ],
};
