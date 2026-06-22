# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: apparel_regression_testing.spec.ts >> Apperal Module | Regression Test Suite >> 10. TC-BPO-007 - Upload PO file with multiple line items
- Location: e2e\apparel_regression_testing.spec.ts:346:10

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('.lp-group-container[data-group="merchandising"]').locator('.lp-group-tiles').getByRole('link', { name: 'Buyer PO Upload Tile', exact: true })
Expected: visible
Timeout: 60000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 60000ms
  - waiting for locator('.lp-group-container[data-group="merchandising"]').locator('.lp-group-tiles').getByRole('link', { name: 'Buyer PO Upload Tile', exact: true })

```

```yaml
- img "SAP"
- heading "Apperal Module" [level=1]
- paragraph: Sign in to your account
- text: Username
- textbox "Username":
  - /placeholder: Enter username
- text: Password
- textbox "Password":
  - /placeholder: Enter password
- button "Sign In"
```