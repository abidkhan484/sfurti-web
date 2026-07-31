import { test, expect } from "@playwright/test";

test.describe("Home page — Mobile (375px)", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test("redirects / to /en/ or serves default locale at /", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/(?:\/en|\/)$/);
  });

  test("hero section is visible", async ({ page }) => {
    await page.goto("/en");
    await expect(page.locator("#hero-section")).toBeVisible();
  });

  test("hero form is visible", async ({ page }) => {
    await page.goto("/en");
    await expect(page.locator("#hero-cta-form")).toBeVisible();
  });

  test("hero form has phone input", async ({ page }) => {
    await page.goto("/en");
    await expect(page.locator("#hero-cta-form input[type='tel']")).toBeVisible();
  });

  test("survey section is visible", async ({ page }) => {
    await page.goto("/en");
    await page.locator("#survey-section").scrollIntoViewIfNeeded();
    await expect(page.locator("#survey-section")).toBeVisible();
  });

  test("FAQ accordion opens and closes", async ({ page }) => {
    await page.goto("/en");
    const firstQuestion = page.locator("[data-faq-item]").first();
    await firstQuestion.scrollIntoViewIfNeeded();
    await firstQuestion.click();
    await expect(page.locator("[data-faq-answer]").first()).toBeVisible();
    await firstQuestion.click();
    await expect(page.locator("[data-faq-answer]").first()).not.toBeVisible();
  });

  test("language toggle switches locale to bn", async ({ page }) => {
    await page.goto("/en");
    await page.locator("button[data-locale='bn']:visible").first().click();
    await expect(page).toHaveURL(/\/bn/);
  });

  test("about page renders", async ({ page }) => {
    await page.goto("/en/about");
    await expect(page).toHaveURL(/\/en\/about/);
    await expect(page.locator("h1")).toBeVisible();
  });

  test("contact page renders", async ({ page }) => {
    await page.goto("/en/contact");
    await expect(page).toHaveURL(/\/en\/contact/);
    await expect(page.locator("h1")).toBeVisible();
  });
});
