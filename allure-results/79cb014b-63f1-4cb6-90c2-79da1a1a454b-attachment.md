# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: apparel_regression_testing.spec.ts >> Apperal Module | Regression Test Suite >> 10.  TC-BPO-002 Fill Routing Plan form
- Location: e2e\apparel_regression_testing.spec.ts:579:7

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
      - <bdi aria-live="polite" id="__mbox-btn-1-BDI-content">Close</bdi> from <div id="__error0" tabindex="-1" aria-modal="true" role="alertdialog" data-sap-ui-render="" data-sap-ui="__error0" aria-labelledby="__error0-title" data-sap-ui-popup="id-1782208103125-854" class="sapMDialog sapMDialog-CTX sapMPopup-CTX sapMMessageDialog sapMMessageBox sapMMessageBoxError sapUiShd sapUiUserSelectable sapMDialogOpen">…</div> subtree intercepts pointer events
    - retrying click action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <bdi aria-live="polite" id="__mbox-btn-1-BDI-content">Close</bdi> from <div id="__error0" tabindex="-1" aria-modal="true" role="alertdialog" data-sap-ui-render="" data-sap-ui="__error0" aria-labelledby="__error0-title" data-sap-ui-popup="id-1782208103125-854" class="sapMDialog sapMDialog-CTX sapMPopup-CTX sapMMessageDialog sapMMessageBox sapMMessageBoxError sapUiShd sapUiUserSelectable sapMDialogOpen">…</div> subtree intercepts pointer events
    - retrying click action
      - waiting 100ms
    58 × waiting for element to be visible, enabled and stable
       - element is visible, enabled and stable
       - scrolling into view if needed
       - done scrolling
       - <bdi aria-live="polite" id="__mbox-btn-1-BDI-content">Close</bdi> from <div id="__error0" tabindex="-1" aria-modal="true" role="alertdialog" data-sap-ui-render="" data-sap-ui="__error0" aria-labelledby="__error0-title" data-sap-ui-popup="id-1782208103125-854" class="sapMDialog sapMDialog-CTX sapMPopup-CTX sapMMessageDialog sapMMessageBox sapMMessageBoxError sapUiShd sapUiUserSelectable sapMDialogOpen">…</div> subtree intercepts pointer events
     - retrying click action
       - waiting 500ms

```

# Test source

```ts
  8   |   constructor(page: Page) {
  9   |     this.page = page;
  10  |     this.createDetailButton = page.locator('button[id*="RotingPlanDetails::StandardAction::Create"]');
  11  |     this.saveButton = page.locator('button[id*="FooterBar::StandardAction::Save"]');
  12  |   }
  13  | 
  14  |   async fillRoutingPlanDetailRows(details: { routeCode: string; routeName: string; warehouse: string; SemifinishedGood: string; FinishedGood: string }[]) {
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
  89  |     console.log('📝 STEP 3: Checking for success dialog...\n');
  90  | 
  91  |     // Check if success dialog is visible
  92  |     const successDialog = this.page.locator('[role="alertdialog"][class*="sapMMessageBoxSuccess"]');
  93  |     const isDialogVisible = await successDialog.isVisible({ timeout: 3000 }).catch(() => false);
  94  | 
  95  |     if (isDialogVisible) {
  96  |       console.log('✓ Success dialog detected');
  97  | 
  98  |       // Verify success message
  99  |       const successMessage = this.page.locator('span[class*="sapMMsgBoxText"]');
  100 |       const messageText = await successMessage.textContent();
  101 |       console.log(`✓ Success message: ${messageText}`);
  102 | 
  103 |       // Wait 1 second before clicking OK button
  104 |       await this.page.waitForTimeout(1000);
  105 | 
  106 |       // Click OK button
  107 |       const okButton = this.page.locator('button[id*="mbox-btn-0"]');
> 108 |       await okButton.click();
      |                      ^ TimeoutError: locator.click: Timeout 30000ms exceeded.
  109 |       await this.page.waitForTimeout(1000);
  110 | 
  111 |       console.log('✓ Success dialog closed\n');
  112 |     } else {
  113 |       console.log('ℹ Success dialog not displayed - continuing with flow\n');
  114 |     }
  115 |   }
  116 | 
  117 |   async captureAndSaveFormData(filePath: string) {
  118 |     const fs = require('fs');
  119 |     const path = require('path');
  120 | 
  121 |     // Capture routing plan header data
  122 |     const routingPlanNameInput = this.page.locator('input[id*="RoutingPlanName::Field-edit-inner"]');
  123 |     const statusInput = this.page.locator('input[id*="Status::Field-edit-inner-inner"]');
  124 |     const routingPlanCodeDisplay = this.page.locator('[id*="DataField::Code::Field-display"]');
  125 | 
  126 |     const routingPlanName = await routingPlanNameInput.inputValue().catch(() => '');
  127 |     const status = await statusInput.inputValue().catch(() => '');
  128 |     const routingPlanCode = await routingPlanCodeDisplay.textContent().catch(() => '');
  129 | 
  130 |     // Capture detail rows from the table
  131 |     const detailRows = [];
  132 |     const tableRows = this.page.locator('tr[id*="innerTableRow"]');
  133 |     const rowCount = await tableRows.count();
  134 | 
  135 |     for (let i = 0; i < rowCount; i++) {
  136 |       const row = tableRows.nth(i);
  137 | 
  138 |       // Get text inputs for route code and name
  139 |       const inputs = row.locator('input[type="text"]');
  140 |       const inputCount = await inputs.count();
  141 | 
  142 |       if (inputCount >= 2) {
  143 |         const routeCode = await inputs.nth(0).inputValue().catch(() => '');
  144 |         const routeName = await inputs.nth(1).inputValue().catch(() => '');
  145 | 
  146 |         // Get warehouse code from combobox
  147 |         const warehouseCode = await row.locator('input[role="combobox"]').inputValue().catch(() => '');
  148 | 
  149 |         if (routeCode) {
  150 |           detailRows.push({
  151 |             routeCode: routeCode,
  152 |             routeName: routeName,
  153 |             warehouse: warehouseCode
  154 |           });
  155 |         }
  156 |       }
  157 |     }
  158 | 
  159 |     // Create the data structure
  160 |     const formData = {
  161 |       routingPlanName: routingPlanName.trim(),
  162 |       routingPlanCode: routingPlanCode?.trim() || '',
  163 |       status: status,
  164 |       details: detailRows
  165 |     };
  166 | 
  167 |     // Ensure directory exists
  168 |     const dir = path.dirname(filePath);
  169 |     if (!fs.existsSync(dir)) {
  170 |       fs.mkdirSync(dir, { recursive: true });
  171 |     }
  172 | 
  173 |     // Save to file
  174 |     fs.writeFileSync(filePath, JSON.stringify(formData, null, 2), 'utf-8');
  175 |     console.log(`Routing plan data captured and saved to ${filePath}`);
  176 |   }
  177 | }
  178 | 
```