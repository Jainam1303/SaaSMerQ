import type { ToolMeta } from "../types";

export const gstCalculator: ToolMeta = {
  slug: "gst-calculator",
  name: "GST Calculator",
  seoTitle: "GST Calculator — Add or Remove GST (India)",
  shortDescription:
    "Add or remove GST across all Indian slabs with a clear CGST/SGST breakdown.",
  metaDescription:
    "Free Indian GST calculator. Add GST to a base amount or extract GST from an inclusive price across 5%, 12%, 18% and 28% slabs, with CGST/SGST/IGST breakdown.",
  category: "business",
  icon: "calculator",
  keywords: [
    "gst calculator",
    "gst calculator india",
    "add gst",
    "remove gst",
    "cgst sgst calculator",
  ],
  addedAt: "2026-01-10",
  featured: true,
  popular: true,
  intro:
    "Calculate Goods and Services Tax the easy way. Add GST to a base price or work out the GST already included in a gross amount, choose any standard Indian slab, and see a clear CGST, SGST and IGST breakdown.",
  howItWorks: [
    "Enter the amount you want to calculate from.",
    "Choose whether to add GST to it or remove GST from it.",
    "Select the applicable GST slab (5%, 12%, 18%, 28% or a custom rate).",
    "Instantly see the tax amount, net price and CGST/SGST/IGST split.",
  ],
  useCases: [
    "Prepare GST-compliant invoices and quotations.",
    "Work out the pre-tax cost of a GST-inclusive price.",
    "Split tax into CGST and SGST for intra-state transactions.",
    "Double-check supplier bills and receipts.",
  ],
  faqs: [
    {
      question: "What's the difference between adding and removing GST?",
      answer:
        "Adding GST calculates the tax on top of a base (exclusive) amount. Removing GST extracts the tax that is already included in a gross (inclusive) amount.",
    },
    {
      question: "How are CGST and SGST calculated?",
      answer:
        "For intra-state supplies the total GST is split equally into CGST and SGST. For inter-state supplies the full amount is charged as IGST.",
    },
    {
      question: "Which GST slabs are supported?",
      answer:
        "The standard Indian slabs of 5%, 12%, 18% and 28% are built in, and you can also enter a custom rate.",
    },
    {
      question: "How do I remove GST from an inclusive price?",
      answer:
        "Use base price = gross price × 100 ÷ (100 + GST rate). For example, ₹1,180 inclusive of 18% GST gives a base price of ₹1,000 and ₹180 GST. This is also called the reverse GST or GST back-calculation method.",
    },
    {
      question: "When is IGST charged instead of CGST and SGST?",
      answer:
        "IGST applies to inter-state supplies — where the supplier and place of supply are in different states (or for imports). For intra-state supplies within the same state, the same total tax is split equally into CGST and SGST.",
    },
    {
      question: "Which GST rate applies to my product?",
      answer:
        "Essentials are often 0% or 5%, standard goods and services fall under 12% or 18%, and luxury or sin goods attract 28%. Confirm the exact rate using your product's HSN code (goods) or SAC code (services).",
    },
  ],
};
