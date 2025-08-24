/**
 * Base SEO Configuration for Nonna.fm
 * Core settings and constants for the music streaming transfer platform
 */

export const SEO_CONFIG = {
  // Brand Information
  brand: {
    name: "Nonna.fm",
    tagline: "Transfer your music library between streaming services seamlessly",
    description:
      "The ultimate music transfer platform for moving your playlists, albums, and liked songs between Spotify, Apple Music, YouTube Music, Deezer, and more.",
    domain: "nonna.fm",
    url: "https://nonna.fm",
    logo: "/favicons/android-chrome-512x512.png",
    favicon: "/favicons/favicon.svg",
  },

  // Company Information
  company: {
    name: "Nonna.fm",
    foundingDate: "2024",
    type: "SoftwareApplication",
    category: "Music Transfer Tool",
    operatingSystem: ["Web", "iOS", "Android"],
    applicationCategory: "MultimediaApplication",
    offers: {
      freeTier: {
        name: "Free Plan",
        description: "500 transfers daily for free",
        price: "0",
        priceCurrency: "USD",
      },
      premiumTier: {
        name: "Premium Plan",
        description: "5,000+ transfers daily with premium features",
        price: "9.99",
        priceCurrency: "USD",
        billingDuration: "P1M", // 1 month
      },
    },
  },

  // Social Media
  social: {
    twitter: "@nonnafm",
    github: "https://github.com/nonnafm",
    support: "https://nonna.fm/support",
  },

  // Technical SEO
  defaultLocale: "en" as const,
  supportedLocales: ["en", "fr", "es", "pt", "it", "de", "ja"] as const,

  // Service Combinations for Dynamic SEO
  services: ["spotify", "apple", "youtube", "deezer", "tidal", "amazon", "pandora"] as const,

  // Default Meta Settings
  defaults: {
    titleTemplate: "%s | Nonna.fm - Music Transfer Platform",
    titleSeparator: " | ",
    descriptionMaxLength: 160,
    keywordsMaxCount: 10,
    ogImageWidth: 1200,
    ogImageHeight: 630,
  },
} as const;

export type Locale = (typeof SEO_CONFIG.supportedLocales)[number];
export type Service = (typeof SEO_CONFIG.services)[number];
