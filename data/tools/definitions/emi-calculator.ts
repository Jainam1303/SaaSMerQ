import type { ToolMeta } from "../types";

export const emiCalculator: ToolMeta = {
  slug: "emi-calculator",
  name: "EMI Calculator",
  seoTitle: "EMI Calculator India — Home, Car & Personal Loan EMI",
  shortDescription:
    "Calculate monthly EMI, total interest and full repayment for any loan in India.",
  metaDescription:
    "Free EMI calculator for India. Enter loan amount, interest rate and tenure to get monthly EMI, total interest, total repayment and a month-by-month amortization summary.",
  category: "business",
  icon: "calculator",
  keywords: [
    "emi calculator",
    "emi calculator india",
    "home loan emi calculator",
    "car loan emi",
    "personal loan emi",
    "loan emi calculator",
  ],
  addedAt: "2026-06-20",
  featured: true,
  popular: true,
  intro:
    "Plan your home loan, car loan or personal loan with confidence. Enter the loan amount, annual interest rate and tenure to see your monthly EMI, how much interest you will pay over the loan life, and a clear amortization breakdown — updated instantly as you change inputs.",
  howItWorks: [
    "Enter the loan amount you want to borrow (principal).",
    "Set the annual interest rate offered by your bank or lender.",
    "Choose the loan tenure in years or months.",
    "View your monthly EMI, total interest and total repayment instantly.",
    "Review the amortization table to see principal vs interest each month.",
  ],
  useCases: [
    "Compare home loan EMIs before buying property.",
    "Check whether a car loan fits your monthly budget.",
    "Estimate personal loan repayments for weddings or emergencies.",
    "See how tenure changes affect total interest paid.",
  ],
  faqs: [
    {
      question: "How is EMI calculated?",
      answer:
        "EMI uses the standard reducing-balance formula: EMI = P × r × (1+r)^n / ((1+r)^n − 1), where P is the loan amount, r is the monthly interest rate (annual rate ÷ 12), and n is the number of monthly instalments.",
    },
    {
      question: "Does this EMI calculator work for all loans in India?",
      answer:
        "Yes. It works for home loans, car loans, personal loans and education loans from Indian banks and NBFCs that use standard monthly EMI schedules.",
    },
    {
      question: "What is an amortization schedule?",
      answer:
        "An amortization schedule shows how each EMI is split between principal repayment and interest. Early months have higher interest; later months repay more principal.",
    },
    {
      question: "What is the EMI formula with an example?",
      answer:
        "EMI = P × r × (1+r)^n / ((1+r)^n − 1). For a ₹10,00,000 loan at 9% annual interest over 20 years (n = 240 months, r = 0.0075), the EMI works out to about ₹8,997 per month, with roughly ₹11.6 lakh paid as total interest.",
    },
    {
      question: "What is the difference between reducing balance and flat rate EMI?",
      answer:
        "Reducing balance charges interest only on the outstanding principal, so interest falls each month — this is what most Indian home, car and personal loans use. A flat rate charges interest on the full original amount for the whole tenure, making the effective rate almost double. This calculator uses the reducing-balance method.",
    },
    {
      question: "How can I lower my total interest?",
      answer:
        "Choose a shorter tenure, make a larger down payment to reduce principal, or prepay lump sums when possible. Even one extra EMI a year can cut years off a long home loan and save significant interest.",
    },
  ],
};
