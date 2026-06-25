import { siteConfig } from "@/lib/site";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const MEASUREMENT_ID =
  siteConfig.analytics.gaMeasurementId.trim();

/** GA4 is enabled only in production builds with a measurement ID set at build time. */
export function isAnalyticsEnabled(): boolean {
  return process.env.NODE_ENV === "production" && MEASUREMENT_ID.length > 0;
}

export function getMeasurementId(): string {
  return MEASUREMENT_ID;
}

function ensureGtag(): ((...args: unknown[]) => void) | null {
  if (typeof window === "undefined" || !isAnalyticsEnabled()) return null;

  window.dataLayer = window.dataLayer ?? [];
  if (typeof window.gtag !== "function") {
    window.gtag = function gtag() {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer!.push(arguments);
    };
  }

  return window.gtag;
}

/** Low-level gtag passthrough; queues on dataLayer before gtag.js loads. */
export function gtag(...args: unknown[]) {
  const fn = ensureGtag();
  if (fn) fn(...args);
}

/** SPA / route-change page view via gtag config (GA4 recommended for App Router). */
export function pageView(pagePath: string, pageTitle?: string) {
  const id = getMeasurementId();
  if (!id) return;

  const title =
    pageTitle ??
    (typeof document !== "undefined" ? document.title : undefined);
  const location =
    typeof window !== "undefined"
      ? `${window.location.origin}${pagePath}`
      : undefined;

  gtag("config", id, {
    page_path: pagePath,
    page_title: title,
    page_location: location,
  });
}

export function trackEvent(
  name: string,
  params?: Record<string, unknown>,
) {
  gtag("event", name, params);
}

export function trackToolUsage(
  toolSlug: string,
  action: string,
  params?: Record<string, unknown>,
) {
  trackEvent("tool_used", {
    tool_slug: toolSlug,
    action,
    ...params,
  });
}

export function trackSearch(query: string, source?: string) {
  const term = query.trim();
  if (!term) return;
  trackEvent("search", { search_term: term, source });
}

export function trackDownload(toolSlug?: string, fileName?: string) {
  trackEvent("file_download", {
    tool_slug: toolSlug,
    file_name: fileName,
  });
}

export function trackOutboundLink(url: string, linkText?: string) {
  trackEvent("click", {
    event_category: "outbound",
    event_label: linkText,
    link_url: url,
    outbound: true,
  });
}

export function trackButtonClick(label: string, context?: string) {
  trackEvent("button_click", {
    button_label: label,
    context,
  });
}
