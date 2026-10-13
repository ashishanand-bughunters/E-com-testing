import { Page, expect } from "@playwright/test";
import { faker } from "@faker-js/faker";
import type { RegisterData } from "../files/common.types";
import registerSelectors from "../selectors/register.json";
import { mediumTimeout } from "../files/global.json";

async function goToRegisterPage(page: Page) {
  console.info("Opening the registration page");
  const menuButton = page.locator(registerSelectors.accountMenuButton).first();
  const registerOption = page.locator(registerSelectors.registerOption).first();

  await menuButton.hover();
  await expect(registerOption, "Register option not visible").toBeVisible({
    timeout: mediumTimeout,
  });
  await registerOption.click();
}

async function fillRegisterFields(page: Page, data: RegisterData) {
  const { firstName, lastName, email, telephone, password, newsletter } = data;

  console.info("Filling registration form");
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
  console.info("Submitting registration form");
  await page.locator(registerSelectors.registerButton).click();
}

async function register(page: Page, data: RegisterData) {
  await goToRegisterPage(page);
  await fillRegisterFields(page, data);
  await expect(page).toHaveTitle("Your Account Has Been Created!");
  console.info("Registration completed successfully");
  return true;
}

function generateRandomRegisterData() {
  const regisData: RegisterData = {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    telephone: faker.phone.number(),
    password: faker.internet.password(),
    newsletter: Math.random() > 0.5 ? "Yes" : "No",
  };
  return regisData;
}

module.exports = {
  goToRegisterPage,
  fillRegisterFields,
  register,
  generateRandomRegisterData,
};
