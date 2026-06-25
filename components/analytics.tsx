import { Suspense } from "react";
import Script from "next/script";
import { siteConfig } from "@/lib/site";
import { isAnalyticsEnabled } from "@/lib/analytics";
import { AnalyticsTracker } from "@/components/analytics-tracker";
import { GoogleAnalytics } from "@/components/google-analytics";

/**
 * Analytics loader. Renders nothing unless configured, so the platform ships
 * clean and privacy-first by default. GA4 loads afterInteractive in production
 * when NEXT_PUBLIC_GA_MEASUREMENT_ID is set at build time.
 *
 * Scripts receive the per-request CSP nonce for strict-dynamic execution.
 * google-analytics / googletagmanager origins are allow-listed in middleware.ts.
 */
export function Analytics({ nonce }: { nonce?: string }) {
  const { gaMeasurementId, plausibleDomain } = siteConfig.analytics;
  const gaEnabled = isAnalyticsEnabled() && Boolean(gaMeasurementId);

  return (
    <>
      {gaEnabled ? (
        <>
          <GoogleAnalytics nonce={nonce} />
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
