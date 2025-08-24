/**
 * Dynamic robots.txt Generation
 * Provides proper crawling directives for the music transfer platform
 */

import { SEO_CONFIG } from "@/lib/seo/config/base";

export async function GET(request: Request): Promise<Response> {
  // Extract hostname from request headers
  const requestHost = request.headers.get("host");

  // Parse primary domain from SEO_CONFIG
  const primaryUrl = new URL(SEO_CONFIG.brand.url);
  const primaryHostname = primaryUrl.hostname; // "nonna.fm"

  // Only allow indexing when request Host exactly matches primary domain
  const allowIndexing = requestHost === primaryHostname;

  // Log for debugging (can be removed in production)
  if (!requestHost) {
    console.warn("robots.txt: Missing host header, blocking indexing");
  } else if (requestHost !== primaryHostname) {
    console.info(`robots.txt: Host "${requestHost}" != "${primaryHostname}", blocking indexing`);
  }

  const baseUrl = SEO_CONFIG.brand.url;

  let robotsTxt = "";

  if (allowIndexing) {
    // Production robots.txt - Allow crawling with specific rules
    robotsTxt = `# Robots.txt for ${SEO_CONFIG.brand.name}
# Music streaming transfer platform

User-agent: *
Allow: /

# Allow all static assets
Allow: /favicon.ico
Allow: /favicons/
Allow: /images/
Allow: /_next/static/
Allow: /manifest.json

# Block API routes (private functionality)
Disallow: /api/
Disallow: /*/api/

# Block callback routes (OAuth flows)
Disallow: /*/callback/
Disallow: /callback/

# Block private/auth pages
Disallow: /*/library/*/
Disallow: /library/

# Block development/test pages
Disallow: /test/
Disallow: /dev/
Disallow: /_next/
Disallow: /_vercel/

# Allow public pages
Allow: /
Allow: /*/
Allow: /*/source
Allow: /en/
Allow: /es/
Allow: /fr/
Allow: /de/
Allow: /pt/
Allow: /it/
Allow: /ja/

# Special directives for search engines
User-agent: Googlebot
Allow: /
Crawl-delay: 1

User-agent: Bingbot
Allow: /
Crawl-delay: 1

User-agent: Slurp
Allow: /
Crawl-delay: 2

# Block specific bots that don't add value
User-agent: GPTBot
Disallow: /

User-agent: ChatGPT-User
Disallow: /

User-agent: CCBot
Disallow: /

User-agent: anthropic-ai
Disallow: /

User-agent: Claude-Web
Disallow: /

# Block social media crawlers from private content
User-agent: facebookexternalhit
Disallow: /*/library/
Allow: /

User-agent: Twitterbot
Disallow: /*/library/
Allow: /

User-agent: LinkedInBot
Disallow: /*/library/
Allow: /

# Sitemap reference
Sitemap: ${baseUrl}/sitemap.xml`;
  } else {
    // Non-primary domain robots.txt - Block all crawling
    robotsTxt = `# Non-Primary Domain (${requestHost || "unknown"})
# All crawling blocked to prevent duplicate content

User-agent: *
Disallow: /

# Block all bots on non-primary domains
User-agent: Googlebot
Disallow: /

User-agent: Bingbot  
Disallow: /

User-agent: *
Disallow: /

# No sitemaps on non-primary domains
# Primary domain: ${primaryHostname}
# Sitemap available at: ${baseUrl}/sitemap.xml`;
  }

  return new Response(robotsTxt, {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "public, max-age=86400, s-maxage=86400", // Cache for 24 hours
    },
  });
}

// Revalidate daily
export const revalidate = 86400;
