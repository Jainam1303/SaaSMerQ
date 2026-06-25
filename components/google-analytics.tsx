"use client";

import Script from "next/script";
import { getMeasurementId } from "@/lib/analytics";

/**
 * Loads GA4 gtag.js after the page becomes interactive (Next.js recommended).
 * Scripts use the per-request CSP nonce from middleware for strict-dynamic.
 */
export function GoogleAnalytics({ nonce }: { nonce?: string }) {
  const gaId = getMeasurementId();
  if (!gaId) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
        nonce={nonce}
      />
      <Script id="ga-init" strategy="afterInteractive" nonce={nonce}>
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${gaId}',{send_page_view:true});`}
      </Script>
    </>
  );
}
