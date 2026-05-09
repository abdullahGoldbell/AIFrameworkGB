import { expect, test } from "@playwright/test";

test("hero navigation and starter steps respond", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: /AI field notes for real work/i })).toBeVisible();
  await page.getByRole("link", { name: /Start Learning AI/i }).click();
  await expect(page.getByRole("heading", { name: /Your 5-step AI starter guide/i })).toBeVisible();

  const stepsList = page.locator("#steps-list");
  const secondStep = stepsList.locator(".step-item").nth(1);
  await secondStep.click();
  await expect(secondStep).toHaveClass(/active/);
  await expect(page.locator("#step-detail")).toContainText(/tasks involving language/i);
});

test("prompt library filters and opens generated prompt cards", async ({ page }) => {
  await page.goto("/#prompt-master");

  const search = page.getByRole("searchbox", { name: /Search prompts/i });
  await search.fill("email");
  await expect(page.locator("#pm-count")).not.toHaveText("0");

  const firstCardButton = page.locator("[data-prompt-action='toggle']").first();
  await firstCardButton.click();
  await expect(firstCardButton).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator(".pm-prompt-box").first()).toBeVisible();
});

test("framework playground, subscription validation, and theme persistence work", async ({
  page,
}) => {
  await page.goto("/#framework-showcase");

  await page.locator("#playground-task").selectOption("summary");
  await page.locator("#playground-context").fill("Weekly pipeline notes for team leads.");
  await expect(page.locator("#playground-output")).toContainText("meeting notes");
  await expect(page.locator("#playground-output")).toContainText("Weekly pipeline notes");

  await page.locator("#subscribe-email").fill("not-an-email");
  await page.getByRole("button", { name: "Subscribe" }).click();
  await expect(page.locator("#subscribe-message")).toHaveClass(/error/);

  await page.locator("#subscribe-email").fill("teammate@example.com");
  await page.getByRole("button", { name: "Subscribe" }).click();
  await expect(page.locator("#subscribe-message")).toHaveClass(/success/);

  await page.getByRole("button", { name: /Toggle dark mode/i }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
});
