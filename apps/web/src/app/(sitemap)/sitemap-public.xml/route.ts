/**
 * Public Pages Sitemap Route
 * Generates XML sitemap for publicly accessible pages only
 * Excludes authentication-gated content per SEO best practices
 */

import { generatePublicSitemap, generateSitemapXML } from "@/lib/seo/generators/sitemaps";

export async function GET(): Promise<Response> {
  try {
    const urls = generatePublicSitemap();
    const xml = generateSitemapXML(urls);

    return new Response(xml, {
      status: 200,
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=86400, s-maxage=86400", // Cache for 24 hours
        "X-Robots-Tag": "noindex", // Sitemaps shouldn't be indexed
      },
    });
  } catch (error) {
    console.error("Error generating public sitemap:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

// Revalidate daily (only includes static public pages)
export const revalidate = 86400;
