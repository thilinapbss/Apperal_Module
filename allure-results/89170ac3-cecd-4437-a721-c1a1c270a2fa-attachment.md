# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: apparel_regression_testing.spec.ts >> Apperal Module | Regression Test Suite >> 36. Fill Routing Plan Detail Rows
- Location: e2e\apparel_regression_testing.spec.ts:458:7

# Error details

```
Test timeout of 120000ms exceeded.
```

```
Error: locator.click: Target page, context or browser has been closed
Call log:
  - waiting for locator('//span[text()="WH-CMB"]/ancestor::tr[@role="row"]').first()
    - locator resolved to <tr role="row" tabindex="-1" aria-rowindex="2" aria-selected="true" data-sap-ui-render="" id="__item24-__clone67" aria-labelledby="__text52" data-sap-ui="__item24-__clone67" class="sapMLIB sapMLIB-CTX sapMLIBShowSeparator sapMLIBTypeActive sapMLIBActionable sapMLIBHoverable sapMLIBFocusable sapMListTblRow sapMLIBSelected sapMLIBFocused">…</tr>
  - attempting click action
    - waiting for element to be visible, enabled and stable
    - element is visible, enabled and stable
    - scrolling into view if needed
    - done scrolling
    - performing click action

```

# Test source

```ts
  1  | import { Page, Locator } from '@playwright/test';
  2  | 
  3  | export class RoutingPlanCreate {
  4  |   readonly page: Page;
  5  |   readonly createDetailButton: Locator;
  6  | 
  7  |   constructor(page: Page) {
  8  |     this.page = page;
  9  |     this.createDetailButton = page.locator('button[id*="RotingPlanDetails::StandardAction::Create"]');
  10 |   }
  11 | 
  12 |   async fillRoutingPlanDetailRows(details: { routeCode: string; routeName: string; warehouse: string }[]) {
  13 |     for (let i = 0; i < details.length; i++) {
  14 |       await this.createDetailButton.click();
  15 |       await this.page.waitForLoadState('networkidle');
  16 |       await this.page.waitForTimeout(2000);
  17 | 
  18 |       // Get the most recently created row inputs
  19 |       const codeInput = this.page.locator('input[type="text"]').last();
  20 |       const nameInput = this.page.locator('input[type="text"]').nth(-2);
  21 |       const warehouseInput = this.page.locator('input[role="combobox"]').last();
  22 | 
  23 |       await codeInput.pressSequentially(details[i].routeCode, { delay: 50 });
  24 |       await this.page.keyboard.press('Tab');
  25 | 
  26 |       await nameInput.pressSequentially(details[i].routeName, { delay: 50 });
  27 |       await this.page.keyboard.press('Tab');
  28 | 
  29 |       // Type warehouse code and open dropdown
  30 |       await warehouseInput.fill(details[i].warehouse);
  31 |       await this.page.waitForTimeout(300);
  32 | 
  33 |       // Click value help button to open dropdown
  34 |       const valueHelpButton = this.page.locator('span[aria-label="Show Value Help"]').last();
  35 |       await valueHelpButton.click();
  36 |       await this.page.waitForLoadState('networkidle');
  37 |       await this.page.waitForTimeout(800);
  38 | 
  39 |       // Wait for the dropdown table to be attached to DOM (may be hidden)
  40 |       const tableBody = this.page.locator('tbody[id*="SuggestTable-tblBody"]');
  41 |       await tableBody.waitFor({ state: 'attached', timeout: 10000 });
  42 |       await this.page.waitForTimeout(500);
  43 | 
  44 |       // Find and click the warehouse option in the table by finding the span with warehouse code
  45 |       const warehouseOptionRow = this.page.locator(`//span[text()="${details[i].warehouse}"]/ancestor::tr[@role="row"]`);
> 46 |       await warehouseOptionRow.first().click();
     |                                        ^ Error: locator.click: Target page, context or browser has been closed
  47 |       await this.page.waitForLoadState('networkidle');
  48 |       await this.page.waitForTimeout(500);
  49 | 
  50 |       console.log(`Filled routing plan detail row ${i + 1}: ${details[i].routeCode} - ${details[i].routeName} - ${details[i].warehouse}`);
  51 |     }
  52 |   }
  53 | }
  54 | 
```