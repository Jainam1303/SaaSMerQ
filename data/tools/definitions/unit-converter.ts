import type { ToolMeta } from "../types";

export const unitConverter: ToolMeta = {
  slug: "unit-converter",
  name: "Unit Converter",
  seoTitle: "Unit Converter — Length, Weight, Temperature, Area & More",
  shortDescription:
    "Convert length, weight, temperature, area, volume and speed units instantly.",
  metaDescription:
    "Free online unit converter. Convert length, weight, temperature, area, volume and speed between metric and imperial units — fast, accurate and mobile-friendly.",
  category: "business",
  icon: "arrow-left-right",
  keywords: [
    "unit converter",
    "length converter",
    "weight converter",
    "temperature converter",
    "area converter",
    "volume converter",
    "km to miles",
    "kg to lbs",
  ],
  addedAt: "2026-06-20",
  featured: true,
  popular: true,
  intro:
    "Convert between common metric and imperial units in six categories: length, weight, temperature, area, volume and speed. Enter a value, pick units and get an instant conversion — handy for travel, cooking, engineering homework and everyday measurements.",
  howItWorks: [
    "Select a category: length, weight, temperature, area, volume or speed.",
    "Enter the value you want to convert.",
    "Choose the source unit and target unit.",
    "The converted result updates instantly as you type.",
  ],
  useCases: [
    "Convert km/h to mph when driving abroad.",
    "Switch between kg and pounds for fitness tracking.",
    "Convert Celsius and Fahrenheit for weather and cooking.",
    "Translate square feet to square metres for real estate.",
  ],
  faqs: [
    {
      question: "Which unit systems are supported?",
      answer:
        "The converter supports common metric (SI) units and US/imperial units across all six categories.",
    },
    {
      question: "How accurate are conversions?",
      answer:
        "Conversions use standard conversion factors. Temperature uses exact formulas for Celsius, Fahrenheit and Kelvin.",
    },
    {
      question: "Can I convert between different categories?",
      answer:
        "No. Each category converts within its own unit family — for example metres to kilometres, not metres to kilograms.",
    },
  ],
};
