import type { ToolMeta } from "../types";

export const upiQrGenerator: ToolMeta = {
  slug: "upi-qr-generator",
  name: "UPI QR Code Generator",
  seoTitle: "UPI QR Code Generator — Accept Payments Instantly",
  shortDescription:
    "Create a UPI payment QR code with your UPI ID, payee name, amount and note.",
  metaDescription:
    "Generate a UPI payment QR code for free. Enter your UPI ID, name, amount and note to create a scannable QR accepted by GPay, PhonePe, Paytm and all UPI apps. Download as PNG.",
  category: "business",
  icon: "indian-rupee",
  keywords: [
    "upi qr code generator",
    "upi qr code",
    "payment qr code",
    "gpay qr code",
    "phonepe qr",
  ],
  addedAt: "2026-01-11",
  featured: true,
  popular: true,
  intro:
    "Accept UPI payments without a payment gateway. Enter your UPI ID, payee name and an optional amount and note to instantly generate a standard UPI QR code that works with Google Pay, PhonePe, Paytm, BHIM and every other UPI app.",
  howItWorks: [
    "Enter your UPI ID (VPA), for example name@bank.",
    "Add the payee name and, optionally, a fixed amount and note.",
    "A compliant UPI QR code is generated instantly.",
    "Download the PNG and print or share it to start collecting payments.",
  ],
  useCases: [
    "Collect payments at shops, stalls and markets.",
    "Add a pay-by-QR option to invoices and bills.",
    "Request fixed amounts for orders, deposits or donations.",
    "Share a payment QR on social media or your website.",
  ],
  faqs: [
    {
      question: "Which apps can scan this QR code?",
      answer:
        "It follows the standard UPI deep-link specification, so it works with Google Pay, PhonePe, Paytm, BHIM, Amazon Pay and any other UPI-enabled app.",
    },
    {
      question: "Is leaving the amount blank okay?",
      answer:
        "Yes. If you omit the amount, the payer can enter any amount when they scan — useful for general-purpose collection QRs.",
    },
    {
      question: "Is my UPI ID safe?",
      answer:
        "The QR is generated entirely in your browser and nothing is sent to a server. A UPI ID is safe to share publicly — it only allows people to pay you, not withdraw funds.",
    },
  ],
};
