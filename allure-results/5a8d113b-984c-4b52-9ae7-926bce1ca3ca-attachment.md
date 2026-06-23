# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: apparel_regression_testing.spec.ts >> Apperal Module | Regression Test Suite >> 36. Fill Routing Plan Detail Rows
- Location: e2e\apparel_regression_testing.spec.ts:561:7

# Error details

```
Error: locator.fill: value: expected string, got undefined
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
  12  |   async fillRoutingPlanDetailRows(details: { routeCode: string; routeName: string; warehouse: string; SemifinishedGood: string }[]) {
  13  |     console.log('\n📝 STEP 1: Creating rows and filling data...\n');
  14  | 
  15  |     for (let i = 0; i < details.length; i++) {
  16  |       console.log(`[Row ${i + 1}/${details.length}] Click Create button...`);
  17  |       await this.createDetailButton.click();
  18  |       await this.page.waitForLoadState('networkidle');
  19  |       await this.page.waitForTimeout(2500);
  20  | 
  21  |       const tbody = this.page.locator('tbody[id*="RotingPlanDetails-innerTable-tblBody"]');
  22  |       const newRow = tbody.locator('tr[id*="innerTableRow"]').first();
  23  | 
  24  |       console.log(`[Row ${i + 1}] Fill Route Code: ${details[i].routeCode}`);
  25  |       const codeCell = newRow.locator('td[data-sap-ui-column*="DepartmentCode-innerColumn"]');
  26  |       const codeInput = codeCell.locator('input[type="text"]');
  27  |       await codeInput.fill(details[i].routeCode);
  28  |       await this.page.waitForTimeout(300);
  29  | 
  30  |       console.log(`[Row ${i + 1}] Fill Route Name: ${details[i].routeName}`);
  31  |       const nameCell = newRow.locator('td[data-sap-ui-column*="DepartmentName-innerColumn"]');
  32  |       const nameInput = nameCell.locator('input[type="text"]');
  33  |       await nameInput.fill(details[i].routeName);
  34  |       await this.page.waitForTimeout(300);
  35  | 
  36  |       console.log(`[Row ${i + 1}] Fill Warehouse: ${details[i].warehouse}`);
  37  |       const warehouseCell = newRow.locator('td[data-sap-ui-column*="warehouse-innerColumn"]');
  38  |       const warehouseInput = warehouseCell.locator('input[role="combobox"]');
  39  |       await warehouseInput.fill(details[i].warehouse);
  40  |       await this.page.waitForTimeout(300);
  41  | 
  42  |       // Press Enter or Tab to confirm warehouse selection instead of clicking dropdown
  43  |       await this.page.keyboard.press('Enter');
  44  |       await this.page.waitForTimeout(800);
  45  | 
  46  |       // Fill Semifinished Good field
  47  |       console.log(`[Row ${i + 1}] Fill Semifinished Good: ${details[i].SemifinishedGood}`);
  48  |       const semifinishedCell = newRow.locator('td[data-sap-ui-column*="SemifinishedGoods-innerColumn"]');
  49  |       const semifinishedInput = semifinishedCell.locator('input[role="combobox"]');
> 50  |       await semifinishedInput.fill(details[i].SemifinishedGood);
      |                               ^ Error: locator.fill: value: expected string, got undefined
  51  |       await this.page.waitForTimeout(500);
  52  | 
  53  |       console.log(`✓ Row ${i + 1} completed\n`);
  54  |     }
  55  | 
  56  |     console.log(`✓ All ${details.length} rows filled\n`);
  57  |   }
  58  | 
  59  |   async captureAndSaveFormData(filePath: string) {
  60  |     const fs = require('fs');
  61  |     const path = require('path');
  62  | 
  63  |     // Capture routing plan header data
  64  |     const routingPlanNameInput = this.page.locator('input[id*="RoutingPlanName::Field-edit-inner"]');
  65  |     const statusInput = this.page.locator('input[id*="Status::Field-edit-inner-inner"]');
  66  |     const routingPlanCodeDisplay = this.page.locator('[id*="DataField::Code::Field-display"]');
  67  | 
  68  |     const routingPlanName = await routingPlanNameInput.inputValue().catch(() => '');
  69  |     const status = await statusInput.inputValue().catch(() => '');
  70  |     const routingPlanCode = await routingPlanCodeDisplay.textContent().catch(() => '');
  71  | 
  72  |     // Capture detail rows from the table
  73  |     const detailRows = [];
  74  |     const tableRows = this.page.locator('tr[id*="innerTableRow"]');
  75  |     const rowCount = await tableRows.count();
  76  | 
  77  |     for (let i = 0; i < rowCount; i++) {
  78  |       const row = tableRows.nth(i);
  79  | 
  80  |       // Get text inputs for route code and name
  81  |       const inputs = row.locator('input[type="text"]');
  82  |       const inputCount = await inputs.count();
  83  | 
  84  |       if (inputCount >= 2) {
  85  |         const routeCode = await inputs.nth(0).inputValue().catch(() => '');
  86  |         const routeName = await inputs.nth(1).inputValue().catch(() => '');
  87  | 
  88  |         // Get warehouse code from combobox
  89  |         const warehouseCode = await row.locator('input[role="combobox"]').inputValue().catch(() => '');
  90  | 
  91  |         if (routeCode) {
  92  |           detailRows.push({
  93  |             routeCode: routeCode,
  94  |             routeName: routeName,
  95  |             warehouse: warehouseCode
  96  |           });
  97  |         }
  98  |       }
  99  |     }
  100 | 
  101 |     // Create the data structure
  102 |     const formData = {
  103 |       routingPlanName: routingPlanName.trim(),
  104 |       routingPlanCode: routingPlanCode?.trim() || '',
  105 |       status: status,
  106 |       details: detailRows
  107 |     };
  108 | 
  109 |     // Ensure directory exists
  110 |     const dir = path.dirname(filePath);
  111 |     if (!fs.existsSync(dir)) {
  112 |       fs.mkdirSync(dir, { recursive: true });
  113 |     }
  114 | 
  115 |     // Save to file
  116 |     fs.writeFileSync(filePath, JSON.stringify(formData, null, 2), 'utf-8');
  117 |     console.log(`Routing plan data captured and saved to ${filePath}`);
  118 |   }
  119 | }
  120 | 
```