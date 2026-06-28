import type { ToolMeta } from "../types";

export const profitMarginCalculator: ToolMeta = {
  slug: "profit-margin-calculator",
  name: "Profit Margin Calculator",
  seoTitle: "Profit Margin Calculator — Gross & Net Margin %",
  shortDescription:
    "Calculate gross profit, margin percentage and markup from cost and selling price.",
  metaDescription:
    "Free profit margin calculator. Enter cost price and selling price to get profit amount, margin %, markup % and revenue breakdown for your business.",
  category: "business",
  icon: "chart-line",
  keywords: [
    "profit margin calculator",
    "gross margin calculator",
    "markup calculator",
    "profit percentage calculator",
    "margin vs markup",
  ],
  addedAt: "2026-06-20",
  featured: false,
  popular: true,
  intro:
    "Understand whether your pricing covers costs and leaves healthy profit. Enter cost price and selling price to see profit amount, gross margin percentage, markup percentage and a clear breakdown — essential for retailers, D2C brands and freelancers.",
  howItWorks: [
    "Enter the cost price (what you pay to make or buy).",
    "Enter the selling price (what the customer pays).",
    "View profit, margin % and markup % instantly.",
    "Adjust prices until margin meets your target.",
  ],
  useCases: [
    "Set wholesale and retail prices for products.",
    "Evaluate whether a new SKU is worth selling.",
    "Compare margin across product lines.",
    "Explain margin vs markup to sales teams.",
  ],
  faqs: [
    {
      question: "What is gross profit margin?",
      answer:
        "Margin % = (Selling price − Cost price) ÷ Selling price × 100. It shows what share of revenue is profit before operating expenses.",
    },
    {
      question: "What is markup vs margin?",
      answer:
        "Markup % = (Selling price − Cost) ÷ Cost × 100. Margin uses selling price as the base; markup uses cost. A 25% margin equals a 33.3% markup.",
    },
    {
      question: "What is a good profit margin?",
      answer:
        "Varies by industry — retail may target 20–50% gross margin, SaaS often higher. Compare against competitors and ensure net margin covers rent, salaries and taxes.",
    },
    {
      question: "How do I price a product for a target margin?",
      answer:
        "Selling price = Cost ÷ (1 − target margin). For a ₹100 cost item and a 40% target margin, the selling price is ₹100 ÷ 0.60 = ₹166.67. Setting price by margin (not markup) guarantees the profit share you want on revenue.",
    },
    {
      question: "How do I convert markup to margin?",
      answer:
        "Margin = markup ÷ (1 + markup). A 50% markup equals a 33.3% margin, and a 100% markup equals a 50% margin. They describe the same profit from different bases — cost for markup, selling price for margin.",
    },
    {
      question: "What is the difference between gross and net profit margin?",
      answer:
        "Gross margin counts only the direct cost of goods sold. Net profit margin subtracts every expense — operating costs, salaries, rent, interest and tax — so it reflects the true bottom-line profit per rupee of revenue.",
    },
  ],
};
