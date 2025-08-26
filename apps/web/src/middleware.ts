import type { NextRequest, NextResponse } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// Create the i18n middleware
const intlMiddleware = createIntlMiddleware(routing);

// Middleware function for internationalization routing
export function middleware(request: NextRequest): NextResponse {
  // Handle i18n routing
  return intlMiddleware(request);
}

// Configure which routes to protect and apply i18n
export const config = {
  matcher: [
    // Match all pathnames except for
    // - API routes, _next static files, images, favicons, XML files (sitemaps), and robots.txt
    "/((?!api/|_next/|_vercel/|favicons/|favicon\\.ico|manifest\\.json|sitemap|robots\\.txt).*)",
  ],
};
