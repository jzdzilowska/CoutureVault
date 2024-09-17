import { test, expect } from "@playwright/test";

test("create a new outfit", async ({ page }) => {
  await page.goto("http://localhost:3000/?skipLogin=true");
  await page.locator(".button").click();
  await page.getByPlaceholder("Title...").click();
  await page.getByPlaceholder("Title...").fill("This is an Outfit");
  await page.getByRole("combobox").selectOption("outfit");
  await page.getByPlaceholder("Outfit Description...").click();
  await page.getByPlaceholder("Outfit Description...").fill("outfit");
  await page
    .locator("div")
    .filter({ hasText: /^Create$/ })
    .nth(1)
    .click();
  await page.getByRole("link", { name: "Couture Vault" }).click();
  //assertion
  await expect(
    page.getByRole("link", { name: "This is an Outfit" })
  ).toBeVisible();
  await page.getByRole("link", { name: "This is an Outfit" }).click();
  //delete to clear from mongodb
  await page
    .locator("div")
    .filter({ hasText: /^Delete$/ })
    .click();
  await page.getByRole("link", { name: "Couture Vault" }).click();
});

test("create a coat with a comment", async ({ page }) => {
  await page.goto("http://localhost:3000/?skipLogin=true");
  await page.locator(".button").click();
  await page.getByRole("combobox").selectOption("clothingitem");
  await page.getByPlaceholder("Title...").click();
  await page.getByPlaceholder("Title...").fill("This is a Clothingitem");
  await page.getByPlaceholder("Brand...").click();
  await page.getByPlaceholder("Brand...").fill("coat brand");
  await page.getByPlaceholder("Color...").click();
  await page.getByPlaceholder("Color...").fill("red");
  await page.getByPlaceholder("Item Description...").click();
  await page.getByPlaceholder("Item Description...").fill("red coat");
  await page.getByPlaceholder("Clothing image URL...").click();
  await page.getByPlaceholder("Clothing image URL...").fill("red coat url");
  await page.getByPlaceholder("Price in $").click();
  await page.getByPlaceholder("Price in $").fill("10");
  await page
    .locator("div")
    .filter({ hasText: /^Create$/ })
    .nth(1)
    .click();
  await page.getByRole("link", { name: "Couture Vault" }).click();
  //assertion
  await expect(
    page.getByRole("link", { name: "This is a Clothingitem" })
  ).toBeVisible();
  await page.getByRole("link", { name: "This is a Clothingitem" }).click();
  await page.getByPlaceholder("Anything?").click();
  await page.getByPlaceholder("Anything?").fill("my clothing item comment");
  await page.getByRole("button", { name: "Comment" }).click();
  //delete to clear from mongodb
  await page
    .locator("div")
    .filter({ hasText: /^Delete$/ })
    .click();
  await page.getByRole("link", { name: "Couture Vault" }).click();
});

test("test comment on aritzia outfit", async ({ page }) => {
  await page.goto("http://localhost:3000/?skipLogin=true");
  await page
    .locator("div")
    .filter({ hasText: /^Aritzia OutfitCreated on 12\/10\/2023$/ })
    .first()
    .click();
  await page.getByPlaceholder("Anything?").click();
  await page.getByPlaceholder("Anything?").fill("comment");
  await page.getByRole("button", { name: "Comment" }).click();
});
