import type { ToolMeta } from "../types";

export const gstInvoiceGenerator: ToolMeta = {
  slug: "gst-invoice-generator",
  name: "GST Invoice Generator",
  seoTitle: "GST Invoice Generator India — CGST, SGST & IGST",
  shortDescription:
    "Create GST-compliant invoices with tax breakdown, HSN and print-ready format for India.",
  metaDescription:
    "Free GST invoice generator for India. Add business GSTIN, line items with HSN, GST rates and auto-calculate CGST, SGST or IGST — print or save instantly.",
  category: "business",
  icon: "receipt",
  keywords: [
    "gst invoice generator",
    "gst invoice format india",
    "create gst bill",
    "cgst sgst invoice",
    "gst bill generator free",
  ],
  addedAt: "2026-06-20",
  featured: true,
  popular: true,
  intro:
    "Generate GST-compliant tax invoices for Indian businesses. Enter your GSTIN, client details, line items with HSN codes and GST rates — the tool calculates taxable value, CGST, SGST or IGST and grand total, then lets you print a clean invoice from your browser.",
  howItWorks: [
    "Enter supplier GSTIN, business name and address.",
    "Add buyer details and invoice metadata (number, date).",
    "Add line items with HSN, quantity, rate and GST %.",
    "Choose intra-state (CGST+SGST) or inter-state (IGST).",
    "Preview tax breakdown and print or save as PDF.",
  ],
  useCases: [
    "Issue tax invoices for B2B sales in India.",
    "Create bills with correct CGST/SGST split for same-state sales.",
    "Generate IGST invoices for inter-state shipments.",
    "Replace manual Excel GST invoice templates.",
  ],
  faqs: [
    {
      question: "What is a GST tax invoice?",
      answer:
        "A GST tax invoice includes supplier and buyer GSTIN (when registered), HSN/SAC codes, taxable value, GST rate and tax amount (CGST, SGST or IGST) as required under Indian GST law.",
    },
    {
      question: "When do I use IGST vs CGST and SGST?",
      answer:
        "Same-state sales split tax into CGST and SGST (each half the rate). Inter-state sales use IGST at the full rate.",
    },
    {
      question: "Is this a legally valid GST invoice?",
      answer:
        "This tool helps format invoices correctly, but you must ensure all mandatory fields under GST rules are filled and your registration details are accurate. Consult a tax professional for compliance.",
    },
  ],
};
