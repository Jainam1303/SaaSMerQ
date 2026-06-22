"use client";

import { useEffect, useState } from "react";

interface GscDashboard {
  lastUpdated: string | null;
  notes?: string;
  indexing: {
    indexedUrls: number;
    notIndexedUrls: number;
    sitemapUrls: number;
  };
  totals: {
    clicks: number;
    impressions: number;
    ctr: number;
    avgPosition: number;
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
}

const empty: GscDashboard = {
  lastUpdated: null,
  indexing: { indexedUrls: 0, notIndexedUrls: 0, sitemapUrls: 299 },
  totals: { clicks: 0, impressions: 0, ctr: 0, avgPosition: 0 },
  topPages: [],
  topQueries: [],
};

export function GscDashboardForm({ initial }: { initial: GscDashboard }) {
  const [data, setData] = useState<GscDashboard>(initial);
  const [jsonText, setJsonText] = useState(JSON.stringify(initial, null, 2));
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    setJsonText(JSON.stringify(data, null, 2));
  }, [data]);

  async function save() {
    try {
      const parsed = JSON.parse(jsonText) as GscDashboard;
      parsed.lastUpdated = new Date().toISOString().slice(0, 10);
      const res = await fetch("/api/admin/gsc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed),
      });
      if (!res.ok) throw new Error("Save failed");
      setData(parsed);
      setStatus("Saved successfully.");
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "Invalid JSON");
    }
  }

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium">
        Paste or edit Search Console export JSON
      </label>
      <textarea
        className="min-h-[280px] w-full rounded-lg border border-border bg-background p-4 font-mono text-xs"
        value={jsonText}
        onChange={(e) => setJsonText(e.target.value)}
      />
      <button
        type="button"
        onClick={save}
        className="rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background"
      >
        Save dashboard data
      </button>
      {status && <p className="text-sm text-muted-foreground">{status}</p>}
    </div>
  );
}

export function GscStats({ data }: { data: GscDashboard }) {
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
    { label: "Avg position", value: data.totals.avgPosition.toFixed(1) },
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

export { empty as emptyGscDashboard };
