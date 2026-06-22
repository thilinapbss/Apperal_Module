# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: apparel_regression_testing.spec.ts >> Apperal Module | Regression Test Suite >> 05. TC-DSH-002: Clicking Buyer PO Upload tile navigates to list page
- Location: e2e\apparel_regression_testing.spec.ts:297:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: [id*="BuyerPOUpload"], [title*="Buyer PO"], text="Buyer PO Upload" >> nth=0
Expected: visible
Error: Unexpected token "=" while parsing css selector "[id*="BuyerPOUpload"], [title*="Buyer PO"], text="Buyer PO Upload"". Did you mean to CSS.escape it?

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for [id*="BuyerPOUpload"], [title*="Buyer PO"], text="Buyer PO Upload" >> nth=0

```