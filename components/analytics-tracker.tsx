"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import {
  pageView,
  trackEvent,
  trackOutboundLink,
} from "@/lib/analytics";

/**
 * Client-side route tracker for GA4 in the App Router.
 *
 * Initial page_view is sent by gtag('config') in <GoogleAnalytics />.
 * Subsequent navigations call gtag('config', …, { page_path }) per GA4 SPA guidance.
 * Tool, category, and blog landings additionally emit dedicated funnel events.
 */
export function AnalyticsTracker({ gaId }: { gaId: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (!pathname) return;

    const query = searchParams.toString();
    const path = query ? `${pathname}?${query}` : pathname;

    if (isFirstRender.current) {
      isFirstRender.current = false;
    } else {
      pageView(path);
    }

    const toolMatch = pathname.match(/^\/tools\/([^/]+)$/);
    if (toolMatch) {
      trackEvent("tool_view", {
        tool_slug: toolMatch[1],
        page_path: path,
        send_to: gaId,
      });
      return;
    }

    const categoryMatch = pathname.match(/^\/category\/([^/]+)$/);
    if (categoryMatch) {
      trackEvent("category_view", {
        category_slug: categoryMatch[1],
        page_path: path,
        send_to: gaId,
      });
      return;
    }

    if (pathname === "/blog" || pathname.startsWith("/blog/")) {
      const slug = pathname.startsWith("/blog/")
        ? pathname.slice("/blog/".length)
        : undefined;
      trackEvent("blog_view", {
        blog_slug: slug,
        page_path: path,
        send_to: gaId,
      });
    }
  }, [pathname, searchParams, gaId]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement).closest("a");
      if (!anchor || !anchor.href) return;

      const url = new URL(anchor.href, window.location.origin);
      if (url.origin === window.location.origin) return;
      if (url.protocol !== "http:" && url.protocol !== "https:") return;

      trackOutboundLink(url.href, anchor.textContent?.trim() || undefined);
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
