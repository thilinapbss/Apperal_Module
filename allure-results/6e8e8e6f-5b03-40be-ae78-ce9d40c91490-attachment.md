# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: apparel_regression_testing.spec.ts >> Apperal Module | Regression Test Suite >> 36. Fill Routing Plan Detail Rows
- Location: e2e\apparel_regression_testing.spec.ts:458:7

# Error details

```
TimeoutError: locator.waitFor: Timeout 5000ms exceeded.
Call log:
  - waiting for locator('tr[id*="innerTableRow"]').first() to be visible
    14 × locator resolved to hidden <tr role="row" tabindex="-1" aria-rowindex="2" aria-current="true" data-sap-ui-render="" aria-selected="false" id="apperal.routingplan::RoutingPlansList--fe::table::RoutingPlans::LineItem-innerTableRow-__clone19" data-sap-ui="apperal.routingplan::RoutingPlansList--fe::table::RoutingPlans::LineItem-innerTableRow-__clone19" class="sapMLIB sapMLIB-CTX sapMLIBShowSeparator sapMLIBTypeNavigation sapMLIBActionable sapMLIBHoverable sapMLIBFocusable sapMTableRowCustomFocus sapMListTblRow">…</tr>

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
  13 |     // Step 1: Click Create button multiple times to add all rows
  14 |     console.log(`Creating ${details.length} new rows...`);
  15 |     for (let i = 0; i < details.length; i++) {
  16 |       await this.createDetailButton.click();
  17 |       await this.page.waitForLoadState('networkidle');
  18 |       await this.page.waitForTimeout(800);
  19 |     }
  20 |     await this.page.waitForTimeout(1000);
  21 | 
  22 |     // Step 2: Fill each row with data one by one
  23 |     for (let i = 0; i < details.length; i++) {
  24 |       const detail = details[i];
  25 | 
  26 |       // Get all rows and select the one to fill (i-th row from the end, since new rows appear at top)
  27 |       const allRows = this.page.locator('tr[id*="innerTableRow"]');
  28 |       const rowIndex = i; // Fill from first row (newly added rows)
  29 |       const currentRow = allRows.nth(rowIndex);
  30 | 
  31 |       // Wait for row to be visible
> 32 |       await currentRow.waitFor({ state: 'visible', timeout: 5000 });
     |                        ^ TimeoutError: locator.waitFor: Timeout 5000ms exceeded.
  33 |       await this.page.waitForTimeout(300);
  34 | 
  35 |       // Fill Route Code (first text input in the row)
  36 |       const routeCodeInput = currentRow.locator('input[type="text"]').nth(0);
  37 |       await routeCodeInput.waitFor({ state: 'visible', timeout: 5000 });
  38 |       await routeCodeInput.fill(detail.routeCode);
  39 |       await this.page.waitForTimeout(300);
  40 | 
  41 |       // Fill Route Name (second text input in the row)
  42 |       const routeNameInput = currentRow.locator('input[type="text"]').nth(1);
  43 |       await routeNameInput.waitFor({ state: 'visible', timeout: 5000 });
  44 |       await routeNameInput.fill(detail.routeName);
  45 |       await this.page.waitForTimeout(300);
  46 | 
  47 |       // Fill Warehouse (dropdown with value help)
  48 |       const warehouseInput = currentRow.locator('input[role="combobox"]');
  49 |       await warehouseInput.waitFor({ state: 'visible', timeout: 5000 });
  50 |       await warehouseInput.fill(detail.warehouse);
  51 |       await this.page.waitForTimeout(500);
  52 | 
  53 |       // Click the value help button to open dropdown
  54 |       const valueHelpButton = currentRow.locator('span[aria-label="Show Value Help"]');
  55 |       await valueHelpButton.click();
  56 |       await this.page.waitForLoadState('networkidle');
  57 |       await this.page.waitForTimeout(800);
  58 | 
  59 |       // Select the warehouse from dropdown
  60 |       const warehouseOption = this.page.locator(`text="${detail.warehouse}"`).first();
  61 |       await warehouseOption.click();
  62 |       await this.page.waitForLoadState('networkidle');
  63 |       await this.page.waitForTimeout(500);
  64 | 
  65 |       console.log(`Filled routing plan detail row ${i + 1}: ${detail.routeCode} - ${detail.routeName} - ${detail.warehouse}`);
  66 |     }
  67 |   }
  68 | }
  69 | 
```