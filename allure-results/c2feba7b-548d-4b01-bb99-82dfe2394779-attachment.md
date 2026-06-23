# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: apparel_regression_testing.spec.ts >> Apperal Module | Regression Test Suite >> 36. Fill Routing Plan Detail Rows
- Location: e2e\apparel_regression_testing.spec.ts:561:7

# Error details

```
Error: locator.click: Target page, context or browser has been closed
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
    24 × waiting for element to be visible, enabled and stable
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
  13  |     for (let i = 0; i < details.length; i++) {
  14  |       console.log(`\n📝 Filling Row ${i + 1}/${details.length}...`);
  15  | 
  16  |       // Click Create button to add a new row
  17  |       await this.createDetailButton.click();
  18  |       await this.page.waitForLoadState('networkidle');
  19  |       await this.page.waitForTimeout(2000);
  20  | 
  21  |       // Get the most recently created row inputs (new rows are added to the TOP of the table)
  22  |       // Using .first() ensures we always get the topmost row which is the newly created one
  23  |       const codeInput = this.page.locator("td[data-sap-ui-column*='DepartmentCode-innerColumn'] input").first();
  24  |       const nameInput = this.page.locator("td[data-sap-ui-column*='DepartmentName-innerColumn'] input").first();
  25  |       const warehouseInput = this.page.locator("td[data-sap-ui-column*='warehouse-innerColumn'] input").first();
  26  | 
  27  |       // Fill Route Code
  28  |       console.log(`   Filling Route Code: ${details[i].routeCode}`);
  29  |       await codeInput.pressSequentially(details[i].routeCode, { delay: 50 });
  30  |       await this.page.keyboard.press('Tab');
  31  |       await this.page.waitForTimeout(300);
  32  | 
  33  |       // Fill Route Name
  34  |       console.log(`   Filling Route Name: ${details[i].routeName}`);
  35  |       await nameInput.pressSequentially(details[i].routeName, { delay: 50 });
  36  |       await this.page.keyboard.press('Tab');
  37  |       await this.page.waitForTimeout(300);
  38  | 
  39  |       // Fill Warehouse
  40  |       console.log(`   Filling Warehouse: ${details[i].warehouse}`);
  41  |       await warehouseInput.fill(details[i].warehouse);
  42  |       await this.page.waitForTimeout(300);
  43  | 
  44  |       // Click value help button to open dropdown for warehouse
> 45  |       const warehouseValueHelpButton = this.page.locator('span[aria-label="Show Value Help"]').nth(1);
      |                                      ^ Error: locator.click: Target page, context or browser has been closed
  46  |       await warehouseValueHelpButton.click();
  47  |       await this.page.waitForLoadState('networkidle');
  48  |       await this.page.waitForTimeout(800);
  49  | 
  50  |       // Wait for the dropdown table to be attached to DOM
  51  |       const tableBody = this.page.locator('tbody[id*="SuggestTable-tblBody"]');
  52  |       await tableBody.waitFor({ state: 'attached', timeout: 10000 });
  53  |       await this.page.waitForTimeout(500);
  54  | 
  55  |       // Find and click the warehouse option in the table by finding the span with warehouse code
  56  |       const warehouseOptionRow = this.page.locator(`//span[text()="${details[i].warehouse}"]/ancestor::tr[@role="row"]`);
  57  |       await this.page.waitForLoadState('networkidle');
  58  |       await this.page.waitForTimeout(500);
  59  | 
  60  |       console.log(`   ✓ Row ${i + 1} data filled: ${details[i].routeCode} - ${details[i].routeName} - ${details[i].warehouse}`);
  61  | 
  62  |       // NOW SELECT SEMIFINISHED GOODS FOR THIS ROW
  63  |       console.log(`   📝 Selecting Semifinished Goods for Row ${i + 1}...`);
  64  |       await this.selectSemifinishedGoodsForRow();
  65  |       await this.page.waitForTimeout(1000);
  66  | 
  67  |       console.log(`✓ Row ${i + 1} completed with Semifinished Goods selected`);
  68  |     }
  69  |   }
  70  | 
  71  |   async captureAndSaveFormData(filePath: string) {
  72  |     const fs = require('fs');
  73  |     const path = require('path');
  74  | 
  75  |     // Capture routing plan header data
  76  |     const routingPlanNameInput = this.page.locator('input[id*="RoutingPlanName::Field-edit-inner"]');
  77  |     const statusInput = this.page.locator('input[id*="Status::Field-edit-inner-inner"]');
  78  |     const routingPlanCodeDisplay = this.page.locator('[id*="DataField::Code::Field-display"]');
  79  | 
  80  |     const routingPlanName = await routingPlanNameInput.inputValue().catch(() => '');
  81  |     const status = await statusInput.inputValue().catch(() => '');
  82  |     const routingPlanCode = await routingPlanCodeDisplay.textContent().catch(() => '');
  83  | 
  84  |     // Capture detail rows from the table
  85  |     const detailRows = [];
  86  |     const tableRows = this.page.locator('tr[id*="innerTableRow"]');
  87  |     const rowCount = await tableRows.count();
  88  | 
  89  |     for (let i = 0; i < rowCount; i++) {
  90  |       const row = tableRows.nth(i);
  91  | 
  92  |       // Get text inputs for route code and name
  93  |       const inputs = row.locator('input[type="text"]');
  94  |       const inputCount = await inputs.count();
  95  | 
  96  |       if (inputCount >= 2) {
  97  |         const routeCode = await inputs.nth(0).inputValue().catch(() => '');
  98  |         const routeName = await inputs.nth(1).inputValue().catch(() => '');
  99  | 
  100 |         // Get warehouse code from combobox
  101 |         const warehouseCode = await row.locator('input[role="combobox"]').inputValue().catch(() => '');
  102 | 
  103 |         if (routeCode) {
  104 |           detailRows.push({
  105 |             routeCode: routeCode,
  106 |             routeName: routeName,
  107 |             warehouse: warehouseCode
  108 |           });
  109 |         }
  110 |       }
  111 |     }
  112 | 
  113 |     // Create the data structure
  114 |     const formData = {
  115 |       routingPlanName: routingPlanName.trim(),
  116 |       routingPlanCode: routingPlanCode?.trim() || '',
  117 |       status: status,
  118 |       details: detailRows
  119 |     };
  120 | 
  121 |     // Ensure directory exists
  122 |     const dir = path.dirname(filePath);
  123 |     if (!fs.existsSync(dir)) {
  124 |       fs.mkdirSync(dir, { recursive: true });
  125 |     }
  126 | 
  127 |     // Save to file
  128 |     fs.writeFileSync(filePath, JSON.stringify(formData, null, 2), 'utf-8');
  129 |     console.log(`Routing plan data captured and saved to ${filePath}`);
  130 |   }
  131 | 
  132 |   async selectSemifinishedGoodsForRow(rowIndex: number = 0) {
  133 |     console.log(`📝 Selecting 1st item from Semifinished Goods for FIRST row...`);
  134 | 
  135 |     // Always select from the FIRST (TOP) row of the table, not by index
  136 |     // Get the first visible row in the routing plan details table
  137 |     const row = this.page.locator('tr[id*="RotingPlanDetails-innerTableRow"]').first();
  138 | 
  139 |     // Find the SemifinishedGoods column cell and click its value help button
  140 |     // The value help button is the last span with -vhi in the SemifinishedGoods cell
  141 |     const semiFinishedGoodsCell = row.locator('td[data-sap-ui-column*="SemifinishedGoods-innerColumn"]');
  142 |     const valueHelpButton = semiFinishedGoodsCell.locator('span[id*="-vhi"][aria-label="Show Value Help"]');
  143 | 
  144 |     console.log(`   Clicking value help button for Semifinished Goods in row ${rowIndex + 1}...`);
  145 |     await valueHelpButton.click({ force: true });
```