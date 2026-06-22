import { siteConfig } from "@/lib/site";

const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

export const GSC_READONLY_SCOPE =
  "https://www.googleapis.com/auth/webmasters.readonly";

export function hasGscScope(scope?: string): boolean {
  return scope?.includes("webmasters") ?? false;
}

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
    scopes: [GSC_READONLY_SCOPE, "openid", "email"],
    isConfigured: Boolean(clientId && clientSecret),
  };
}
