# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: apparel_regression_testing.spec.ts >> Apperal Module | Regression Test Suite >> 11. TC-BPO-001: Click on Buyer PO Upload tile
- Location: e2e\apparel_regression_testing.spec.ts:67:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('.lp-group-container[data-group="production"]').locator('.lp-group-tiles').getByRole('link', { name: 'Buyer PO Upload Tile', exact: true })
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for locator('.lp-group-container[data-group="production"]').locator('.lp-group-tiles').getByRole('link', { name: 'Buyer PO Upload Tile', exact: true })
    - waiting for" http://kgntest.ddns.net:4005/launchpadPage.html" navigation to finish...
    - navigated to "http://kgntest.ddns.net:4005/launchpadPage.html"

```