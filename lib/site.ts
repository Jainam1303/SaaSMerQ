/**
 * Central site configuration. Update domain / branding here once and it
 * propagates across SEO metadata, sitemaps, schema markup and the UI.
 */
export const siteConfig = {
  name: "MerQPrime Tools",
  shortName: "MerQPrime",
  domain: "merqprime.in",
  url: "https://merqprime.in",
  tagline: "Fast, free & secure online tools",
  description:
    "MerQPrime Tools is a fast, secure and privacy-first collection of free online utilities for developers, businesses and creators. QR codes, password & UUID generators, JSON & Base64 tools, GST & UPI utilities, image compression and more.",
  locale: "en_IN",
  twitter: "@merqprime",
  author: "MerQPrime",
  // Toggle once ad/analytics integrations are configured. Kept false so the
  // platform ships clean, with reserved slots ready but nothing rendered.
  ads: {
    enabled: false,
  },
  analytics: {
    // GA4 measurement ID (G-XXXXXXXXXX). NEXT_PUBLIC_GA_MEASUREMENT_ID is the
    // canonical variable; NEXT_PUBLIC_GA_ID is kept as a backwards-compatible
    // fallback. NEXT_PUBLIC_* vars are inlined at build time.
    gaMeasurementId:
      process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ??
      process.env.NEXT_PUBLIC_GA_ID ??
      "",
    plausibleDomain: process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN ?? "",
    googleSearchConsoleVerification:
      process.env.NEXT_PUBLIC_GSC_VERIFICATION ?? "",
  },
} as const;

export type SiteConfig = typeof siteConfig;
