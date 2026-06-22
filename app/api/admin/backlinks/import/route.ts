import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-api";
import { buildBacklinkReport } from "@/lib/backlinks/reports";
import { importBacklinkStore } from "@/lib/backlinks/storage";
import type { BacklinkStore } from "@/lib/backlinks/types";

export async function POST(request: NextRequest) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  const mode =
    request.nextUrl.searchParams.get("mode") === "merge" ? "merge" : "replace";

  let payload: BacklinkStore;
  try {
    payload = (await request.json()) as BacklinkStore;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  try {
    const store = importBacklinkStore(payload, mode);
    return NextResponse.json({
      store,
      report: buildBacklinkReport(store),
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Import failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
