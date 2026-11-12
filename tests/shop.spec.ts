import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { USERS, PASSWORD } from './data/users';

test.describe('Shop', () => {
  // Every test in this file starts logged in as the standard user
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login(USERS.standard, PASSWORD);
  });

  test('adding a product puts it in the cart', async ({ page }) => {
    const inventory = new InventoryPage(page);
    await inventory.addToCart('sauce-labs-backpack');
    await expect(inventory.cartBadge).toHaveText('1');

    await inventory.openCart();
    const cart = new CartPage(page);
    await expect(cart.items).toHaveCount(1);
    await expect(cart.itemNames.first()).toHaveText('Sauce Labs Backpack');
  });

  test('sorting by price low to high orders the products', async ({ page }) => {
    const inventory = new InventoryPage(page);
    await inventory.sortBy('lohi');

    const prices = await inventory.prices();
    const sorted = [...prices].sort((a, b) => a - b);
    expect(prices).toEqual(sorted);
  });

  test('user completes an order from cart to confirmation', async ({ page }) => {
    const inventory = new InventoryPage(page);
    await inventory.addToCart('sauce-labs-bike-light');
    await inventory.openCart();

    await new CartPage(page).checkout();
    const checkout = new CheckoutPage(page);
    await checkout.fillCustomer('Test', 'User', '75-001');
    await checkout.finish();

    await expect(checkout.completeHeader).toHaveText('Thank you for your order!');
  });
});
