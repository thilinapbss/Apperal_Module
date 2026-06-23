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
  - waiting for locator('//span[text()="WH-CMB"]/ancestor::tr[@role="row"]').first()
    - locator resolved to <tr role="row" tabindex="-1" aria-rowindex="2" aria-selected="true" data-sap-ui-render="" id="__item24-__clone55" data-sap-ui="__item24-__clone55" class="sapMLIB sapMLIB-CTX sapMLIBShowSeparator sapMLIBTypeActive sapMLIBActionable sapMLIBHoverable sapMLIBFocusable sapMListTblRow sapMLIBSelected">…</tr>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is not visible
    - retrying click action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and stable
      - element is not visible
    - retrying click action
      - waiting 100ms
    38 × waiting for element to be visible, enabled and stable
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
  40  |       await this.page.waitForTimeout(500);
  41  | 
  42  |       const warehouseValueHelpButton = warehouseCell.locator('span[aria-label="Show Value Help"]');
  43  |       await warehouseValueHelpButton.click();
  44  |       await this.page.waitForLoadState('networkidle');
  45  |       await this.page.waitForTimeout(1000);
  46  | 
  47  |       const warehouseOption = this.page.locator(`//span[text()="${details[i].warehouse}"]/ancestor::tr[@role="row"]`).first();
> 48  |       await warehouseOption.click();
      |                             ^ TimeoutError: locator.click: Timeout 30000ms exceeded.
  49  |       await this.page.waitForLoadState('networkidle');
  50  |       await this.page.waitForTimeout(600);
  51  | 
  52  |       // Fill Semifinished Good field
  53  |       console.log(`[Row ${i + 1}] Fill Semifinished Good: ${details[i].SemifinishedGood}`);
  54  |       const semifinishedCell = newRow.locator('td[data-sap-ui-column*="SemifinishedGoods-innerColumn"]');
  55  |       const semifinishedInput = semifinishedCell.locator('input[role="combobox"]');
  56  |       await semifinishedInput.fill(details[i].SemifinishedGood);
  57  |       await this.page.waitForTimeout(500);
  58  | 
  59  |       console.log(`✓ Row ${i + 1} completed\n`);
  60  |     }
  61  | 
  62  |     console.log(`✓ All ${details.length} rows filled\n`);
  63  |   }
  64  | 
  65  |   async captureAndSaveFormData(filePath: string) {
  66  |     const fs = require('fs');
  67  |     const path = require('path');
  68  | 
  69  |     // Capture routing plan header data
  70  |     const routingPlanNameInput = this.page.locator('input[id*="RoutingPlanName::Field-edit-inner"]');
  71  |     const statusInput = this.page.locator('input[id*="Status::Field-edit-inner-inner"]');
  72  |     const routingPlanCodeDisplay = this.page.locator('[id*="DataField::Code::Field-display"]');
  73  | 
  74  |     const routingPlanName = await routingPlanNameInput.inputValue().catch(() => '');
  75  |     const status = await statusInput.inputValue().catch(() => '');
  76  |     const routingPlanCode = await routingPlanCodeDisplay.textContent().catch(() => '');
  77  | 
  78  |     // Capture detail rows from the table
  79  |     const detailRows = [];
  80  |     const tableRows = this.page.locator('tr[id*="innerTableRow"]');
  81  |     const rowCount = await tableRows.count();
  82  | 
  83  |     for (let i = 0; i < rowCount; i++) {
  84  |       const row = tableRows.nth(i);
  85  | 
  86  |       // Get text inputs for route code and name
  87  |       const inputs = row.locator('input[type="text"]');
  88  |       const inputCount = await inputs.count();
  89  | 
  90  |       if (inputCount >= 2) {
  91  |         const routeCode = await inputs.nth(0).inputValue().catch(() => '');
  92  |         const routeName = await inputs.nth(1).inputValue().catch(() => '');
  93  | 
  94  |         // Get warehouse code from combobox
  95  |         const warehouseCode = await row.locator('input[role="combobox"]').inputValue().catch(() => '');
  96  | 
  97  |         if (routeCode) {
  98  |           detailRows.push({
  99  |             routeCode: routeCode,
  100 |             routeName: routeName,
  101 |             warehouse: warehouseCode
  102 |           });
  103 |         }
  104 |       }
  105 |     }
  106 | 
  107 |     // Create the data structure
  108 |     const formData = {
  109 |       routingPlanName: routingPlanName.trim(),
  110 |       routingPlanCode: routingPlanCode?.trim() || '',
  111 |       status: status,
  112 |       details: detailRows
  113 |     };
  114 | 
  115 |     // Ensure directory exists
  116 |     const dir = path.dirname(filePath);
  117 |     if (!fs.existsSync(dir)) {
  118 |       fs.mkdirSync(dir, { recursive: true });
  119 |     }
  120 | 
  121 |     // Save to file
  122 |     fs.writeFileSync(filePath, JSON.stringify(formData, null, 2), 'utf-8');
  123 |     console.log(`Routing plan data captured and saved to ${filePath}`);
  124 |   }
  125 | }
  126 | 
```