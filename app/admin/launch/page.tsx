import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { buildMetadata } from "@/lib/seo";
import { buildBacklinkReport } from "@/lib/backlinks/reports";
import { readBacklinkStore } from "@/lib/backlinks/storage";
import { BacklinkTrackerPanel } from "@/components/admin/backlink-tracker";

export const metadata: Metadata = buildMetadata({
  title: "Launch & Backlink Tracker",
  description:
    "Directory submission checklist and backlink growth tracker for MerQPrime.",
  path: "/admin/launch",
  absoluteTitle: true,
});

export default async function AdminLaunchPage() {
  const store = readBacklinkStore();
  const report = buildBacklinkReport(store);

  return (
    <div className="container max-w-6xl space-y-6 py-8 md:py-12">
      <header className="space-y-2">
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <span>Internal</span>
          <span aria-hidden>·</span>
          <Link href="/admin/seo" className="hover:text-foreground">
            SEO Dashboard
          </Link>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">
          Launch & Backlink Tracker
        </h1>
        <p className="text-muted-foreground">
          Track directory submissions, approval status, and live backlinks.
          Export or import JSON for backups and reporting.
        </p>
      </header>

      <Suspense
        fallback={<p className="text-sm text-muted-foreground">Loading…</p>}
      >
        <BacklinkTrackerPanel initialStore={store} initialReport={report} />
      </Suspense>
    </div>
  );
}
