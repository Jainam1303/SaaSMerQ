import { NextRequest, NextResponse } from "next/server";

export const ADMIN_ROBOTS_HEADER = "noindex, nofollow, noarchive";

/** Paths protected by HTTP Basic Auth (pages and admin API). */
export function isAdminRoute(pathname: string): boolean {
  return (
    pathname === "/admin" ||
    pathname.startsWith("/admin/") ||
    pathname === "/api/admin" ||
    pathname.startsWith("/api/admin/")
  );
}

function adminHeaders(extra?: Record<string, string>): Record<string, string> {
  return {
    "X-Robots-Tag": ADMIN_ROBOTS_HEADER,
    ...extra,
  };
}

function unauthorized(): NextResponse {
  return new NextResponse("Authentication required", {
    status: 401,
    headers: adminHeaders({
      "WWW-Authenticate": 'Basic realm="MerQPrime Admin", charset="UTF-8"',
    }),
  });
}

function adminNotFound(): NextResponse {
  return new NextResponse(null, {
    status: 404,
    headers: adminHeaders(),
  });
}

/**
 * Validates HTTP Basic credentials for admin routes.
 * Returns a response to short-circuit the request, or null when auth passes.
 */
export function enforceAdminAuth(request: NextRequest): NextResponse | null {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;

  if (!username || !password) {
    return adminNotFound();
  }

  const auth = request.headers.get("authorization");
  if (!auth?.startsWith("Basic ")) {
    return unauthorized();
  }

  let decoded: string;
  try {
    decoded = atob(auth.slice(6));
  } catch {
    return unauthorized();
  }

  const colon = decoded.indexOf(":");
  if (colon === -1) {
    return unauthorized();
  }

  const suppliedUsername = decoded.slice(0, colon);
  const suppliedPassword = decoded.slice(colon + 1);

  if (suppliedUsername !== username || suppliedPassword !== password) {
    return unauthorized();
  }

  return null;
}

export function withAdminRobotsHeader(response: NextResponse): NextResponse {
  response.headers.set("X-Robots-Tag", ADMIN_ROBOTS_HEADER);
  return response;
}
