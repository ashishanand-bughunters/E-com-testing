import { Page, expect } from "@playwright/test";
import loginSelectors from "../selectors/login.json";
import { shortTimeout } from "../files/global.json";

async function navigateToLoginPage(page: Page) {
  await page.locator(loginSelectors.accountMenuButton).hover();
  await page.locator(loginSelectors.loginOption).waitFor({ state: "visible" });
  await page.locator(loginSelectors.loginOption).click();
}

async function addLoginCreds(page: Page, user: string, pass: string) {
  await page.locator(loginSelectors.emailInput).fill(user);
  await page.locator(loginSelectors.passwordInput).fill(pass);
  await page.locator(loginSelectors.loginButton).click();
}

async function login(page: Page, user: string, pass: string) {
  await navigateToLoginPage(page);
  await addLoginCreds(page, user, pass);
  await page.waitForTimeout(shortTimeout);
  await expect(page).toHaveTitle("My Account");
}

async function logout(page: Page) {
  const menuButton = page.locator(loginSelectors.accountMenuButton);
  const logoutOption = page.locator(loginSelectors.logoutOption);

  await menuButton.hover();
  await logoutOption.waitFor({ state: "visible" });
  await logoutOption.click();
}

module.exports = { navigateToLoginPage, addLoginCreds, login, logout };
