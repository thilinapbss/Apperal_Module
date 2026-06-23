# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: apparel_regression_testing.spec.ts >> Apperal Module | Regression Test Suite >> 36. Fill Routing Plan Detail Rows
- Location: e2e\apparel_regression_testing.spec.ts:561:7

# Error details

```
TimeoutError: locator.click: Timeout 30000ms exceeded.
Call log:
  - waiting for locator('span[aria-label="Show Value Help"]').nth(1)
    - locator resolved to <span role="button" data-sap-ui-render="" aria-label="Show Value Help" data-sap-ui-icon-content="" class="sapUiIcon sapUiIconMirrorInRTL sapUiIconPointer sapMInputBaseIcon" id="apperal.routingplan::RoutingPlansList--fe::FilterBar::RoutingPlans::FilterField::RoutingPlanCode-inner-vhi" data-sap-ui="apperal.routingplan::RoutingPlansList--fe::FilterBar::RoutingPlans::FilterField::RoutingPlanCode-inner-vhi"></span>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is not visible
    - retrying click action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and stable
      - element is not visible
    - retrying click action
      - waiting 100ms
    57 × waiting for element to be visible, enabled and stable
       - element is not visible
     - retrying click action
       - waiting 500ms

```

# Test source

```ts
  1   | import { Page, Locator } from '@playwright/test';
  2   | 
  3   | export class RoutingPlanCreate {
  4   |   readonly page: Page;
  5   |   readonly createDetailButton: Locator;
  6   | 
  7   |   constructor(page: Page) {
  8   |     this.page = page;
  9   |     this.createDetailButton = page.locator('button[id*="RotingPlanDetails::StandardAction::Create"]');
  10  |   }
  11  | 
  12  |   async fillRoutingPlanDetailRows(details: { routeCode: string; routeName: string; warehouse: string }[]) {
  13  |     console.log('\n📝 STEP 1: Entering all data for all rows...\n');
  14  | 
  15  |     for (let i = 0; i < details.length; i++) {
  16  |       console.log(`   Filling Row ${i + 1}/${details.length}: ${details[i].routeCode} - ${details[i].routeName} - ${details[i].warehouse}`);
  17  | 
  18  |       // Click Create button to add a new row
  19  |       await this.createDetailButton.click();
  20  |       await this.page.waitForLoadState('networkidle');
  21  |       await this.page.waitForTimeout(2000);
  22  | 
  23  |       // Get the most recently created row inputs (new rows are added to the TOP of the table)
  24  |       // Using .first() ensures we always get the topmost row which is the newly created one
  25  |       const codeInput = this.page.locator("td[data-sap-ui-column*='DepartmentCode-innerColumn'] input").first();
  26  |       const nameInput = this.page.locator("td[data-sap-ui-column*='DepartmentName-innerColumn'] input").first();
  27  |       const warehouseInput = this.page.locator("td[data-sap-ui-column*='warehouse-innerColumn'] input").first();
  28  | 
  29  |       // Fill Route Code
  30  |       await codeInput.pressSequentially(details[i].routeCode, { delay: 50 });
  31  |       await this.page.keyboard.press('Tab');
  32  |       await this.page.waitForTimeout(300);
  33  | 
  34  |       // Fill Route Name
  35  |       await nameInput.pressSequentially(details[i].routeName, { delay: 50 });
  36  |       await this.page.keyboard.press('Tab');
  37  |       await this.page.waitForTimeout(300);
  38  | 
  39  |       // Fill Warehouse
  40  |       await warehouseInput.fill(details[i].warehouse);
  41  |       await this.page.waitForTimeout(300);
  42  | 
  43  |       // Click value help button to open dropdown for warehouse
  44  |       const warehouseValueHelpButton = this.page.locator('span[aria-label="Show Value Help"]').nth(1);
> 45  |       await warehouseValueHelpButton.click();
      |                                      ^ TimeoutError: locator.click: Timeout 30000ms exceeded.
  46  |       await this.page.waitForLoadState('networkidle');
  47  |       await this.page.waitForTimeout(800);
  48  | 
  49  |       // Wait for the dropdown table to be attached to DOM
  50  |       const tableBody = this.page.locator('tbody[id*="SuggestTable-tblBody"]');
  51  |       await tableBody.waitFor({ state: 'attached', timeout: 10000 });
  52  |       await this.page.waitForTimeout(500);
  53  | 
  54  |       // Find and click the warehouse option in the table by finding the span with warehouse code
  55  |       const warehouseOptionRow = this.page.locator(`//span[text()="${details[i].warehouse}"]/ancestor::tr[@role="row"]`);
  56  |       await this.page.waitForLoadState('networkidle');
  57  |       await this.page.waitForTimeout(500);
  58  |     }
  59  | 
  60  |     console.log(`\n✓ All ${details.length} rows completed with data filled\n`);
  61  |   }
  62  | 
  63  | 
  64  |   async captureAndSaveFormData(filePath: string) {
  65  |     const fs = require('fs');
  66  |     const path = require('path');
  67  | 
  68  |     // Capture routing plan header data
  69  |     const routingPlanNameInput = this.page.locator('input[id*="RoutingPlanName::Field-edit-inner"]');
  70  |     const statusInput = this.page.locator('input[id*="Status::Field-edit-inner-inner"]');
  71  |     const routingPlanCodeDisplay = this.page.locator('[id*="DataField::Code::Field-display"]');
  72  | 
  73  |     const routingPlanName = await routingPlanNameInput.inputValue().catch(() => '');
  74  |     const status = await statusInput.inputValue().catch(() => '');
  75  |     const routingPlanCode = await routingPlanCodeDisplay.textContent().catch(() => '');
  76  | 
  77  |     // Capture detail rows from the table
  78  |     const detailRows = [];
  79  |     const tableRows = this.page.locator('tr[id*="innerTableRow"]');
  80  |     const rowCount = await tableRows.count();
  81  | 
  82  |     for (let i = 0; i < rowCount; i++) {
  83  |       const row = tableRows.nth(i);
  84  | 
  85  |       // Get text inputs for route code and name
  86  |       const inputs = row.locator('input[type="text"]');
  87  |       const inputCount = await inputs.count();
  88  | 
  89  |       if (inputCount >= 2) {
  90  |         const routeCode = await inputs.nth(0).inputValue().catch(() => '');
  91  |         const routeName = await inputs.nth(1).inputValue().catch(() => '');
  92  | 
  93  |         // Get warehouse code from combobox
  94  |         const warehouseCode = await row.locator('input[role="combobox"]').inputValue().catch(() => '');
  95  | 
  96  |         if (routeCode) {
  97  |           detailRows.push({
  98  |             routeCode: routeCode,
  99  |             routeName: routeName,
  100 |             warehouse: warehouseCode
  101 |           });
  102 |         }
  103 |       }
  104 |     }
  105 | 
  106 |     // Create the data structure
  107 |     const formData = {
  108 |       routingPlanName: routingPlanName.trim(),
  109 |       routingPlanCode: routingPlanCode?.trim() || '',
  110 |       status: status,
  111 |       details: detailRows
  112 |     };
  113 | 
  114 |     // Ensure directory exists
  115 |     const dir = path.dirname(filePath);
  116 |     if (!fs.existsSync(dir)) {
  117 |       fs.mkdirSync(dir, { recursive: true });
  118 |     }
  119 | 
  120 |     // Save to file
  121 |     fs.writeFileSync(filePath, JSON.stringify(formData, null, 2), 'utf-8');
  122 |     console.log(`Routing plan data captured and saved to ${filePath}`);
  123 |   }
  124 | 
  125 |   async selectSemifinishedGoodsForRow(rowIndex: number = 0) {
  126 |     console.log(`📝 Selecting 1st item from Semifinished Goods for FIRST row...`);
  127 | 
  128 |     // Always select from the FIRST (TOP) row of the table, not by index
  129 |     // Get the first visible row in the routing plan details table
  130 |     const row = this.page.locator('tr[id*="RotingPlanDetails-innerTableRow"]').first();
  131 | 
  132 |     // Find the SemifinishedGoods column cell and click its value help button
  133 |     // The value help button is the last span with -vhi in the SemifinishedGoods cell
  134 |     const semiFinishedGoodsCell = row.locator('td[data-sap-ui-column*="SemifinishedGoods-innerColumn"]');
  135 |     const valueHelpButton = semiFinishedGoodsCell.locator('span[id*="-vhi"][aria-label="Show Value Help"]');
  136 | 
  137 |     console.log(`   Clicking value help button for Semifinished Goods in row ${rowIndex + 1}...`);
  138 |     await valueHelpButton.click({ force: true });
  139 |     await this.page.waitForLoadState('networkidle');
  140 |     await this.page.waitForTimeout(1200);
  141 | 
  142 |     // Wait for the dropdown suggestion table to appear
  143 |     const suggestTableContainer = this.page.locator('div[id*="SuggestTable"][id*="Popover"]');
  144 |     await suggestTableContainer.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
  145 | 
```