"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import {
  Download,
  ExternalLink,
  Plus,
  RefreshCw,
  Trash2,
  Upload,
} from "lucide-react";
import type {
  BacklinkReport,
  BacklinkStore,
  BacklinkSubmission,
  SubmissionStatus,
} from "@/lib/backlinks/types";

const STATUS_OPTIONS: SubmissionStatus[] = [
  "pending",
  "submitted",
  "approved",
  "rejected",
];

const STATUS_STYLES: Record<SubmissionStatus, string> = {
  pending: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  submitted: "bg-blue-500/15 text-blue-700 dark:text-blue-400",
  approved: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  rejected: "bg-red-500/15 text-red-700 dark:text-red-400",
};

function emptyForm(): Omit<BacklinkSubmission, "id"> & { id?: string } {
  return {
    websiteName: "",
    url: "",
    category: "Other",
    submittedDate: null,
    status: "pending",
    backlinkUrl: null,
    notes: "",
  };
}

function SummaryCards({ report }: { report: BacklinkReport }) {
  const cards = [
    {
      label: "Total submissions",
      value: report.summary.totalSubmissions,
    },
    {
      label: "Approved backlinks",
      value: report.summary.approvedBacklinks,
    },
    {
      label: "Pending reviews",
      value: report.summary.pendingReviews,
    },
    {
      label: "Domain diversity",
      value: report.domainDiversity,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-xl border border-border bg-card p-4 shadow-sm"
        >
          <p className="text-xs text-muted-foreground">{card.label}</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums">
            {card.value}
          </p>
        </div>
      ))}
    </div>
  );
}

function ProgressBar({ report }: { report: BacklinkReport }) {
  const segments = [
    { key: "approved", pct: report.submissionProgress.approvedPercent, color: "bg-emerald-500" },
    { key: "submitted", pct: report.submissionProgress.submittedPercent, color: "bg-blue-500" },
    { key: "pending", pct: report.submissionProgress.pendingPercent, color: "bg-amber-500" },
    { key: "rejected", pct: report.submissionProgress.rejectedPercent, color: "bg-red-500" },
  ];

  return (
    <div className="space-y-3 rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-sm font-semibold">Submission progress</h2>
        <span className="text-xs text-muted-foreground">
          {report.totalBacklinks} live backlinks
        </span>
      </div>
      <div className="flex h-3 overflow-hidden rounded-full bg-muted">
        {segments.map((seg) =>
          seg.pct > 0 ? (
            <div
              key={seg.key}
              className={`${seg.color} transition-all`}
              style={{ width: `${seg.pct}%` }}
              title={`${seg.key}: ${seg.pct}%`}
            />
          ) : null,
        )}
      </div>
      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
        {segments.map((seg) => (
          <span key={seg.key} className="capitalize">
            {seg.key}: {seg.pct}%
          </span>
        ))}
      </div>
      {report.domains.length > 0 ? (
        <p className="text-xs text-muted-foreground">
          Referring domains: {report.domains.join(", ")}
        </p>
      ) : null}
    </div>
  );
}

export function BacklinkTrackerPanel({
  initialStore,
  initialReport,
}: {
  initialStore: BacklinkStore;
  initialReport: BacklinkReport;
}) {
  const [store, setStore] = useState(initialStore);
  const [report, setReport] = useState(initialReport);
  const [filter, setFilter] = useState<SubmissionStatus | "all">("all");
  const [editing, setEditing] = useState<
    (Omit<BacklinkSubmission, "id"> & { id?: string }) | null
  >(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    const list = [...store.submissions].sort((a, b) =>
      a.websiteName.localeCompare(b.websiteName),
    );
    if (filter === "all") return list;
    return list.filter((s) => s.status === filter);
  }, [store.submissions, filter]);

  const refresh = useCallback(async () => {
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch("/api/admin/backlinks");
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      const json = (await res.json()) as {
        store: BacklinkStore;
        report: BacklinkReport;
      };
      setStore(json.store);
      setReport(json.report);
      setStatus("Data refreshed.");
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "Refresh failed");
    } finally {
      setLoading(false);
    }
  }, []);

  const saveSubmission = async () => {
    if (!editing) return;
    if (!editing.websiteName.trim() || !editing.url.trim()) {
      setStatus("Website name and URL are required.");
      return;
    }

    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch("/api/admin/backlinks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing),
      });
      if (!res.ok) {
        const err = (await res.json()) as { error?: string };
        throw new Error(err.error ?? `Save failed (${res.status})`);
      }
      const json = (await res.json()) as { report: BacklinkReport };
      setEditing(null);
      await refresh();
      setReport(json.report);
      setStatus("Submission saved.");
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "Save failed");
    } finally {
      setLoading(false);
    }
  };

  const removeSubmission = async (id: string) => {
    if (!confirm("Delete this submission?")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/backlinks?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(`Delete failed (${res.status})`);
      await refresh();
      setStatus("Submission removed.");
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "Delete failed");
    } finally {
      setLoading(false);
    }
  };

  const exportJson = () => {
    window.open("/api/admin/backlinks/export", "_blank");
  };

  const importJson = async (file: File) => {
    setLoading(true);
    setStatus(null);
    try {
      const text = await file.text();
      const payload = JSON.parse(text) as BacklinkStore;
      const merge = confirm(
        "OK = merge by ID. Cancel = replace entire store.",
      );
      const res = await fetch(
        `/api/admin/backlinks/import?mode=${merge ? "merge" : "replace"}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      if (!res.ok) {
        const err = (await res.json()) as { error?: string };
        throw new Error(err.error ?? `Import failed (${res.status})`);
      }
      const json = (await res.json()) as {
        store: BacklinkStore;
        report: BacklinkReport;
      };
      setStore(json.store);
      setReport(json.report);
      setStatus(merge ? "Import merged." : "Import replaced store.");
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "Import failed");
    } finally {
      setLoading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div className="space-y-6">
      <SummaryCards report={report} />
      <ProgressBar report={report} />

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => refresh()}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm hover:bg-muted/50 disabled:opacity-50"
        >
          <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
        <button
          type="button"
          onClick={() => setEditing(emptyForm())}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm text-primary-foreground hover:opacity-90"
        >
          <Plus className="size-4" />
          Add submission
        </button>
        <button
          type="button"
          onClick={exportJson}
          className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm hover:bg-muted/50"
        >
          <Download className="size-4" />
          Export JSON
        </button>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm hover:bg-muted/50"
        >
          <Upload className="size-4" />
          Import JSON
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void importJson(file);
          }}
        />
        <select
          value={filter}
          onChange={(e) =>
            setFilter(e.target.value as SubmissionStatus | "all")
          }
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
        >
          <option value="all">All statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {status ? (
        <p className="text-sm text-muted-foreground">{status}</p>
      ) : null}

      {editing ? (
        <div className="space-y-4 rounded-xl border border-border bg-card p-4 shadow-sm">
          <h2 className="text-sm font-semibold">
            {editing.id ? "Edit submission" : "New submission"}
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="space-y-1 text-sm">
              <span className="text-muted-foreground">Website name</span>
              <input
                className="w-full rounded-lg border border-border bg-background px-3 py-2"
                value={editing.websiteName}
                onChange={(e) =>
                  setEditing({ ...editing, websiteName: e.target.value })
                }
              />
            </label>
            <label className="space-y-1 text-sm">
              <span className="text-muted-foreground">Category</span>
              <input
                className="w-full rounded-lg border border-border bg-background px-3 py-2"
                value={editing.category}
                onChange={(e) =>
                  setEditing({ ...editing, category: e.target.value })
                }
              />
            </label>
            <label className="space-y-1 text-sm sm:col-span-2">
              <span className="text-muted-foreground">Submission URL</span>
              <input
                className="w-full rounded-lg border border-border bg-background px-3 py-2"
                value={editing.url}
                onChange={(e) => setEditing({ ...editing, url: e.target.value })}
              />
            </label>
            <label className="space-y-1 text-sm">
              <span className="text-muted-foreground">Submitted date</span>
              <input
                type="date"
                className="w-full rounded-lg border border-border bg-background px-3 py-2"
                value={editing.submittedDate?.slice(0, 10) ?? ""}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    submittedDate: e.target.value || null,
                  })
                }
              />
            </label>
            <label className="space-y-1 text-sm">
              <span className="text-muted-foreground">Status</span>
              <select
                className="w-full rounded-lg border border-border bg-background px-3 py-2"
                value={editing.status}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    status: e.target.value as SubmissionStatus,
                  })
                }
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-1 text-sm sm:col-span-2">
              <span className="text-muted-foreground">Backlink URL</span>
              <input
                className="w-full rounded-lg border border-border bg-background px-3 py-2"
                placeholder="https://example.com/listing/merqprime"
                value={editing.backlinkUrl ?? ""}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    backlinkUrl: e.target.value || null,
                  })
                }
              />
            </label>
            <label className="space-y-1 text-sm sm:col-span-2">
              <span className="text-muted-foreground">Notes</span>
              <textarea
                rows={2}
                className="w-full rounded-lg border border-border bg-background px-3 py-2"
                value={editing.notes ?? ""}
                onChange={(e) =>
                  setEditing({ ...editing, notes: e.target.value })
                }
              />
            </label>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => void saveSubmission()}
              disabled={loading}
              className="rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground hover:opacity-90 disabled:opacity-50"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-muted/50"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : null}

      <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="border-b border-border bg-muted/30 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Website</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Submitted</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Backlink</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((row) => (
              <tr key={row.id} className="hover:bg-muted/20">
                <td className="px-4 py-3">
                  <div className="font-medium">{row.websiteName}</div>
                  <a
                    href={row.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                  >
                    Submit
                    <ExternalLink className="size-3" />
                  </a>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{row.category}</td>
                <td className="px-4 py-3 tabular-nums text-muted-foreground">
                  {row.submittedDate?.slice(0, 10) ?? "—"}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium capitalize ${STATUS_STYLES[row.status]}`}
                  >
                    {row.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {row.backlinkUrl ? (
                    <a
                      href={row.backlinkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      View
                    </a>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setEditing({ ...row })}
                      className="text-xs text-primary hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => void removeSubmission(row.id)}
                      className="inline-flex items-center gap-1 text-xs text-red-600 hover:underline"
                    >
                      <Trash2 className="size-3" />
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-muted-foreground">
            No submissions match this filter.
          </p>
        ) : null}
      </div>

      <p className="text-xs text-muted-foreground">
        Last updated: {new Date(store.updatedAt).toLocaleString("en-IN")}
      </p>
    </div>
  );
}
