# Playwright Demo Suite

[![Playwright tests](https://github.com/tharkun1/playwright-demo-suite/actions/workflows/playwright.yml/badge.svg)](https://github.com/tharkun1/playwright-demo-suite/actions/workflows/playwright.yml)

A practice project in **Playwright + TypeScript**: UI tests built with the **Page Object Model** and API tests, running automatically in **GitHub Actions** after every push.

It was built after completing Playwright training, to practise the patterns on public demo applications. Built with AI assistance (Claude Code).

## What is tested

**UI: [saucedemo.com](https://www.saucedemo.com)** (demo online shop), 5 tests

| Test | What it checks |
|---|---|
| Login: standard user | logs in and lands on the product list |
| Login: locked out user | sees the "locked out" error and stays on the login page |
| Add to cart | cart badge shows 1 and the right product is in the cart |
| Sort by price | "low to high" really orders the prices |
| Checkout | full order from cart to "Thank you for your order!" |

**API: [restful-booker](https://restful-booker.herokuapp.com/apidoc/index.html)** (demo booking API), 3 tests

| Test | What it checks |
|---|---|
| GET /booking | returns a non-empty list of booking ids |
| POST + GET | a created booking is saved exactly as sent |
| Auth + PUT + DELETE | update and delete need a token; a deleted booking returns 404 |

## Project structure

```
pages/            Page Objects: one class per screen (Login, Inventory, Cart, Checkout)
api/              API client for restful-booker (same idea as a Page Object)
tests/            UI tests (login, shop)
tests/api/        API tests
tests/data/       public demo accounts
.github/workflows CI: runs all tests on every push and uploads the HTML report
```

**Why Page Object Model:** tests describe *what* the user does (`loginPage.login(user, password)`), while the Page Objects know *where* things are on the page. When the page changes, only one file needs fixing. Locators use the site's `data-test` attributes, so styling changes do not break the tests.

## Run it locally

Requires Node.js 20 or newer.

```bash
npm ci
npx playwright install chromium
npm test                 # all tests
npm run test:api         # API tests only
npx playwright test --ui # interactive mode, step-by-step view
npm run report           # open the last HTML report
```

## Notes

- `restful-booker` answers **201** on DELETE instead of the usual 200/204; the test documents this known quirk of the demo API.
- The CI runner is pinned to `ubuntu-24.04`: since October 2026 `ubuntu-latest` points to Ubuntu 26.04, which Playwright 1.56 does not support yet.
- The accounts in `tests/data/users.ts` and the API login are public demo credentials published by the demo sites.
