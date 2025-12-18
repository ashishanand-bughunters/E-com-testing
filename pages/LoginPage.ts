import { Locator, Page } from "@playwright/test";

export class LoginPage {
  readonly page: Page;
  readonly menuButton: Locator;
  readonly loginOption: Locator;
  readonly username: Locator;
  readonly password: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.menuButton = page.locator("a:has(i.fa-user)");
    this.loginOption = page.locator(".dropdown-menu >> text=Login");
    this.username = page.locator("#input-email");
    this.password = page.locator("#input-password");
    this.loginButton = page.locator(".btn.btn-primary[value='Login']");
  }

  async goToLoginPage() {
    await this.menuButton.hover();
    await this.loginOption.waitFor({ state: "visible" });
    await this.loginOption.click();
  }

  async login(user: string, pass: string) {
    await this.username.fill(user);
    await this.password.fill(pass);
    await this.loginButton.click();
  }
}
