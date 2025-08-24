/**
 * SEO Validation API Route
 * Tests and validates the SEO implementation
 */

import { NextRequest } from "next/server";
import { validatePageSEO, generateSEOReport } from "@/lib/seo/utils/validation";
import type { Locale } from "@/lib/seo";

export async function GET(request: NextRequest): Promise<Response> {
  try {
    const { searchParams } = new URL(request.url);
    const locale = (searchParams.get("locale") || "en") as Locale;
    const pathname = searchParams.get("path") || "/";
    const source = searchParams.get("source");
    const target = searchParams.get("target");

    const params = source && target ? { source, target } : undefined;

    // Run comprehensive SEO validation
    const validation = await validatePageSEO({
      locale,
      pathname,
      params,
    });

    // Generate human-readable report
    const report = generateSEOReport(validation);

    return new Response(
      JSON.stringify({
        validation,
        report,
        timestamp: new Date().toISOString(),
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
      }
    );
  } catch (error) {
    console.error("SEO validation error:", error);
    return new Response(
      JSON.stringify({
        error: "Validation failed",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}

// Development/testing only - disable in production
export const runtime = "nodejs";
