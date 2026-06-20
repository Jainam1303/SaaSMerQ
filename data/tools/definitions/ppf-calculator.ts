import type { ToolMeta } from "../types";

export const ppfCalculator: ToolMeta = {
  slug: "ppf-calculator",
  name: "PPF Calculator",
  seoTitle: "PPF Calculator India — Public Provident Fund Returns",
  shortDescription:
    "Calculate PPF maturity amount, interest earned and year-by-year growth for annual deposits.",
  metaDescription:
    "Free PPF calculator for India. Model annual deposits up to ₹1.5 lakh, apply current PPF interest rate and see maturity after 15 years with interest breakdown.",
  category: "business",
  icon: "wallet",
  keywords: [
    "ppf calculator",
    "ppf calculator india",
    "public provident fund calculator",
    "ppf maturity calculator",
    "ppf interest calculator",
  ],
  addedAt: "2026-06-20",
  featured: true,
  popular: true,
  intro:
    "Model your Public Provident Fund growth over the 15-year lock-in. Enter annual deposits (up to ₹1.5 lakh), the current PPF rate and see year-by-year balance, total interest and final maturity — with tax-free returns in mind.",
  howItWorks: [
    "Enter your planned annual PPF deposit (max ₹1.5 lakh).",
    "Set the annual PPF interest rate (government notified).",
    "Choose projection period (default 15 years minimum lock-in).",
    "Review year-by-year balance and total interest earned.",
    "Copy results for tax planning or retirement discussions.",
  ],
  useCases: [
    "Plan Section 80C investments alongside ELSS and life insurance.",
    "Compare PPF vs ELSS for long-term goals.",
    "Estimate retirement corpus from disciplined PPF saving.",
    "Understand 15-year lock-in growth before opening an account.",
  ],
  faqs: [
    {
      question: "What is the PPF interest rate?",
      answer:
        "The Government of India revises PPF rates quarterly. Check the latest notified rate on the Finance Ministry or India Post website — this calculator lets you enter any rate.",
    },
    {
      question: "Is PPF interest tax-free?",
      answer:
        "Yes. PPF falls under EEE — deposits (up to ₹1.5L under 80C), interest and maturity are exempt from income tax for resident Indians.",
    },
    {
      question: "Can I withdraw from PPF before 15 years?",
      answer:
        "Partial withdrawals are allowed from year 7 under rules, and loans are available from year 3. Full account closure before 15 years is only in specific cases.",
    },
  ],
};
