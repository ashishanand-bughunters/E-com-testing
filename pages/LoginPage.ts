import { Page, expect } from "@playwright/test";
import loginSelectors from "../selectors/login.json";
import { shortTimeout } from "../files/global.json";

async function navigateToLoginPage(page: Page) {
  console.info("Opening the login page");
  await page.locator(loginSelectors.accountMenuButton).first().hover();
  await page
    .locator(loginSelectors.loginOption)
    .first()
    .waitFor({ state: "visible" });
  await page.locator(loginSelectors.loginOption).click();
}

async function addLoginCreds(page: Page, user: string, pass: string) {
  console.info("Entering login credentials");
  await page.locator(loginSelectors.emailInput).fill(user);
  await page.locator(loginSelectors.passwordInput).fill(pass);
  console.info("Submitting login form");
  await page.locator(loginSelectors.loginButton).click();
}

async function login(page: Page, user: string, pass: string) {
  await navigateToLoginPage(page);
  await addLoginCreds(page, user, pass);
  await page.waitForTimeout(shortTimeout);
  await expect(page).toHaveTitle("My Account");
  console.info("Login completed successfully");
}

async function logout(page: Page) {
  const menuButton = page.locator(loginSelectors.accountMenuButton).first();
  const logoutOption = page.locator(loginSelectors.logoutOption).first();

  await menuButton.hover();
  await logoutOption.waitFor({ state: "visible" });
  await logoutOption.click();
  console.info("Logged out successfully");
}

module.exports = { navigateToLoginPage, addLoginCreds, login, logout };
