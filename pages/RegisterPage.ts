import { Locator, Page } from "@playwright/test";
import { RegisterData } from "../tests/example.spec";

export class RegisterPage {
  readonly page: Page;
  readonly menuButton: Locator;
  readonly registerOption: Locator;
  readonly firstname: Locator;
  readonly lastname: Locator;
  readonly email: Locator;
  readonly telephone: Locator;
  readonly password: Locator;
  readonly confirmPassword: Locator;
  readonly newsletterYes: Locator;
  readonly privacy: Locator;
  readonly registerButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.menuButton = page.locator("a:has(i.fa-user)");
    this.registerOption = page.locator(".dropdown-menu >> text=Register");
    this.firstname = page.locator("#input-firstname");
    this.lastname = page.locator("#input-lastname");
    this.email = page.locator("#input-email");
    this.telephone = page.locator("#input-telephone");
    this.password = page.locator("#input-password");
    this.confirmPassword = page.locator("#input-confirm");
    this.newsletterYes = page.locator("[for='input-newsletter-yes']");
    this.privacy = page.locator("[for='input-agree']");
    this.registerButton = page.locator(".btn.btn-primary[value='Continue']");
  }

  async goToRegisterPage() {
    await this.menuButton.hover();
    await this.registerOption.waitFor({ state: "visible" });
    await this.registerOption.click();
  }

  async register(data: RegisterData) {
    const { firstName, lastName, email, telephone, password, newsletter } =
      data;
    await this.firstname.fill(firstName);
    await this.lastname.fill(lastName);
    await this.email.fill(email);
    await this.telephone.fill(telephone);
    await this.password.fill(password);
    await this.confirmPassword.fill(password);
    if (newsletter === "Yes") await this.newsletterYes.click();
    await this.privacy.check();
    await this.registerButton.click();
  }
}
