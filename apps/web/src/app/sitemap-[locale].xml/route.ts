/**
 * Locale-Specific Sitemap Routes
 * Generates XML sitemaps for each supported locale
 */

import { NextRequest } from "next/server";
import { generateLocaleSitemap, generateSitemapXML } from "@/lib/seo/generators/sitemaps";
import { SEO_CONFIG } from "@/lib/seo/config/base";
import type { Locale } from "@/lib/seo/config/base";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<Record<string, string>> }
): Promise<Response> {
  try {
    const params = await context.params;
    const { locale } = params;

    // Validate locale
    if (!SEO_CONFIG.supportedLocales.includes(locale as Locale)) {
      return new Response("Locale not found", { status: 404 });
    }

    const urls = generateLocaleSitemap(locale as Locale);
    const xml = generateSitemapXML(urls);

    return new Response(xml, {
      status: 200,
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=7200, s-maxage=14400", // Cache for 2 hours, CDN for 4 hours
        "X-Robots-Tag": "noindex", // Sitemaps shouldn't be indexed
      },
    });
  } catch (error) {
    console.error(`Error generating sitemap for locale:`, error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

// Generate static params for all supported locales
export async function generateStaticParams(): Promise<Array<{ locale: string }>> {
  return SEO_CONFIG.supportedLocales.map(locale => ({
    locale,
  }));
}

// Revalidate every 2 hours
export const revalidate = 7200;
