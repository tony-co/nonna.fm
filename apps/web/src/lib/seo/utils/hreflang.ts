/**
 * Hreflang Tag Generation Utilities
 * Manages multilingual SEO with proper hreflang implementation
 */

import type { Locale } from "../config/base";
import { SEO_CONFIG } from "../config/base";

export interface HrefLangEntry {
  hreflang: string;
  href: string;
}

/**
 * Generate hreflang alternate links for all supported locales
 */
export function generateHreflang(pathname: string): Record<string, string> {
  const hreflangs: Record<string, string> = {};

  // Add all supported locales
  SEO_CONFIG.supportedLocales.forEach(locale => {
    const localizedPath = generateLocalizedPath(pathname, locale);
    hreflangs[locale] = `${SEO_CONFIG.brand.url}${localizedPath}`;
  });

  // Add x-default for default locale (English)
  const defaultPath = generateLocalizedPath(pathname, SEO_CONFIG.defaultLocale);
  hreflangs["x-default"] = `${SEO_CONFIG.brand.url}${defaultPath}`;

  return hreflangs;
}

/**
 * Generate complete hreflang entries for HTML head tags
 */
export function generateHrefLangTags(pathname: string): HrefLangEntry[] {
  const entries: HrefLangEntry[] = [];

  // Add all supported locales
  SEO_CONFIG.supportedLocales.forEach(locale => {
    const localizedPath = generateLocalizedPath(pathname, locale);
    entries.push({
      hreflang: locale,
      href: `${SEO_CONFIG.brand.url}${localizedPath}`,
    });
  });

  // Add x-default
  const defaultPath = generateLocalizedPath(pathname, SEO_CONFIG.defaultLocale);
  entries.push({
    hreflang: "x-default",
    href: `${SEO_CONFIG.brand.url}${defaultPath}`,
  });

  return entries;
}

/**
 * Generate localized path for a given pathname and locale
 */
export function generateLocalizedPath(pathname: string, locale: Locale): string {
  // Remove any existing locale prefix
  const pathWithoutLocale = removeLocaleFromPath(pathname);

  // Add the new locale prefix
  return `/${locale}${pathWithoutLocale}`;
}

/**
 * Remove locale prefix from pathname
 */
export function removeLocaleFromPath(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);

  // Check if first segment is a locale
  if (segments.length > 0 && SEO_CONFIG.supportedLocales.includes(segments[0] as Locale)) {
    segments.shift(); // Remove locale segment
  }

  return segments.length > 0 ? `/${segments.join("/")}` : "";
}

/**
 * Extract locale from pathname
 */
export function extractLocaleFromPath(pathname: string): Locale | null {
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length > 0) {
    const potentialLocale = segments[0] as Locale;
    if (SEO_CONFIG.supportedLocales.includes(potentialLocale)) {
      return potentialLocale;
    }
  }

  return null;
}

/**
 * Generate alternate links for Next.js metadata API
 */
export function generateAlternateLinks(pathname: string): {
  languages: Record<string, string>;
  canonical: string;
} {
  const languages: Record<string, string> = {};

  SEO_CONFIG.supportedLocales.forEach(locale => {
    const localizedPath = generateLocalizedPath(pathname, locale);
    languages[locale] = localizedPath;
  });

  return {
    languages,
    canonical: generateLocalizedPath(pathname, SEO_CONFIG.defaultLocale),
  };
}

/**
 * Validate hreflang implementation
 */
export function validateHreflang(hreflangs: Record<string, string>): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check for required locales
  SEO_CONFIG.supportedLocales.forEach(locale => {
    if (!hreflangs[locale]) {
      errors.push(`Missing hreflang for locale: ${locale}`);
    }
  });

  // Check for x-default
  if (!hreflangs["x-default"]) {
    errors.push("Missing x-default hreflang");
  }

  // Check URL format
  Object.entries(hreflangs).forEach(([hreflang, url]) => {
    try {
      new URL(url);
    } catch {
      errors.push(`Invalid URL for hreflang ${hreflang}: ${url}`);
    }

    // Check for self-referential hreflang
    if (hreflang !== "x-default" && !url.includes(`/${hreflang}/`)) {
      warnings.push(`Hreflang ${hreflang} URL might not be self-referential: ${url}`);
    }
  });

  // Check for duplicate URLs
  const urls = Object.values(hreflangs);
  const uniqueUrls = new Set(urls);
  if (urls.length !== uniqueUrls.size) {
    warnings.push("Duplicate URLs found in hreflang implementation");
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}
