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
  /** When true, the title bypasses the layout-level title template. */
  absoluteTitle?: boolean;
  /** Optional override for the text rendered into the OG image. */
  ogTitle?: string;
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
  absoluteTitle = false,
  ogTitle,
}: BuildMetadataOptions): Metadata {
  const url = absoluteUrl(path);
  const ogImage = `${siteConfig.url}/api/og?title=${encodeURIComponent(
    ogTitle ?? title,
  )}`;

  return {
    title: absoluteTitle ? { absolute: title } : title,
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

interface ArticleJsonLdOptions {
  title: string;
  description: string;
  slug: string;
  publishedAt: string;
  updatedAt?: string;
}

export function articleJsonLd({
  title,
  description,
  slug,
  publishedAt,
  updatedAt,
}: ArticleJsonLdOptions) {
  const url = absoluteUrl(`/blog/${slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    url,
    datePublished: publishedAt,
    dateModified: updatedAt ?? publishedAt,
    author: {
      "@type": "Organization",
      name: siteConfig.author,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}/icon.svg`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  };
}
