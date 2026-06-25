"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackEvent } from "@/lib/analytics";

/** Fires a 404 event when the not-found UI is shown. */
export function NotFoundAnalytics() {
  const pathname = usePathname();

  useEffect(() => {
    trackEvent("page_not_found", {
      page_path: pathname,
      page_location:
        typeof window !== "undefined" ? window.location.href : undefined,
    });
  }, [pathname]);

  return null;
}
