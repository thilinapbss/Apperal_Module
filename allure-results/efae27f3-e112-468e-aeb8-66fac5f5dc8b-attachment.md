# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: apparel_regression_testing.spec.ts >> Apperal Module | Regression Test Suite >> 36. Fill Routing Plan Detail Rows
- Location: e2e\apparel_regression_testing.spec.ts:470:7

# Error details

```
TimeoutError: locator.click: Timeout 30000ms exceeded.
Call log:
  - waiting for locator('//span[text()="WH-CMB"]/ancestor::tr[@role="row"]').first()
    - locator resolved to <tr role="row" tabindex="-1" aria-rowindex="2" aria-selected="true" data-sap-ui-render="" id="__item24-__clone52" data-sap-ui="__item24-__clone52" class="sapMLIB sapMLIB-CTX sapMLIBShowSeparator sapMLIBTypeActive sapMLIBActionable sapMLIBHoverable sapMLIBFocusable sapMListTblRow sapMLIBSelected">…</tr>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is not visible
    - retrying click action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and stable
      - element is not visible
    - retrying click action
      - waiting 100ms
    43 × waiting for element to be visible, enabled and stable
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
  14  |       await this.createDetailButton.click();
  15  |       await this.page.waitForLoadState('networkidle');
  16  |       await this.page.waitForTimeout(2000);
  17  | 
  18  |       // Get the most recently created row inputs
  19  |       const codeInput = this.page.locator("td[data-sap-ui-column*='DepartmentCode-innerColumn'] input").first();
  20  |       const nameInput = this.page.locator("td[data-sap-ui-column*='DepartmentName-innerColumn'] input").first();
  21  |       const warehouseInput = this.page.locator("td[data-sap-ui-column*='warehouse-innerColumn'] input").first();
  22  | 
  23  |       await codeInput.pressSequentially(details[i].routeCode, { delay: 50 });
  24  |       await this.page.keyboard.press('Tab');
  25  | 
  26  |       await nameInput.pressSequentially(details[i].routeName, { delay: 50 });
  27  |       await this.page.keyboard.press('Tab');
  28  | 
  29  |       // Type warehouse code and open dropdown
  30  |       await warehouseInput.fill(details[i].warehouse);
  31  |       await this.page.waitForTimeout(300);
  32  | 
  33  |       // Click value help button to open dropdown
  34  |       const valueHelpButton = this.page.locator('span[aria-label="Show Value Help"]').last();
  35  |       await valueHelpButton.click();
  36  |       await this.page.waitForLoadState('networkidle');
  37  |       await this.page.waitForTimeout(800);
  38  | 
  39  |       // Wait for the dropdown table to be attached to DOM (may be hidden)
  40  |       const tableBody = this.page.locator('tbody[id*="SuggestTable-tblBody"]');
  41  |       await tableBody.waitFor({ state: 'attached', timeout: 10000 });
  42  |       await this.page.waitForTimeout(500);
  43  | 
  44  |       // Find and click the warehouse option in the table by finding the span with warehouse code
  45  |       const warehouseOptionRow = this.page.locator(`//span[text()="${details[i].warehouse}"]/ancestor::tr[@role="row"]`);
> 46  |       await warehouseOptionRow.first().click();
      |                                        ^ TimeoutError: locator.click: Timeout 30000ms exceeded.
  47  |       await this.page.waitForLoadState('networkidle');
  48  |       await this.page.waitForTimeout(500);
  49  | 
  50  |       console.log(`Filled routing plan detail row ${i + 1}: ${details[i].routeCode} - ${details[i].routeName} - ${details[i].warehouse}`);
  51  |     }
  52  |   }
  53  | 
  54  |   async captureAndSaveFormData(filePath: string) {
  55  |     const fs = require('fs');
  56  |     const path = require('path');
  57  | 
  58  |     // Capture routing plan header data
  59  |     const routingPlanNameInput = this.page.locator('input[id*="RoutingPlanName::Field-edit-inner"]');
  60  |     const statusInput = this.page.locator('input[id*="Status::Field-edit-inner-inner"]');
  61  |     const routingPlanCodeDisplay = this.page.locator('[id*="DataField::Code::Field-display"]');
  62  | 
  63  |     const routingPlanName = await routingPlanNameInput.inputValue().catch(() => '');
  64  |     const status = await statusInput.inputValue().catch(() => '');
  65  |     const routingPlanCode = await routingPlanCodeDisplay.textContent().catch(() => '');
  66  | 
  67  |     // Capture detail rows from the table
  68  |     const detailRows = [];
  69  |     const tableRows = this.page.locator('tr[id*="innerTableRow"]');
  70  |     const rowCount = await tableRows.count();
  71  | 
  72  |     for (let i = 0; i < rowCount; i++) {
  73  |       const row = tableRows.nth(i);
  74  | 
  75  |       // Get text inputs for route code and name
  76  |       const inputs = row.locator('input[type="text"]');
  77  |       const inputCount = await inputs.count();
  78  | 
  79  |       if (inputCount >= 2) {
  80  |         const routeCode = await inputs.nth(0).inputValue().catch(() => '');
  81  |         const routeName = await inputs.nth(1).inputValue().catch(() => '');
  82  | 
  83  |         // Get warehouse code from combobox
  84  |         const warehouseCode = await row.locator('input[role="combobox"]').inputValue().catch(() => '');
  85  | 
  86  |         if (routeCode) {
  87  |           detailRows.push({
  88  |             routeCode: routeCode,
  89  |             routeName: routeName,
  90  |             warehouse: warehouseCode
  91  |           });
  92  |         }
  93  |       }
  94  |     }
  95  | 
  96  |     // Create the data structure
  97  |     const formData = {
  98  |       routingPlanName: routingPlanName.trim(),
  99  |       routingPlanCode: routingPlanCode?.trim() || '',
  100 |       status: status,
  101 |       details: detailRows
  102 |     };
  103 | 
  104 |     // Ensure directory exists
  105 |     const dir = path.dirname(filePath);
  106 |     if (!fs.existsSync(dir)) {
  107 |       fs.mkdirSync(dir, { recursive: true });
  108 |     }
  109 | 
  110 |     // Save to file
  111 |     fs.writeFileSync(filePath, JSON.stringify(formData, null, 2), 'utf-8');
  112 |     console.log(`Routing plan data captured and saved to ${filePath}`);
  113 |   }
  114 | }
  115 | 
```