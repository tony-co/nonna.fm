import type { Organization, SoftwareApplication, WebSite, WithContext } from "schema-dts";
import type { Locale } from "./base";
import { SEO_CONFIG } from "./base";

export function getHomepageSchemas(locale: Locale, description: string) {
  const organizationId = `${SEO_CONFIG.brand.url}#organization`;
  const organization: WithContext<Organization> = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": organizationId,
    name: SEO_CONFIG.brand.name,
    alternateName: "Nonna FM",
    url: SEO_CONFIG.brand.url,
    logo: `${SEO_CONFIG.brand.url}${SEO_CONFIG.brand.logo}`,
    sameAs: [SEO_CONFIG.social.github],
  };
  const software: WithContext<SoftwareApplication> = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${SEO_CONFIG.brand.url}/${locale}#software`,
    name: SEO_CONFIG.brand.name,
    description,
    url: `${SEO_CONFIG.brand.url}/${locale}`,
    image: `${SEO_CONFIG.brand.url}${SEO_CONFIG.brand.logo}`,
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Web browser",
    inLanguage: locale,
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    publisher: { "@id": organizationId },
  };
  const website: WithContext<WebSite> = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SEO_CONFIG.brand.url}#website`,
    name: SEO_CONFIG.brand.name,
    alternateName: "Nonna FM",
    url: SEO_CONFIG.brand.url,
    inLanguage: SEO_CONFIG.supportedLocales,
    publisher: { "@id": organizationId },
  };

  return [organization, software, website];
}
