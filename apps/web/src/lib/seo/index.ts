/**
 * SEO System Main Export
 * Centralized exports for all SEO functionality
 */

// Configuration
export * from "./config/base";
export * from "./config/keywords";
export * from "./config/structured-data";

// Generators
export * from "./generators/metadata";
export * from "./generators/sitemaps";
export * from "./generators/structured-data";
export * from "./generators/breadcrumbs";

// Utilities
export * from "./utils/hreflang";
export * from "./utils/canonical";
export * from "./utils/validation";

// Re-export common types
export type { Locale, Service } from "./config/base";

export type { MetadataOptions } from "./generators/metadata";

export type { BreadcrumbItem, BreadcrumbOptions } from "./generators/breadcrumbs";

export type { SitemapUrl, SitemapIndexEntry } from "./generators/sitemaps";

// Common SEO utilities
export { generateMetadata } from "./generators/metadata";
export { StructuredData, HomepageStructuredData } from "./generators/structured-data";
export { generateBreadcrumbs, generateServiceTransferBreadcrumbs } from "./generators/breadcrumbs";
