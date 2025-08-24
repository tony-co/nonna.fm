/**
 * Transfer Pages Sitemap Route
 * Generates XML sitemap for callback and transfer-related pages
 */

import { generateTransferSitemap, generateSitemapXML } from "@/lib/seo/generators/sitemaps";

export async function GET(): Promise<Response> {
  try {
    const urls = generateTransferSitemap();
    const xml = generateSitemapXML(urls);

    return new Response(xml, {
      status: 200,
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=21600, s-maxage=43200", // Cache for 6 hours, CDN for 12 hours
        "X-Robots-Tag": "noindex", // Sitemaps shouldn't be indexed
      },
    });
  } catch (error) {
    console.error("Error generating transfer sitemap:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

// Revalidate every 6 hours (transfer pages change infrequently)
export const revalidate = 21600;
