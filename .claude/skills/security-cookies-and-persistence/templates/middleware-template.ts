/**
 * Next.js Middleware Template
 *
 * Template for protecting routes with authentication cookies.
 * Copy this into src/middleware.ts
 */

import { NextRequest, NextResponse } from "next/server";

// Constants
const ACCESS_TOKEN = "ACCESS_TOKEN";

/**
 * Middleware function to protect routes based on authentication status
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get auth token from cookies
  const accessToken = request.cookies.get(ACCESS_TOKEN)?.value;
  const isAuthenticated = !!accessToken;

  // Define route categories
  const isPublicRoute = pathname === "/" || pathname.startsWith("/about");

  const isAuthRoute =
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/reset-password");

  const isProtectedRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/wallet") ||
    pathname.startsWith("/profile") ||
    pathname.startsWith("/members") ||
    pathname.startsWith("/settings");

  // Case 1: Public routes - always allow
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Case 2: Not authenticated trying to access protected route
  if (!isAuthenticated && isProtectedRoute) {
    console.log("🔒 [middleware] Redirecting to login:", pathname);

    const loginUrl = new URL("/login", request.url);

    // Store return URL for post-login redirect
    loginUrl.searchParams.set("returnUrl", pathname);

    return NextResponse.redirect(loginUrl);
  }

  // Case 3: Authenticated trying to access auth pages
  if (isAuthenticated && isAuthRoute) {
    console.log("🔓 [middleware] Redirecting to dashboard");

    // Check if there's a return URL
    const returnUrl = request.nextUrl.searchParams.get("returnUrl");

    if (returnUrl && returnUrl.startsWith("/")) {
      return NextResponse.redirect(new URL(returnUrl, request.url));
    }

    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Case 4: All other requests - allow through
  return NextResponse.next();
}

/**
 * Configure which routes to run middleware on
 * Use specific matchers for better performance
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

/**
 * Alternative: Specific route matcher (better performance)
 */
export const configSpecific = {
  matcher: [
    // Protected routes
    "/dashboard/:path*",
    "/wallet/:path*",
    "/profile/:path*",
    "/members/:path*",
    "/settings/:path*",
    // Auth routes
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
  ],
};

/**
 * Advanced: Role-based access control
 */
export function middlewareWithRoles(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get(ACCESS_TOKEN)?.value;

  // You could decode JWT here to check roles
  // const decoded = decodeJWT(accessToken);
  // const userRole = decoded.role;

  const isAdminRoute = pathname.startsWith("/admin");

  // if (isAdminRoute && userRole !== "admin") {
  //   return NextResponse.redirect(new URL("/dashboard", request.url));
  // }

  // ... rest of middleware logic

  return NextResponse.next();
}
