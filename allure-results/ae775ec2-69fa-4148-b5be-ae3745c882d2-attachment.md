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
  26  | 
  27  |       await nameInput.pressSequentially(details[i].routeName, { delay: 50 });
  28  |       await this.page.keyboard.press('Tab');
  29  | 
  30  |       // Type warehouse code and open dropdown
  31  |       await warehouseInput.fill(details[i].warehouse);
  32  |       await this.page.waitForTimeout(300);
  33  | 
  34  |       // Click value help button to open dropdown
  35  |       const valueHelpButton = this.page.locator('span[aria-label="Show Value Help"]').last();
  36  |       await valueHelpButton.click();
  37  |       await this.page.waitForLoadState('networkidle');
  38  |       await this.page.waitForTimeout(800);
  39  | 
  40  |       // Wait for the dropdown table to be attached to DOM (may be hidden)
  41  |       const tableBody = this.page.locator('tbody[id*="SuggestTable-tblBody"]');
  42  |       await tableBody.waitFor({ state: 'attached', timeout: 10000 });
  43  |       await this.page.waitForTimeout(500);
  44  | 
  45  |       // Find and click the warehouse option in the table by finding the span with warehouse code
  46  |       const warehouseOptionRow = this.page.locator(`//span[text()="${details[i].warehouse}"]/ancestor::tr[@role="row"]`);
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
  114 | 
  115 |   async selectFinishedGoodsForRow(rowIndex: number = 0) {
  116 |     console.log(`📝 Selecting finished goods (1st item) for row ${rowIndex + 1}...`);
  117 | 
  118 |     // Get all table rows
  119 |     const tableRows = this.page.locator('tr[id*="innerTableRow"]');
  120 |     const row = tableRows.nth(rowIndex);
  121 | 
  122 |     // Find the finished goods value help button in this row
  123 |     const finishedGoodsValueHelpButton = row.locator('span[id*="-vhi"][aria-label="Show Value Help"]').first();
  124 | 
  125 |     // Click the value help button
> 126 |     await finishedGoodsValueHelpButton.click();
      |                                        ^ TimeoutError: locator.click: Timeout 30000ms exceeded.
  127 |     await this.page.waitForLoadState('networkidle');
  128 |     await this.page.waitForTimeout(800);
  129 | 
  130 |     // Wait for dropdown/dialog table to appear
  131 |     const dropdownTableBody = this.page.locator('tbody[id*="SuggestTable-tblBody"], [role="grid"] tbody');
  132 |     await dropdownTableBody.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
  133 | 
  134 |     await this.page.waitForTimeout(300);
  135 | 
  136 |     // Select the FIRST ROW from the dropdown table - find the first visible row and click it
  137 |     const firstDropdownRow = this.page.locator('tr[role="row"]:not([style*="display: none"])').first();
  138 | 
  139 |     // Try clicking the first cell in the first row
  140 |     const firstCell = firstDropdownRow.locator('td[role="gridcell"]').first();
  141 |     await firstCell.click().catch(async () => {
  142 |       // If that fails, click the row itself
  143 |       await firstDropdownRow.click();
  144 |     });
  145 | 
  146 |     await this.page.waitForTimeout(500);
  147 |     console.log(`✓ First row item selected for finished goods in row ${rowIndex + 1}`);
  148 |   }
  149 | }
  150 | 
```