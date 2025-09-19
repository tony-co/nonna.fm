/**
 * SEO System Main Export
 * Centralized exports for all SEO functionality
 */

// Re-export common types
export type { Locale, Service } from "./config/base";
// Configuration
export * from "./config/base";
export * from "./config/keywords";
export * from "./config/structured-data";
export type { BreadcrumbItem, BreadcrumbOptions } from "./generators/breadcrumbs";
export * from "./generators/breadcrumbs";
export { generateBreadcrumbs, generateServiceTransferBreadcrumbs } from "./generators/breadcrumbs";
export type { MetadataOptions } from "./generators/metadata";
// Generators
export * from "./generators/metadata";
// Common SEO utilities
export { generateMetadata } from "./generators/metadata";
export type { SitemapIndexEntry, SitemapUrl } from "./generators/sitemaps";
export * from "./generators/sitemaps";
export * from "./generators/structured-data";
export { HomepageStructuredData, StructuredData } from "./generators/structured-data";
export * from "./utils/canonical";
// Utilities
export * from "./utils/hreflang";
export * from "./utils/validation";
