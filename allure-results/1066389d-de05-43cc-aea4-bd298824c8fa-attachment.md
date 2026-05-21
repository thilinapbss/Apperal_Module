# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: apparel_regression_testing.spec.ts >> Apperal Module | Regression Test Suite >> 36. Fill Routing Plan Detail Rows
- Location: e2e\apparel_regression_testing.spec.ts:458:7

# Error details

```
TimeoutError: locator.click: Timeout 30000ms exceeded.
Call log:
  - waiting for locator('text="WH-CMB"').first()
    - locator resolved to <span class="sapMInputHighlight">WH-CMB</span>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is not visible
    - retrying click action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and stable
      - element is not visible
    - retrying click action
      - waiting 100ms
    23 × waiting for element to be visible, enabled and stable
       - element is not visible
     - retrying click action
       - waiting 500ms
    - waiting for element to be visible, enabled and stable

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
  21 |       // Get all rows and select the last one (newly added)
  22 |       const allRows = this.page.locator('tr[id*="innerTableRow"]');
  23 |       const rowCount = await allRows.count();
  24 |       const lastRow = allRows.nth(rowCount - 1);
  25 | 
  26 |       // Fill Route Code (first text input in the row)
  27 |       const routeCodeInput = lastRow.locator('input[type="text"]').nth(0);
  28 |       await routeCodeInput.fill(detail.routeCode);
  29 | 
  30 |       // Fill Route Name (second text input in the row)
  31 |       const routeNameInput = lastRow.locator('input[type="text"]').nth(1);
  32 |       await routeNameInput.fill(detail.routeName);
  33 | 
  34 |       // Fill Warehouse (dropdown with value help)
  35 |       const warehouseInput = lastRow.locator('input[role="combobox"]');
  36 |       await warehouseInput.fill(detail.warehouse);
  37 |       await this.page.waitForTimeout(500);
  38 | 
  39 |       // Click the value help button to open dropdown
  40 |       const valueHelpButton = lastRow.locator('span[aria-label="Show Value Help"]');
  41 |       await valueHelpButton.click();
  42 |       await this.page.waitForLoadState('networkidle');
  43 | 
  44 |       // Select the warehouse from dropdown
  45 |       const warehouseOption = this.page.locator(`text="${detail.warehouse}"`).first();
> 46 |       await warehouseOption.click();
     |                             ^ TimeoutError: locator.click: Timeout 30000ms exceeded.
  47 |       await this.page.waitForLoadState('networkidle');
  48 | 
  49 |       console.log(`Filled routing plan detail row ${i + 1}: ${detail.routeCode} - ${detail.routeName} - ${detail.warehouse}`);
  50 |     }
  51 |   }
  52 | }
  53 | 
```