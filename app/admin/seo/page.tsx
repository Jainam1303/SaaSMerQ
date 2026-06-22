import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { buildMetadata } from "@/lib/seo";
import { getDashboardData } from "@/lib/gsc/sync";
import { GscDashboardPanel } from "@/components/admin/gsc-dashboard";

export const metadata: Metadata = buildMetadata({
  title: "SEO Dashboard",
  description: "Search Console metrics and indexing overview for MerQPrime.",
  path: "/admin/seo",
  absoluteTitle: true,
});

export default async function AdminSeoPage() {
  const data = await getDashboardData();

  return (
    <div className="container max-w-6xl space-y-6 py-8 md:py-12">
      <header className="space-y-2">
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <span>Internal</span>
          <span aria-hidden>·</span>
          <Link href="/admin/launch" className="hover:text-foreground">
            Launch Tracker
          </Link>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">
          Search Console Dashboard
        </h1>
        <p className="text-muted-foreground">
          Live metrics from Google Search Console. Data is cached for 24 hours
          between syncs.
        </p>
      </header>

      <Suspense fallback={<p className="text-sm text-muted-foreground">Loading…</p>}>
        <GscDashboardPanel initial={data} />
      </Suspense>
    </div>
  );
}
