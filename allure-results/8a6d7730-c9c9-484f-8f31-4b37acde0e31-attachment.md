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
    48 × waiting for element to be visible, enabled and stable
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
      |                                      ^ Error: locator.click: Target page, context or browser has been closed
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
  63  |   async selectSemifinishedGoodsForAllRows(rowCount: number) {
  64  |     console.log('\n📝 STEP 2: Line by line selecting Semifinished Goods...\n');
  65  | 
  66  |     for (let i = 0; i < rowCount; i++) {
  67  |       console.log(`   [${i + 1}/${rowCount}] Selecting Semifinished Goods for row...`);
  68  |       await this.selectSemifinishedGoodsForRow();
  69  |       await this.page.waitForTimeout(1200);
  70  |     }
  71  | 
  72  |     console.log(`\n✓ Semifinished Goods selected for all ${rowCount} rows\n`);
  73  |   }
  74  | 
  75  |   async captureAndSaveFormData(filePath: string) {
  76  |     const fs = require('fs');
  77  |     const path = require('path');
  78  | 
  79  |     // Capture routing plan header data
  80  |     const routingPlanNameInput = this.page.locator('input[id*="RoutingPlanName::Field-edit-inner"]');
  81  |     const statusInput = this.page.locator('input[id*="Status::Field-edit-inner-inner"]');
  82  |     const routingPlanCodeDisplay = this.page.locator('[id*="DataField::Code::Field-display"]');
  83  | 
  84  |     const routingPlanName = await routingPlanNameInput.inputValue().catch(() => '');
  85  |     const status = await statusInput.inputValue().catch(() => '');
  86  |     const routingPlanCode = await routingPlanCodeDisplay.textContent().catch(() => '');
  87  | 
  88  |     // Capture detail rows from the table
  89  |     const detailRows = [];
  90  |     const tableRows = this.page.locator('tr[id*="innerTableRow"]');
  91  |     const rowCount = await tableRows.count();
  92  | 
  93  |     for (let i = 0; i < rowCount; i++) {
  94  |       const row = tableRows.nth(i);
  95  | 
  96  |       // Get text inputs for route code and name
  97  |       const inputs = row.locator('input[type="text"]');
  98  |       const inputCount = await inputs.count();
  99  | 
  100 |       if (inputCount >= 2) {
  101 |         const routeCode = await inputs.nth(0).inputValue().catch(() => '');
  102 |         const routeName = await inputs.nth(1).inputValue().catch(() => '');
  103 | 
  104 |         // Get warehouse code from combobox
  105 |         const warehouseCode = await row.locator('input[role="combobox"]').inputValue().catch(() => '');
  106 | 
  107 |         if (routeCode) {
  108 |           detailRows.push({
  109 |             routeCode: routeCode,
  110 |             routeName: routeName,
  111 |             warehouse: warehouseCode
  112 |           });
  113 |         }
  114 |       }
  115 |     }
  116 | 
  117 |     // Create the data structure
  118 |     const formData = {
  119 |       routingPlanName: routingPlanName.trim(),
  120 |       routingPlanCode: routingPlanCode?.trim() || '',
  121 |       status: status,
  122 |       details: detailRows
  123 |     };
  124 | 
  125 |     // Ensure directory exists
  126 |     const dir = path.dirname(filePath);
  127 |     if (!fs.existsSync(dir)) {
  128 |       fs.mkdirSync(dir, { recursive: true });
  129 |     }
  130 | 
  131 |     // Save to file
  132 |     fs.writeFileSync(filePath, JSON.stringify(formData, null, 2), 'utf-8');
  133 |     console.log(`Routing plan data captured and saved to ${filePath}`);
  134 |   }
  135 | 
  136 |   async selectSemifinishedGoodsForRow(rowIndex: number = 0) {
  137 |     console.log(`📝 Selecting 1st item from Semifinished Goods for FIRST row...`);
  138 | 
  139 |     // Always select from the FIRST (TOP) row of the table, not by index
  140 |     // Get the first visible row in the routing plan details table
  141 |     const row = this.page.locator('tr[id*="RotingPlanDetails-innerTableRow"]').first();
  142 | 
  143 |     // Find the SemifinishedGoods column cell and click its value help button
  144 |     // The value help button is the last span with -vhi in the SemifinishedGoods cell
  145 |     const semiFinishedGoodsCell = row.locator('td[data-sap-ui-column*="SemifinishedGoods-innerColumn"]');
```