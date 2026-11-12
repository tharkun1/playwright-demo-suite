import { type Page, type Locator } from '@playwright/test';

// Page Object for the login screen: tests call these methods instead of using selectors directly.
export class LoginPage {
  readonly page: Page;
  readonly username: Locator;
  readonly password: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.username = page.getByTestId('username');
    this.password = page.getByTestId('password');
    this.loginButton = page.getByTestId('login-button');
    this.errorMessage = page.getByTestId('error');
  }

  async open() {
    await this.page.goto('/');
  }

  async login(user: string, password: string) {
    await this.username.fill(user);
    await this.password.fill(password);
    await this.loginButton.click();
  }
}
