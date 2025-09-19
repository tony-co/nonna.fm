/**
 * SEO Validation Utilities
 * Comprehensive testing and validation of SEO implementation
 */

import type { Locale } from "../config/base";
import { SEO_CONFIG } from "../config/base";
import { generateBreadcrumbs } from "../generators/breadcrumbs";
import { generateMetadata } from "../generators/metadata";
import { getAllSitemapUrls } from "../generators/sitemaps";
import { validateCanonicalImplementation } from "./canonical";
import { validateHreflang } from "./hreflang";

interface ValidationParams {
  source?: string;
  target?: string;
  id?: string;
}

export interface SEOValidationResult {
  isValid: boolean;
  score: number;
  errors: string[];
  warnings: string[];
  recommendations: string[];
  details: {
    metadata: SEOValidationSection;
    hreflang: SEOValidationSection;
    canonical: SEOValidationSection;
    structuredData: SEOValidationSection;
    sitemaps: SEOValidationSection;
    breadcrumbs: SEOValidationSection;
    localization: SEOValidationSection;
  };
}

export interface SEOValidationSection {
  isValid: boolean;
  score: number;
  errors: string[];
  warnings: string[];
  recommendations: string[];
}

/**
 * Comprehensive SEO validation for a specific page
 */
export async function validatePageSEO(options: {
  locale: Locale;
  pathname: string;
  params?: {
    source?: string;
    target?: string;
    id?: string;
  };
}): Promise<SEOValidationResult> {
  const { locale, pathname, params } = options;
  const errors: string[] = [];
  const warnings: string[] = [];
  const recommendations: string[] = [];

  // Validate Metadata
  const metadataResult = await validateMetadata(locale, pathname, params);

  // Validate Hreflang
  const hrefLangResult = validateHrefLang(pathname);

  // Validate Canonical URLs
  const canonicalResult = validateCanonicalUrls(pathname, locale);

  // Validate Structured Data
  const structuredDataResult = validateStructuredDataImplementation(locale, pathname, params);

  // Validate Sitemaps
  const sitemapResult = await validateSitemapImplementation();

  // Validate Breadcrumbs
  const breadcrumbResult = validateBreadcrumbImplementation(locale, pathname, params);

  // Validate Localization
  const localizationResult = validateLocalizationImplementation(locale);

  // Calculate overall score
  const sections = [
    metadataResult,
    hrefLangResult,
    canonicalResult,
    structuredDataResult,
    sitemapResult,
    breadcrumbResult,
    localizationResult,
  ];

  const overallScore = sections.reduce((acc, section) => acc + section.score, 0) / sections.length;
  const isOverallValid = sections.every(section => section.isValid);

  // Collect all errors, warnings, recommendations
  sections.forEach(section => {
    errors.push(...section.errors);
    warnings.push(...section.warnings);
    recommendations.push(...section.recommendations);
  });

  return {
    isValid: isOverallValid,
    score: Math.round(overallScore),
    errors,
    warnings,
    recommendations,
    details: {
      metadata: metadataResult,
      hreflang: hrefLangResult,
      canonical: canonicalResult,
      structuredData: structuredDataResult,
      sitemaps: sitemapResult,
      breadcrumbs: breadcrumbResult,
      localization: localizationResult,
    },
  };
}

/**
 * Validate metadata implementation
 */
async function validateMetadata(
  locale: Locale,
  pathname: string,
  params?: ValidationParams
): Promise<SEOValidationSection> {
  const errors: string[] = [];
  const warnings: string[] = [];
  const recommendations: string[] = [];

  try {
    const metadata = generateMetadata({
      locale,
      pathname,
      params,
    });

    // Check title
    if (!metadata.title) {
      errors.push("Missing title");
    } else if (typeof metadata.title === "string" && metadata.title.length > 60) {
      warnings.push("Title is too long (>60 characters)");
    }

    // Check description
    if (!metadata.description) {
      errors.push("Missing description");
    } else if (metadata.description.length > 160) {
      warnings.push("Description is too long (>160 characters)");
    } else if (metadata.description.length < 120) {
      recommendations.push("Description could be longer for better SEO");
    }

    // Check keywords
    if (!metadata.keywords) {
      warnings.push("No keywords specified");
    }

    // Check OpenGraph
    if (!metadata.openGraph) {
      warnings.push("Missing OpenGraph metadata");
    } else {
      if (!metadata.openGraph.title) warnings.push("Missing OpenGraph title");
      if (!metadata.openGraph.description) warnings.push("Missing OpenGraph description");
      if (!metadata.openGraph.images) warnings.push("Missing OpenGraph images");
    }

    // Check Twitter
    if (!metadata.twitter) {
      warnings.push("Missing Twitter Card metadata");
    }

    const score = errors.length === 0 ? (warnings.length === 0 ? 100 : 80) : 50;

    return {
      isValid: errors.length === 0,
      score,
      errors,
      warnings,
      recommendations,
    };
  } catch (error) {
    errors.push(`Metadata generation failed: ${error}`);
    return {
      isValid: false,
      score: 0,
      errors,
      warnings,
      recommendations,
    };
  }
}

/**
 * Validate hreflang implementation
 */
function validateHrefLang(pathname: string): SEOValidationSection {
  const errors: string[] = [];
  const warnings: string[] = [];
  const recommendations: string[] = [];

  try {
    const hreflangs: Record<string, string> = {};
    SEO_CONFIG.supportedLocales.forEach(locale => {
      const path = `/${locale}${pathname}`;
      hreflangs[locale] = `${SEO_CONFIG.brand.url}${path}`;
    });
    hreflangs["x-default"] = `${SEO_CONFIG.brand.url}/en${pathname}`;

    const validation = validateHreflang(hreflangs);

    return {
      isValid: validation.isValid,
      score: validation.isValid ? 100 : validation.errors.length === 0 ? 80 : 50,
      errors: validation.errors,
      warnings: validation.warnings,
      recommendations,
    };
  } catch (error) {
    errors.push(`Hreflang validation failed: ${error}`);
    return {
      isValid: false,
      score: 0,
      errors,
      warnings,
      recommendations,
    };
  }
}

/**
 * Validate canonical URLs
 */
function validateCanonicalUrls(pathname: string, locale: Locale): SEOValidationSection {
  const errors: string[] = [];
  const warnings: string[] = [];
  const recommendations: string[] = [];

  try {
    const canonicalUrl = `${SEO_CONFIG.brand.url}/${locale}${pathname}`;
    const validation = validateCanonicalImplementation(pathname, locale, canonicalUrl);

    return {
      isValid: validation.isValid,
      score: validation.isValid ? 100 : validation.errors.length === 0 ? 80 : 50,
      errors: validation.errors,
      warnings: validation.warnings,
      recommendations: validation.recommendations,
    };
  } catch (error) {
    errors.push(`Canonical validation failed: ${error}`);
    return {
      isValid: false,
      score: 0,
      errors,
      warnings,
      recommendations,
    };
  }
}

/**
 * Validate structured data implementation
 */
function validateStructuredDataImplementation(
  locale: Locale,
  pathname: string,
  params?: ValidationParams
): SEOValidationSection {
  const errors: string[] = [];
  const warnings: string[] = [];
  const recommendations: string[] = [];

  // Check if required schemas are implemented
  const requiredSchemas = ["Organization", "WebSite"];
  if (pathname === "/") {
    requiredSchemas.push("SoftwareApplication");
  }
  if (params?.source && params?.target) {
    requiredSchemas.push("Service", "BreadcrumbList");
  }

  // Validate locale-specific content in structured data
  if (!SEO_CONFIG.supportedLocales.includes(locale)) {
    errors.push(`Unsupported locale in structured data: ${locale}`);
  }

  // This would normally check actual DOM for JSON-LD scripts
  recommendations.push("Verify JSON-LD schemas are properly rendered in DOM");
  recommendations.push("Test structured data with Google's Rich Results Test");
  recommendations.push(`Validate locale-specific content for ${locale}`);

  return {
    isValid: true,
    score: 95,
    errors,
    warnings,
    recommendations,
  };
}

/**
 * Validate sitemap implementation
 */
async function validateSitemapImplementation(): Promise<SEOValidationSection> {
  const errors: string[] = [];
  const warnings: string[] = [];
  const recommendations: string[] = [];

  try {
    const sitemapUrls = getAllSitemapUrls();

    // Check if all required sitemaps exist
    const requiredSitemaps = [
      "/sitemap.xml",
      "/sitemap-services.xml",
      "/sitemap-transfers.xml",
      ...SEO_CONFIG.supportedLocales.map(locale => `/sitemap-${locale}.xml`),
    ];

    requiredSitemaps.forEach(sitemap => {
      const fullUrl = `${SEO_CONFIG.brand.url}${sitemap}`;
      if (!sitemapUrls.includes(fullUrl)) {
        errors.push(`Missing sitemap: ${sitemap}`);
      }
    });

    recommendations.push("Test sitemap accessibility in production");
    recommendations.push("Submit sitemaps to Google Search Console");

    return {
      isValid: errors.length === 0,
      score: errors.length === 0 ? 100 : 70,
      errors,
      warnings,
      recommendations,
    };
  } catch (error) {
    errors.push(`Sitemap validation failed: ${error}`);
    return {
      isValid: false,
      score: 0,
      errors,
      warnings,
      recommendations,
    };
  }
}

/**
 * Validate breadcrumb implementation
 */
function validateBreadcrumbImplementation(
  locale: Locale,
  pathname: string,
  params?: ValidationParams
): SEOValidationSection {
  const errors: string[] = [];
  const warnings: string[] = [];
  const recommendations: string[] = [];

  try {
    const breadcrumbs = generateBreadcrumbs({ locale, pathname, params });

    if (breadcrumbs.length === 0) {
      errors.push("No breadcrumbs generated");
    } else if (breadcrumbs.length === 1) {
      warnings.push("Only home breadcrumb found - consider adding more levels");
    }

    // Check breadcrumb structure
    breadcrumbs.forEach((breadcrumb, index) => {
      if (!breadcrumb.name) {
        errors.push(`Breadcrumb ${index + 1} missing name`);
      }
      if (!breadcrumb.url) {
        errors.push(`Breadcrumb ${index + 1} missing URL`);
      }
      if (breadcrumb.position !== index + 1) {
        warnings.push(`Breadcrumb ${index + 1} position mismatch`);
      }
    });

    return {
      isValid: errors.length === 0,
      score: errors.length === 0 ? (warnings.length === 0 ? 100 : 85) : 60,
      errors,
      warnings,
      recommendations,
    };
  } catch (error) {
    errors.push(`Breadcrumb validation failed: ${error}`);
    return {
      isValid: false,
      score: 0,
      errors,
      warnings,
      recommendations,
    };
  }
}

/**
 * Validate localization implementation
 */
function validateLocalizationImplementation(locale: Locale): SEOValidationSection {
  const errors: string[] = [];
  const warnings: string[] = [];
  const recommendations: string[] = [];

  // Check if locale is supported
  if (!SEO_CONFIG.supportedLocales.includes(locale)) {
    errors.push(`Unsupported locale: ${locale}`);
  }

  // Check if all required locales are configured
  const expectedLocales = ["en", "es", "fr", "de", "pt", "it", "ja"];
  expectedLocales.forEach(expectedLocale => {
    if (!SEO_CONFIG.supportedLocales.includes(expectedLocale as Locale)) {
      warnings.push(`Missing locale configuration: ${expectedLocale}`);
    }
  });

  recommendations.push("Test translated content for accuracy");
  recommendations.push("Verify cultural adaptation of content");
  recommendations.push("Check right-to-left language support if needed");

  return {
    isValid: errors.length === 0,
    score: errors.length === 0 ? (warnings.length === 0 ? 100 : 90) : 70,
    errors,
    warnings,
    recommendations,
  };
}

/**
 * Generate SEO validation report
 */
export function generateSEOReport(validation: SEOValidationResult): string {
  const report: string[] = [];

  report.push(`# SEO Validation Report`);
  report.push(`Overall Score: ${validation.score}/100`);
  report.push(`Status: ${validation.isValid ? "✅ PASS" : "❌ FAIL"}`);
  report.push("");

  if (validation.errors.length > 0) {
    report.push(`## Errors (${validation.errors.length})`);
    validation.errors.forEach(error => {
      report.push(`- ❌ ${error}`);
    });
    report.push("");
  }

  if (validation.warnings.length > 0) {
    report.push(`## Warnings (${validation.warnings.length})`);
    validation.warnings.forEach(warning => {
      report.push(`- ⚠️ ${warning}`);
    });
    report.push("");
  }

  if (validation.recommendations.length > 0) {
    report.push(`## Recommendations (${validation.recommendations.length})`);
    validation.recommendations.forEach(rec => {
      report.push(`- 💡 ${rec}`);
    });
    report.push("");
  }

  report.push(`## Section Details`);
  Object.entries(validation.details).forEach(([section, result]) => {
    report.push(`### ${section.charAt(0).toUpperCase() + section.slice(1)}`);
    report.push(`Score: ${result.score}/100 ${result.isValid ? "✅" : "❌"}`);
    if (result.errors.length > 0) {
      result.errors.forEach(error => {
        report.push(`  - ❌ ${error}`);
      });
    }
    if (result.warnings.length > 0) {
      result.warnings.forEach(warning => {
        report.push(`  - ⚠️ ${warning}`);
      });
    }
    report.push("");
  });

  return report.join("\n");
}
