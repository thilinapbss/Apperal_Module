# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: apparel_regression_testing.spec.ts >> Apperal Module | Regression Test Suite >> 53f. Verify Finish Goods combinations
- Location: e2e\apparel_regression_testing.spec.ts:1158:7

# Error details

```
Error: locator.count: SyntaxError: Failed to execute 'querySelectorAll' on 'Element': 'input[value!=""]' is not a valid selector.
    at query (<anonymous>:5334:41)
    at <anonymous>:5344:7
    at SelectorEvaluatorImpl._cached (<anonymous>:5121:20)
    at SelectorEvaluatorImpl._queryCSS (<anonymous>:5331:17)
    at SelectorEvaluatorImpl._querySimple (<anonymous>:5211:19)
    at <anonymous>:5159:29
    at SelectorEvaluatorImpl._cached (<anonymous>:5121:20)
    at SelectorEvaluatorImpl.query (<anonymous>:5152:19)
    at Object.query (<anonymous>:5366:44)
    at <anonymous>:5324:21
```