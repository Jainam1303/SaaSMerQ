import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-api";
import { clearOAuthTokens } from "@/lib/gsc/storage";

export async function POST(request: NextRequest) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  clearOAuthTokens();
  return NextResponse.json({ ok: true });
}
