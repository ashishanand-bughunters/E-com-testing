import { Page, expect } from "@playwright/test";
import { faker } from "@faker-js/faker";
import type { RegisterData } from "../files/common.types";
import registerSelectors from "../selectors/register.json";

async function goToRegisterPage(page: Page) {
  const menuButton = page.locator(registerSelectors.accountMenuButton);
  const registerOption = page.locator(registerSelectors.registerOption);

  await menuButton.hover();
  await registerOption.waitFor({ state: "visible" });
  await registerOption.click();
}

async function fillRegisterFields(page: Page, data: RegisterData) {
  const { firstName, lastName, email, telephone, password, newsletter } = data;

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

async function register(page: Page, data: RegisterData) {
  await goToRegisterPage(page);
  await fillRegisterFields(page, data);
  await expect(page).toHaveTitle("Your Account Has Been Created!");
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
  console.log(JSON.stringify(regisData, null, 2));
  return regisData;
}

module.exports = {
  goToRegisterPage,
  fillRegisterFields,
  register,
  generateRandomRegisterData,
};
