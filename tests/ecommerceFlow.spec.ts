import { test, BrowserContext, Page } from "@playwright/test";
import * as fs from "node:fs";
import dontenv from "dotenv";
import type {
  BillingData,
  RegisterData,
  TestResult,
} from "../files/common.types";

dontenv.config();

const pageUrl: string = process.env.PAGE_URL || "",
  results: TestResult[] = [];

const {
    register,
    generateRandomRegisterData,
  } = require("../pages/RegisterPage"),
  { login } = require("../pages/LoginPage"),
  { addProduct, searchProduct } = require("../pages/Products"),
  {
    confirmOrder,
    fillForm,
    goToCart,
    generateRandomBillingData,
  } = require("../pages/Checkout");

let screenshotPath: string | undefined,
  context: BrowserContext,
  page: Page,
  registeredEmail: string = process.env.REGISTERED_EMAIL || "",
  password: string = process.env.PASSWORD || "",
  registered: boolean = false;

test.describe("Ecommerce Flow", () => {
  test.describe.configure({ mode: "serial" });

  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext();
    page = await context.newPage();
  });

  test("Register", async () => {
    const regisData: RegisterData = generateRandomRegisterData();
    registeredEmail = regisData.email;
    password = regisData.password;

    await page.goto(pageUrl);
    registered = await register(page, regisData);
  });

  test("Login", async () => {
    test.skip(registered, "User already registered, skipping login test");
    await login(page, registeredEmail, password);
  });

  test("Product", async () => {
    await searchProduct(page, "HTC");
    await addProduct(page);
  });

  test("Checkout", async ({}, testInfo) => {
    const billingData: BillingData = generateRandomBillingData();

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
