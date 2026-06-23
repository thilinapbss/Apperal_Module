# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: apparel_regression_testing.spec.ts >> Apperal Module | Regression Test Suite >> 10.  TC-BPO-002 Fill Routing Plan form
- Location: e2e\apparel_regression_testing.spec.ts:612:7

# Error details

```
TimeoutError: locator.click: Timeout 30000ms exceeded.
Call log:
  - waiting for locator('button[id*="mbox-btn-0"]')
    - locator resolved to <button id="__mbox-btn-0" data-sap-ui-render="" data-ui5-accesskey="o" data-sap-ui="__mbox-btn-0" aria-describedby="__text15" class="sapMBtnBase sapMBtn sapMBtnInverted sapMBarChild">…</button>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <bdi aria-live="polite" id="__mbox-btn-1-BDI-content">Close</bdi> from <div id="__error0" tabindex="-1" aria-modal="true" role="alertdialog" data-sap-ui-render="" data-sap-ui="__error0" aria-labelledby="__error0-title" data-sap-ui-popup="id-1782212410760-852" class="sapMDialog sapMDialog-CTX sapMPopup-CTX sapMMessageDialog sapMMessageBox sapMMessageBoxError sapUiShd sapUiUserSelectable sapMDialogOpen">…</div> subtree intercepts pointer events
    - retrying click action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <bdi aria-live="polite" id="__mbox-btn-1-BDI-content">Close</bdi> from <div id="__error0" tabindex="-1" aria-modal="true" role="alertdialog" data-sap-ui-render="" data-sap-ui="__error0" aria-labelledby="__error0-title" data-sap-ui-popup="id-1782212410760-852" class="sapMDialog sapMDialog-CTX sapMPopup-CTX sapMMessageDialog sapMMessageBox sapMMessageBoxError sapUiShd sapUiUserSelectable sapMDialogOpen">…</div> subtree intercepts pointer events
    - retrying click action
      - waiting 100ms
    58 × waiting for element to be visible, enabled and stable
       - element is visible, enabled and stable
       - scrolling into view if needed
       - done scrolling
       - <bdi aria-live="polite" id="__mbox-btn-1-BDI-content">Close</bdi> from <div id="__error0" tabindex="-1" aria-modal="true" role="alertdialog" data-sap-ui-render="" data-sap-ui="__error0" aria-labelledby="__error0-title" data-sap-ui-popup="id-1782212410760-852" class="sapMDialog sapMDialog-CTX sapMPopup-CTX sapMMessageDialog sapMMessageBox sapMMessageBoxError sapUiShd sapUiUserSelectable sapMDialogOpen">…</div> subtree intercepts pointer events
     - retrying click action
       - waiting 500ms

```

# Test source

```ts
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
  44  |       // Wait for dropdown to appear
  45  |       await this.page.waitForTimeout(500);
  46  | 
  47  |       // Look for and click the exact matching warehouse option in the dropdown
  48  |       const warehouseOption = this.page.locator(`div[role="option"]:has-text("${details[i].warehouse}")`).first();
  49  |       try {
  50  |         await warehouseOption.click({ timeout: 3000 });
  51  |         console.log(`[Row ${i + 1}] Warehouse option selected: ${details[i].warehouse}`);
  52  |       } catch {
  53  |         // If exact match not found, use arrow down and Enter to select
  54  |         console.log(`[Row ${i + 1}] Exact warehouse option not found, using keyboard selection...`);
  55  |         await this.page.keyboard.press('ArrowDown');
  56  |         await this.page.waitForTimeout(200);
  57  |         await this.page.keyboard.press('Enter');
  58  |       }
  59  |       await this.page.waitForTimeout(800);
  60  | 
  61  |       // Fill Semifinished Good field
  62  |       console.log(`[Row ${i + 1}] Fill Semifinished Good: ${details[i].SemifinishedGood}`);
  63  |       const semifinishedCell = newRow.locator('td[data-sap-ui-column*="SemifinishedGoods-innerColumn"]');
  64  |       const semifinishedInput = semifinishedCell.locator('input[role="combobox"]');
  65  |       await semifinishedInput.fill(details[i].SemifinishedGood);
  66  |       await this.page.waitForTimeout(500);
  67  | 
  68  |       // Fill Finished Good field using XPath
  69  |       console.log(`[Row ${i + 1}] Fill Finished Good: ${details[i].FinishedGood}`);
  70  |       const finishedGoodInput = this.page.locator("(//td[@role='gridcell' and @aria-colindex='6' and contains(@data-sap-ui-column,'finishedGoods-innerColumn')])[1]//input[@role='combobox']");
  71  |       await finishedGoodInput.fill(details[i].FinishedGood);
  72  |       await this.page.waitForTimeout(500);
  73  | 
  74  |       console.log(`✓ Row ${i + 1} completed\n`);
  75  |     }
  76  | 
  77  |     console.log(`✓ All ${details.length} rows filled\n`);
  78  |   }
  79  | 
  80  |   async clickSaveButton() {
  81  |     console.log('📝 STEP 2: Clicking Save button...\n');
  82  |     await this.saveButton.click();
  83  |     await this.page.waitForLoadState('networkidle');
  84  |     await this.page.waitForTimeout(2000);
  85  |     console.log('✓ Routing Plan saved successfully\n');
  86  |   }
  87  | 
  88  |   async verifyAndCloseSuccessDialog() {
  89  |     console.log('📝 STEP 3: Checking for dialogs...\n');
  90  | 
  91  |     // Wait a bit for any dialog to appear
  92  |     await this.page.waitForTimeout(500);
  93  | 
  94  |     // Check for any alert dialog (error or success)
  95  |     const anyDialog = this.page.locator('[role="alertdialog"]');
  96  |     const dialogExists = await anyDialog.isVisible({ timeout: 2000 }).catch(() => false);
  97  | 
  98  |     if (dialogExists) {
  99  |       // Get the dialog message
  100 |       const dialogMessage = this.page.locator('span[class*="sapMMsgBoxText"]');
  101 |       const messageText = await dialogMessage.textContent().catch(() => '');
  102 | 
  103 |       // Check if it's an error dialog
  104 |       const isError = await anyDialog.evaluate(el => el.className.includes('Error')).catch(() => false);
  105 | 
  106 |       if (isError) {
  107 |         console.log('\n❌ ================================');
  108 |         console.log('ERROR DIALOG DETECTED');
  109 |         console.log('================================');
  110 |         console.log(`Error Message: ${messageText}`);
  111 |         console.log('================================\n');
  112 |       } else {
  113 |         console.log(`✓ Success message: ${messageText}`);
  114 |       }
  115 | 
  116 |       // Wait and click OK button to close
  117 |       await this.page.waitForTimeout(1000);
  118 |       const okButton = this.page.locator('button[id*="mbox-btn-0"]');
  119 |       const okButtonExists = await okButton.isVisible({ timeout: 2000 }).catch(() => false);
  120 | 
  121 |       if (okButtonExists) {
> 122 |         await okButton.click();
      |                        ^ TimeoutError: locator.click: Timeout 30000ms exceeded.
  123 |         await this.page.waitForTimeout(1500);
  124 |         console.log('✓ Dialog closed - continuing test flow\n');
  125 |       } else {
  126 |         console.log('ℹ OK button not found\n');
  127 |       }
  128 |     } else {
  129 |       console.log('ℹ No dialog displayed - continuing with flow\n');
  130 |     }
  131 |   }
  132 | 
  133 |   async captureAndSaveFormData(filePath: string) {
  134 |     const fs = require('fs');
  135 |     const path = require('path');
  136 | 
  137 |     // Capture routing plan header data
  138 |     const routingPlanNameInput = this.page.locator('input[id*="RoutingPlanName::Field-edit-inner"]');
  139 |     const statusInput = this.page.locator('input[id*="Status::Field-edit-inner-inner"]');
  140 |     const routingPlanCodeDisplay = this.page.locator('[id*="DataField::Code::Field-display"]');
  141 | 
  142 |     const routingPlanName = await routingPlanNameInput.inputValue().catch(() => '');
  143 |     const status = await statusInput.inputValue().catch(() => '');
  144 |     const routingPlanCode = await routingPlanCodeDisplay.textContent().catch(() => '');
  145 | 
  146 |     // Capture detail rows from the table
  147 |     const detailRows = [];
  148 |     const tableRows = this.page.locator('tr[id*="innerTableRow"]');
  149 |     const rowCount = await tableRows.count();
  150 | 
  151 |     for (let i = 0; i < rowCount; i++) {
  152 |       const row = tableRows.nth(i);
  153 | 
  154 |       // Get text inputs for route code and name
  155 |       const inputs = row.locator('input[type="text"]');
  156 |       const inputCount = await inputs.count();
  157 | 
  158 |       if (inputCount >= 2) {
  159 |         const routeCode = await inputs.nth(0).inputValue().catch(() => '');
  160 |         const routeName = await inputs.nth(1).inputValue().catch(() => '');
  161 | 
  162 |         // Get warehouse code from combobox
  163 |         const warehouseCode = await row.locator('input[role="combobox"]').inputValue().catch(() => '');
  164 | 
  165 |         if (routeCode) {
  166 |           detailRows.push({
  167 |             routeCode: routeCode,
  168 |             routeName: routeName,
  169 |             warehouse: warehouseCode
  170 |           });
  171 |         }
  172 |       }
  173 |     }
  174 | 
  175 |     // Create the data structure
  176 |     const formData = {
  177 |       routingPlanName: routingPlanName.trim(),
  178 |       routingPlanCode: routingPlanCode?.trim() || '',
  179 |       status: status,
  180 |       details: detailRows
  181 |     };
  182 | 
  183 |     // Ensure directory exists
  184 |     const dir = path.dirname(filePath);
  185 |     if (!fs.existsSync(dir)) {
  186 |       fs.mkdirSync(dir, { recursive: true });
  187 |     }
  188 | 
  189 |     // Save to file
  190 |     fs.writeFileSync(filePath, JSON.stringify(formData, null, 2), 'utf-8');
  191 |     console.log(`Routing plan data captured and saved to ${filePath}`);
  192 |   }
  193 | }
  194 | 
```