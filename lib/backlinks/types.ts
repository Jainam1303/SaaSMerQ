export type SubmissionStatus =
  | "submitted"
  | "pending"
  | "approved"
  | "rejected";

export interface BacklinkSubmission {
  id: string;
  websiteName: string;
  url: string;
  category: string;
  submittedDate: string | null;
  status: SubmissionStatus;
  backlinkUrl: string | null;
  notes?: string;
}

export interface BacklinkStore {
  version: 1;
  updatedAt: string;
  submissions: BacklinkSubmission[];
}

export interface BacklinkSummary {
  totalSubmissions: number;
  approvedBacklinks: number;
  pendingReviews: number;
  submitted: number;
  rejected: number;
}

export interface BacklinkReport {
  generatedAt: string;
  summary: BacklinkSummary;
  totalBacklinks: number;
  domainDiversity: number;
  domains: string[];
  submissionProgress: {
    approvedPercent: number;
    submittedPercent: number;
    pendingPercent: number;
    rejectedPercent: number;
  };
  byCategory: Record<string, number>;
  byStatus: Record<SubmissionStatus, number>;
}
