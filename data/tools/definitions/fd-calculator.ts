import type { ToolMeta } from "../types";

export const fdCalculator: ToolMeta = {
  slug: "fd-calculator",
  name: "FD Calculator",
  seoTitle: "FD Calculator India — Fixed Deposit Maturity & Interest",
  shortDescription:
    "Calculate fixed deposit maturity amount, interest earned and effective yield for Indian banks.",
  metaDescription:
    "Free FD calculator for India. Enter deposit amount, interest rate, tenure and compounding frequency to get maturity value, total interest and effective annual yield.",
  category: "business",
  icon: "landmark",
  keywords: [
    "fd calculator",
    "fixed deposit calculator india",
    "fd maturity calculator",
    "fd interest calculator",
    "bank fd calculator",
  ],
  addedAt: "2026-06-20",
  featured: true,
  popular: true,
  intro:
    "Estimate how much your fixed deposit will grow before you lock in at your bank. Enter the deposit amount, annual interest rate, tenure and how often interest is compounded to see maturity value, interest earned and effective yield — updated instantly.",
  howItWorks: [
    "Enter the lump-sum amount you plan to deposit.",
    "Set the annual interest rate offered by your bank.",
    "Choose tenure in years or months.",
    "Select compounding frequency (quarterly is common for Indian FDs).",
    "View maturity amount, interest earned and effective annual rate.",
  ],
  useCases: [
    "Compare FD returns across banks before investing.",
    "Plan short-term savings with 1–3 year FDs.",
    "See how compounding frequency affects maturity.",
    "Estimate retirement or emergency fund growth safely.",
  ],
  faqs: [
    {
      question: "How is FD interest calculated in India?",
      answer:
        "Most Indian banks compound FD interest quarterly. Maturity = P × (1 + r/n)^(n×t), where P is deposit, r is annual rate, n is compounding periods per year and t is tenure in years.",
    },
    {
      question: "Is FD interest taxable in India?",
      answer:
        "Yes. FD interest is added to your income and taxed per your slab. Banks may deduct TDS if interest exceeds ₹40,000 per year (₹50,000 for senior citizens).",
    },
    {
      question: "What is effective annual yield on an FD?",
      answer:
        "Effective yield reflects compounding — the actual annual return you earn when interest is reinvested each period, which is higher than the nominal rate when compounded more than once a year.",
    },
  ],
};
