"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

/**
 * Loads GA4 only after the first user interaction so automated audits and
 * passive visits do not pay the gtag main-thread cost during initial load.
 */
export function DeferredGoogleAnalytics({
  gaId,
  nonce,
}: {
  gaId: string;
  nonce?: string;
}) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (enabled) return;

    const enable = () => setEnabled(true);
    const opts: AddEventListenerOptions = { once: true, passive: true };

    window.addEventListener("scroll", enable, opts);
    window.addEventListener("click", enable, { once: true });
    window.addEventListener("keydown", enable, { once: true });
    window.addEventListener("touchstart", enable, opts);

    return () => {
      window.removeEventListener("scroll", enable);
      window.removeEventListener("click", enable);
      window.removeEventListener("keydown", enable);
      window.removeEventListener("touchstart", enable);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
        nonce={nonce}
      />
      <Script id="ga-init" strategy="afterInteractive" nonce={nonce}>
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}');`}
      </Script>
    </>
  );
}
