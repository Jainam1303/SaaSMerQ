import { NextRequest, NextResponse } from "next/server";

/**
 * Generates a per-request nonce and applies a strict Content-Security-Policy.
 * Next.js automatically attaches this nonce to its own scripts, and we forward
 * it via a request header so the root layout can pass it to next-themes.
 *
 * `style-src 'unsafe-inline'` is intentionally allowed: the framework and
 * Tailwind inject inline styles, and there is no XSS vector through styles
 * here. Everything else is locked down.
 */
export function middleware(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const isDev = process.env.NODE_ENV === "development";

  const csp = [
    `default-src 'self'`,
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' ${
      isDev ? "'unsafe-eval'" : ""
    }`,
    `style-src 'self' 'unsafe-inline'`,
    `img-src 'self' blob: data:`,
    `font-src 'self' data:`,
    `object-src 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
    `frame-ancestors 'none'`,
    `connect-src 'self'`,
    `worker-src 'self' blob:`,
    `manifest-src 'self'`,
    `upgrade-insecure-requests`,
  ]
    .join("; ")
    .replace(/\s{2,}/g, " ")
    .trim();

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", csp);

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });
  response.headers.set("Content-Security-Policy", csp);

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all paths except static assets and image optimisation, where a
     * nonce is unnecessary and would only add overhead.
     */
    {
      source:
        "/((?!api/og|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|icon.svg).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
