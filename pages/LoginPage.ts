import { Page } from "@playwright/test";
import loginSelectors from "../selectors/login.json";

async function goToLoginPage(page: Page) {
  const menuButton = page.locator(loginSelectors.accountMenuButton);
  const loginOption = page.locator(loginSelectors.loginOption);
  const logoutOption = page.locator(loginSelectors.logoutOption);

  await menuButton.hover();
  const loginOptionVisible = await loginOption.isVisible();
  const logoutOptionVisible = await logoutOption.isVisible();
  // console.log(`Login option visible: ${loginOptionVisible}`);
  // console.log(`Logout option visible: ${logoutOptionVisible}`);

  if (loginOptionVisible) {
    await loginOption.waitFor({ state: "visible" });
    await loginOption.click();
    return false;
  }

  if (logoutOptionVisible) {
    console.log("Login option not found, user already logged in");
    return true;
  }

  console.log(
    "Neither login nor logout option found, user might be on a different page",
  );
  return false;
}

async function login(page: Page, user: string, pass: string) {
  await page.locator(loginSelectors.emailInput).fill(user);
  await page.locator(loginSelectors.passwordInput).fill(pass);
  await page.locator(loginSelectors.loginButton).click();
}

async function logout(page: Page) {
  const menuButton = page.locator(loginSelectors.accountMenuButton);
  const logoutOption = page.locator(loginSelectors.logoutOption);

  await menuButton.hover();
  await logoutOption.waitFor({ state: "visible" });
  await logoutOption.click();
}

module.exports = { goToLoginPage, login, logout };
