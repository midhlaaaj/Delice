import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { checkRateLimit, getIpFromHeaders } from "@/lib/rate-limit";

// NOTE: passing a custom function to `auth()` makes NextAuth skip its own
// automatic redirect-on-unauthorized behavior (that only fires when the
// `authorized` callback returns a Response, not a boolean) — so the admin
// gate below is handled explicitly instead of relying on that callback.
export default auth((req) => {
  const { pathname } = req.nextUrl;

  const isAdminRoute = pathname.startsWith("/admin") && !pathname.startsWith("/admin/login");
  if (isAdminRoute && !req.auth?.user) {
    const signInUrl = new URL("/admin/login", req.nextUrl);
    signInUrl.searchParams.set("callbackUrl", req.nextUrl.href);
    return NextResponse.redirect(signInUrl);
  }

  // Coarse, defense-in-depth cap on admin-action API routes, on top of the
  // tighter per-route limits already applied inside individual handlers.
  // Public asset serving (/api/media) and NextAuth's own polling endpoints
  // (/api/auth/session, /csrf, etc., which the client calls on every page)
  // are excluded — they have their own, more appropriate handling and
  // shouldn't share a bucket with admin actions on a busy/shared IP.
  if (pathname.startsWith("/api/admin/")) {
    const ip = getIpFromHeaders(req.headers);
    const { allowed, retryAfterSeconds } = checkRateLimit(`api:${ip}`, 300, 60_000);
    if (!allowed) {
      return NextResponse.json(
        { error: "Too many requests." },
        { status: 429, headers: { "Retry-After": String(retryAfterSeconds) } }
      );
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/api/:path*"],
};
