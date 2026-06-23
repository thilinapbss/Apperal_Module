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
  - waiting for locator('tr[id*="innerTableRow"]').first().locator('span[id*="-vhi"][aria-label="Show Value Help"]').first()

```

# Test source

```ts
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
  46  |       await this.page.waitForLoadState('networkidle');
  47  |       await this.page.waitForTimeout(500);
  48  | 
  49  |       console.log(`Filled routing plan detail row ${i + 1}: ${details[i].routeCode} - ${details[i].routeName} - ${details[i].warehouse}`);
  50  |     }
  51  |   }
  52  | 
  53  |   async captureAndSaveFormData(filePath: string) {
  54  |     const fs = require('fs');
  55  |     const path = require('path');
  56  | 
  57  |     // Capture routing plan header data
  58  |     const routingPlanNameInput = this.page.locator('input[id*="RoutingPlanName::Field-edit-inner"]');
  59  |     const statusInput = this.page.locator('input[id*="Status::Field-edit-inner-inner"]');
  60  |     const routingPlanCodeDisplay = this.page.locator('[id*="DataField::Code::Field-display"]');
  61  | 
  62  |     const routingPlanName = await routingPlanNameInput.inputValue().catch(() => '');
  63  |     const status = await statusInput.inputValue().catch(() => '');
  64  |     const routingPlanCode = await routingPlanCodeDisplay.textContent().catch(() => '');
  65  | 
  66  |     // Capture detail rows from the table
  67  |     const detailRows = [];
  68  |     const tableRows = this.page.locator('tr[id*="innerTableRow"]');
  69  |     const rowCount = await tableRows.count();
  70  | 
  71  |     for (let i = 0; i < rowCount; i++) {
  72  |       const row = tableRows.nth(i);
  73  | 
  74  |       // Get text inputs for route code and name
  75  |       const inputs = row.locator('input[type="text"]');
  76  |       const inputCount = await inputs.count();
  77  | 
  78  |       if (inputCount >= 2) {
  79  |         const routeCode = await inputs.nth(0).inputValue().catch(() => '');
  80  |         const routeName = await inputs.nth(1).inputValue().catch(() => '');
  81  | 
  82  |         // Get warehouse code from combobox
  83  |         const warehouseCode = await row.locator('input[role="combobox"]').inputValue().catch(() => '');
  84  | 
  85  |         if (routeCode) {
  86  |           detailRows.push({
  87  |             routeCode: routeCode,
  88  |             routeName: routeName,
  89  |             warehouse: warehouseCode
  90  |           });
  91  |         }
  92  |       }
  93  |     }
  94  | 
  95  |     // Create the data structure
  96  |     const formData = {
  97  |       routingPlanName: routingPlanName.trim(),
  98  |       routingPlanCode: routingPlanCode?.trim() || '',
  99  |       status: status,
  100 |       details: detailRows
  101 |     };
  102 | 
  103 |     // Ensure directory exists
  104 |     const dir = path.dirname(filePath);
  105 |     if (!fs.existsSync(dir)) {
  106 |       fs.mkdirSync(dir, { recursive: true });
  107 |     }
  108 | 
  109 |     // Save to file
  110 |     fs.writeFileSync(filePath, JSON.stringify(formData, null, 2), 'utf-8');
  111 |     console.log(`Routing plan data captured and saved to ${filePath}`);
  112 |   }
  113 | 
  114 |   async selectFinishedGoodsForRow(rowIndex: number = 0) {
  115 |     console.log(`📝 Selecting finished goods for row ${rowIndex + 1}...`);
  116 | 
  117 |     // Get all table rows
  118 |     const tableRows = this.page.locator('tr[id*="innerTableRow"]');
  119 |     const row = tableRows.nth(rowIndex);
  120 | 
  121 |     // Find the finished goods value help button in this row
  122 |     const finishedGoodsValueHelpButton = row.locator('span[id*="-vhi"][aria-label="Show Value Help"]').first();
  123 | 
  124 |     // Click the value help button
> 125 |     await finishedGoodsValueHelpButton.click();
      |                                        ^ TimeoutError: locator.click: Timeout 30000ms exceeded.
  126 |     await this.page.waitForLoadState('networkidle');
  127 |     await this.page.waitForTimeout(800);
  128 | 
  129 |     // Wait for dropdown/dialog to appear
  130 |     const dropdownTable = this.page.locator('tbody[id*="SuggestTable-tblBody"], table[role="grid"] tbody');
  131 |     await dropdownTable.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
  132 | 
  133 |     // Select the first available option
  134 |     const firstOption = this.page.locator('tr[role="row"]').locator('td').first().locator('span').first();
  135 |     await firstOption.click().catch(async () => {
  136 |       // If direct click fails, try clicking the first row
  137 |       const firstRow = this.page.locator('tr[role="row"]').first();
  138 |       await firstRow.click();
  139 |     });
  140 | 
  141 |     await this.page.waitForTimeout(500);
  142 |     console.log(`✓ Finished goods selected for row ${rowIndex + 1}`);
  143 |   }
  144 | }
  145 | 
```