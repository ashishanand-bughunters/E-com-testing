import { expect, Page } from "@playwright/test";
import productSelectors from "../selectors/products.json";

async function searchProduct(page: Page, product: string) {
  await page.locator(productSelectors.searchInput).fill(product);
  await page.locator(productSelectors.searchButton).click();
}

async function addProduct(page: Page) {
  const products = page.locator(productSelectors.productCards);
  const outStock = page.locator(productSelectors.outOfStockBadge);
  const addProductConfirmation = page.locator(
    productSelectors.addProductConfirmation,
  );

  await page.locator(productSelectors.productImage).first().waitFor();
  const count = await products.count();
  console.log(count);

  for (let i = 0; i < count; i++) {
    await products.nth(i).locator(productSelectors.productLink).first().click();
    await expect(page.locator(productSelectors.pageAd)).toBeVisible({
      timeout: 10000,
    });
    await page
      .locator(productSelectors.addToCartButton)
      .or(outStock)
      .first()
      .waitFor();
    const isOutOfStock = await outStock.isVisible().catch(() => false);

    if (isOutOfStock) {
      await page.goBack();
    } else {
      console.log("Adding to cart");
      await page.locator(productSelectors.addToCartButton).click();
      await expect(addProductConfirmation).toBeVisible();
      console.log("Added to cart");
      break;
    }
  }
}

module.exports = { searchProduct, addProduct };
