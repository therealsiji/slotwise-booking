import { expect, test } from "@playwright/test";

test("home page renders SlotWise", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /calmer way/i })).toBeVisible();
});

test("dashboard redirects unauthenticated users", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(page).toHaveURL(/sign-in|dashboard/);
});
