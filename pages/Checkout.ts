import { expect, Locator, Page } from "@playwright/test";
import { BillingData } from "../tests/example.spec";

export class Checkout {
  page: Page;
  cartPage: Locator;
  checkoutPage: Locator;
  firstName: Locator;
  lastName: Locator;
  company: Locator;
  add1: Locator;
  add2: Locator;
  city: Locator;
  postcode: Locator;
  country: Locator;
  state: Locator;
  tnc: Locator;
  continue: Locator;
  confirm: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartPage = page.locator("#entry_217825 a");
    this.checkoutPage = page.locator("#entry_217851 a");
    this.firstName = page.locator("#input-payment-firstname");
    this.lastName = page.locator("#input-payment-lastname");
    this.company = page.locator("#input-payment-company");
    this.add1 = page.locator("#input-payment-address-1");
    this.add2 = page.locator("#input-payment-address-2");
    this.city = page.locator("#input-payment-city");
    this.postcode = page.locator("#input-payment-postcode");
    this.country = page.locator("#input-payment-country");
    this.state = page.locator("#input-payment-zone");
    this.tnc = page.locator("label[for='input-agree']");
    this.continue = page.locator("#button-save");
    this.confirm = page.locator("#button-confirm");
  }

  async goToCart() {
    await this.cartPage.click();
    await this.checkoutPage.click();
  }

  async fillForm(data: BillingData) {
    const { firstName, lastName, company, add1, add2, city, postcode } = data;

    await this.firstName.fill(firstName);
    await this.lastName.fill(lastName);
    await this.company.fill(company);
    await this.add1.fill(add1);
    await this.add2.fill(add2);
    await this.city.fill(city);
    await this.postcode.fill(postcode);

    const countryOptions = await this.country.count();
    const randomIndexC = Math.floor(Math.random() * (countryOptions - 1)) + 1;
    await this.country.selectOption({ index: randomIndexC });

    await expect(this.state).toBeEnabled();

    const stateOptions = await this.state.count();
    const randomIndexS = Math.floor(Math.random() * (stateOptions - 1)) + 1;
    await this.state.selectOption({ index: randomIndexS });

    await this.tnc.click();

    await this.continue.click();
  }

  async confirmOrder() {
    await this.confirm.click();

    await expect(this.page).toHaveTitle("Your order has been placed!");
    console.log("Order Placed!!!!!!!!!");
  }
}
