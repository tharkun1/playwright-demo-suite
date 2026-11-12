import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { USERS, PASSWORD } from './data/users';

test.describe('Login', () => {
  test('standard user logs in and sees the product list', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login(USERS.standard, PASSWORD);

    await expect(page).toHaveURL(/inventory\.html/);
    await expect(page.getByTestId('title')).toHaveText('Products');
  });

  test('locked out user sees an error message', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login(USERS.lockedOut, PASSWORD);

    await expect(loginPage.errorMessage).toContainText('Sorry, this user has been locked out');
    await expect(page).not.toHaveURL(/inventory\.html/);
  });
});
