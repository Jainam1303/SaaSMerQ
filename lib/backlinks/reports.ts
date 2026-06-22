import type {
  BacklinkReport,
  BacklinkStore,
  BacklinkSummary,
  SubmissionStatus,
} from "./types";

function extractDomain(url: string | null): string | null {
  if (!url?.trim()) return null;
  try {
    const host = new URL(url.trim()).hostname.replace(/^www\./, "");
    return host || null;
  } catch {
    return null;
  }
}

export function buildSummary(store: BacklinkStore): BacklinkSummary {
  const { submissions } = store;
  const approvedBacklinks = submissions.filter(
    (s) => s.status === "approved" && s.backlinkUrl,
  ).length;

  return {
    totalSubmissions: submissions.length,
    approvedBacklinks,
    pendingReviews: submissions.filter(
      (s) => s.status === "pending" || s.status === "submitted",
    ).length,
    submitted: submissions.filter((s) => s.status === "submitted").length,
    rejected: submissions.filter((s) => s.status === "rejected").length,
  };
}

export function buildBacklinkReport(store: BacklinkStore): BacklinkReport {
  const summary = buildSummary(store);
  const approvedWithLink = store.submissions.filter(
    (s) => s.status === "approved" && s.backlinkUrl,
  );

  const domainSet = new Set<string>();
  for (const item of approvedWithLink) {
    const domain = extractDomain(item.backlinkUrl);
    if (domain) domainSet.add(domain);
  }

  const total = store.submissions.length || 1;
  const byStatus: Record<SubmissionStatus, number> = {
    submitted: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  };
  const byCategory: Record<string, number> = {};

  for (const s of store.submissions) {
    byStatus[s.status] += 1;
    byCategory[s.category] = (byCategory[s.category] ?? 0) + 1;
  }

  return {
    generatedAt: new Date().toISOString(),
    summary,
    totalBacklinks: approvedWithLink.length,
    domainDiversity: domainSet.size,
    domains: Array.from(domainSet).sort(),
    submissionProgress: {
      approvedPercent: Math.round((byStatus.approved / total) * 100),
      submittedPercent: Math.round((byStatus.submitted / total) * 100),
      pendingPercent: Math.round((byStatus.pending / total) * 100),
      rejectedPercent: Math.round((byStatus.rejected / total) * 100),
    },
    byCategory,
    byStatus,
  };
}
