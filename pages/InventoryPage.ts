import { type Page, type Locator } from '@playwright/test';

// Page Object for the product list shown after login.
export class InventoryPage {
  readonly page: Page;
  readonly title: Locator;
  readonly sortSelect: Locator;
  readonly itemPrices: Locator;
  readonly cartBadge: Locator;
  readonly cartLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.getByTestId('title');
    this.sortSelect = page.getByTestId('product-sort-container');
    this.itemPrices = page.getByTestId('inventory-item-price');
    this.cartBadge = page.getByTestId('shopping-cart-badge');
    this.cartLink = page.getByTestId('shopping-cart-link');
  }

  // productId is the end of the button's data-test, e.g. 'sauce-labs-backpack'
  async addToCart(productId: string) {
    await this.page.getByTestId(`add-to-cart-${productId}`).click();
  }

  // 'az' | 'za' | 'lohi' | 'hilo' (values of the sort dropdown)
  async sortBy(option: 'az' | 'za' | 'lohi' | 'hilo') {
    await this.sortSelect.selectOption(option);
  }

  // Reads prices like "$29.99" and returns them as numbers
  async prices(): Promise<number[]> {
    const texts = await this.itemPrices.allTextContents();
    return texts.map((t) => parseFloat(t.replace('$', '')));
  }

  async openCart() {
    await this.cartLink.click();
  }
}
