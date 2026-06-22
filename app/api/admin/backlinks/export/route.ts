import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-api";
import { exportBacklinkStore } from "@/lib/backlinks/storage";

export async function GET(request: NextRequest) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  const store = exportBacklinkStore();
  const filename = `merqprime-backlinks-${new Date().toISOString().slice(0, 10)}.json`;

  return new NextResponse(JSON.stringify(store, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
