/**
 * Sprint 10 backlink growth report — totals, domain diversity, submission progress.
 * Usage: node scripts/backlink-report.mjs
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const STORE_PATH = path.join(ROOT, "data/backlinks/submissions.json");
const OUT = path.join(ROOT, "reports/backlink-growth.json");

function extractDomain(url) {
  if (!url?.trim()) return null;
  try {
    return new URL(url.trim()).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

function loadStore() {
  if (!fs.existsSync(STORE_PATH)) {
    return { version: 1, updatedAt: null, submissions: [] };
  }
  return JSON.parse(fs.readFileSync(STORE_PATH, "utf8"));
}

function buildReport(store) {
  const submissions = store.submissions ?? [];
  const byStatus = { submitted: 0, pending: 0, approved: 0, rejected: 0 };
  const byCategory = {};
  const domains = new Set();

  for (const s of submissions) {
    byStatus[s.status] = (byStatus[s.status] ?? 0) + 1;
    byCategory[s.category] = (byCategory[s.category] ?? 0) + 1;
    if (s.status === "approved" && s.backlinkUrl) {
      const d = extractDomain(s.backlinkUrl);
      if (d) domains.add(d);
    }
  }

  const approvedWithLink = submissions.filter(
    (s) => s.status === "approved" && s.backlinkUrl,
  ).length;
  const total = submissions.length || 1;

  return {
    generatedAt: new Date().toISOString(),
    storeUpdatedAt: store.updatedAt,
    summary: {
      totalSubmissions: submissions.length,
      approvedBacklinks: approvedWithLink,
      pendingReviews: submissions.filter(
        (s) => s.status === "pending" || s.status === "submitted",
      ).length,
      submitted: byStatus.submitted,
      rejected: byStatus.rejected,
    },
    totalBacklinks: approvedWithLink,
    domainDiversity: domains.size,
    domains: [...domains].sort(),
    submissionProgress: {
      approvedPercent: Math.round((byStatus.approved / total) * 100),
      submittedPercent: Math.round((byStatus.submitted / total) * 100),
      pendingPercent: Math.round((byStatus.pending / total) * 100),
      rejectedPercent: Math.round((byStatus.rejected / total) * 100),
    },
    byCategory,
    byStatus,
    checklistCoverage: {
      note: "Seed checklist items are merged on first admin load if store is empty",
      targetsInRepo: 20,
    },
  };
}

const store = loadStore();
const report = buildReport(store);

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(report, null, 2), "utf8");

console.log(`Backlink report written to ${OUT}`);
console.log(
  `Submissions: ${report.summary.totalSubmissions} | Approved backlinks: ${report.summary.approvedBacklinks} | Domains: ${report.domainDiversity}`,
);
