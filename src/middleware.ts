import { TokenBucketRateLimiter } from "@/lib/rateLimiter";
import { NextResponse, type NextRequest } from "next/server";

import { decrypt } from "@/lib/session";
import { cookies } from "next/headers";

const apiRateLimiter = new TokenBucketRateLimiter({
  bucketCapacity: 10,
  tokensPerMinute: 20,
});

const publicRoutes = ["/login", "/api/v1/auth/login"];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isPublicRoute = publicRoutes.includes(path);

  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);

  if (!isPublicRoute && !session) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }

  if (!request.nextUrl.pathname.includes("/api")) return NextResponse.next();

  // Get the IP address from the request headers
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0] ||
    request.headers.get("x-real-ip") ||
    "unknown";

  // Get the fingerprint ID from cookie
  const fpCookie = request.cookies.get("x-fp-id")?.value;

  // Use session.userId if available (user is logged in)
  // Otherwise fall back to fpCookie or IP for non-authenticated requests
  const identifier = (session?.userId as string) || fpCookie || ip;

  // Reject the request if no identifier is available
  if (!identifier || identifier === "unknown") {
    return new NextResponse(
      JSON.stringify({
        message: "Unable to identify request source",
        error: "IDENTIFICATION_FAILED",
      }),
      {
        status: 403,
        headers: { "content-type": "application/json" },
      },
    );
  }

  const allowed = await apiRateLimiter.allow(identifier);

  if (!allowed) {
    return new NextResponse(JSON.stringify({ message: "Too Many Requests" }), {
      status: 429,
      headers: { "content-type": "application/json" },
    });
  }

  return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
  // Original matcher: '/((?!api|_next/static|_next/image|.*\\.(png|jpg|jpeg|gif|webp|svg)$).*)',
  // Fixed matcher with non-capturing group for file extensions:
  matcher: [
    "/((?!_next/static|_next/image|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico)$).*)",
  ],
};
