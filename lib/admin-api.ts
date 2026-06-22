import { NextRequest, NextResponse } from "next/server";
import { enforceAdminAuth } from "@/lib/admin-auth";

/** Guard admin API route handlers (middleware also enforces Basic Auth). */
export function requireAdmin(
  request: NextRequest,
): NextResponse | null {
  return enforceAdminAuth(request);
}
