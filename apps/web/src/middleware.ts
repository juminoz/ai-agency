import { NextResponse, type NextRequest } from "next/server";

import { updateSession } from "@/lib/supabase/middleware";

const PUBLIC_ROUTES = ["/", "/login", "/signup", "/unauthorized"];
const AUTH_ROUTES = ["/login", "/signup"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static assets and Next.js internals
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const { user, response } = await updateSession(request);

  // Public routes — no auth needed
  if (PUBLIC_ROUTES.includes(pathname)) {
    // Redirect logged-in users away from login/signup
    if (user && AUTH_ROUTES.includes(pathname)) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return response;
  }

  // Auth callback — always allow
  if (pathname.startsWith("/auth/callback")) {
    return response;
  }

  // All routes below require authentication
  if (!user) {
    const redirectUrl = new URL("/login", request.url);
    redirectUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // /admin/* and /api/admin/* — require admin role
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    const { createServerClient } = await import("@/lib/supabase/server");
    const supabase = createServerClient();

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile || profile.role !== "admin") {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json(
          { error: "Forbidden: admin access required" },
          { status: 403 },
        );
      }
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  // /dashboard/* — any authenticated user is allowed
  // (already passed the auth check above)

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
