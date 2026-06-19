import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";
import type { FaqItem, ToolMeta } from "@/data/tools/types";

/** Absolute URL helper that always resolves against the canonical domain. */
export function absoluteUrl(path = "/"): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${siteConfig.url}${normalized === "/" ? "" : normalized}`;
}

interface BuildMetadataOptions {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  ogType?: "website" | "article";
}

/**
 * Builds a complete Metadata object including canonical URL, Open Graph and
 * Twitter card data. Open Graph images are produced by the dynamic OG route.
 */
export function buildMetadata({
  title,
  description,
  path,
  keywords,
  ogType = "website",
}: BuildMetadataOptions): Metadata {
  const url = absoluteUrl(path);
  const ogImage = `${siteConfig.url}/api/og?title=${encodeURIComponent(title)}`;

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: ogType,
      url,
      title,
      description,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      site: siteConfig.twitter,
      creator: siteConfig.twitter,
      images: [ogImage],
    },
  };
}

/* ------------------------------------------------------------------ */
/* JSON-LD structured data builders                                    */
/* ------------------------------------------------------------------ */

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteConfig.url}/tools?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/icon.svg`,
  };
}

export function softwareApplicationJsonLd(tool: ToolMeta) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.name,
    description: tool.metaDescription,
    url: absoluteUrl(`/tools/${tool.slug}`),
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any (Web)",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
    },
  };
}

export function breadcrumbJsonLd(
  items: { name: string; url: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function faqJsonLd(faqs: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}
