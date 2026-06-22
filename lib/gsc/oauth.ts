import { getGscConfig, hasGscScope } from "./config";
import { readOAuthTokens, writeOAuthTokens } from "./storage";
import type { GscOAuthTokens } from "./types";

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";

export function buildOAuthUrl(state: string): string {
  const { clientId, redirectUri, scopes } = getGscConfig();
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: scopes.join(" "),
    access_type: "offline",
    prompt: "consent",
    state,
  });
  return `${AUTH_URL}?${params.toString()}`;
}

export async function exchangeCodeForTokens(
  code: string,
): Promise<GscOAuthTokens> {
  const { clientId, clientSecret, redirectUri } = getGscConfig();
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OAuth token exchange failed: ${err}`);
  }

  const json = (await res.json()) as {
    access_token: string;
    refresh_token?: string;
    expires_in: number;
    scope?: string;
    token_type?: string;
  };

  const existing = readOAuthTokens();
  const tokens: GscOAuthTokens = {
    access_token: json.access_token,
    refresh_token: json.refresh_token ?? existing?.refresh_token,
    expires_at: Date.now() + json.expires_in * 1000 - 60_000,
    scope: json.scope,
    token_type: json.token_type,
  };

  if (!tokens.refresh_token) {
    throw new Error("No refresh token received. Revoke app access and reconnect.");
  }

  if (!hasGscScope(tokens.scope)) {
    throw new Error(
      "Search Console permission was not granted. Add the webmasters.readonly scope in Google Cloud OAuth consent screen, then reconnect.",
    );
  }

  writeOAuthTokens(tokens);
  return tokens;
}

export async function getValidAccessToken(): Promise<string | null> {
  const tokens = readOAuthTokens();
  if (!tokens?.refresh_token && !tokens?.access_token) return null;

  if (tokens.access_token && tokens.expires_at > Date.now()) {
    return tokens.access_token;
  }

  if (!tokens.refresh_token) return null;

  const { clientId, clientSecret } = getGscConfig();
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: tokens.refresh_token,
      grant_type: "refresh_token",
    }),
  });

  if (!res.ok) {
    return null;
  }

  const json = (await res.json()) as {
    access_token: string;
    expires_in: number;
  };

  const updated: GscOAuthTokens = {
    ...tokens,
    access_token: json.access_token,
    expires_at: Date.now() + json.expires_in * 1000 - 60_000,
  };
  writeOAuthTokens(updated);
  return updated.access_token;
}

export function isGoogleConnected(): boolean {
  const tokens = readOAuthTokens();
  return Boolean(tokens?.refresh_token && hasGscScope(tokens.scope));
}
