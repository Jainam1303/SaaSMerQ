import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-api";
import { syncGscData } from "@/lib/gsc/sync";

export async function POST(request: NextRequest) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  const data = await syncGscData(true);
  return NextResponse.json(data);
}
