import { describe, expect, it } from "vitest";
import { GET } from "@/app/robots.txt/route";
import { generateCanonicalUrl } from "@/lib/seo/utils/canonical";

describe("localized canonicals", () => {
  it.each(["/", "/fr", "/fr/", "/help"])("keeps translated page %s in its own language", path => {
    expect(generateCanonicalUrl(path, "fr")).toBe(
      `https://nonna.fm/fr${path === "/help" ? "/help" : ""}`
    );
  });
});

describe("robots policy", () => {
  it("shares API exclusions with search bots while allowing noindex pages and rendering assets", async () => {
    const response = GET(
      new Request("https://nonna.fm/robots.txt", { headers: { host: "nonna.fm" } })
    );
    const body = await response.text();
    const searchGroup = body.split("\n\n")[0];
    expect(searchGroup).toContain("User-agent: *");
    expect(searchGroup).toContain("Disallow: /api/");
    expect(searchGroup).toContain("Allow: /api/og");
    expect(body).not.toMatch(/User-agent: (Googlebot|Bingbot|Slurp)/);
    expect(body).not.toMatch(/Disallow: .*?(library|callback|source|_next)/);
    expect(body).toContain("Sitemap: https://nonna.fm/sitemap.xml");
  });

  it.each(["preview.vercel.app", "localhost:3017", ""])("blocks crawling on %s", async host => {
    const response = GET(new Request("http://localhost/robots.txt", { headers: { host } }));
    expect(await response.text()).toBe("User-agent: *\nDisallow: /\n");
  });
});
