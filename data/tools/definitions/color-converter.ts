import type { ToolMeta } from "../types";

export const colorConverter: ToolMeta = {
  slug: "color-converter",
  name: "Color Converter",
  seoTitle: "Color Converter — HEX, RGB, HSL & More",
  shortDescription:
    "Convert colors between HEX, RGB, HSL and other formats instantly.",
  metaDescription:
    "Free online color converter. Convert between HEX, RGB, HSL and CSS color formats with a live preview. Perfect for designers and developers — runs in your browser.",
  category: "developer",
  icon: "palette",
  keywords: [
    "color converter",
    "hex to rgb",
    "rgb to hex",
    "hsl converter",
    "css color converter",
    "color format converter",
  ],
  addedAt: "2026-06-20",
  intro:
    "Switch between color formats without guessing. Enter a HEX, RGB or HSL value and see equivalent representations instantly, along with a live preview swatch for quick visual confirmation.",
  howItWorks: [
    "Enter a color in HEX, RGB or HSL format.",
    "All equivalent formats update automatically.",
    "View a live color preview swatch as you edit.",
    "Copy any format to your clipboard with one click.",
  ],
  useCases: [
    "Translate brand HEX colors into RGB for design tools and APIs.",
    "Convert CSS HSL values when migrating stylesheets.",
    "Match colors from screenshots and design specs across formats.",
    "Generate consistent color tokens for design systems and themes.",
  ],
  faqs: [
    {
      question: "Which color formats are supported?",
      answer:
        "Common web formats including HEX (#RRGGBB), RGB, RGBA, HSL and HSLA are supported with automatic cross-conversion.",
    },
    {
      question: "Does it support shorthand HEX?",
      answer:
        "Yes. Three-digit shorthand HEX values are expanded to their six-digit equivalents during conversion.",
    },
    {
      question: "Can I pick a color visually?",
      answer:
        "Where supported, a color picker lets you select a color visually and see all format values update accordingly.",
    },
  ],
};
