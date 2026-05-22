# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: apparel_regression_testing.spec.ts >> Apperal Module | Regression Test Suite >> 03. Should successfully login with valid credentials and save auth
- Location: e2e\apparel_regression_testing.spec.ts:198:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('#shell-header')
Expected: visible
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 60000ms
  - waiting for locator('#shell-header')

```

```yaml
- img "SAP"
- heading "Apperal Module" [level=1]
- paragraph: Sign in to your account
- text: Username
- textbox "Username":
  - /placeholder: Enter username
  - text: admin
- text: Password
- textbox "Password":
  - /placeholder: Enter password
  - text: Admin@1234
- button "Sign In"
```