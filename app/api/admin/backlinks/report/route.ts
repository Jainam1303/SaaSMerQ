import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-api";
import { buildBacklinkReport } from "@/lib/backlinks/reports";
import { readBacklinkStore } from "@/lib/backlinks/storage";

export async function GET(request: NextRequest) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  const store = readBacklinkStore();
  return NextResponse.json(buildBacklinkReport(store));
}
