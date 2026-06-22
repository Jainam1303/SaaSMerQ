import { NextRequest, NextResponse } from "next/server";
import { siteConfig } from "@/lib/site";
import { requireAdmin } from "@/lib/admin-api";
import { exchangeCodeForTokens } from "@/lib/gsc/oauth";
import { syncGscData } from "@/lib/gsc/sync";

export async function GET(request: NextRequest) {
  const denied = requireAdmin(request);
  if (denied) return denied;

  const { searchParams } = request.nextUrl;
  const error = searchParams.get("error");
  if (error) {
    return NextResponse.redirect(
      `${siteConfig.url}/admin/seo?error=${encodeURIComponent(error)}`,
    );
  }

  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const savedState = request.cookies.get("gsc_oauth_state")?.value;

  if (!code || !state || !savedState || state !== savedState) {
    return NextResponse.redirect(
      `${siteConfig.url}/admin/seo?error=oauth_state_mismatch`,
    );
  }

  try {
    await exchangeCodeForTokens(code);
    await syncGscData(true);
    const response = NextResponse.redirect(
      `${siteConfig.url}/admin/seo?connected=1`,
    );
    response.cookies.delete("gsc_oauth_state");
    return response;
  } catch (err) {
    const message = err instanceof Error ? err.message : "oauth_failed";
    return NextResponse.redirect(
      `${siteConfig.url}/admin/seo?error=${encodeURIComponent(message)}`,
    );
  }
}
