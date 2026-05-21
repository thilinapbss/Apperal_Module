# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: apparel_regression_testing.spec.ts >> Apperal Module | Regression Test Suite >> 36. Fill Routing Plan Detail Rows
- Location: e2e\apparel_regression_testing.spec.ts:458:7

# Error details

```
TimeoutError: locator.fill: Timeout 30000ms exceeded.
Call log:
  - waiting for locator('tr[id*="innerTableRow"]').first().locator('input[type="text"]').first()

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
  14 |       const detail = details[i];
  15 | 
  16 |       // Click Create button to add new row
  17 |       await this.createDetailButton.click();
  18 |       await this.page.waitForLoadState('networkidle');
  19 |       await this.page.waitForTimeout(1000);
  20 | 
  21 |       // Get all rows and select the first one (newly added row appears at top)
  22 |       const allRows = this.page.locator('tr[id*="innerTableRow"]');
  23 |       const firstRow = allRows.nth(0);
  24 | 
  25 |       // Fill Route Code (first text input in the row)
  26 |       const routeCodeInput = firstRow.locator('input[type="text"]').nth(0);
> 27 |       await routeCodeInput.fill(detail.routeCode);
     |                            ^ TimeoutError: locator.fill: Timeout 30000ms exceeded.
  28 | 
  29 |       // Fill Route Name (second text input in the row)
  30 |       const routeNameInput = firstRow.locator('input[type="text"]').nth(1);
  31 |       await routeNameInput.fill(detail.routeName);
  32 | 
  33 |       // Fill Warehouse (dropdown with value help)
  34 |       const warehouseInput = firstRow.locator('input[role="combobox"]');
  35 |       await warehouseInput.fill(detail.warehouse);
  36 |       await this.page.waitForTimeout(500);
  37 | 
  38 |       // Click the value help button to open dropdown
  39 |       const valueHelpButton = firstRow.locator('span[aria-label="Show Value Help"]');
  40 |       await valueHelpButton.click();
  41 |       await this.page.waitForLoadState('networkidle');
  42 | 
  43 |       // Select the warehouse from dropdown
  44 |       const warehouseOption = this.page.locator(`text="${detail.warehouse}"`).first();
  45 |       await warehouseOption.click();
  46 |       await this.page.waitForLoadState('networkidle');
  47 | 
  48 |       console.log(`Filled routing plan detail row ${i + 1}: ${detail.routeCode} - ${detail.routeName} - ${detail.warehouse}`);
  49 |     }
  50 |   }
  51 | }
  52 | 
```