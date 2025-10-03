import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import { routing } from "./i18n/routing";

// Define protected routes
const isProtectedRoute = createRouteMatcher([
  "/admin(.*)",
  // '/account(.*)',
  // '/settings(.*)',
  // Add more protected routes as needed
]);

// Configure internationalization middleware
const intlMiddleware = createMiddleware({
  locales: routing.locales,
  defaultLocale: routing.defaultLocale,
  localePrefix: "always",
});

export default clerkMiddleware(async (auth, req) => {
  const { pathname, searchParams } = req.nextUrl;
  const isApiRoute = pathname.startsWith("/api");

  // Handle API routes - protect all except GET requests
  if (isApiRoute) {
    const method = req.method;
    
    // Allow GET requests without authentication
    if (method === "GET") {
      return NextResponse.next();
    }
    
    // Allow POST requests to /api/messages without authentication
    if (method === "POST" && pathname.includes("/api/messages")) {
      return NextResponse.next();
    }
    
    // Require authentication for all other methods (POST, PUT, DELETE, PATCH, etc.)
    const authResult = await auth();
    
    if (!authResult.userId) {
      return NextResponse.json(
        { error: "Unauthorized", message: "Authentication required" },
        { status: 401 }
      );
    }
    
    // Optional: Add role-based checks for specific API routes
    // if (pathname.startsWith("/api/admin") && authResult.orgRole !== "admin") {
    //   return NextResponse.json(
    //     { error: "Forbidden", message: "Admin access required" },
    //     { status: 403 }
    //   );
    // }
    
    return NextResponse.next();
  }

  // Redirect root to default locale
  if (pathname === "/") {
    return NextResponse.redirect(
      new URL(
        `/${routing.defaultLocale}${pathname}${
          searchParams ? `?${searchParams}` : ""
        }`,
        req.url
      )
    );
  }

  // Process internationalization
  const intlResponse = intlMiddleware(req);
  if (intlResponse) return intlResponse;

  // Handle protected routes
  if (isProtectedRoute(req)) {
    const authResult = await auth();
    
    // Redirect unauthenticated users
    if (!authResult.userId) {
      const signInUrl = new URL("/login", req.url);
      signInUrl.searchParams.set("redirect_url", req.url);
      return NextResponse.redirect(signInUrl);
    }
    
    // Optional: Check user role or other permissions
    // if (authResult.orgRole !== 'admin') {
    //   return NextResponse.redirect(new URL('/unauthorized', req.url));
    // }
  }

  return intlResponse;
});

export const config = {
  matcher: [
    // Match all routes except static files and Next.js internals
    "/((?!_next|.*\\..*).*)",
    // Include API routes
    "/(api|trpc)(.*)",
  ],
};