# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: apparel_regression_testing.spec.ts >> Apperal Module | Regression Test Suite >> 53. Fill Style Master Form and Save
- Location: e2e\apparel_regression_testing.spec.ts:691:7

# Error details

```
TimeoutError: locator.waitFor: Timeout 10000ms exceeded.
Call log:
  - waiting for locator('tbody[id*="SuggestTable-tblBody"]') to be visible
    23 × locator resolved to hidden <tbody class="sapMListItems sapMTableTBody" id="apperal.stylemaster::StyleMasterObjectPage--fe::FormContainer::GeneralInfo::FieldValueHelp::Departments::Popover::qualifier::::SuggestTable-tblBody">…</tbody>

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
  8  |   readonly customerValueHelpButton: Locator;
  9  |   readonly customerDropdownTable: Locator;
  10 |   readonly customerTableBody: Locator;
  11 | 
  12 |   constructor(page: Page) {
  13 |     this.page = page;
  14 |     this.departmentsValueHelpButton = page.locator('span[id*="DataField::Departments::Field-edit-inner-vhi"]');
  15 |     this.departmentsDropdownTable = page.locator('table[id*="SuggestTable-listUl"]');
  16 |     this.departmentsTableBody = page.locator('tbody[id*="SuggestTable-tblBody"]');
  17 |     this.customerValueHelpButton = page.locator('span[id*="DataField::Customer::Field-edit-inner-vhi"]');
  18 |     this.customerDropdownTable = page.locator('table[id*="SuggestTable-listUl"]');
  19 |     this.customerTableBody = page.locator('tbody[id*="SuggestTable-tblBody"]');
  20 |   }
  21 | 
  22 |   async waitForFormLoad() {
  23 |     await this.departmentsValueHelpButton.waitFor({ state: 'visible', timeout: 30000 });
  24 |   }
  25 | 
  26 |   async clickDepartmentsValueHelp() {
  27 |     await this.departmentsValueHelpButton.click();
  28 |     await this.page.waitForLoadState('networkidle');
  29 |   }
  30 | 
  31 |   async waitForDropdownLoad() {
  32 |     await this.departmentsTableBody.waitFor({ state: 'visible', timeout: 10000 });
  33 |   }
  34 | 
  35 |   async selectDepartmentByRoutingPlan(routingPlanName: string) {
  36 |     // Find the row containing the routing plan name and click it
  37 |     const matchingRow = this.departmentsTableBody.locator(
  38 |       `tr[role="row"]:has(span:text("${routingPlanName}"))`
  39 |     );
  40 |     await matchingRow.click();
  41 |     await this.page.waitForLoadState('networkidle');
  42 |   }
  43 | 
  44 |   async selectFirstDepartment() {
  45 |     // Click the first row in the dropdown table
  46 |     const firstRow = this.departmentsTableBody.locator('tr[role="row"]').first();
  47 |     await firstRow.click();
  48 |     await this.page.waitForLoadState('networkidle');
  49 |   }
  50 | 
  51 |   async clickCustomerValueHelp() {
  52 |     await this.customerValueHelpButton.click();
  53 |     await this.page.waitForLoadState('networkidle');
  54 |   }
  55 | 
  56 |   async waitForCustomerDropdownLoad() {
> 57 |     await this.customerTableBody.waitFor({ state: 'visible', timeout: 10000 });
     |                                  ^ TimeoutError: locator.waitFor: Timeout 10000ms exceeded.
  58 |   }
  59 | 
  60 |   async selectCustomerByName(customerName: string) {
  61 |     // Find the row containing the customer name and click it
  62 |     const matchingRow = this.customerTableBody.locator(
  63 |       `tr[role="row"]:has(span:text("${customerName}"))`
  64 |     );
  65 |     await matchingRow.click();
  66 |     await this.page.waitForLoadState('networkidle');
  67 |   }
  68 | 
  69 |   async selectFirstCustomer() {
  70 |     // Click the first row in the dropdown table
  71 |     const firstRow = this.customerTableBody.locator('tr[role="row"]').first();
  72 |     await firstRow.click();
  73 |     await this.page.waitForLoadState('networkidle');
  74 |   }
  75 | }
  76 | 
```