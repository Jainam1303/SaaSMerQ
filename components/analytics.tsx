import { Suspense } from "react";
import Script from "next/script";
import { siteConfig } from "@/lib/site";
import { AnalyticsTracker } from "@/components/analytics-tracker";

/**
 * Client-side analytics helpers (route tracking). GA4 gtag.js is injected in
 * <head> via GoogleAnalyticsScripts so init runs with a valid CSP nonce.
 */
export function Analytics({ gaId }: { gaId: string }) {
  const { plausibleDomain } = siteConfig.analytics;

  return (
    <>
      <Suspense fallback={null}>
        <AnalyticsTracker gaId={gaId} />
      </Suspense>

      {plausibleDomain ? (
        <Script
          id="plausible"
          strategy="afterInteractive"
          data-domain={plausibleDomain}
          src="https://plausible.io/js/script.js"
        />
      ) : null}
    </>
  );
}
