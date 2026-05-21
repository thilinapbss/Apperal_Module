# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: apparel_regression_testing.spec.ts >> Apperal Module | Regression Test Suite >> 53. Fill Style Master Form and Save
- Location: e2e\apparel_regression_testing.spec.ts:695:7

# Error details

```
TimeoutError: locator.waitFor: Timeout 10000ms exceeded.
Call log:
  - waiting for locator('div[id*="FieldValueHelp::Customer::Dialog"][id*="pop"]').locator('tbody')

```

# Test source

```ts
  1   | import { Page, Locator } from '@playwright/test';
  2   | 
  3   | export class StyleMasterCreate {
  4   |   readonly page: Page;
  5   |   readonly departmentsValueHelpButton: Locator;
  6   |   readonly departmentsDropdownTable: Locator;
  7   |   readonly departmentsTableBody: Locator;
  8   |   readonly customerValueHelpButton: Locator;
  9   |   readonly customerDialog: Locator;
  10  |   readonly customerTableBody: Locator;
  11  | 
  12  |   constructor(page: Page) {
  13  |     this.page = page;
  14  |     this.departmentsValueHelpButton = page.locator('span[id*="DataField::Departments::Field-edit-inner-vhi"]');
  15  |     this.departmentsDropdownTable = page.locator('table[id*="SuggestTable-listUl"]');
  16  |     this.departmentsTableBody = page.locator('tbody[id*="SuggestTable-tblBody"]');
  17  |     this.customerValueHelpButton = page.locator('span[id*="DataField::Customer::Field-edit-inner-vhi"]');
  18  |     this.customerDialog = page.locator('div[id*="FieldValueHelp::Customer::Dialog"][id*="pop"]');
  19  |     this.customerTableBody = this.customerDialog.locator('tbody');
  20  |   }
  21  | 
  22  |   async waitForFormLoad() {
  23  |     try {
  24  |       await this.departmentsValueHelpButton.waitFor({ state: 'visible', timeout: 30000 });
  25  |     } catch (e) {
  26  |       const isAttached = await this.departmentsValueHelpButton.isVisible().catch(() => false);
  27  |       console.log(`Departments button visible: ${isAttached}`);
  28  |       console.log(`Current URL: ${this.page.url()}`);
  29  |       throw e;
  30  |     }
  31  |   }
  32  | 
  33  |   async clickDepartmentsValueHelp() {
  34  |     await this.departmentsValueHelpButton.click();
  35  |     await this.page.waitForLoadState('networkidle');
  36  |   }
  37  | 
  38  |   async waitForDropdownLoad() {
  39  |     await this.departmentsTableBody.waitFor({ state: 'attached', timeout: 10000 });
  40  |     await this.page.waitForTimeout(500);
  41  |   }
  42  | 
  43  |   async selectDepartmentByRoutingPlan(routingPlanName: string) {
  44  |     // Find the row containing the routing plan name and click it
  45  |     const matchingRow = this.departmentsTableBody.locator(
  46  |       `tr[role="row"]:has(span:text("${routingPlanName}"))`
  47  |     );
  48  |     await matchingRow.click();
  49  |     await this.page.waitForLoadState('networkidle');
  50  |   }
  51  | 
  52  |   async selectFirstDepartment() {
  53  |     // Click the first row in the dropdown table
  54  |     const firstRow = this.departmentsTableBody.locator('tr[role="row"]').first();
  55  |     await firstRow.click();
  56  |     await this.page.waitForLoadState('networkidle');
  57  |   }
  58  | 
  59  |   async clickCustomerValueHelp() {
  60  |     await this.customerValueHelpButton.click();
  61  |     await this.page.waitForLoadState('networkidle');
  62  |   }
  63  | 
  64  |   async waitForCustomerDropdownLoad() {
> 65  |     await this.customerTableBody.waitFor({ state: 'attached', timeout: 10000 });
      |                                  ^ TimeoutError: locator.waitFor: Timeout 10000ms exceeded.
  66  |     await this.page.waitForTimeout(500);
  67  |   }
  68  | 
  69  |   async selectCustomerByName(customerName: string) {
  70  |     // Find the row containing the customer name and click it
  71  |     const matchingRow = this.customerTableBody.locator(
  72  |       `tr[role="row"]:has(span:text("${customerName}"))`
  73  |     );
  74  |     await matchingRow.click();
  75  |     await this.page.waitForLoadState('networkidle');
  76  |   }
  77  | 
  78  |   async selectFirstCustomer() {
  79  |     // Click the first row in the dropdown table
  80  |     const firstRow = this.customerTableBody.locator('tr[role="row"]').first();
  81  |     await firstRow.click();
  82  |     await this.page.waitForLoadState('networkidle');
  83  |   }
  84  | 
  85  |   async selectRandomCustomer() {
  86  |     // Get all customer rows from the SAP UI5 ResponsiveTable inside the customer dialog
  87  |     // Use tbody rows with data-sap-ui-rowindex which are actual data rows
  88  |     const allRows = this.customerDialog.locator('tbody tr[data-sap-ui-rowindex]');
  89  |     const rowCount = await allRows.count();
  90  | 
  91  |     if (rowCount === 0) {
  92  |       throw new Error('No customer rows found in the customer dialog table');
  93  |     }
  94  | 
  95  |     // Select a random row (0 to rowCount-1)
  96  |     const randomIndex = Math.floor(Math.random() * rowCount);
  97  |     const randomRow = allRows.nth(randomIndex);
  98  | 
  99  |     await randomRow.click();
  100 |     await this.page.waitForLoadState('networkidle');
  101 |     console.log(`Selected customer at random index: ${randomIndex}`);
  102 |   }
  103 | }
  104 | 
```