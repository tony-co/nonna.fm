import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  // Test with an isolated browser and never contact real music or analytics services.
  await page.route("**/*", route =>
    new URL(route.request().url()).origin === "http://127.0.0.1:3017"
      ? route.continue()
      : route.abort()
  );
});

test("public pages render and keep the chosen locale", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  for (const locale of ["en", "fr", "it", "de", "es", "pt", "ja"]) {
    const response = await page.goto(`/${locale}`);
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator("html")).toHaveAttribute("lang", locale);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth
    );
    expect(overflow).toBe(false);
  }
  expect(errors).toEqual([]);
});

test("an empty Spotify library finishes loading", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem(
      "nonna_source_token",
      JSON.stringify({
        accessToken: "test-only",
        expiresIn: 3600,
        timestamp: Date.now(),
        userId: "test-user",
        tokenType: "Bearer",
        role: "source",
        serviceId: "spotify",
      })
    );
  });
  let requests = 0;
  await page.route("https://api.spotify.com/v1/**", route => {
    requests++;
    return route.fulfill({ json: { items: [], total: 0 } });
  });
  await page.route("**/api/user/status", route =>
    route.fulfill({ json: { isPremium: false, currentUsage: 0, resetInSeconds: 0 } })
  );
  await page.goto("/en/library/spotify/apple");
  await expect(page.getByTestId("sidebar")).toBeVisible();
  await expect(page.getByTestId("transfer-button")).toBeDisabled();
  expect(requests).toBe(3);
});

test("invalid service routes return 404", async ({ page }) => {
  const response = await page.goto("/en/library/unknown/apple");
  expect(response?.status()).toBe(404);
});

test("homepage auth errors and consent still work after hydration", async ({ page }) => {
  await page.goto("/en?error=not_authenticated&utm_source=test");
  await expect(
    page.getByText("Please authenticate with a music service to continue.")
  ).toBeVisible();
  await page.getByRole("button", { name: "Connect with Spotify" }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog.getByText("Before using Spotify with Nonna.fm, please note:")).toHaveCSS(
    "text-align",
    "left"
  );
  await dialog.getByRole("button", { name: "Close dialog" }).click();
  await expect(dialog).not.toBeVisible();
});
