import { expect, Locator, Page } from "@playwright/test";

export class Products {
  readonly page: Page;
  searchBox: Locator;
  searchButton: Locator;
  products: Locator;
  outStock: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchBox = page.locator("input[name='search'][data-autocomplete]");
    this.searchButton = page.locator(".type-text");
    this.products = page.locator(".product-thumb");
    this.outStock = page.locator(".badge.badge-danger");
  }

  async searchProduct(product: string) {
    await this.searchBox.fill(product);
    await this.searchButton.click();
  }

  async addProduct() {
    await this.page.getByAltText("HTC Touch HD").first().waitFor();
    const count: number = await this.products.count();
    console.log(count);

    for (let i = 0; i < count; i++) {
      await this.products.nth(i).locator("a").first().click();
      await this.page
        .getByRole("button", { name: "Add to Cart" })
        .or(this.outStock)
        .first()
        .waitFor();
      const isOutOfStock = await this.outStock.isVisible().catch(() => false);

      if (isOutOfStock) {
        await this.page.goBack();
      } else {
        console.log("Adding to cartttttttttt");
        await this.page.getByRole("button", { name: "Add to Cart" }).click();
        await expect(this.page.locator(".toast")).toBeVisible();
        console.log("Added to cartttttttttt");
        break;
      }
    }
  }
}
