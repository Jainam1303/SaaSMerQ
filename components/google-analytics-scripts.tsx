/**
 * Server-rendered GA4 snippets in the initial HTML so gtag init runs under CSP
 * and tools like Wappalyzer can detect Google Analytics from page source.
 */
export function GoogleAnalyticsScripts({
  gaId,
  nonce,
}: {
  gaId: string;
  nonce?: string;
}) {
  return (
    <>
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        nonce={nonce}
      />
      <script
        id="google-analytics-init"
        nonce={nonce}
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = gtag;
            gtag('js', new Date());
            gtag('config', '${gaId}', { send_page_view: true });
          `,
        }}
      />
    </>
  );
}
