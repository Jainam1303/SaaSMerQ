import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-api";
import { getGscConfig } from "@/lib/gsc/config";
import { buildOAuthUrl } from "@/lib/gsc/oauth";

export async function GET(request: NextRequest) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  const { isConfigured } = getGscConfig();
  if (!isConfigured) {
    return NextResponse.json(
      { error: "Google OAuth is not configured on the server." },
      { status: 503 },
    );
  }

  const state = crypto.randomUUID();
  const response = NextResponse.redirect(buildOAuthUrl(state));
  response.cookies.set("gsc_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 600,
    path: "/",
  });
  return response;
}
