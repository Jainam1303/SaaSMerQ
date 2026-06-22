export interface GscRow {
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface GscTopPage extends GscRow {
  url: string;
}

export interface GscTopQuery extends GscRow {
  query: string;
}

export interface GscDashboardData {
  lastSyncedAt: string | null;
  cacheExpiresAt: string | null;
  connected: boolean;
  property: string | null;
  indexing: {
    indexedUrls: number;
    notIndexedUrls: number;
    sitemapUrls: number;
  };
  totals: GscRow;
  topPages: GscTopPage[];
  topQueries: GscTopQuery[];
  syncError?: string | null;
}

export interface GscOAuthTokens {
  access_token: string;
  refresh_token?: string;
  expires_at: number;
  scope?: string;
  token_type?: string;
}

export interface GscCacheFile {
  syncedAt: string;
  expiresAt: string;
  data: Omit<GscDashboardData, "lastSyncedAt" | "cacheExpiresAt" | "connected">;
}
