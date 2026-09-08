import { SEO_CONFIG } from "@/lib/seo/config/base";

export function GET(request: Request): Response {
  const primaryHostname = new URL(SEO_CONFIG.brand.url).hostname;
  const allowIndexing = request.headers.get("host") === primaryHostname;

  // Keep session pages crawlable so search engines can observe their noindex tags.
  // Specific search-bot groups would override the shared API exclusions.
  const robots = allowIndexing
    ? `User-agent: *
Allow: /
Disallow: /api/
Allow: /api/og
Disallow: /_vercel/

User-agent: GPTBot
User-agent: ChatGPT-User
User-agent: CCBot
User-agent: anthropic-ai
User-agent: Claude-Web
Disallow: /

Sitemap: ${SEO_CONFIG.brand.url}/sitemap.xml
`
    : "User-agent: *\nDisallow: /\n";

  return new Response(robots, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
