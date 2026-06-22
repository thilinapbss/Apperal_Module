# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: apparel_regression_testing.spec.ts >> Apperal Module | Regression Test Suite >> 10. TC-BPO-007 - Upload PO file with multiple line items
- Location: e2e\apparel_regression_testing.spec.ts:346:10

# Error details

```
TimeoutError: locator.click: Timeout 30000ms exceeded.
Call log:
  - waiting for locator('button').filter({ hasText: 'Excel Upload' }).first()
    - locator resolved to <button id="__button7" data-sap-ui-render="" data-ui5-accesskey="e" data-sap-ui="__button7" class="sapMBtnBase sapMBtn">…</button>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <div class="sapFeAvatar sapFeAvatarSizeM sapFeAvatarShapeSquare"></div> from <div alt="" tabindex="0" aria-valuemin="0" role="progressbar" aria-valuemax="100" title="Please wait" aria-valuetext="Busy" class="sapUiBlockLayer  sapUiPlaceholder" id="application-apperalbuyerpoupload-display-component---appRootView--appContent--placeholder">…</div> subtree intercepts pointer events
    - retrying click action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <div class="sapFeAvatar sapFeAvatarSizeM sapFeAvatarShapeSquare"></div> from <div alt="" tabindex="0" aria-valuemin="0" role="progressbar" aria-valuemax="100" title="Please wait" aria-valuetext="Busy" class="sapUiBlockLayer  sapUiPlaceholder" id="application-apperalbuyerpoupload-display-component---appRootView--appContent--placeholder">…</div> subtree intercepts pointer events
    - retrying click action
      - waiting 100ms
    9 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <div class="sapFeAvatar sapFeAvatarSizeM sapFeAvatarShapeSquare"></div> from <div alt="" tabindex="0" aria-valuemin="0" role="progressbar" aria-valuemax="100" title="Please wait" aria-valuetext="Busy" class="sapUiBlockLayer  sapUiPlaceholder" id="application-apperalbuyerpoupload-display-component---appRootView--appContent--placeholder">…</div> subtree intercepts pointer events
    - retrying click action
      - waiting 500ms
    - waiting for element to be visible, enabled and stable
    - element is not stable
  43 × retrying click action
       - waiting 500ms
       - waiting for element to be visible, enabled and stable
       - element is visible, enabled and stable
       - scrolling into view if needed
       - done scrolling
       - <div alt="" tabindex="0" aria-valuemin="0" role="progressbar" aria-valuemax="100" title="Please wait" aria-valuetext="Busy" id="apperal.buyerpoupload::BuyerPoUploadHeaderObjectPage-busyIndicator" class="sapUiBlockLayer  sapUiLocalBusyIndicator sapUiLocalBusyIndicatorSizeMedium sapUiLocalBusyIndicatorFade">…</div> intercepts pointer events
  - retrying click action
    - waiting 500ms

```

# Test source

```ts
  1   | import { Page, Locator } from '@playwright/test';
  2   | 
  3   | export class BuyerPoUploadFormPage {
  4   |   readonly page: Page;
  5   | 
  6   |   readonly formContainer: Locator;
  7   |   readonly formTitle: Locator;
  8   |   readonly submitButton: Locator;
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
  70  |       // Wait for the Excel Upload button and set up file chooser listener
  71  |       const fileChooserPromise = this.page.waitForEvent('filechooser', { timeout: 15000 }).catch(err => {
  72  |         console.log('File chooser timeout:', err.message);
  73  |         return null;
  74  |       });
  75  | 
  76  |       // Click the Excel Upload button
  77  |       console.log('Clicking Excel Upload button');
  78  |       await this.excelUploadButton.waitFor({ state: 'visible', timeout: 10000 });
> 79  |       await this.excelUploadButton.click();
      |                                    ^ TimeoutError: locator.click: Timeout 30000ms exceeded.
  80  | 
  81  |       // Wait for file chooser
  82  |       const fileChooser = await fileChooserPromise;
  83  | 
  84  |       if (fileChooser) {
  85  |         console.log('File chooser triggered, setting files');
  86  |         await fileChooser.setFiles(filePath);
  87  |         console.log('✓ File uploaded successfully');
  88  | 
  89  |         // Wait for file to be processed
  90  |         await this.page.waitForLoadState('networkidle');
  91  |         await this.page.waitForTimeout(2000);
  92  |       } else {
  93  |         throw new Error('File chooser dialog did not appear after clicking Excel Upload button');
  94  |       }
  95  |     } catch (error) {
  96  |       console.error(`Error uploading file: ${error}`);
  97  |       throw error;
  98  |     }
  99  |   }
  100 | 
  101 |   async clickExcelUploadButton() {
  102 |     // Just click the button, file upload is handled in uploadExcelFile
  103 |     await this.excelUploadButton.click();
  104 |   }
  105 | 
  106 |   async isExcelUploadButtonVisible(): Promise<boolean> {
  107 |     return await this.excelUploadButton.isVisible();
  108 |   }
  109 | 
  110 |   async clickSubmitButton() {
  111 |     await this.submitButton.click();
  112 |   }
  113 | 
  114 |   async clickSaveButton() {
  115 |     await this.saveButton.click();
  116 |   }
  117 | 
  118 |   async clickCancelButton() {
  119 |     await this.cancelButton.click();
  120 |   }
  121 | 
  122 |   async clickSaveCreateButton() {
  123 |     const saveButton = this.page.locator('[id*="FooterBar::StandardAction::Save"]').first();
  124 |     await saveButton.waitFor({ state: 'visible', timeout: 10000 });
  125 |     await saveButton.click();
  126 |     console.log('✓ Clicked Save/Create button');
  127 |     await this.page.waitForLoadState('networkidle');
  128 |     await this.page.waitForTimeout(2000);
  129 |   }
  130 | 
  131 |   async clickSupplierCodeValueHelpButton() {
  132 |     await this.supplierCodeValueHelpButton.click();
  133 |   }
  134 | 
  135 |   private async waitForSupplierDialogToClose() {
  136 |     // Wait for the SAP UI5 supplier value help dialog to fully detach from the DOM.
  137 |     // waitForLoadState('networkidle') is not sufficient — the dialog's sap-ui-static
  138 |     // overlay stays in the DOM and blocks pointer events until it is fully removed.
  139 |     try {
  140 |       await this.page.waitForSelector('[id*="FieldValueHelp::SupplierCode::Dialog"]', {
  141 |         state: 'detached',
  142 |         timeout: 15000,
  143 |       });
  144 |     } catch {
  145 |       await this.page.waitForSelector('[role="dialog"]', { state: 'hidden', timeout: 10000 });
  146 |     }
  147 |     // Allow SAP UI5 to finish re-rendering after dialog removal.
  148 |     await this.page.waitForTimeout(800);
  149 |   }
  150 | 
  151 |   async selectFirstSupplierFromValueHelpList() {
  152 |     await this.page.waitForSelector('[role="dialog"]', { timeout: 10000 });
  153 | 
  154 |     // Wait for the first data row to be rendered and not in a loading/overlay state.
  155 |     const firstCell = this.page.locator(
  156 |       '[id*="FieldValueHelp::SupplierCode::Dialog"] tr[data-sap-ui-rowindex="0"] td'
  157 |     ).first();
  158 |     await firstCell.waitFor({ state: 'visible', timeout: 10000 });
  159 |     await firstCell.click();
  160 | 
  161 |     // Some SAP Fiori value help dialogs require an explicit OK/Select confirmation.
  162 |     const dialog = this.page.locator('[role="dialog"]').first();
  163 |     if (await dialog.isVisible()) {
  164 |       const okButton = dialog.locator('button:has-text("OK"), button:has-text("Select")').first();
  165 |       if (await okButton.isVisible()) {
  166 |         await okButton.click();
  167 |       }
  168 |     }
  169 | 
  170 |     await this.waitForSupplierDialogToClose();
  171 |   }
  172 | 
  173 |   async selectSupplierByCode(supplierCode: string) {
  174 |     await this.page.waitForSelector('[role="dialog"]', { timeout: 10000 });
  175 | 
  176 |     // Wait for table rows to be rendered.
  177 |     await this.page.waitForSelector('[id*="FieldValueHelp::SupplierCode::Dialog"] tr[data-sap-ui-rowindex]', {
  178 |       timeout: 10000,
  179 |     });
```