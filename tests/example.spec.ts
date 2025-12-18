import { test, expect, Locator } from "@playwright/test";
import { RegisterPage } from "../pages/RegisterPage";
import { LoginPage } from "../pages/LoginPage";
import { Products } from "../pages/Products";
import { Checkout } from "../pages/Checkout";
import { faker } from "@faker-js/faker";
import fs from "fs";

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  telephone: string;
  password: string;
  newsletter: "Yes" | "No";
}

export interface BillingData {
  firstName: string;
  lastName: string;
  company: string;
  add1: string;
  add2: string;
  city: string;
  postcode: string;
}

type TestResult = {
  title: string | undefined;
  status: string | undefined;
  screenshot?: string | undefined;
};

const results: TestResult[] = [];

let screenshotPath: string | undefined;
let registeredEmail: string;
const password = faker.internet.password();

test.describe("Ecommerce Flow", () => {
  test.describe.configure({ mode: "serial" });

  test("Register", async ({ page }) => {
    registeredEmail = faker.internet.email();
    const nls = Math.random() > 0.5 ? "Yes" : "No";
    const regisData: RegisterData = {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: registeredEmail,
      telephone: faker.phone.number(),
      password,
      newsletter: nls,
    };
    await page.goto("https://ecommerce-playground.lambdatest.io/");
    console.log(regisData.newsletter);
    const register = new RegisterPage(page);
    await register.goToRegisterPage();
    await register.register(regisData);
    await expect(page).toHaveTitle("Your Account Has Been Created!");
  });

  test.beforeEach(async ({ page }) => {
    if (!registeredEmail) return;
    await page.goto("https://ecommerce-playground.lambdatest.io/");
    const login = new LoginPage(page);
    await login.goToLoginPage();
    await login.login(registeredEmail, password);
    await expect(page).toHaveTitle("My Account");
  });

  test("Product", async ({ page }) => {
    // await page.goto("https://ecommerce-playground.lambdatest.io/");
    const product = new Products(page);
    await product.searchProduct("HTC");
    await product.addProduct();
  });

  test("Checkout", async ({ page }, testInfo) => {
    const billinData: BillingData = {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      company: faker.company.name(),
      add1: faker.location.streetAddress(),
      add2: faker.location.secondaryAddress(),
      city: faker.location.city(),
      postcode: faker.location.zipCode(),
    };

    const checkout = new Checkout(page);
    await checkout.goToCart();
    await checkout.fillForm(billinData);
    await checkout.confirmOrder();
    screenshotPath = "OrderPlaced.png";
    await page.screenshot({ path: screenshotPath });
    results.push({
      title: "Test completed",
      status: testInfo.status,
      screenshot: screenshotPath,
    });
  });

  test.afterEach(async ({ page }, testInfo) => {
    screenshotPath = `failureAt${testInfo.title}.png`;
    if (testInfo.status !== testInfo.expectedStatus) {
      await page.screenshot({
        path: screenshotPath,
      });
      results.push({
        title: testInfo.title,
        status: testInfo.status,
        screenshot: screenshotPath,
      });
    }
  });

  test.afterAll(async () => {
    const html = `
  <html>
    <head>
      <title>Custom Test Report</title>
      <style>
        body { font-family: Arial; padding: 20px; }
        .pass { color: green; }
        .fail { color: red; }
        img { width: 400px; border: 1px solid #ccc; margin-top: 10px; }
      </style>
    </head>
    <body>
      <h1>Playwright Custom Test Report</h1>
      ${results
        .map(
          (r) => `
          <div>
            <h3>Fail on page - ${r.title}</h3>
            <p class="${r.status === "passed" ? "pass" : "fail"}">
              Status: ${r.status}
            </p>
            ${r.screenshot ? `<img src="../${r.screenshot}" />` : ""}
          </div>
          <hr />
        `
        )
        .join("")}
    </body>
  </html>
  `;

    fs.writeFileSync("report/custom-report.html", html);
  });
});
