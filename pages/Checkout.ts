import { expect, Page } from "@playwright/test";
import { faker } from "@faker-js/faker";
import type { BillingData } from "../files/common.types";
import checkoutSelectors from "../selectors/checkout.json";

async function navigateToCheckout(page: Page) {
  console.info("Opening the cart and checkout");
  await page.locator(checkoutSelectors.openCartButton).click();
  await page.locator(checkoutSelectors.checkoutButton).click();
}

async function fillForm(page: Page, data: BillingData) {
  console.info("Filling billing form");
  const { firstName, lastName, company, add1, add2, city, postcode } = data;
  await page
    .locator(checkoutSelectors.billingAddressFirstNameInput)
    .fill(firstName);
  await page
    .locator(checkoutSelectors.billingAddressLastNameInput)
    .fill(lastName);
  await page
    .locator(checkoutSelectors.billingAddressCompanyInput)
    .fill(company);
  await page.locator(checkoutSelectors.billingAddressLine1Input).fill(add1);
  await page.locator(checkoutSelectors.billingAddressLine2Input).fill(add2);
  await page.locator(checkoutSelectors.billingCityInput).fill(city);
  await page.locator(checkoutSelectors.billingPostcodeInput).fill(postcode);

  const country = page.locator(checkoutSelectors.billingCountrySelect);
  const countryOptions = await country.count();
  const randomCountryIndex =
    Math.floor(Math.random() * (countryOptions - 1)) + 1;
  await country.selectOption({ index: randomCountryIndex });

  const state = page.locator(checkoutSelectors.billingStateSelect);
  await expect(state).toBeEnabled();
  const stateOptions = await state.count();
  const randomStateIndex = Math.floor(Math.random() * (stateOptions - 1)) + 1;
  await state.selectOption({ index: randomStateIndex });

  await page.locator(checkoutSelectors.termsAndConditionsLabel).click();
  await page.locator(checkoutSelectors.continueButton).click();
  console.info("Billing form submitted");
}

async function completeOrder(page: Page, billingData: BillingData) {
  await fillForm(page, billingData);
  console.info("Confirming the order");
  await page.locator(checkoutSelectors.confirmOrderButton).click();
  await expect(page).toHaveTitle("Your order has been placed!");
  console.info("Order placed successfully");
}

function generateRandomBillingData() {
  const billingData: BillingData = {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    company: faker.company.name(),
    add1: faker.location.streetAddress(),
    add2: faker.location.secondaryAddress(),
    city: faker.location.city(),
    postcode: faker.location.zipCode(),
  };
  return billingData;
}

module.exports = {
  navigateToCheckout,
  fillForm,
  completeOrder,
  generateRandomBillingData,
};
