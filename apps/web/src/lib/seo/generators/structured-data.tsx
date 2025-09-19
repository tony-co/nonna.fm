/**
 * Structured Data Generator Components
 * Creates and injects JSON-LD schemas for enhanced search results
 */

import Script from "next/script";
import type { Thing, WithContext } from "schema-dts";
import type { Locale } from "../config/base";
import {
  getBreadcrumbSchema,
  getFAQSchema,
  getOrganizationSchema,
  getServiceSchema,
  getSoftwareApplicationSchema,
  getWebSiteSchema,
} from "../config/structured-data";

export interface StructuredDataProps {
  locale: Locale;
  type: "organization" | "software" | "website" | "service" | "breadcrumb" | "faq" | "all";
  source?: string;
  target?: string;
  breadcrumbs?: Array<{ name: string; url: string }>;
}

/**
 * Main Structured Data Component
 * Renders appropriate JSON-LD scripts based on page type
 */
export function StructuredData({ locale, type, source, target, breadcrumbs }: StructuredDataProps) {
  const schemas: Record<string, WithContext<Thing>> = {};

  // Generate schemas based on type
  switch (type) {
    case "organization":
      schemas.organization = getOrganizationSchema(locale);
      break;

    case "software":
      schemas.software = getSoftwareApplicationSchema(locale);
      break;

    case "website":
      schemas.website = getWebSiteSchema(locale);
      break;

    case "service":
      if (source && target) {
        schemas.service = getServiceSchema(source, target, locale);
      }
      break;

    case "breadcrumb":
      if (breadcrumbs && breadcrumbs.length > 0) {
        schemas.breadcrumb = getBreadcrumbSchema(breadcrumbs);
      }
      break;

    case "faq":
      schemas.faq = getFAQSchema(locale);
      break;

    case "all":
      schemas.organization = getOrganizationSchema(locale);
      schemas.software = getSoftwareApplicationSchema(locale);
      schemas.website = getWebSiteSchema(locale);
      if (breadcrumbs && breadcrumbs.length > 0) {
        schemas.breadcrumb = getBreadcrumbSchema(breadcrumbs);
      }
      break;
  }

  return (
    <>
      {Object.entries(schemas).map(([key, schema]) => (
        <Script
          key={`structured-data-${key}`}
          id={`structured-data-${key}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema, null, 0),
          }}
        />
      ))}
    </>
  );
}

/**
 * Homepage Structured Data
 * Combines Organization, Software, and Website schemas
 */
export function HomepageStructuredData({ locale }: { locale: Locale }) {
  return <StructuredData locale={locale} type="all" />;
}

/**
 * Service Transfer Page Structured Data
 * Includes Service schema with breadcrumbs
 */
export function ServiceTransferStructuredData({
  locale,
  source,
  target,
  breadcrumbs,
}: {
  locale: Locale;
  source: string;
  target: string;
  breadcrumbs: Array<{ name: string; url: string }>;
}) {
  return (
    <>
      <StructuredData locale={locale} type="organization" />
      <StructuredData locale={locale} type="service" source={source} target={target} />
      <StructuredData locale={locale} type="breadcrumb" breadcrumbs={breadcrumbs} />
    </>
  );
}

/**
 * Static Page Structured Data
 * Basic organization and breadcrumb schemas
 */
export function StaticPageStructuredData({
  locale,
  breadcrumbs,
}: {
  locale: Locale;
  breadcrumbs?: Array<{ name: string; url: string }>;
}) {
  return (
    <>
      <StructuredData locale={locale} type="organization" />
      {breadcrumbs && (
        <StructuredData locale={locale} type="breadcrumb" breadcrumbs={breadcrumbs} />
      )}
    </>
  );
}

/**
 * Generate structured data for Next.js metadata API
 */
export function generateStructuredDataForMetadata(
  locale: Locale,
  type: "organization" | "software" | "website" | "service",
  options?: {
    source?: string;
    target?: string;
  }
): WithContext<Thing> | null {
  switch (type) {
    case "organization":
      return getOrganizationSchema(locale);

    case "software":
      return getSoftwareApplicationSchema(locale);

    case "website":
      return getWebSiteSchema(locale);

    case "service":
      if (options?.source && options?.target) {
        return getServiceSchema(options.source, options.target, locale);
      }
      return null;

    default:
      return null;
  }
}
