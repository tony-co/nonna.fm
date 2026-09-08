import { readFile } from "node:fs/promises";
import { expect, test } from "@playwright/test";
import { JSDOM } from "jsdom";
import { routing } from "../src/i18n/routing";

test("every sitemap page serves localized content and canonical metadata without JavaScript", async ({
  request,
}) => {
  const sitemap = await request.get("/sitemap-public.xml");
  expect(sitemap.status()).toBe(200);
  const xml = new JSDOM(await sitemap.text(), { contentType: "text/xml" }).window.document;
  const urls = [...xml.querySelectorAll("loc")].map(node => node.textContent);
  expect(urls).toEqual(routing.locales.map(locale => `https://nonna.fm/${locale}`));
  expect(xml.querySelector("lastmod")).toBeNull();

  for (const locale of routing.locales) {
    const messages = JSON.parse(
      await readFile(new URL(`../messages/${locale}.json`, import.meta.url), "utf8")
    );
    const response = await request.get(`/${locale}`, { headers: { "User-Agent": "Googlebot" } });
    expect(response.status()).toBe(200);
    const document = new JSDOM(await response.text()).window.document;
    expect(document.documentElement.lang).toBe(locale);
    expect(document.querySelector("h1")?.textContent).toBe(messages.HomePage.title);
    expect(document.querySelector("main")?.textContent).toContain(messages.HomePage.guide.title);
    expect(document.querySelector("main")?.textContent).toContain(
      messages.HomePage.faq.matching.answer
    );
    expect(document.title).toBe(`${messages.HomePage.metaTitle} | Nonna.fm`);
    expect(document.head.querySelector('meta[name="description"]')?.getAttribute("content")).toBe(
      messages.HomePage.description
    );
    expect(document.head.querySelector('meta[name="robots"]')?.getAttribute("content")).toBe(
      "index, follow"
    );
    expect(document.head.querySelectorAll('link[rel="canonical"]')).toHaveLength(1);
    expect(document.head.querySelector('link[rel="canonical"]')?.getAttribute("href")).toBe(
      `https://nonna.fm/${locale}`
    );
    for (const language of [...routing.locales, "x-default"]) {
      const target = language === "x-default" ? "en" : language;
      expect(
        document.head.querySelector(`link[hreflang="${language}"]`)?.getAttribute("href")
      ).toBe(`https://nonna.fm/${target}`);
    }
    expect(document.querySelectorAll("nav a[hreflang]")).toHaveLength(routing.locales.length);
    const schemas = JSON.parse(
      document.querySelector('script[type="application/ld+json"]')?.textContent || "null"
    );
    const software = schemas.find(
      (schema: { "@type": string }) => schema["@type"] === "SoftwareApplication"
    );
    expect(software.description).toBe(messages.HomePage.description);
    expect(software.url).toBe(`https://nonna.fm/${locale}`);
    expect(software.offers.price).toBe("0");
    expect(software).not.toHaveProperty("aggregateRating");
    expect(software).not.toHaveProperty("screenshot");
    expect(
      schemas.find((schema: { "@type": string }) => schema["@type"] === "WebSite")
    ).not.toHaveProperty("potentialAction");
  }
});

test("transfer sessions stay out of search results and do not inherit homepage markup", async ({
  request,
}) => {
  for (const path of [
    "/en/source?source=spotify",
    "/fr/callback/spotify",
    "/en/callback/youtube",
    "/it/callback/deezer",
    "/en/library/spotify/apple",
    "/fr/library/apple/spotify/liked",
  ]) {
    const response = await request.get(path, { headers: { "User-Agent": "Googlebot" } });
    expect(response.status()).toBe(200);
    const document = new JSDOM(await response.text()).window.document;
    expect(document.querySelector('meta[name="robots"]')?.getAttribute("content")).toContain(
      "noindex"
    );
    expect(document.querySelector('link[rel="canonical"]')).toBeNull();
    expect(document.querySelector('script[type="application/ld+json"]')).toBeNull();
  }
});

test("query strings, static assets and obsolete URLs retain their HTTP contracts", async ({
  request,
}) => {
  const response = await request.get("/fr?error=not_authenticated&utm_source=test");
  const document = new JSDOM(await response.text()).window.document;
  expect(document.querySelector('link[rel="canonical"]')?.getAttribute("href")).toBe(
    "https://nonna.fm/fr"
  );
  const image = await request.get("/images/nonna_logo.png", { maxRedirects: 0 });
  expect(image.status()).toBe(200);
  expect(image.headers()["content-type"]).toContain("image/png");
  const redirect = await request.get("/fr/", { maxRedirects: 0 });
  expect(redirect.status()).toBe(308);
  expect(redirect.headers().location).toBe("/fr");
  for (const path of [
    "/en/missing-page",
    "/ja/library/amazon/tidal",
    "/en/library/tidal/apple",
    "/de/library/youtube/amazon/liked",
  ]) {
    expect((await request.get(path)).status(), path).toBe(404);
  }
});

test("homepage content and language links work with JavaScript disabled", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    await page.goto("/en");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "How to transfer between Spotify and Apple Music" })
    ).toBeAttached();
    await page.getByRole("link", { name: "Français", exact: true }).click();
    await expect(page).toHaveURL(/\/fr$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Transférez votre musique");
  } finally {
    await context.close();
  }
});
