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
  ],
};
