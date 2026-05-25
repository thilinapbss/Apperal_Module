# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: apparel_regression_testing.spec.ts >> Apperal Module | Regression Test Suite >> 51. Wait for Style Master page to load
- Location: e2e\apparel_regression_testing.spec.ts:722:7

# Error details

```
TimeoutError: locator.waitFor: Timeout 30000ms exceeded.
Call log:
  - waiting for locator('button[id*="StyleMaster::LineItem::StandardAction::Create"]') to be visible

```