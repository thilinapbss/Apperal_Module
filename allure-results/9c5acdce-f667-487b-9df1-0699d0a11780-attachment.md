# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: apparel_regression_testing.spec.ts >> Apperal Module | Regression Test Suite >> 36. Fill Routing Plan Detail Rows
- Location: e2e\apparel_regression_testing.spec.ts:458:7

# Error details

```
Error: locator.waitFor: SyntaxError: Failed to execute 'evaluate' on 'Document': The string '(//input)[6])' is not a valid XPath expression.
    at Object.queryAll (<anonymous>:6017:25)
    at InjectedScript._queryEngineAll (<anonymous>:6730:49)
    at InjectedScript.querySelectorAll (<anonymous>:6717:30)
    at eval (eval at evaluate (:302:30), <anonymous>:4:39)
    at UtilityScript.evaluate (<anonymous>:304:16)
    at UtilityScript.<anonymous> (<anonymous>:1:44)
Call log:
  - waiting for locator('xpath=(//input)[6])') to be visible

```