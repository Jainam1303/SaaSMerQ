import type { ToolMeta } from "../types";

export const discountCalculator: ToolMeta = {
  slug: "discount-calculator",
  name: "Discount Calculator",
  seoTitle: "Discount Calculator — Sale Price & Percent Off",
  shortDescription:
    "Calculate discount amount, final sale price and savings from percentage or flat discounts.",
  metaDescription:
    "Free discount calculator. Enter original price and discount percent or amount to get sale price, savings and reverse-calculate original price from a discounted price.",
  category: "business",
  icon: "badge-percent",
  keywords: [
    "discount calculator",
    "sale price calculator",
    "percent off calculator",
    "discount percentage calculator",
    "price after discount",
  ],
  addedAt: "2026-06-20",
  featured: false,
  popular: true,
  intro:
    "Quickly work out sale prices for retail, e-commerce and wholesale deals. Enter original price and discount (percent or flat amount) to see savings and final price — or reverse-calculate the original price from a discounted tag.",
  howItWorks: [
    "Choose percent discount or flat amount off.",
    "Enter the original price or discounted price.",
    "View discount amount, final price and savings percentage.",
    "Copy results for invoices, listings or negotiation notes.",
  ],
  useCases: [
    "Price products during seasonal sales and festivals.",
    "Verify retailer discount claims during shopping.",
    "Calculate bulk or B2B trade discounts.",
    "Reverse-check MRP from a promotional price.",
  ],
  faqs: [
    {
      question: "How do I calculate a 20% discount?",
      answer:
        "Discount amount = Original price × 20 ÷ 100. Final price = Original price − discount amount. Example: ₹500 × 20% = ₹100 off → ₹400 sale price.",
    },
    {
      question: "How do I find the original price after discount?",
      answer:
        "Original = Discounted price ÷ (1 − discount% ÷ 100). Example: ₹400 after 20% off → Original = 400 ÷ 0.8 = ₹500.",
    },
    {
      question: "Can I stack multiple discounts?",
      answer:
        "This calculator handles one discount at a time. For stacked discounts, apply the first discount to get an intermediate price, then run again with the second discount.",
    },
  ],
};
