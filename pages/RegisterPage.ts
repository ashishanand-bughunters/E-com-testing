import { Page } from "@playwright/test";
import registerSelectors from "../selectors/register.json";

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  telephone: string;
  password: string;
  newsletter: "Yes" | "No";
}

async function goToRegisterPage(page: Page) {
  const menuButton = page.locator(registerSelectors.accountMenuButton);
  const registerOption = page.locator(registerSelectors.registerOption);

  await menuButton.hover();
  await registerOption.waitFor({ state: "visible" });
  await registerOption.click();
}

async function register(page: Page, data: RegisterData) {
  const {
    firstName,
    lastName,
    email,
    telephone,
    password,
    newsletter,
  } = data;

  console.log(`Registering new user: ${firstName} ${lastName} [${email}]`);
  await page.locator(registerSelectors.firstNameInput).fill(firstName);
  await page.locator(registerSelectors.lastNameInput).fill(lastName);
  await page.locator(registerSelectors.emailInput).fill(email);
  await page.locator(registerSelectors.telephoneInput).fill(telephone);
  await page.locator(registerSelectors.passwordInput).fill(password);
  await page.locator(registerSelectors.confirmPasswordInput).fill(password);
  if (newsletter === "Yes") {
    await page.locator(registerSelectors.newsletterYesLabel).click();
  }
  await page.locator(registerSelectors.privacyAgreementLabel).check();
  await page.locator(registerSelectors.registerButton).click();
}

module.exports = { goToRegisterPage, register };
