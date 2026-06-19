"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/** Pushes a gtag event, ensuring the dataLayer/gtag shim exists. */
function gtagEvent(name: string, params: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag !== "function") {
    window.gtag = function gtag() {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer!.push(arguments);
    };
  }
  window.gtag("event", name, params);
}

/**
 * Client-side route tracker for GA4 in the App Router.
 *
 * `gtag('config')` (rendered by <GoogleAnalytics />) emits the initial
 * page_view, so we only emit page_view on subsequent client-side navigations
 * to avoid double counting. Tool and category landings additionally emit
 * dedicated funnel events on every visit, including direct landings.
 */
export function AnalyticsTracker({ gaId }: { gaId: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (!pathname) return;

    const query = searchParams.toString();
    const path = query ? `${pathname}?${query}` : pathname;
    const url = `${window.location.origin}${path}`;

    if (isFirstRender.current) {
      isFirstRender.current = false;
    } else {
      gtagEvent("page_view", {
        page_path: path,
        page_location: url,
        page_title: document.title,
        send_to: gaId,
      });
    }

    const toolMatch = pathname.match(/^\/tools\/([^/]+)$/);
    if (toolMatch) {
      gtagEvent("tool_view", { tool_slug: toolMatch[1], page_path: path });
      return;
    }

    const categoryMatch = pathname.match(/^\/category\/([^/]+)$/);
    if (categoryMatch) {
      gtagEvent("category_view", {
        category_slug: categoryMatch[1],
        page_path: path,
      });
    }
  }, [pathname, searchParams, gaId]);

  return null;
}
