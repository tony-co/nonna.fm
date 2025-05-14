import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { env } from "./env.mjs";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest): NextResponse {
  // Get the basic auth credentials from the request
  const basicAuth = request.headers.get("authorization");

  if (basicAuth) {
    const authValue = basicAuth.split(" ")[1];
    const [user, pwd] = atob(authValue).split(":");

    // Check if the credentials match
    if (user === env.BASIC_AUTH_USER && pwd === env.BASIC_AUTH_PASSWORD) {
      return NextResponse.next();
    }
  }

  // If no credentials or invalid credentials, return 401
  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Secure Area"',
    },
  });
}

// Configure which routes to protect
export const config = {
  matcher: [
    /*
     * Exclude the Sentry tunnel route from middleware to avoid conflicts.
     * This must come before other exclusions to ensure Sentry requests are not blocked.
     */
    "/((?!monitoring|api|_next/static|_next/image|favicon\\.ico|manifest\\.json|favicons/).*)",
  ],
};
