"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { RefreshCw, Link2 } from "lucide-react";

export interface GscDashboardData {
  lastSyncedAt: string | null;
  cacheExpiresAt: string | null;
  connected: boolean;
  oauthConfigured: boolean;
  property: string | null;
  indexing: {
    indexedUrls: number;
    notIndexedUrls: number;
    sitemapUrls: number;
  };
  totals: {
    clicks: number;
    impressions: number;
    ctr: number;
    position: number;
  };
  topPages: {
    url: string;
    clicks: number;
    impressions: number;
    ctr: number;
    position: number;
  }[];
  topQueries: {
    query: string;
    clicks: number;
    impressions: number;
    ctr: number;
    position: number;
  }[];
  syncError?: string | null;
}

function formatTimestamp(iso: string | null): string {
  if (!iso) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

export function GscStats({ data }: { data: GscDashboardData }) {
  const cards = [
    { label: "Indexed URLs", value: data.indexing.indexedUrls },
    { label: "Not indexed", value: data.indexing.notIndexedUrls },
    { label: "Sitemap URLs", value: data.indexing.sitemapUrls },
    { label: "Clicks", value: data.totals.clicks },
    { label: "Impressions", value: data.totals.impressions },
    {
      label: "CTR",
      value: `${(data.totals.ctr * 100).toFixed(2)}%`,
    },
    { label: "Avg position", value: data.totals.position.toFixed(1) },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-xl border border-border bg-card p-4 shadow-sm"
        >
          <p className="text-xs text-muted-foreground">{card.label}</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums">{card.value}</p>
        </div>
      ))}
    </div>
  );
}

export function GscDashboardPanel({
  initial,
}: {
  initial: GscDashboardData;
}) {
  const searchParams = useSearchParams();
  const [data, setData] = useState<GscDashboardData>(initial);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const load = useCallback(async (refresh = false) => {
    setLoading(true);
    setStatus(null);
    try {
      const url = refresh ? "/api/admin/gsc/refresh" : "/api/admin/gsc";
      const res = await fetch(url, refresh ? { method: "POST" } : undefined);
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      const json = (await res.json()) as GscDashboardData;
      setData(json);
      if (json.syncError) setStatus(json.syncError);
      else if (refresh) setStatus("Data refreshed from Google Search Console.");
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const connected = searchParams.get("connected");
    const error = searchParams.get("error");
    if (connected === "1") {
      setStatus("Google Search Console connected successfully.");
      load(false);
    } else if (error) {
      setStatus(decodeURIComponent(error));
    }
  }, [searchParams, load]);

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1 text-sm">
          <p>
            <span className="text-muted-foreground">Google connection: </span>
            <span className="font-medium">
              {data.connected ? "Connected" : "Not connected"}
            </span>
          </p>
          <p>
            <span className="text-muted-foreground">Property: </span>
            <span className="font-medium">{data.property ?? "—"}</span>
          </p>
          <p>
            <span className="text-muted-foreground">Last sync: </span>
            <span className="font-medium">
              {formatTimestamp(data.lastSyncedAt)}
            </span>
          </p>
          {data.cacheExpiresAt && (
            <p className="text-xs text-muted-foreground">
              Cache valid until {formatTimestamp(data.cacheExpiresAt)}
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-3">
          {!data.connected && (
            <a
              href={data.oauthConfigured ? "/api/admin/gsc/oauth/start" : undefined}
              aria-disabled={!data.oauthConfigured}
              className={`inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors ${
                data.oauthConfigured
                  ? "hover:bg-muted/50"
                  : "pointer-events-none opacity-50"
              }`}
            >
              <Link2 className="size-4" />
              Connect Google
            </a>
          )}
          {data.connected && (
            <button
              type="button"
              onClick={async () => {
                await fetch("/api/admin/gsc/disconnect", { method: "POST" });
                window.location.reload();
              }}
              className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted/50"
            >
              Reconnect Google
            </button>
          )}
          <button
            type="button"
            onClick={() => load(true)}
            disabled={loading || !data.connected}
            className="inline-flex items-center gap-2 rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background disabled:opacity-50"
          >
            <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
            {loading ? "Refreshing…" : "Refresh Data"}
          </button>
        </div>
      </div>

      {status && (
        <p className="text-sm text-muted-foreground" role="status">
          {status}
        </p>
      )}

      {!data.oauthConfigured && (
        <section className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-6 text-sm">
          <h2 className="mb-2 font-semibold">Google OAuth setup required</h2>
          <p className="mb-4 text-muted-foreground">
            Server env vars <code className="text-foreground">GOOGLE_CLIENT_ID</code> and{" "}
            <code className="text-foreground">GOOGLE_CLIENT_SECRET</code> are missing.
            Create them in Google Cloud Console, then add to production and rebuild.
          </p>
          <ol className="list-decimal space-y-2 pl-5 text-muted-foreground">
            <li>
              Open{" "}
              <a
                href="https://console.cloud.google.com/apis/library/searchconsole.googleapis.com"
                className="underline hover:text-foreground"
                target="_blank"
                rel="noopener noreferrer"
              >
                Google Search Console API
              </a>{" "}
              and enable it for your project.
            </li>
            <li>
              Create an OAuth 2.0 Web Client with redirect URI:{" "}
              <code className="text-foreground">
                https://merqprime.in/api/admin/gsc/oauth/callback
              </code>
            </li>
            <li>
              Add to <code className="text-foreground">~/SaaSMerQ/.env.production</code> on the
              server, then run <code className="text-foreground">npm run build && pm2 restart merqprime</code>.
            </li>
          </ol>
        </section>
      )}

      <GscStats data={data} />

      <section className="grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="mb-4 text-lg font-semibold">Top pages</h2>
          {data.topPages.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              {data.connected
                ? "No page data for the selected period."
                : "Connect Google to load top pages."}
            </p>
          ) : (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b text-muted-foreground">
                  <th className="py-2 pr-2">URL</th>
                  <th className="py-2">Clicks</th>
                  <th className="py-2">CTR</th>
                </tr>
              </thead>
              <tbody>
                {data.topPages.map((row) => (
                  <tr key={row.url} className="border-b border-border/60">
                    <td className="max-w-[220px] truncate py-2 pr-2">
                      {row.url}
                    </td>
                    <td className="py-2 tabular-nums">{row.clicks}</td>
                    <td className="py-2 tabular-nums">
                      {(row.ctr * 100).toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div>
          <h2 className="mb-4 text-lg font-semibold">Top queries</h2>
          {data.topQueries.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              {data.connected
                ? "No query data for the selected period."
                : "Connect Google to load top queries."}
            </p>
          ) : (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b text-muted-foreground">
                  <th className="py-2 pr-2">Query</th>
                  <th className="py-2">Clicks</th>
                  <th className="py-2">Position</th>
                </tr>
              </thead>
              <tbody>
                {data.topQueries.map((row) => (
                  <tr key={row.query} className="border-b border-border/60">
                    <td className="py-2 pr-2">{row.query}</td>
                    <td className="py-2 tabular-nums">{row.clicks}</td>
                    <td className="py-2 tabular-nums">
                      {row.position.toFixed(1)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  );
}
