/**
 * Dynamic Sitemap Generation for Nonna.fm
 * Generates XML sitemaps per locale with proper structure and indexing
 */

import type { Locale } from "../config/base";
import { SEO_CONFIG } from "../config/base";
import { generateLocalizedPath } from "../utils/hreflang";

export interface SitemapUrl {
  url: string;
  lastModified?: string;
  changeFrequency?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: number;
  alternateRefs?: Array<{
    hreflang: string;
    href: string;
  }>;
}

export interface SitemapIndexEntry {
  sitemap: string;
  lastModified?: string;
}

/**
 * Generate main sitemap index that references all sitemaps
 * Only includes publicly accessible content (no authentication required)
 */
export function generateSitemapIndex(): SitemapIndexEntry[] {
  const sitemaps: SitemapIndexEntry[] = [];
  const now = new Date().toISOString();

  // Add consolidated public pages sitemap
  sitemaps.push({
    sitemap: `${SEO_CONFIG.brand.url}/sitemap-public.xml`,
    lastModified: now,
  });

  return sitemaps;
}

/**
 * Generate sitemap URLs for publicly accessible pages only
 * Excludes authentication-gated content per SEO best practices
 */
export function generatePublicSitemap(): SitemapUrl[] {
  const urls: SitemapUrl[] = [];
  const baseUrl = SEO_CONFIG.brand.url;

  // Only truly public pages that don't require authentication
  const publicPages = [
    { path: "/", priority: 1.0, changeFrequency: "daily" as const },
    // Note: /source excluded as it may require authentication for service selection
    // Add other public pages here: /about, /privacy, /terms, /help, etc.
  ];

  // Generate URLs for all supported locales
  SEO_CONFIG.supportedLocales.forEach(locale => {
    publicPages.forEach(({ path, priority, changeFrequency }) => {
      const localizedPath = generateLocalizedPath(path, locale);
      urls.push({
        url: `${baseUrl}${localizedPath}`,
        lastModified: new Date().toISOString(),
        changeFrequency,
        priority,
        alternateRefs: generateAlternateRefs(path),
      });
    });
  });

  return urls;
}

/**
 * Generate service combination sitemap
 * 
 * ❌ DISABLED FOR SEO COMPLIANCE
 * These URLs require OAuth authentication for both source and target services,
 * making them inaccessible to search engine crawlers. Including authentication-gated
 * URLs in sitemaps violates Google's guidelines and can harm search rankings.
 * 
 * URLs like /library/spotify/apple require users to authenticate with BOTH
 * Spotify AND Apple Music before access, making them unsuitable for public sitemaps.
 */
export function generateServiceSitemap(): SitemapUrl[] {
  // Return empty array - authentication-gated content excluded per SEO best practices
  return [];
}

/**
 * Generate dynamic transfer pages sitemap
 * 
 * ❌ DISABLED FOR SEO COMPLIANCE  
 * OAuth callback URLs are technical server-to-server endpoints used for authentication
 * flows, not user-facing content. These should never appear in public sitemaps as:
 * 
 * 1. They're not intended for search engine discovery
 * 2. They don't contain user-valuable content 
 * 3. They may expose technical implementation details
 * 4. They can confuse search engines about site structure
 * 
 * URLs like /callback/spotify are purely functional OAuth endpoints.
 */
export function generateTransferSitemap(): SitemapUrl[] {
  // Return empty array - OAuth callbacks excluded per SEO best practices
  return [];
}

/**
 * Generate alternate references for hreflang
 */
function generateAlternateRefs(path: string): Array<{ hreflang: string; href: string }> {
  const alternates: Array<{ hreflang: string; href: string }> = [];

  SEO_CONFIG.supportedLocales.forEach(locale => {
    const localizedPath = generateLocalizedPath(path, locale);
    alternates.push({
      hreflang: locale,
      href: `${SEO_CONFIG.brand.url}${localizedPath}`,
    });
  });

  // Add x-default
  const defaultPath = generateLocalizedPath(path, SEO_CONFIG.defaultLocale);
  alternates.push({
    hreflang: "x-default",
    href: `${SEO_CONFIG.brand.url}${defaultPath}`,
  });

  return alternates;
}

/**
 * Convert sitemap URLs to XML format
 */
export function generateSitemapXML(urls: SitemapUrl[]): string {
  const urlElements = urls
    .map(url => {
      let urlXml = `  <url>
    <loc>${escapeXml(url.url)}</loc>`;

      if (url.lastModified) {
        urlXml += `
    <lastmod>${url.lastModified}</lastmod>`;
      }

      if (url.changeFrequency) {
        urlXml += `
    <changefreq>${url.changeFrequency}</changefreq>`;
      }

      if (url.priority !== undefined) {
        urlXml += `
    <priority>${url.priority}</priority>`;
      }

      // Add hreflang alternates
      if (url.alternateRefs && url.alternateRefs.length > 0) {
        url.alternateRefs.forEach(alternate => {
          urlXml += `
    <xhtml:link rel="alternate" hreflang="${alternate.hreflang}" href="${escapeXml(alternate.href)}" />`;
        });
      }

      urlXml += `
  </url>`;

      return urlXml;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urlElements}
</urlset>`;
}

/**
 * Convert sitemap index to XML format
 */
export function generateSitemapIndexXML(sitemaps: SitemapIndexEntry[]): string {
  const sitemapElements = sitemaps
    .map(sitemap => {
      let sitemapXml = `  <sitemap>
    <loc>${escapeXml(sitemap.sitemap)}</loc>`;

      if (sitemap.lastModified) {
        sitemapXml += `
    <lastmod>${sitemap.lastModified}</lastmod>`;
      }

      sitemapXml += `
  </sitemap>`;

      return sitemapXml;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapElements}
</sitemapindex>`;
}

/**
 * Escape XML special characters
 */
function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * Get all sitemap URLs for validation
 */
export function getAllSitemapUrls(): string[] {
  const urls: string[] = [];

  // Main sitemap index
  urls.push(`${SEO_CONFIG.brand.url}/sitemap.xml`);

  // Locale-specific sitemaps
  SEO_CONFIG.supportedLocales.forEach(locale => {
    urls.push(`${SEO_CONFIG.brand.url}/sitemap-${locale}.xml`);
  });

  // Special sitemaps
  urls.push(
    `${SEO_CONFIG.brand.url}/sitemap-services.xml`,
    `${SEO_CONFIG.brand.url}/sitemap-transfers.xml`
  );

  return urls;
}

/**
 * Validate sitemap structure and content
 */
export function validateSitemap(urls: SitemapUrl[]): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  stats: {
    totalUrls: number;
    localeBreakdown: Record<string, number>;
    priorityDistribution: Record<string, number>;
  };
} {
  const errors: string[] = [];
  const warnings: string[] = [];
  const localeBreakdown: Record<string, number> = {};
  const priorityDistribution: Record<string, number> = {};

  // Validate each URL
  urls.forEach((url, index) => {
    // URL validation
    try {
      new URL(url.url);
    } catch {
      errors.push(`Invalid URL at index ${index}: ${url.url}`);
    }

    // Priority validation
    if (url.priority !== undefined) {
      if (url.priority < 0 || url.priority > 1) {
        errors.push(`Invalid priority at index ${index}: ${url.priority}`);
      }

      const priorityKey = url.priority.toString();
      priorityDistribution[priorityKey] = (priorityDistribution[priorityKey] || 0) + 1;
    }

    // Count locale distribution
    const locale = extractLocaleFromUrl(url.url);
    if (locale) {
      localeBreakdown[locale] = (localeBreakdown[locale] || 0) + 1;
    }

    // Check for missing hreflang alternates
    if (!url.alternateRefs || url.alternateRefs.length === 0) {
      warnings.push(`Missing hreflang alternates for URL: ${url.url}`);
    }
  });

  // Check for duplicate URLs
  const urlSet = new Set(urls.map(u => u.url));
  if (urlSet.size !== urls.length) {
    errors.push("Duplicate URLs found in sitemap");
  }

  // Validate locale coverage
  SEO_CONFIG.supportedLocales.forEach(locale => {
    if (!localeBreakdown[locale]) {
      warnings.push(`No URLs found for locale: ${locale}`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    stats: {
      totalUrls: urls.length,
      localeBreakdown,
      priorityDistribution,
    },
  };
}

/**
 * Extract locale from URL
 */
function extractLocaleFromUrl(url: string): string | null {
  try {
    const parsedUrl = new URL(url);
    const pathSegments = parsedUrl.pathname.split("/").filter(Boolean);

    if (pathSegments.length > 0) {
      const potentialLocale = pathSegments[0];
      if (SEO_CONFIG.supportedLocales.includes(potentialLocale as Locale)) {
        return potentialLocale;
      }
    }
  } catch {
    return null;
  }

  return null;
}
