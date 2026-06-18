# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: apparel_regression_testing.spec.ts >> Apperal Module | Regression Test Suite >> 48. Fill Sub Master Branch Form and Save
- Location: e2e\apparel_regression_testing.spec.ts:681:7

# Error details

```
TimeoutError: locator.click: Timeout 30000ms exceeded.
Call log:
  - waiting for locator('button[id$="::FooterBar::StandardAction::Save"]')
    - locator resolved to <button data-sap-ui-render="" data-ui5-accesskey="c" aria-keyshortcuts="Ctrl+S" aria-describedby="__text12" class="sapMBtnBase sapMBtn sapMBtnInverted sapMBarChild" id="apperal.submasterbranch::BranchObjectPage--fe::FooterBar::StandardAction::Save" data-sap-ui="apperal.submasterbranch::BranchObjectPage--fe::FooterBar::StandardAction::Save" aria-labelledby="apperal.submasterbranch::BranchObjectPage--fe::FooterBar::StandardAction::Save-content">…</button>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFeTableCell sapFeSmallestVisibleSizeL">…</div> from <div alt="" tabindex="0" aria-valuemin="0" role="progressbar" aria-valuemax="100" title="Please wait" aria-valuetext="Busy" class="sapUiBlockLayer  sapUiPlaceholder" id="application-apperalsubmasterbranch-display-component---appRootView--appContent--placeholder">…</div> subtree intercepts pointer events
    - retrying click action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFeTableCell sapFeSmallestVisibleSizeL">…</div> from <div alt="" tabindex="0" aria-valuemin="0" role="progressbar" aria-valuemax="100" title="Please wait" aria-valuetext="Busy" class="sapUiBlockLayer  sapUiPlaceholder" id="application-apperalsubmasterbranch-display-component---appRootView--appContent--placeholder">…</div> subtree intercepts pointer events
    - retrying click action
      - waiting 100ms
    2 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <div class="sapFeVerticalLayout sapFeVerticalContent sapFeTextAlignStart sapFeVerticalAlignTop sapFeTableCell sapFeSmallestVisibleSizeL">…</div> from <div alt="" tabindex="0" aria-valuemin="0" role="progressbar" aria-valuemax="100" title="Please wait" aria-valuetext="Busy" class="sapUiBlockLayer  sapUiPlaceholder" id="application-apperalsubmasterbranch-display-component---appRootView--appContent--placeholder">…</div> subtree intercepts pointer events
    - retrying click action
      - waiting 500ms
    52 × waiting for element to be visible, enabled and stable
       - element is visible, enabled and stable
       - scrolling into view if needed
       - done scrolling
       - <div alt="" tabindex="0" aria-valuemin="0" role="progressbar" aria-valuemax="100" title="Please wait" aria-valuetext="Busy" id="apperal.submasterbranch::BranchObjectPage-busyIndicator" class="sapUiBlockLayer  sapUiLocalBusyIndicator sapUiLocalBusyIndicatorSizeMedium sapUiLocalBusyIndicatorFade">…</div> intercepts pointer events
     - retrying click action
       - waiting 500ms

```

# Test source

```ts
  1  | import { Page, Locator } from '@playwright/test';
  2  | 
  3  | export class SubMasterBranchCreate {
  4  |   readonly page: Page;
  5  |   readonly branchCodeInput: Locator;
  6  |   readonly branchNameInput: Locator;
  7  |   readonly statusInput: Locator;
  8  |   readonly saveButton: Locator;
  9  | 
  10 |   constructor(page: Page) {
  11 |     this.page = page;
  12 |     this.branchCodeInput = page.locator('input[id*="DataField::code::Field-edit-inner"]');
  13 |     this.branchNameInput = page.locator('input[id*="DataField::name::Field-edit-inner"]');
  14 |     this.statusInput = page.locator('input[id*="DataField::status::Field-edit-inner-inner"]');
  15 |     this.saveButton = page.locator('button[id$="::FooterBar::StandardAction::Save"]');
  16 |   }
  17 | 
  18 |   async waitForFormLoad() {
  19 |     await this.branchCodeInput.waitFor({ state: 'visible', timeout: 30000 });
  20 |   }
  21 | 
  22 |   async fillBranchCode(code: string) {
  23 |     await this.branchCodeInput.fill(code);
  24 |   }
  25 | 
  26 |   async fillBranchName(name: string) {
  27 |     await this.branchNameInput.fill(name);
  28 |   }
  29 | 
  30 |   async fillStatus(status: string) {
  31 |     await this.statusInput.fill(status);
  32 |     await this.page.waitForTimeout(300);
  33 | 
  34 |     // Click value help button to open dropdown if status has value help
  35 |     const valueHelpButton = this.page.locator('span[aria-label="Show Value Help"]').last();
  36 |     try {
  37 |       await valueHelpButton.click({ timeout: 5000 });
  38 |       await this.page.waitForLoadState('networkidle');
  39 |       await this.page.waitForTimeout(800);
  40 | 
  41 |       // Wait for dropdown table
  42 |       const tableBody = this.page.locator('tbody[id*="SuggestTable-tblBody"]');
  43 |       await tableBody.waitFor({ state: 'attached', timeout: 10000 });
  44 |       await this.page.waitForTimeout(500);
  45 | 
  46 |       // Find and click the status option in the table
  47 |       const statusOptionRow = this.page.locator(`//span[text()="${status}"]/ancestor::tr[@role="row"]`);
  48 |       await statusOptionRow.first().click();
  49 |       await this.page.waitForLoadState('networkidle');
  50 |       await this.page.waitForTimeout(500);
  51 |     } catch {
  52 |       // Status may not have value help, skip dropdown selection
  53 |       console.log('No value help dropdown for status field');
  54 |     }
  55 |   }
  56 | 
  57 |   async captureAndSaveFormData(filePath: string) {
  58 |     const fs = require('fs');
  59 |     const path = require('path');
  60 | 
  61 |     // Capture branch data
  62 |     const branchCode = await this.branchCodeInput.inputValue().catch(() => '');
  63 |     const branchName = await this.branchNameInput.inputValue().catch(() => '');
  64 |     const status = await this.statusInput.inputValue().catch(() => '');
  65 | 
  66 |     // Create the data structure
  67 |     const formData = {
  68 |       branchCode: branchCode.trim(),
  69 |       branchName: branchName.trim(),
  70 |       status: status.trim()
  71 |     };
  72 | 
  73 |     // Ensure directory exists
  74 |     const dir = path.dirname(filePath);
  75 |     if (!fs.existsSync(dir)) {
  76 |       fs.mkdirSync(dir, { recursive: true });
  77 |     }
  78 | 
  79 |     // Save to file with UTF-8 encoding without BOM
  80 |     const jsonString = JSON.stringify(formData, null, 2);
  81 |     fs.writeFileSync(filePath, jsonString, { encoding: 'utf-8' });
  82 |     console.log(`Sub Master Branch data captured and saved to ${filePath}`);
  83 |   }
  84 | 
  85 |   async clickSaveButton() {
> 86 |     await this.saveButton.click();
     |                           ^ TimeoutError: locator.click: Timeout 30000ms exceeded.
  87 |     await this.page.waitForLoadState('networkidle');
  88 |   }
  89 | }
  90 | 
```