import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-api";
import { buildBacklinkReport } from "@/lib/backlinks/reports";
import {
  deleteSubmission,
  readBacklinkStore,
  upsertSubmission,
} from "@/lib/backlinks/storage";
import type { SubmissionStatus } from "@/lib/backlinks/types";

const VALID_STATUSES: SubmissionStatus[] = [
  "submitted",
  "pending",
  "approved",
  "rejected",
];

export async function GET(request: NextRequest) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  const store = readBacklinkStore();
  const report = buildBacklinkReport(store);

  return NextResponse.json({
    store,
    report,
  });
}

export async function POST(request: NextRequest) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const status = body.status as SubmissionStatus;
  if (!VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  if (
    typeof body.websiteName !== "string" ||
    typeof body.url !== "string" ||
    typeof body.category !== "string"
  ) {
    return NextResponse.json(
      { error: "websiteName, url and category are required" },
      { status: 400 },
    );
  }

  const entry = upsertSubmission({
    id: typeof body.id === "string" ? body.id : undefined,
    websiteName: body.websiteName,
    url: body.url,
    category: body.category,
    submittedDate:
      typeof body.submittedDate === "string" ? body.submittedDate : null,
    status,
    backlinkUrl:
      typeof body.backlinkUrl === "string" ? body.backlinkUrl : null,
    notes: typeof body.notes === "string" ? body.notes : undefined,
  });

  const store = readBacklinkStore();
  return NextResponse.json({
    submission: entry,
    report: buildBacklinkReport(store),
  });
}

export async function DELETE(request: NextRequest) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  const id = request.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  const removed = deleteSubmission(id);
  if (!removed) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const store = readBacklinkStore();
  return NextResponse.json({ report: buildBacklinkReport(store) });
}
