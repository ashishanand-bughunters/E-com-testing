import { test, expect, BrowserContext, Page } from "@playwright/test";
const { goToRegisterPage, register } = require("../pages/RegisterPage");
const { goToLoginPage, login } = require("../pages/LoginPage");
const { addProduct, searchProduct } = require("../pages/Products");
const { confirmOrder, fillForm, goToCart } = require("../pages/Checkout");
import { faker } from "@faker-js/faker";
import * as fs from "node:fs";

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  telephone: string;
  password: string;
  newsletter: "Yes" | "No";
}

interface BillingData {
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
let context: BrowserContext;
let page: Page;
let registeredEmail: string;
let password: string;

test.describe("Ecommerce Flow", () => {
  test.describe.configure({ mode: "serial" });

  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext();
    page = await context.newPage();
  });

  test("Register", async () => {
    registeredEmail = faker.internet.email();
    password = faker.internet.password();
    const regisData: RegisterData = {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: registeredEmail,
      telephone: faker.phone.number(),
      password,
      newsletter: Math.random() > 0.5 ? "Yes" : "No",
    };

    await page.goto("https://ecommerce-playground.lambdatest.io/");
    await goToRegisterPage(page);
    await register(page, regisData);
    await expect(page).toHaveTitle("Your Account Has Been Created!");
  });

  test("Login", async () => {
    await page.goto("https://ecommerce-playground.lambdatest.io/");
    const alreadyLoggedIn = await goToLoginPage(page);
    if (!alreadyLoggedIn) {
      await login(page, registeredEmail, password);
      await expect(page).toHaveTitle("My Account");
    } else {
      await expect(page).toHaveTitle("Your Store");
    }
  });

  test("Product", async () => {
    await searchProduct(page, "HTC");
    await addProduct(page);
  });

  test("Checkout", async ({}, testInfo) => {
    const billingData: BillingData = {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      company: faker.company.name(),
      add1: faker.location.streetAddress(),
      add2: faker.location.secondaryAddress(),
      city: faker.location.city(),
      postcode: faker.location.zipCode(),
    };

    await goToCart(page);
    await fillForm(page, billingData);
    await confirmOrder(page);
    screenshotPath = "OrderPlaced.png";
    await page.screenshot({ path: screenshotPath });
    results.push({
      title: "Test completed",
      status: testInfo.status,
      screenshot: screenshotPath,
    });
  });

  test.afterEach(async ({}, testInfo) => {
    screenshotPath = `failureAt${testInfo.title}.png`;
    if (testInfo.status !== testInfo.expectedStatus && page) {
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
    if (context) {
      await context.close();
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
        `,
        )
        .join("")}
    </body>
  </html>
  `;

    fs.writeFileSync("report/custom-report.html", html);
  });
});
