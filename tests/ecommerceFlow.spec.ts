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
  { login, logout } = require("../pages/LoginPage"),
  { addProduct } = require("../pages/Products"),
  {
    completeOrder,
    navigateToCheckout,
    generateRandomBillingData,
  } = require("../pages/Checkout");

let screenshotPath: string | undefined,
  context: BrowserContext,
  page: Page,
  registeredEmail: string = process.env.REGISTERED_EMAIL || "",
  password: string = process.env.PASSWORD || "",
  registered: boolean = false,
  productName: string = "HTC";

test.describe("Ecommerce Flow", () => {
  test.describe.configure({ mode: "serial" });

  test.beforeEach(async ({}, testInfo) => {
    console.log(
      `\x1B[1m****************** ${testInfo.title.toUpperCase()} ******************\x1B[0m`,
    );
  });

  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext();
    page = await context.newPage();
  });

  test("Register a new User", async () => {
    const regisData: RegisterData = generateRandomRegisterData();
    registeredEmail = regisData.email;
    password = regisData.password;

    await page.goto(pageUrl);
    registered = await register(page, regisData);
  });

  test("Login with user", async () => {
    if (registered) {
      console.log("Skipping Login: registration already signed in the user");
      test.skip();
    }
    await login(page, registeredEmail, password);
  });

  test("Logging out", async () => {
    if (!registered) {
      console.log("Skipping Logout: No newly registered user to log out");
      test.skip();
    }
    await logout(page);
  });

  test("Login again after logout", async () => {
    await login(page, registeredEmail, password);
  });

  test("Search a Product", async () => {
    await addProduct(page, productName);
  });

  test("Checkout and confirn Order", async ({}, testInfo) => {
    const billingData: BillingData = generateRandomBillingData();

    await navigateToCheckout(page);
    await completeOrder(page, billingData);
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
    if (
      testInfo.status !== testInfo.expectedStatus &&
      page &&
      !page.isClosed()
    ) {
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

    fs.mkdirSync("report", { recursive: true });
    fs.writeFileSync("report/custom-report.html", html);
  });
});
