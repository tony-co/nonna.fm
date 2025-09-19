/**
 * Canonical URL Management Utilities
 * Handles proper canonicalization across locales and routes
 */

import type { Locale } from "../config/base";
import { SEO_CONFIG } from "../config/base";
import { generateLocalizedPath, removeLocaleFromPath } from "./hreflang";

export interface CanonicalOptions {
  locale: Locale;
  pathname: string;
  searchParams?: URLSearchParams;
  preferredLocale?: Locale;
  forceLocale?: boolean;
}

/**
 * Generate canonical URL for a given pathname and locale
 */
export function generateCanonicalUrl(
  pathname: string,
  locale: Locale,
  options?: {
    searchParams?: URLSearchParams;
    preferredLocale?: Locale;
    forceLocale?: boolean;
  }
): string {
  const { searchParams, preferredLocale, forceLocale = false } = options || {};

  // Determine the target locale for canonical URL
  let targetLocale: Locale;

  if (forceLocale) {
    targetLocale = locale;
  } else if (preferredLocale && SEO_CONFIG.supportedLocales.includes(preferredLocale)) {
    targetLocale = preferredLocale;
  } else {
    // Use default locale for canonical unless it's a locale-specific page
    targetLocale = shouldUseLocaleInCanonical(pathname) ? locale : SEO_CONFIG.defaultLocale;
  }

  // Generate the localized path
  const localizedPath = generateLocalizedPath(pathname, targetLocale);

  // Build the canonical URL
  let canonicalUrl = `${SEO_CONFIG.brand.url}${localizedPath}`;

  // Add search parameters if provided
  if (searchParams?.toString()) {
    canonicalUrl += `?${searchParams.toString()}`;
  }

  return canonicalUrl;
}

/**
 * Generate canonical URL without locale prefix (for x-default)
 */
export function generateDefaultCanonicalUrl(
  pathname: string,
  searchParams?: URLSearchParams
): string {
  const pathWithoutLocale = removeLocaleFromPath(pathname);
  let canonicalUrl = `${SEO_CONFIG.brand.url}${pathWithoutLocale || "/"}`;

  if (searchParams?.toString()) {
    canonicalUrl += `?${searchParams.toString()}`;
  }

  return canonicalUrl;
}

/**
 * Check if the pathname should use locale in canonical URL
 */
function shouldUseLocaleInCanonical(pathname: string): boolean {
  // Remove locale prefix for analysis
  const pathWithoutLocale = removeLocaleFromPath(pathname);

  // Pages that should use locale-specific canonical URLs
  const localeSpecificPaths = [
    "/", // Homepage
    "/source", // Source selection
    "/library", // Library pages (content varies by locale)
  ];

  // Check if path starts with any locale-specific path
  return localeSpecificPaths.some(
    path => pathWithoutLocale === path || pathWithoutLocale.startsWith(`${path}/`)
  );
}

/**
 * Generate self-referential canonical URL for current page
 */
export function generateSelfCanonicalUrl(
  pathname: string,
  locale: Locale,
  searchParams?: URLSearchParams
): string {
  const localizedPath = generateLocalizedPath(pathname, locale);
  let canonicalUrl = `${SEO_CONFIG.brand.url}${localizedPath}`;

  if (searchParams?.toString()) {
    canonicalUrl += `?${searchParams.toString()}`;
  }

  return canonicalUrl;
}

/**
 * Generate canonical URLs for all locale variants
 */
export function generateAllCanonicalVariants(pathname: string): Record<Locale, string> {
  const canonicals: Record<string, string> = {};

  SEO_CONFIG.supportedLocales.forEach(locale => {
    canonicals[locale] = generateCanonicalUrl(pathname, locale, { forceLocale: true });
  });

  return canonicals as Record<Locale, string>;
}

/**
 * Clean and normalize pathname for canonical URL generation
 */
export function normalizePathnameForCanonical(pathname: string): string {
  // Remove trailing slash (except for root)
  if (pathname.length > 1 && pathname.endsWith("/")) {
    pathname = pathname.slice(0, -1);
  }

  // Remove double slashes
  pathname = pathname.replace(/\/+/g, "/");

  // Ensure starts with slash
  if (!pathname.startsWith("/")) {
    pathname = `/${pathname}`;
  }

  return pathname;
}

/**
 * Check if URL is a valid canonical URL
 */
export function isValidCanonicalUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url);

    // Check if it's our domain
    if (!parsedUrl.hostname.endsWith(SEO_CONFIG.brand.domain)) {
      return false;
    }

    // Check if it uses HTTPS
    if (parsedUrl.protocol !== "https:") {
      return false;
    }

    // Check for fragment identifiers (not allowed in canonical URLs)
    if (parsedUrl.hash) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * Generate canonical URL for service transfer pages
 */
export function generateServiceCanonicalUrl(
  source: string,
  target: string,
  locale: Locale,
  pageType?: "liked" | "albums" | "playlists"
): string {
  let pathname = `/library/${source}/${target}`;

  if (pageType) {
    pathname += `/${pageType}`;
  }

  return generateCanonicalUrl(pathname, locale);
}

/**
 * Validate canonical URL implementation across locales
 */
export function validateCanonicalImplementation(
  pathname: string,
  currentLocale: Locale,
  canonicalUrl: string
): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  recommendations: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];
  const recommendations: string[] = [];

  // Basic URL validation
  if (!isValidCanonicalUrl(canonicalUrl)) {
    errors.push("Invalid canonical URL format");
  }

  // Check if canonical URL matches expected pattern
  const expectedCanonical = generateCanonicalUrl(pathname, currentLocale);
  if (canonicalUrl !== expectedCanonical) {
    warnings.push(`Canonical URL differs from expected: ${expectedCanonical}`);
  }

  // Check for locale consistency
  const canonicalHasLocale = SEO_CONFIG.supportedLocales.some(locale => {
    // Match both /locale/ and /locale (at end of URL) to handle root locale paths
    const localePattern = new RegExp(`/${locale}(?:/|$)`);
    return localePattern.test(canonicalUrl);
  });

  if (!canonicalHasLocale && currentLocale !== SEO_CONFIG.defaultLocale) {
    recommendations.push("Consider using locale-specific canonical for non-default locale");
  }

  // Check for self-referential canonical
  const pathWithoutDomain = canonicalUrl.replace(SEO_CONFIG.brand.url, "");
  const currentPath = generateLocalizedPath(pathname, currentLocale);

  if (pathWithoutDomain === currentPath) {
    recommendations.push("Canonical URL is self-referential (good practice)");
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    recommendations,
  };
}
