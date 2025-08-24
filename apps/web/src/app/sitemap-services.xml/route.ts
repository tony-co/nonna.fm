/**
 * Service Combination Sitemap Route
 * Generates XML sitemap for all service-to-service transfer pages
 */

import { generateServiceSitemap, generateSitemapXML } from "@/lib/seo/generators/sitemaps";

export async function GET(): Promise<Response> {
  try {
    const urls = generateServiceSitemap();
    const xml = generateSitemapXML(urls);

    return new Response(xml, {
      status: 200,
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=14400, s-maxage=28800", // Cache for 4 hours, CDN for 8 hours
        "X-Robots-Tag": "noindex", // Sitemaps shouldn't be indexed
      },
    });
  } catch (error) {
    console.error("Error generating service sitemap:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

// Revalidate every 4 hours (service combinations don't change frequently)
export const revalidate = 14400;
