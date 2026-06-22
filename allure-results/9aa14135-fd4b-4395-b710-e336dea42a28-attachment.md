# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: apparel_regression_testing.spec.ts >> Apperal Module | Regression Test Suite >> 09. TC-BPO-006 - Upload invalid file type is rejected
- Location: e2e\apparel_regression_testing.spec.ts:323:10

# Error details

```
Error: locator.waitFor: Error: strict mode violation: locator('.sapMMessageToast[role="alert"]') resolved to 3 elements:
    1) <div role="alert" data-sap-ui-popup="id-1782100081732-530" class="sapMMessageToast sapUiSelectable sapContrast sapContrastPlus">…</div> aka getByText('Loading Excel library...')
    2) <div role="alert" data-sap-ui-popup="id-1782100082145-531" class="sapMMessageToast sapUiSelectable sapContrast sapContrastPlus">…</div> aka getByText('Excel library loaded')
    3) <div role="alert" data-sap-ui-popup="id-1782100082284-532" class="sapMMessageToast sapUiSelectable sapContrast sapContrastPlus">…</div> aka getByText('No valid data was found in')

Call log:
  - waiting for locator('.sapMMessageToast[role="alert"]') to be visible


Call Log:
- Timeout 15000ms exceeded while waiting on the predicate
```