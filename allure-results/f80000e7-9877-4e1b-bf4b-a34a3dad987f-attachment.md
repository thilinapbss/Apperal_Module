# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: apparel_regression_testing.spec.ts >> Apperal Module | Regression Test Suite >> 36. Fill Routing Plan Detail Rows
- Location: e2e\apparel_regression_testing.spec.ts:458:7

# Error details

```
TimeoutError: locator.waitFor: Timeout 10000ms exceeded.
Call log:
  - waiting for locator('tr[id*="innerTableRow"]').first() to be visible
    18 × locator resolved to hidden <tr role="row" tabindex="-1" aria-rowindex="2" aria-current="true" data-sap-ui-render="" aria-selected="false" id="apperal.routingplan::RoutingPlansList--fe::table::RoutingPlans::LineItem-innerTableRow-__clone11" data-sap-ui="apperal.routingplan::RoutingPlansList--fe::table::RoutingPlans::LineItem-innerTableRow-__clone11" class="sapMLIB sapMLIB-CTX sapMLIBShowSeparator sapMLIBTypeNavigation sapMLIBActionable sapMLIBHoverable sapMLIBFocusable sapMTableRowCustomFocus sapMListTblRow">…</tr>

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
  19 |       await this.page.waitForTimeout(2000);
  20 | 
  21 |       // Get all rows and select the first one (newly added row appears at top)
  22 |       const allRows = this.page.locator('tr[id*="innerTableRow"]');
> 23 |       await allRows.first().waitFor({ state: 'visible', timeout: 10000 });
     |                             ^ TimeoutError: locator.waitFor: Timeout 10000ms exceeded.
  24 |       const firstRow = allRows.first();
  25 | 
  26 |       // Wait for inputs to be visible and enabled
  27 |       const routeCodeInput = firstRow.locator('input[type="text"]').first();
  28 |       await routeCodeInput.waitFor({ state: 'visible', timeout: 10000 });
  29 |       await this.page.waitForTimeout(500);
  30 | 
  31 |       // Fill Route Code
  32 |       await routeCodeInput.fill(detail.routeCode);
  33 |       await this.page.waitForTimeout(300);
  34 | 
  35 |       // Fill Route Name (second text input in the row)
  36 |       const routeNameInput = firstRow.locator('input[type="text"]').nth(1);
  37 |       await routeNameInput.waitFor({ state: 'visible', timeout: 5000 });
  38 |       await routeNameInput.fill(detail.routeName);
  39 |       await this.page.waitForTimeout(300);
  40 | 
  41 |       // Fill Warehouse (dropdown with value help)
  42 |       const warehouseInput = firstRow.locator('input[role="combobox"]');
  43 |       await warehouseInput.waitFor({ state: 'visible', timeout: 5000 });
  44 |       await warehouseInput.fill(detail.warehouse);
  45 |       await this.page.waitForTimeout(500);
  46 | 
  47 |       // Click the value help button to open dropdown
  48 |       const valueHelpButton = firstRow.locator('span[aria-label="Show Value Help"]');
  49 |       await valueHelpButton.click();
  50 |       await this.page.waitForLoadState('networkidle');
  51 |       await this.page.waitForTimeout(1000);
  52 | 
  53 |       // Select the warehouse from dropdown
  54 |       const warehouseOption = this.page.locator(`text="${detail.warehouse}"`).first();
  55 |       await warehouseOption.click();
  56 |       await this.page.waitForLoadState('networkidle');
  57 |       await this.page.waitForTimeout(500);
  58 | 
  59 |       console.log(`Filled routing plan detail row ${i + 1}: ${detail.routeCode} - ${detail.routeName} - ${detail.warehouse}`);
  60 |     }
  61 |   }
  62 | }
  63 | 
```