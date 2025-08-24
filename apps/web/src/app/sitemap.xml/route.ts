/**
 * Main Sitemap Index Route
 * Serves the primary sitemap.xml that references all locale-specific sitemaps
 */

import { generateSitemapIndex, generateSitemapIndexXML } from "@/lib/seo/generators/sitemaps";

export async function GET(): Promise<Response> {
  try {
    const sitemapEntries = generateSitemapIndex();
    const xml = generateSitemapIndexXML(sitemapEntries);

    return new Response(xml, {
      status: 200,
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=3600, s-maxage=7200", // Cache for 1 hour, CDN for 2 hours
        "X-Robots-Tag": "noindex", // Sitemap indexes shouldn't be indexed
      },
    });
  } catch (error) {
    console.error("Error generating sitemap index:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

// Revalidate every hour
export const revalidate = 3600;
