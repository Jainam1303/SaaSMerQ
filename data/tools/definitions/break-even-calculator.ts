import type { ToolMeta } from "../types";

export const breakEvenCalculator: ToolMeta = {
  slug: "break-even-calculator",
  name: "Break-even Calculator",
  seoTitle: "Break-even Calculator — Units & Revenue Target",
  shortDescription:
    "Calculate break-even point in units and revenue from fixed costs, price and variable cost.",
  metaDescription:
    "Free break-even calculator. Enter fixed costs, price per unit and variable cost per unit to find how many units you must sell to cover all costs.",
  category: "business",
  icon: "chart-line",
  keywords: [
    "break even calculator",
    "breakeven point calculator",
    "break even analysis",
    "units to break even",
    "startup break even calculator",
  ],
  addedAt: "2026-06-20",
  featured: false,
  popular: false,
  intro:
    "Know exactly when your business covers its costs. Enter monthly or annual fixed costs, selling price per unit and variable cost per unit to find the break-even point in units and revenue — critical for startups, cafes, manufacturers and side hustles.",
  howItWorks: [
    "Enter total fixed costs (rent, salaries, insurance, etc.).",
    "Enter selling price per unit or service.",
    "Enter variable cost per unit (materials, shipping, commissions).",
    "View break-even units and break-even revenue.",
    "Adjust price or costs to model different scenarios.",
  ],
  useCases: [
    "Validate a startup idea before investing capital.",
    "Set sales targets for a new product launch.",
    "See how lowering variable costs speeds break-even.",
    "Plan café, salon or agency monthly targets.",
  ],
  faqs: [
    {
      question: "What is the break-even formula?",
      answer:
        "Break-even units = Fixed costs ÷ (Price per unit − Variable cost per unit). Break-even revenue = Break-even units × Price per unit.",
    },
    {
      question: "What if price equals variable cost?",
      answer:
        "You cannot break even — each unit sold does not contribute to fixed costs. You must raise price or cut variable or fixed costs.",
    },
    {
      question: "Should fixed costs be monthly or annual?",
      answer:
        "Use one period consistently. Enter monthly fixed costs for monthly targets, or annual for yearly planning — the calculator labels results accordingly.",
    },
  ],
};
