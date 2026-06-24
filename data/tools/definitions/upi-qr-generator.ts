import type { ToolMeta } from "../types";

export const upiQrGenerator: ToolMeta = {
  slug: "upi-qr-generator",
  name: "UPI QR Code Generator",
  seoTitle: "UPI QR Generator — UPI ID to QR Code Online",
  shortDescription:
    "Create your UPI QR code online — convert UPI ID to a scannable payment QR for GPay, PhonePe, Paytm and every UPI app.",
  metaDescription:
    "Create your UPI QR code free. Convert UPI ID to QR for GPay, PhonePe & Paytm. Download PNG payment QR online — instant, private, no sign-up.",
  category: "business",
  icon: "indian-rupee",
  keywords: [
    "create your upi qr code",
    "upi id to qr code",
    "upi barcode generator",
    "qr code generator upi",
    "generate upi id",
    "upi qr code generator",
    "dynamic upi qr code generator",
    "upi payment qr",
    "gpay qr code",
    "phonepe qr",
    "upi qr code india",
    "merchant upi qr",
  ],
  addedAt: "2026-01-11",
  featured: true,
  popular: true,
  intro:
    "Accept UPI payments without a payment gateway. This free UPI QR generator converts your UPI ID (VPA) into a standard Bharat QR–compatible payment code. Enter payee name, optional fixed amount and transaction note, then download a high-resolution PNG for print, WhatsApp or your website. Everything runs in your browser — your UPI ID is never uploaded to MerQPrime servers.",
  howItWorks: [
    "Enter your UPI ID (Virtual Payment Address), for example shopname@okbank.",
    "Add the payee name customers will see when they pay you.",
    "Optionally set a fixed amount and note for invoice-style or donation QRs.",
    "Click generate — the tool builds a compliant UPI payment URI and QR image.",
    "Download the PNG and print, share on social media or embed on invoices.",
  ],
  useCases: [
    "Collect payments at shops, stalls, food trucks and weekend markets.",
    "Add a scan-to-pay block on GST invoices and delivery receipts.",
    "Request fixed amounts for orders, deposits, event tickets or memberships.",
    "Share a personal UPI QR on WhatsApp Status for freelance or gig payments.",
    "Replace handwritten “pay to this number” signs with a scannable UPI barcode.",
  ],
  faqs: [
    {
      question: "Is UPI QR code generation free on MerQPrime?",
      answer:
        "Yes. MerQPrime’s UPI QR generator is completely free with no sign-up, no watermark and no limit on how many QRs you create or download.",
    },
    {
      question: "Can I create a UPI QR code without a bank account?",
      answer:
        "You need an active UPI ID linked to a bank account or wallet to receive money. You cannot receive real UPI payments without a registered VPA, but you can generate and preview QR layouts before going live.",
    },
    {
      question: "Which apps support UPI QR codes?",
      answer:
        "All major UPI apps scan standard payment QRs: Google Pay, PhonePe, Paytm, BHIM, Amazon Pay, CRED and most bank UPI apps (SBI, HDFC, ICICI, Axis, etc.).",
    },
    {
      question: "Can I print my UPI QR code for my shop?",
      answer:
        "Yes. Download the PNG and print on paper, vinyl or acrylic standees. Use high contrast (dark QR on white) and test with your own phone before placing at the counter.",
    },
    {
      question: "Is UPI QR secure for receiving payments?",
      answer:
        "Sharing a UPI QR only lets people pay you — it cannot withdraw funds. Customers still authorize each payment with their UPI PIN or biometric in their own app. Never share OTPs or PINs.",
    },
    {
      question: "Can I receive international payments with UPI QR?",
      answer:
        "Standard UPI QR codes are designed for domestic INR payments within India’s UPI network. International card or cross-border rails are not supported through a basic UPI payment QR.",
    },
    {
      question: "Can businesses use UPI QR codes?",
      answer:
        "Yes. Millions of Indian merchants use static or dynamic UPI QRs at checkout. Use a business-linked VPA where possible and reconcile payments in your bank or merchant dashboard.",
    },
    {
      question: "What happens if I leave the amount blank?",
      answer:
        "The QR becomes a static collect QR. The customer enters any amount when scanning — ideal for general shop counters where each bill differs.",
    },
    {
      question: "How do I convert UPI ID to QR code?",
      answer:
        "Enter your UPI ID in MerQPrime’s generator, add payee name and optional amount, then generate. The tool encodes your VPA into a scannable QR image you can download instantly.",
    },
    {
      question: "What is the difference between static and dynamic UPI QR?",
      answer:
        "Static QRs have no fixed amount — the payer types the value. Dynamic QRs embed a specific amount (and often a note) so the payer only confirms — useful for exact invoices.",
    },
    {
      question: "Does this work as a UPI barcode generator?",
      answer:
        "Yes. The output is a QR barcode encoding the official UPI payment deep link. Any UPI app camera or in-app scanner can read it.",
    },
    {
      question: "Can I add a note or invoice reference?",
      answer:
        "Yes. Optional transaction notes appear in the payer’s app and help you match payments to orders, table numbers or customer IDs.",
    },
    {
      question: "Is my UPI ID stored on MerQPrime servers?",
      answer:
        "No. QR generation runs entirely in your browser. MerQPrime does not upload your VPA, amount or note to our servers.",
    },
    {
      question: "What UPI ID format should I use?",
      answer:
        "A valid VPA looks like name@bank or mobile@paytm — the part before @ is your handle and after @ is the PSP or bank identifier. Copy it exactly from your UPI app.",
    },
    {
      question: "Can I regenerate QR if I change my UPI ID?",
      answer:
        "Yes. If you switch banks or wallets, create a new VPA in your app, then generate a fresh QR here and replace old printed materials to avoid failed payments.",
    },
  ],
};
