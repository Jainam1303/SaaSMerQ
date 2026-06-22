import { getGscConfig } from "./config";
import { isGoogleConnected } from "./oauth";
import {
  fetchIndexingFromSitemaps,
  fetchSearchTotals,
  fetchTopPages,
  fetchTopQueries,
  resolveSiteUrl,
} from "./client";
import { readCache, writeCache } from "./storage";
import type { GscCacheFile, GscDashboardData } from "./types";

function emptyDashboard(): GscDashboardData {
  return {
    lastSyncedAt: null,
    cacheExpiresAt: null,
    connected: isGoogleConnected(),
    property: getGscConfig().siteUrl,
    indexing: { indexedUrls: 0, notIndexedUrls: 0, sitemapUrls: 0 },
    totals: { clicks: 0, impressions: 0, ctr: 0, position: 0 },
    topPages: [],
    topQueries: [],
    syncError: null,
  };
}

function cacheToDashboard(cache: GscCacheFile): GscDashboardData {
  return {
    ...cache.data,
    lastSyncedAt: cache.syncedAt,
    cacheExpiresAt: cache.expiresAt,
    connected: isGoogleConnected(),
    property: cache.data.property,
    syncError: null,
  };
}

export function isCacheValid(cache: GscCacheFile | null): boolean {
  if (!cache) return false;
  return new Date(cache.expiresAt).getTime() > Date.now();
}

export async function syncGscData(force = false): Promise<GscDashboardData> {
  if (!isGoogleConnected()) {
    return { ...emptyDashboard(), syncError: "Connect Google Search Console first." };
  }

  const existing = readCache();
  if (!force && existing && isCacheValid(existing)) {
    return cacheToDashboard(existing);
  }

  try {
    const property = await resolveSiteUrl();
    const [totals, topPages, topQueries, indexing] = await Promise.all([
      fetchSearchTotals(property),
      fetchTopPages(property, 20),
      fetchTopQueries(property, 20),
      fetchIndexingFromSitemaps(property),
    ]);

    const now = new Date();
    const expires = new Date(now.getTime() + getGscConfig().cacheTtlMs);

    const cache: GscCacheFile = {
      syncedAt: now.toISOString(),
      expiresAt: expires.toISOString(),
      data: {
        property,
        indexing,
        totals,
        topPages,
        topQueries,
      },
    };

    writeCache(cache);
    return cacheToDashboard(cache);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Sync failed";
    const fallback = existing ? cacheToDashboard(existing) : emptyDashboard();
    return { ...fallback, syncError: message };
  }
}

export async function getDashboardData(
  options: { force?: boolean } = {},
): Promise<GscDashboardData> {
  const cache = readCache();

  if (!isGoogleConnected()) {
    if (cache && isCacheValid(cache)) {
      return cacheToDashboard(cache);
    }
    return emptyDashboard();
  }

  if (cache && isCacheValid(cache) && !options.force) {
    return cacheToDashboard(cache);
  }

  return syncGscData(options.force);
}
