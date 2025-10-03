import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import { routing } from './i18n/routing';

// Define protected routes
const isProtectedRoute = createRouteMatcher([
  '/admin(.*)',
  // '/account(.*)',
  // '/settings(.*)',
  // Add more protected routes as needed
]);

// Configure internationalization middleware
const intlMiddleware = createMiddleware({
  locales: routing.locales,
  defaultLocale: routing.defaultLocale,
  localePrefix: 'always',
  // Optional: domain-based routing if using multiple domains
  // domains: [
  //   {domain: 'example.com', defaultLocale: 'en'},
  //   {domain: 'example.es', defaultLocale: 'es'}
  // ]
});

export default clerkMiddleware(async (auth, req) => {
  const { pathname, searchParams } = req.nextUrl;
  const isApiRoute = pathname.startsWith('/api');

  // Handle API routes with authentication
  if (isApiRoute) {
    const authResult = await auth();

    // Check if this is a public API route that doesn't require authentication
    const publicApiRoutes = [
      '/api/health',
      '/api/example', // Add any public API routes here
    ];

    // Check if this is a public message endpoint (POST only for contact forms)
    const isPublicMessageEndpoint =
      pathname === '/api/messages' && req.method === 'POST';

    const isPublicApiRoute = publicApiRoutes.some(route =>
      pathname.startsWith(route)
    );

    // Allow OPTIONS requests for CORS preflight without authentication
    const isOptionsRequest = req.method === 'OPTIONS';

    // If not a public route, not a public message endpoint, not an OPTIONS request, and user is not authenticated, return 401
    if (
      !isPublicApiRoute &&
      !isPublicMessageEndpoint &&
      !isOptionsRequest &&
      !authResult.userId
    ) {
      return NextResponse.json(
        {
          error: 'Unauthorized',
          message: 'Authentication required',
          statusCode: 401,
        },
        {
          status: 401,
          headers: {
            'WWW-Authenticate': 'Bearer',
          },
        }
      );
    }

    // Add user ID to headers for authenticated requests
    if (authResult.userId) {
      const response = NextResponse.next();
      response.headers.set('x-user-id', authResult.userId);
      return response;
    }

    return NextResponse.next();
  }

  // Redirect root to default locale
  if (pathname === '/') {
    return NextResponse.redirect(
      new URL(
        `/${routing.defaultLocale}${pathname}${
          searchParams ? `?${searchParams}` : ''
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
      const signInUrl = new URL('/login', req.url);
      signInUrl.searchParams.set('redirect_url', req.url);
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
    '/((?!_next|.*\\..*).*)',
    // Include API routes for authentication
    '/(api|trpc)(.*)',
  ],
};
