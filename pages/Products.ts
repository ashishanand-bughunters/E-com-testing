import { expect, Page } from "@playwright/test";
import productSelectors from "../selectors/products.json";
import { shortTimeout, longTimeout } from "../files/global.json";

export async function searchProduct(page: Page, product: string) {
  console.info("Searching for a product");
  await page.locator(productSelectors.searchInput).fill(product);
  await page.locator(productSelectors.searchButton).click();
  console.info("Product search submitted");
}

export async function addProduct(page: Page, productName: string) {
  await searchProduct(page, productName);
  await page.waitForTimeout(shortTimeout);
  const products = page.locator(productSelectors.productCards);
  const outStock = page.locator(productSelectors.outOfStockBadge);
  const addToCartButton = page
    .getByRole("button", {
      name: productSelectors.addToCartButtonName,
      exact: true,
    })
    .last();
  const addProductConfirmation = page.locator(
    productSelectors.addProductConfirmation,
  );

  await page.locator(productSelectors.productImage).first().waitFor();
  const count = await products.count();
  console.info(`Found ${count} matching product cards`);
  let addedToCart = false;

  for (let i = 0; i < count; i++) {
    await products.nth(i).locator(productSelectors.productLink).first().click();

    console.info(`Checking product ${i + 1} of ${count}`);
    await expect
      .poll(
        async () =>
          (await addToCartButton.isVisible()) || (await outStock.isVisible()),
        {
          message:
            "Product details did not show stock status or an Add to Cart button",
          timeout: longTimeout,
        },
      )
      .toBe(true);

    if (await outStock.isVisible()) {
      console.info(
        `Product ${i + 1} is out of stock; checking the next result`,
      );
      await page.goBack();
    } else {
      console.info("Adding an in-stock product to the cart");
      await addToCartButton.click();
      await expect(addProductConfirmation).toBeVisible();
      console.info("Product added to cart successfully");
      addedToCart = true;
      break;
    }
  }

  expect(addedToCart, "No in-stock product could be added to the cart").toBe(
    true,
  );

  await page
    .locator(productSelectors.closeConfirmationPopupButton)
    .click({ force: true });
}

module.exports = { searchProduct, addProduct };
