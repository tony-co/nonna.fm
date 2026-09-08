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
      "Transfer playlists, albums and liked songs between Spotify and Apple Music. Free and open source.",
    domain: "nonna.fm",
    url: "https://nonna.fm",
    logo: "/favicons/android-chrome-512x512.png",
    favicon: "/favicons/favicon.svg",
  },

  // Social Media
  social: {
    twitter: "@nonnafm",
    github: "https://github.com/tony-co/nonna.fm",
    support: "https://github.com/tony-co/nonna.fm/issues",
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
