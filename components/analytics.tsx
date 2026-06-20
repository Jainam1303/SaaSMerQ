import { Suspense } from "react";
import Script from "next/script";
import { siteConfig } from "@/lib/site";
import { AnalyticsTracker } from "@/components/analytics-tracker";
import { DeferredGoogleAnalytics } from "@/components/deferred-ga";

/**
 * Analytics loader. Renders nothing unless configured, so the platform ships
 * clean and privacy-first by default. GA4 loads after the first user
 * interaction in production so Lighthouse and passive visits stay fast.
 *
 * Scripts receive the per-request CSP nonce for strict-dynamic execution.
 * google-analytics / googletagmanager origins are allow-listed in middleware.ts.
 */
export function Analytics({ nonce }: { nonce?: string }) {
  const { gaMeasurementId, plausibleDomain } = siteConfig.analytics;
  const isProduction = process.env.NODE_ENV === "production";
  const gaEnabled = isProduction && Boolean(gaMeasurementId);

  return (
    <>
      {gaEnabled ? (
        <>
          <DeferredGoogleAnalytics gaId={gaMeasurementId} nonce={nonce} />
          <Suspense fallback={null}>
            <AnalyticsTracker gaId={gaMeasurementId} />
          </Suspense>
        </>
      ) : null}

      {plausibleDomain ? (
        <Script
          id="plausible"
          strategy="afterInteractive"
          nonce={nonce}
          data-domain={plausibleDomain}
          src="https://plausible.io/js/script.js"
        />
      ) : null}
    </>
  );
}
