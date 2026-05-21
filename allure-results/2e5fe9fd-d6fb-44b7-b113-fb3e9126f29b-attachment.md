# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: apparel_regression_testing.spec.ts >> Apperal Module | Regression Test Suite >> 53. Fill Style Master Form and Save
- Location: e2e\apparel_regression_testing.spec.ts:690:7

# Error details

```
TimeoutError: locator.waitFor: Timeout 30000ms exceeded.
Call log:
  - waiting for locator('span[id*="DataField::Departments::Field-edit-inner-vhi"]') to be visible

```

# Test source

```ts
  1  | import { Page, Locator } from '@playwright/test';
  2  | 
  3  | export class StyleMasterCreate {
  4  |   readonly page: Page;
  5  |   readonly departmentsValueHelpButton: Locator;
  6  |   readonly departmentsDropdownTable: Locator;
  7  |   readonly departmentsTableBody: Locator;
  8  | 
  9  |   constructor(page: Page) {
  10 |     this.page = page;
  11 |     this.departmentsValueHelpButton = page.locator('span[id*="DataField::Departments::Field-edit-inner-vhi"]');
  12 |     this.departmentsDropdownTable = page.locator('table[id*="SuggestTable-listUl"]');
  13 |     this.departmentsTableBody = page.locator('tbody[id*="SuggestTable-tblBody"]');
  14 |   }
  15 | 
  16 |   async waitForFormLoad() {
> 17 |     await this.departmentsValueHelpButton.waitFor({ state: 'visible', timeout: 30000 });
     |                                           ^ TimeoutError: locator.waitFor: Timeout 30000ms exceeded.
  18 |   }
  19 | 
  20 |   async clickDepartmentsValueHelp() {
  21 |     await this.departmentsValueHelpButton.click();
  22 |     await this.page.waitForLoadState('networkidle');
  23 |   }
  24 | 
  25 |   async waitForDropdownLoad() {
  26 |     await this.departmentsTableBody.waitFor({ state: 'visible', timeout: 10000 });
  27 |   }
  28 | 
  29 |   async selectDepartmentByRoutingPlan(routingPlanName: string) {
  30 |     // Find the row containing the routing plan name and click it
  31 |     const matchingRow = this.departmentsTableBody.locator(
  32 |       `tr[role="row"]:has(span:text("${routingPlanName}"))`
  33 |     );
  34 |     await matchingRow.click();
  35 |     await this.page.waitForLoadState('networkidle');
  36 |   }
  37 | 
  38 |   async selectFirstDepartment() {
  39 |     // Click the first row in the dropdown table
  40 |     const firstRow = this.departmentsTableBody.locator('tr[role="row"]').first();
  41 |     await firstRow.click();
  42 |     await this.page.waitForLoadState('networkidle');
  43 |   }
  44 | }
  45 | 
```