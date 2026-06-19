import Script from "next/script";
import { siteConfig } from "@/lib/site";

/**
 * Analytics loader. Renders nothing unless the corresponding environment
 * variable is configured, so the platform ships clean and privacy-first by
 * default. Supports Google Analytics 4 and Plausible.
 *
 * Scripts use `afterInteractive` so they never block first paint.
 */
export function Analytics({ nonce }: { nonce?: string }) {
  const { googleAnalyticsId, plausibleDomain } = siteConfig.analytics;

  return (
    <>
      {googleAnalyticsId ? (
        <>
          <Script
            id="ga-src"
            strategy="afterInteractive"
            nonce={nonce}
            src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}
          />
          <Script id="ga-init" strategy="afterInteractive" nonce={nonce}>
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${googleAnalyticsId}', { anonymize_ip: true });
            `}
          </Script>
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
