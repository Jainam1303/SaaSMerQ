import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-api";
import { getDashboardData } from "@/lib/gsc/sync";

export async function GET(request: NextRequest) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  const force = request.nextUrl.searchParams.get("refresh") === "1";
  const data = await getDashboardData({ force });
  return NextResponse.json(data);
}
