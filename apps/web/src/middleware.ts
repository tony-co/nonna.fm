import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { env } from "./env.mjs";
import { routing } from "./i18n/routing";

// Create the i18n middleware
const intlMiddleware = createIntlMiddleware(routing);

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest): NextResponse {
  // Get the basic auth credentials from the request
  const basicAuth = request.headers.get("authorization");

  if (basicAuth) {
    const authValue = basicAuth.split(" ")[1];
    const [user, pwd] = atob(authValue).split(":");

    // Check if the credentials match
    if (user === env.BASIC_AUTH_USER && pwd === env.BASIC_AUTH_PASSWORD) {
      // If authenticated, proceed with i18n routing
      return intlMiddleware(request);
    }
  }

  // If no credentials or invalid credentials, return 401
  return new NextResponse(env.BASIC_AUTH_USER ? "Authentication required" : "", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Secure Area"',
    },
  });
}

// Configure which routes to protect and apply i18n
export const config = {
  matcher: [
    // Match all pathnames except for
    // - API routes, _next static files, images, and favicons
    // - Sentry tunnel route to avoid conflicts
    "/((?!api|sentry-tunnel|_next|_vercel|favicons|favicon\\.ico|manifest\\.json|.*\\..*).*)",
  ],
};
