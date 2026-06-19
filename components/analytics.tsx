import { Suspense } from "react";
import Script from "next/script";
import { GoogleAnalytics } from "@next/third-parties/google";
import { siteConfig } from "@/lib/site";
import { AnalyticsTracker } from "@/components/analytics-tracker";

/**
 * Analytics loader. Renders nothing unless configured, so the platform ships
 * clean and privacy-first by default. Google Analytics 4 is loaded via
 * `@next/third-parties` (Next.js best practice) and only in production.
 *
 * The GA scripts receive the per-request CSP nonce so they execute under the
 * strict nonce + 'strict-dynamic' policy. The matching google-analytics /
 * googletagmanager origins are allow-listed in middleware.ts.
 */
export function Analytics({ nonce }: { nonce?: string }) {
  const { gaMeasurementId, plausibleDomain } = siteConfig.analytics;
  const isProduction = process.env.NODE_ENV === "production";
  const gaEnabled = isProduction && Boolean(gaMeasurementId);

  return (
    <>
      {gaEnabled ? (
        <>
          <GoogleAnalytics gaId={gaMeasurementId} nonce={nonce} />
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
