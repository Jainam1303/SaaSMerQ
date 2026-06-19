import type { Category, CategorySlug } from "./types";

export const categories: Category[] = [
  {
    slug: "business",
    name: "Business Tools",
    description:
      "Calculators and generators for invoicing, payments and everyday business operations.",
    icon: "briefcase",
  },
  {
    slug: "developer",
    name: "Developer Tools",
    description:
      "Encoders, formatters and generators that speed up day-to-day development work.",
    icon: "code",
  },
  {
    slug: "image",
    name: "Image Tools",
    description:
      "Compress, resize and optimize images right in your browser — nothing is uploaded.",
    icon: "image",
  },
  {
    slug: "seo",
    name: "SEO Tools",
    description:
      "Utilities to improve discoverability, crawlability and search performance.",
    icon: "search",
  },
  {
    slug: "text",
    name: "Text Tools",
    description:
      "Transform, encode and inspect text and structured data with ease.",
    icon: "type",
  },
];

export const categoryMap: Record<CategorySlug, Category> = categories.reduce(
  (acc, category) => {
    acc[category.slug] = category;
    return acc;
  },
  {} as Record<CategorySlug, Category>,
);

export function getCategory(slug: CategorySlug): Category {
  return categoryMap[slug];
}
