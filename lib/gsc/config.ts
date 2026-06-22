import { siteConfig } from "@/lib/site";

const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

export function getGscConfig() {
  const clientId = process.env.GOOGLE_CLIENT_ID ?? "";
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET ?? "";
  const siteUrl =
    process.env.GSC_SITE_URL ?? `sc-domain:${siteConfig.domain}`;
  const redirectUri =
    process.env.GOOGLE_OAUTH_REDIRECT_URI ??
    `${siteConfig.url}/api/admin/gsc/oauth/callback`;

  return {
    clientId,
    clientSecret,
    siteUrl,
    redirectUri,
    cacheTtlMs: CACHE_TTL_MS,
    scopes: [
      "https://www.googleapis.com/auth/webmasters.readonly",
      "openid",
      "email",
    ],
    isConfigured: Boolean(clientId && clientSecret),
  };
}
