import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import {
  GscDashboardForm,
  GscStats,
  emptyGscDashboard,
} from "@/components/admin/gsc-dashboard";

export const metadata: Metadata = buildMetadata({
  title: "SEO Dashboard",
  description: "Search Console metrics and indexing overview for MerQPrime.",
  path: "/admin/seo",
  absoluteTitle: true,
});

function loadDashboard() {
  try {
    const raw = fs.readFileSync(
      path.join(process.cwd(), "data/gsc/dashboard.json"),
      "utf8",
    );
    return JSON.parse(raw) as typeof emptyGscDashboard;
  } catch {
    return emptyGscDashboard;
  }
}

export default function AdminSeoPage() {
  const data = loadDashboard();

  return (
    <div className="container max-w-6xl space-y-10 py-8 md:py-12">
      <header className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">Internal</p>
        <h1 className="text-3xl font-bold tracking-tight">Search Console Dashboard</h1>
        <p className="text-muted-foreground">
          Enter figures manually from Google Search Console exports. Last
          updated: {data.lastUpdated ?? "—"}
        </p>
      </header>

      <GscStats data={data} />

      <section className="grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="mb-4 text-lg font-semibold">Top pages</h2>
          {data.topPages.length === 0 ? (
            <p className="text-sm text-muted-foreground">No data yet.</p>
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
                    <td className="max-w-[200px] truncate py-2 pr-2">{row.url}</td>
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
            <p className="text-sm text-muted-foreground">No data yet.</p>
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
                    <td className="py-2 tabular-nums">{row.position.toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      <section className="rounded-2xl border border-border p-6">
        <h2 className="mb-4 text-lg font-semibold">Manual data entry</h2>
        <GscDashboardForm initial={data} />
      </section>
    </div>
  );
}
