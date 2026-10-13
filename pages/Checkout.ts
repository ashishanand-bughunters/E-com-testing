import { expect, Page } from "@playwright/test";
const checkoutSelectors = require("../selectors/checkout.json");

interface BillingData {
  firstName: string;
  lastName: string;
  company: string;
  add1: string;
  add2: string;
  city: string;
  postcode: string;
}

async function goToCart(page: Page) {
  await page.locator(checkoutSelectors.openCartButton).click();
  await page.locator(checkoutSelectors.checkoutButton).click();
}

async function fillForm(page: Page, data: BillingData) {
  await page
    .locator(checkoutSelectors.billingAddressFirstNameInput)
    .fill(data.firstName);
  await page
    .locator(checkoutSelectors.billingAddressLastNameInput)
    .fill(data.lastName);
  await page
    .locator(checkoutSelectors.billingAddressCompanyInput)
    .fill(data.company);
  await page
    .locator(checkoutSelectors.billingAddressLine1Input)
    .fill(data.add1);
  await page
    .locator(checkoutSelectors.billingAddressLine2Input)
    .fill(data.add2);
  await page.locator(checkoutSelectors.billingCityInput).fill(data.city);
  await page
    .locator(checkoutSelectors.billingPostcodeInput)
    .fill(data.postcode);

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
}

async function confirmOrder(page: Page) {
  await page.locator(checkoutSelectors.confirmOrderButton).click();
  await expect(page).toHaveTitle("Your order has been placed!");
  console.log("Order Placed!!!!!!!!!");
}

module.exports = { goToCart, fillForm, confirmOrder };
