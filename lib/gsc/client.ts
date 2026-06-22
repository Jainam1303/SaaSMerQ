import { getGscConfig } from "./config";
import { getValidAccessToken } from "./oauth";
import type { GscRow, GscTopPage, GscTopQuery } from "./types";

interface AnalyticsRow {
  keys?: string[];
  clicks?: number;
  impressions?: number;
  ctr?: number;
  position?: number;
}

function formatDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function analyticsRange() {
  const end = new Date();
  end.setDate(end.getDate() - 3);
  const start = new Date(end);
  start.setDate(start.getDate() - 27);
  return { startDate: formatDate(start), endDate: formatDate(end) };
}

async function gscFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const token = await getValidAccessToken();
  if (!token) throw new Error("Google Search Console is not connected.");

  const res = await fetch(`https://www.googleapis.com/webmasters/v3${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`GSC API error (${res.status}): ${err}`);
  }

  return res.json() as Promise<T>;
}

function encodeSiteUrl(siteUrl: string): string {
  return encodeURIComponent(siteUrl);
}

function mapRow(row: AnalyticsRow): GscRow {
  return {
    clicks: row.clicks ?? 0,
    impressions: row.impressions ?? 0,
    ctr: row.ctr ?? 0,
    position: row.position ?? 0,
  };
}

async function queryAnalytics(
  siteUrl: string,
  body: Record<string, unknown>,
): Promise<AnalyticsRow[]> {
  const data = await gscFetch<{ rows?: AnalyticsRow[] }>(
    `/sites/${encodeSiteUrl(siteUrl)}/searchAnalytics/query`,
    { method: "POST", body: JSON.stringify(body) },
  );
  return data.rows ?? [];
}

export async function fetchSearchTotals(siteUrl: string): Promise<GscRow> {
  const range = analyticsRange();
  const rows = await queryAnalytics(siteUrl, {
    ...range,
    rowLimit: 1,
  });
  return rows[0] ? mapRow(rows[0]) : { clicks: 0, impressions: 0, ctr: 0, position: 0 };
}

export async function fetchTopPages(
  siteUrl: string,
  limit = 20,
): Promise<GscTopPage[]> {
  const range = analyticsRange();
  const rows = await queryAnalytics(siteUrl, {
    ...range,
    dimensions: ["page"],
    rowLimit: limit,
  });
  return rows.map((row) => ({
    ...mapRow(row),
    url: row.keys?.[0] ?? "",
  }));
}

export async function fetchTopQueries(
  siteUrl: string,
  limit = 20,
): Promise<GscTopQuery[]> {
  const range = analyticsRange();
  const rows = await queryAnalytics(siteUrl, {
    ...range,
    dimensions: ["query"],
    rowLimit: limit,
  });
  return rows.map((row) => ({
    ...mapRow(row),
    query: row.keys?.[0] ?? "",
  }));
}

export async function fetchIndexingFromSitemaps(siteUrl: string): Promise<{
  indexedUrls: number;
  sitemapUrls: number;
  notIndexedUrls: number;
}> {
  const data = await gscFetch<{
    sitemap?: Array<{
      contents?: Array<{ type?: string; submitted?: string; indexed?: string }>;
    }>;
  }>(`/sites/${encodeSiteUrl(siteUrl)}/sitemaps`);

  let indexedUrls = 0;
  let sitemapUrls = 0;

  for (const entry of data.sitemap ?? []) {
    for (const content of entry.contents ?? []) {
      if (content.type === "web") {
        indexedUrls += Number(content.indexed ?? 0);
        sitemapUrls += Number(content.submitted ?? 0);
      }
    }
  }

  return {
    indexedUrls,
    sitemapUrls,
    notIndexedUrls: Math.max(0, sitemapUrls - indexedUrls),
  };
}

/** Resolve an accessible property URL (prefers configured, falls back to first site). */
export async function resolveSiteUrl(): Promise<string> {
  const { siteUrl } = getGscConfig();
  const token = await getValidAccessToken();
  if (!token) throw new Error("Not connected");

  const res = await fetch("https://www.googleapis.com/webmasters/v3/sites", {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new Error("Failed to list Search Console properties");
  }

  const data = (await res.json()) as {
    siteEntry?: Array<{ siteUrl?: string; permissionLevel?: string }>;
  };

  const sites = data.siteEntry ?? [];
  const match = sites.find((s) => s.siteUrl === siteUrl);
  if (match) return siteUrl;

  const domainAlt = `https://${siteUrl.replace("sc-domain:", "")}/`;
  const matchHttps = sites.find((s) => s.siteUrl === domainAlt);
  if (matchHttps) return matchHttps.siteUrl!;

  if (sites[0]?.siteUrl) return sites[0].siteUrl;
  throw new Error(`No access to property ${siteUrl}. Add it in Search Console.`);
}
