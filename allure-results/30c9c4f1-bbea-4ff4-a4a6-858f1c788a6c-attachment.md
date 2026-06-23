# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: apparel_regression_testing.spec.ts >> Apperal Module | Regression Test Suite >> 37. Save Routing Plan
- Location: e2e\apparel_regression_testing.spec.ts:587:7

# Error details

```
Error: locator.count: Target page, context or browser has been closed
```

# Test source

```ts
  1   | import { Page, Locator } from '@playwright/test';
  2   | 
  3   | export class RoutingPlanCreate {
  4   |   readonly page: Page;
  5   |   readonly createDetailButton: Locator;
  6   |   readonly saveButton: Locator;
  7   | 
  8   |   constructor(page: Page) {
  9   |     this.page = page;
  10  |     this.createDetailButton = page.locator('button[id*="RotingPlanDetails::StandardAction::Create"]');
  11  |     this.saveButton = page.locator('button[id*="FooterBar::StandardAction::Save"]');
  12  |   }
  13  | 
  14  |   async fillRoutingPlanDetailRows(details: { routeCode: string; routeName: string; warehouse: string; SemifinishedGood: string }[]) {
  15  |     console.log('\n📝 STEP 1: Creating rows and filling data...\n');
  16  | 
  17  |     for (let i = 0; i < details.length; i++) {
  18  |       console.log(`[Row ${i + 1}/${details.length}] Click Create button...`);
  19  |       await this.createDetailButton.click();
  20  |       await this.page.waitForLoadState('networkidle');
  21  |       await this.page.waitForTimeout(2500);
  22  | 
  23  |       const tbody = this.page.locator('tbody[id*="RotingPlanDetails-innerTable-tblBody"]');
  24  |       const newRow = tbody.locator('tr[id*="innerTableRow"]').first();
  25  | 
  26  |       console.log(`[Row ${i + 1}] Fill Route Code: ${details[i].routeCode}`);
  27  |       const codeCell = newRow.locator('td[data-sap-ui-column*="DepartmentCode-innerColumn"]');
  28  |       const codeInput = codeCell.locator('input[type="text"]');
  29  |       await codeInput.fill(details[i].routeCode);
  30  |       await this.page.waitForTimeout(300);
  31  | 
  32  |       console.log(`[Row ${i + 1}] Fill Route Name: ${details[i].routeName}`);
  33  |       const nameCell = newRow.locator('td[data-sap-ui-column*="DepartmentName-innerColumn"]');
  34  |       const nameInput = nameCell.locator('input[type="text"]');
  35  |       await nameInput.fill(details[i].routeName);
  36  |       await this.page.waitForTimeout(300);
  37  | 
  38  |       console.log(`[Row ${i + 1}] Fill Warehouse: ${details[i].warehouse}`);
  39  |       const warehouseCell = newRow.locator('td[data-sap-ui-column*="warehouse-innerColumn"]');
  40  |       const warehouseInput = warehouseCell.locator('input[role="combobox"]');
  41  |       await warehouseInput.fill(details[i].warehouse);
  42  |       await this.page.waitForTimeout(300);
  43  | 
  44  |       // Press Enter or Tab to confirm warehouse selection instead of clicking dropdown
  45  |       await this.page.keyboard.press('Enter');
  46  |       await this.page.waitForTimeout(800);
  47  | 
  48  |       // Fill Semifinished Good field
  49  |       console.log(`[Row ${i + 1}] Fill Semifinished Good: ${details[i].SemifinishedGood}`);
  50  |       const semifinishedCell = newRow.locator('td[data-sap-ui-column*="SemifinishedGoods-innerColumn"]');
  51  |       const semifinishedInput = semifinishedCell.locator('input[role="combobox"]');
  52  |       await semifinishedInput.fill(details[i].SemifinishedGood);
  53  |       await this.page.waitForTimeout(500);
  54  | 
  55  |       console.log(`✓ Row ${i + 1} completed\n`);
  56  |     }
  57  | 
  58  |     console.log(`✓ All ${details.length} rows filled\n`);
  59  |   }
  60  | 
  61  |   async clickSaveButton() {
  62  |     console.log('📝 STEP 2: Clicking Save button...\n');
  63  |     await this.saveButton.click();
  64  |     await this.page.waitForLoadState('networkidle');
  65  |     await this.page.waitForTimeout(2000);
  66  |     console.log('✓ Routing Plan saved successfully\n');
  67  |   }
  68  | 
  69  |   async captureAndSaveFormData(filePath: string) {
  70  |     const fs = require('fs');
  71  |     const path = require('path');
  72  | 
  73  |     // Capture routing plan header data
  74  |     const routingPlanNameInput = this.page.locator('input[id*="RoutingPlanName::Field-edit-inner"]');
  75  |     const statusInput = this.page.locator('input[id*="Status::Field-edit-inner-inner"]');
  76  |     const routingPlanCodeDisplay = this.page.locator('[id*="DataField::Code::Field-display"]');
  77  | 
  78  |     const routingPlanName = await routingPlanNameInput.inputValue().catch(() => '');
  79  |     const status = await statusInput.inputValue().catch(() => '');
  80  |     const routingPlanCode = await routingPlanCodeDisplay.textContent().catch(() => '');
  81  | 
  82  |     // Capture detail rows from the table
  83  |     const detailRows = [];
  84  |     const tableRows = this.page.locator('tr[id*="innerTableRow"]');
> 85  |     const rowCount = await tableRows.count();
      |                                      ^ Error: locator.count: Target page, context or browser has been closed
  86  | 
  87  |     for (let i = 0; i < rowCount; i++) {
  88  |       const row = tableRows.nth(i);
  89  | 
  90  |       // Get text inputs for route code and name
  91  |       const inputs = row.locator('input[type="text"]');
  92  |       const inputCount = await inputs.count();
  93  | 
  94  |       if (inputCount >= 2) {
  95  |         const routeCode = await inputs.nth(0).inputValue().catch(() => '');
  96  |         const routeName = await inputs.nth(1).inputValue().catch(() => '');
  97  | 
  98  |         // Get warehouse code from combobox
  99  |         const warehouseCode = await row.locator('input[role="combobox"]').inputValue().catch(() => '');
  100 | 
  101 |         if (routeCode) {
  102 |           detailRows.push({
  103 |             routeCode: routeCode,
  104 |             routeName: routeName,
  105 |             warehouse: warehouseCode
  106 |           });
  107 |         }
  108 |       }
  109 |     }
  110 | 
  111 |     // Create the data structure
  112 |     const formData = {
  113 |       routingPlanName: routingPlanName.trim(),
  114 |       routingPlanCode: routingPlanCode?.trim() || '',
  115 |       status: status,
  116 |       details: detailRows
  117 |     };
  118 | 
  119 |     // Ensure directory exists
  120 |     const dir = path.dirname(filePath);
  121 |     if (!fs.existsSync(dir)) {
  122 |       fs.mkdirSync(dir, { recursive: true });
  123 |     }
  124 | 
  125 |     // Save to file
  126 |     fs.writeFileSync(filePath, JSON.stringify(formData, null, 2), 'utf-8');
  127 |     console.log(`Routing plan data captured and saved to ${filePath}`);
  128 |   }
  129 | }
  130 | 
```