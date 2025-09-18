import { NextResponse } from "next/server";
import { getValidDeveloperToken, getTokenStatus } from "@/lib/services/apple/token-manager";

/**
 * API endpoint to get a valid Apple Music developer token
 * This endpoint ensures we always return a fresh, non-expired token
 */
export async function GET(): Promise<NextResponse> {
  try {
    // Get a valid developer token (generates new one if needed)
    const token = await getValidDeveloperToken();

    // Get token status for debugging info
    const status = getTokenStatus();

    return NextResponse.json({
      success: true,
      token,
      debug: {
        generatedAt: status.generatedAt,
        expiresAt: status.expiresAt,
        daysUntilExpiry: status.daysUntilExpiry,
      },
    });
  } catch (error) {
    console.error("Failed to get Apple Music developer token:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to obtain valid developer token",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * API endpoint to force refresh the developer token
 * Useful for manual token renewal or error recovery
 */
export async function POST(): Promise<NextResponse> {
  try {
    const { refreshDeveloperToken } = await import("@/lib/services/apple/token-manager");
    const token = await refreshDeveloperToken();
    const status = getTokenStatus();

    return NextResponse.json({
      success: true,
      token,
      refreshed: true,
      debug: {
        generatedAt: status.generatedAt,
        expiresAt: status.expiresAt,
        daysUntilExpiry: status.daysUntilExpiry,
      },
    });
  } catch (error) {
    console.error("Failed to refresh Apple Music developer token:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to refresh developer token",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
