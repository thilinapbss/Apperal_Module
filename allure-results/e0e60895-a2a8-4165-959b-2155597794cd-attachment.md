# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: apparel_regression_testing.spec.ts >> Apperal Module | Regression Test Suite >> 08. TC-BPO-005 - Upload PO file with multiple line items
- Location: e2e\apparel_regression_testing.spec.ts:343:10

# Error details

```
Error: File chooser dialog did not appear after clicking Excel Upload button
```

# Test source

```ts
  9   |   readonly saveButton: Locator;
  10  |   readonly cancelButton: Locator;
  11  |   readonly excelUploadButton: Locator;
  12  |   readonly fileInput: Locator;
  13  |   readonly buyerInput: Locator;
  14  |   readonly styleNoInput: Locator;
  15  |   readonly styleDescriptionInput: Locator;
  16  |   readonly styleColorInput: Locator;
  17  |   readonly seasonInput: Locator;
  18  |   readonly poDateInput: Locator;
  19  |   readonly kimbleNoInput: Locator;
  20  |   readonly remarkInput: Locator;
  21  |   readonly successMessage: Locator;
  22  |   readonly errorMessage: Locator;
  23  |   readonly supplierCodeValueHelpButton: Locator;
  24  |   readonly supplierCodeInput: Locator;
  25  | 
  26  |   constructor(page: Page) {
  27  |     this.page = page;
  28  | 
  29  |     // Form selectors - update based on actual form structure
  30  |     this.formContainer = page.locator('form, [role="main"]').first();
  31  |     this.formTitle = page.locator('h1, h2').filter({ hasText: /Buyer.*PO|Create/ }).first();
  32  |     this.submitButton = page.locator('button:has-text("Submit"), button[type="submit"]').first();
  33  |     this.saveButton = page.locator('button:has-text("Save")').first();
  34  |     this.cancelButton = page.locator('button:has-text("Cancel")').first();
  35  |     // Excel upload button - look for button with "Excel Upload" text
  36  |     this.excelUploadButton = page.locator('button').filter({ hasText: 'Excel Upload' }).first();
  37  |     this.fileInput = page.locator('input[type="file"]');
  38  | 
  39  |     // Input field selectors - matching actual SAP UI5 form structure
  40  |     this.buyerInput = page.locator('input[id*="Buyer::Field-edit-inner"]').first();
  41  |     this.styleNoInput = page.locator('input[id*="StyleNo::Field-edit-inner"]').first();
  42  |     this.styleDescriptionInput = page.locator('input[id*="StyleDescription::Field-edit-inner"]').first();
  43  |     this.styleColorInput = page.locator('input[id*="StyleColor::Field-edit-inner"]').first();
  44  |     this.seasonInput = page.locator('input[id*="Season::Field-edit-inner"]').first();
  45  |     this.poDateInput = page.locator('input[id*="::PODate::Field-edit-inner"]').first();
  46  |     this.kimbleNoInput = page.locator('input[id*="::KimbleNo::Field-edit-inner"]').first();
  47  |     this.remarkInput = page.locator('input[id*="Remark::Field-edit-inner"]').first();
  48  | 
  49  |     this.successMessage = page.locator('[role="alert"]').filter({ hasText: /success|saved|created|uploaded/i }).first();
  50  |     this.errorMessage = page.locator('[role="alert"]').filter({ hasText: /error|failed/i }).first();
  51  | 
  52  |     // Value help button and input for Supplier Code field
  53  |     this.supplierCodeValueHelpButton = page.locator('[id*="SupplierCode::Field-edit-inner-vhi"][aria-label="Show Value Help"]').first();
  54  |     this.supplierCodeInput = page.locator('input[id*="SupplierCode::Field-edit-inner"]:not([id*="-vhi"])').first();
  55  |   }
  56  | 
  57  |   async waitForFormLoad() {
  58  |     await this.formContainer.waitFor({ state: 'visible', timeout: 90000 });
  59  |   }
  60  | 
  61  |   async fillFormField(fieldName: string, value: string) {
  62  |     const input = this.page.locator(`input[name*="${fieldName}"], input[aria-label*="${fieldName}"], input[placeholder*="${fieldName}"]`).first();
  63  |     await input.fill(value);
  64  |   }
  65  | 
  66  |   async uploadExcelFile(filePath: string) {
  67  |     try {
  68  |       console.log(`Attempting to upload file: ${filePath}`);
  69  | 
  70  |       // Wait for page to fully load and busy indicators to disappear
  71  |       await this.page.waitForLoadState('networkidle');
  72  |       await this.page.waitForTimeout(1000);
  73  | 
  74  |       // Wait for any busy/loading indicators to disappear
  75  |       const busyIndicators = this.page.locator('.sapUiBlockLayer, .sapUiLocalBusyIndicator, [class*="busy"]');
  76  |       const busyCount = await busyIndicators.count();
  77  |       if (busyCount > 0) {
  78  |         console.log(`Waiting for ${busyCount} busy indicators to disappear...`);
  79  |         await this.page.waitForSelector('.sapUiBlockLayer, .sapUiLocalBusyIndicator', { state: 'hidden', timeout: 30000 }).catch(() => {
  80  |           console.log('Busy indicator wait timed out, proceeding anyway');
  81  |         });
  82  |         await this.page.waitForTimeout(500);
  83  |       }
  84  | 
  85  |       // Set up file chooser listener BEFORE clicking
  86  |       const fileChooserPromise = this.page.waitForEvent('filechooser', { timeout: 20000 }).catch(err => {
  87  |         console.log('File chooser timeout:', err.message);
  88  |         return null;
  89  |       });
  90  | 
  91  |       // Click the Excel Upload button
  92  |       console.log('Clicking Excel Upload button');
  93  |       await this.excelUploadButton.waitFor({ state: 'visible', timeout: 10000 });
  94  |       await this.excelUploadButton.click({ force: true, timeout: 10000 });
  95  |       console.log('✓ Excel Upload button clicked');
  96  | 
  97  |       // Wait for file chooser
  98  |       const fileChooser = await fileChooserPromise;
  99  | 
  100 |       if (fileChooser) {
  101 |         console.log('File chooser triggered, setting files');
  102 |         await fileChooser.setFiles(filePath);
  103 |         console.log('✓ File uploaded successfully');
  104 | 
  105 |         // Wait for file to be processed
  106 |         await this.page.waitForLoadState('networkidle');
  107 |         await this.page.waitForTimeout(2000);
  108 |       } else {
> 109 |         throw new Error('File chooser dialog did not appear after clicking Excel Upload button');
      |               ^ Error: File chooser dialog did not appear after clicking Excel Upload button
  110 |       }
  111 |     } catch (error) {
  112 |       console.error(`Error uploading file: ${error}`);
  113 |       throw error;
  114 |     }
  115 |   }
  116 | 
  117 |   async clickExcelUploadButton() {
  118 |     // Just click the button, file upload is handled in uploadExcelFile
  119 |     await this.excelUploadButton.click();
  120 |   }
  121 | 
  122 |   async isExcelUploadButtonVisible(): Promise<boolean> {
  123 |     return await this.excelUploadButton.isVisible();
  124 |   }
  125 | 
  126 |   async clickSubmitButton() {
  127 |     await this.submitButton.click();
  128 |   }
  129 | 
  130 |   async clickSaveButton() {
  131 |     await this.saveButton.click();
  132 |   }
  133 | 
  134 |   async clickCancelButton() {
  135 |     await this.cancelButton.click();
  136 |   }
  137 | 
  138 |   async clickSaveCreateButton() {
  139 |     const saveButton = this.page.locator('[id*="FooterBar::StandardAction::Save"]').first();
  140 |     await saveButton.waitFor({ state: 'visible', timeout: 10000 });
  141 |     await saveButton.click();
  142 |     console.log('✓ Clicked Save/Create button');
  143 |     await this.page.waitForLoadState('networkidle');
  144 |     await this.page.waitForTimeout(2000);
  145 |   }
  146 | 
  147 |   async clickSupplierCodeValueHelpButton() {
  148 |     await this.supplierCodeValueHelpButton.click();
  149 |   }
  150 | 
  151 |   private async waitForSupplierDialogToClose() {
  152 |     // Wait for the SAP UI5 supplier value help dialog to fully detach from the DOM.
  153 |     // waitForLoadState('networkidle') is not sufficient — the dialog's sap-ui-static
  154 |     // overlay stays in the DOM and blocks pointer events until it is fully removed.
  155 |     try {
  156 |       await this.page.waitForSelector('[id*="FieldValueHelp::SupplierCode::Dialog"]', {
  157 |         state: 'detached',
  158 |         timeout: 15000,
  159 |       });
  160 |     } catch {
  161 |       await this.page.waitForSelector('[role="dialog"]', { state: 'hidden', timeout: 10000 });
  162 |     }
  163 |     // Allow SAP UI5 to finish re-rendering after dialog removal.
  164 |     await this.page.waitForTimeout(800);
  165 |   }
  166 | 
  167 |   async selectFirstSupplierFromValueHelpList() {
  168 |     await this.page.waitForSelector('[role="dialog"]', { timeout: 10000 });
  169 | 
  170 |     // Wait for the first data row to be rendered and not in a loading/overlay state.
  171 |     const firstCell = this.page.locator(
  172 |       '[id*="FieldValueHelp::SupplierCode::Dialog"] tr[data-sap-ui-rowindex="0"] td'
  173 |     ).first();
  174 |     await firstCell.waitFor({ state: 'visible', timeout: 10000 });
  175 |     await firstCell.click();
  176 | 
  177 |     // Some SAP Fiori value help dialogs require an explicit OK/Select confirmation.
  178 |     const dialog = this.page.locator('[role="dialog"]').first();
  179 |     if (await dialog.isVisible()) {
  180 |       const okButton = dialog.locator('button:has-text("OK"), button:has-text("Select")').first();
  181 |       if (await okButton.isVisible()) {
  182 |         await okButton.click();
  183 |       }
  184 |     }
  185 | 
  186 |     await this.waitForSupplierDialogToClose();
  187 |   }
  188 | 
  189 |   async selectSupplierByCode(supplierCode: string) {
  190 |     await this.page.waitForSelector('[role="dialog"]', { timeout: 10000 });
  191 | 
  192 |     // Wait for table rows to be rendered.
  193 |     await this.page.waitForSelector('[id*="FieldValueHelp::SupplierCode::Dialog"] tr[data-sap-ui-rowindex]', {
  194 |       timeout: 10000,
  195 |     });
  196 | 
  197 |     const tableRows = await this.page.locator(
  198 |       '[id*="FieldValueHelp::SupplierCode::Dialog"] tr[data-sap-ui-rowindex]'
  199 |     ).all();
  200 |     let found = false;
  201 | 
  202 |     for (const row of tableRows) {
  203 |       const rowText = await row.textContent();
  204 |       if (rowText && rowText.includes(supplierCode)) {
  205 |         await row.locator('td').first().click();
  206 |         console.log(`Clicked on supplier row: ${supplierCode}`);
  207 |         found = true;
  208 |         break;
  209 |       }
```