import type { ToolMeta } from "../types";

export const hraCalculator: ToolMeta = {
  slug: "hra-calculator",
  name: "HRA Calculator",
  seoTitle: "HRA Calculator India — House Rent Allowance Exemption",
  shortDescription:
    "Calculate tax-exempt HRA under Indian income tax rules for metro and non-metro cities.",
  metaDescription:
    "Free HRA exemption calculator for India. Enter basic salary, HRA received, rent paid and city type to compute taxable vs exempt HRA under Section 10(13A).",
  category: "business",
  icon: "scale",
  keywords: [
    "hra calculator",
    "hra exemption calculator india",
    "house rent allowance calculator",
    "hra tax exemption",
    "salary hra calculator",
  ],
  addedAt: "2026-06-20",
  featured: false,
  popular: true,
  intro:
    "Find how much of your House Rent Allowance is tax-exempt under Indian law. Enter basic salary, actual HRA received, rent paid and whether you live in a metro city — the calculator applies the three-part rule and shows exempt vs taxable HRA instantly.",
  howItWorks: [
    "Enter monthly basic salary (excluding other allowances).",
    "Enter actual HRA received from your employer per month.",
    "Enter rent paid per month and select metro or non-metro city.",
    "View exempt HRA, taxable HRA and the limiting factor applied.",
    "Use results when filing ITR or negotiating salary structure.",
  ],
  useCases: [
    "Estimate tax savings when relocating to a rented home.",
    "Validate employer payroll HRA exemption calculations.",
    "Compare metro vs non-metro exemption limits.",
    "Plan rent receipts and landlord PAN requirements.",
  ],
  faqs: [
    {
      question: "How is HRA exemption calculated?",
      answer:
        "Exempt HRA is the minimum of: (1) actual HRA received, (2) rent paid minus 10% of basic salary, (3) 50% of basic for metro cities or 40% for non-metro cities.",
    },
    {
      question: "Which cities are metro for HRA?",
      answer:
        "Delhi, Mumbai, Kolkata and Chennai are treated as metro cities for the 50% rule. Other cities use the 40% of basic limit.",
    },
    {
      question: "Can I claim HRA if I live with parents?",
      answer:
        "You can claim HRA if you pay rent to parents and have valid rent receipts and their PAN if annual rent exceeds ₹1 lakh. The arrangement must be genuine.",
    },
  ],
};
