import type { ToolMeta } from "../types";

export const qrGenerator: ToolMeta = {
  slug: "qr-generator",
  name: "QR Code Generator",
  seoTitle: "Free QR Code Generator — Text, URL, WiFi, Email & Phone",
  shortDescription:
    "Create custom QR codes for text, URLs, email, phone numbers and WiFi, then download as PNG.",
  metaDescription:
    "Generate free QR codes for text, links, email, phone and WiFi networks. Adjust size and error correction, then download a high-quality PNG. 100% in-browser and private.",
  category: "business",
  icon: "qr-code",
  keywords: [
    "qr code generator",
    "free qr code",
    "wifi qr code",
    "url qr code",
    "qr code png download",
  ],
  addedAt: "2026-01-05",
  featured: true,
  popular: true,
  intro:
    "Generate scannable QR codes for any purpose in seconds. Choose from text, website URLs, email addresses, phone numbers or WiFi credentials, fine-tune the appearance, and download a crisp PNG ready for print or screen.",
  howItWorks: [
    "Pick the QR type that matches your data — plain text, URL, email, phone or WiFi.",
    "Fill in the relevant fields. The preview updates instantly as you type.",
    "Adjust the size and error-correction level to suit your use case.",
    "Click Download PNG to save the QR code to your device.",
  ],
  useCases: [
    "Link to your website, menu or product page from printed materials.",
    "Share WiFi access with guests without dictating long passwords.",
    "Add scannable contact details to business cards and flyers.",
    "Speed up payments, sign-ups and downloads at events.",
  ],
  faqs: [
    {
      question: "Is my data sent to a server?",
      answer:
        "No. QR codes are generated entirely in your browser, so the information you enter never leaves your device.",
    },
    {
      question: "What is error correction and which level should I use?",
      answer:
        "Error correction lets a QR code remain scannable even if partially damaged or obscured. Use a higher level (Q or H) for printed codes or codes with logos, and a lower level (L or M) for clean digital displays.",
    },
    {
      question: "Can I generate a WiFi QR code?",
      answer:
        "Yes. Choose the WiFi type, enter the network name (SSID), password and security type, and most modern phones can connect simply by scanning.",
    },
    {
      question: "What format can I download?",
      answer:
        "QR codes download as high-resolution PNG images, suitable for both web and print.",
    },
  ],
};
