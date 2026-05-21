# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: apparel_regression_testing.spec.ts >> Apperal Module | Regression Test Suite >> 53. Fill Style Master Form and Save
- Location: e2e\apparel_regression_testing.spec.ts:686:7

# Error details

```
TimeoutError: locator.waitFor: Timeout 30000ms exceeded.
Call log:
  - waiting for locator('input[id*="DataField::code::Field-edit-inner"]') to be visible

```

# Test source

```ts
  1  | import { Page, Locator } from '@playwright/test';
  2  | 
  3  | export class StyleMasterCreate {
  4  |   readonly page: Page;
  5  |   readonly styleMasterCodeInput: Locator;
  6  |   readonly styleMasterNameInput: Locator;
  7  |   readonly statusInput: Locator;
  8  |   readonly styleMasterCodeDisplay: Locator;
  9  |   readonly saveButton: Locator;
  10 | 
  11 |   constructor(page: Page) {
  12 |     this.page = page;
  13 |     this.styleMasterCodeInput = page.locator('input[id*="DataField::code::Field-edit-inner"]');
  14 |     this.styleMasterNameInput = page.locator('input[id*="DataField::name::Field-edit-inner"]');
  15 |     this.statusInput = page.locator('input[id*="DataField::status::Field-edit-inner-inner"]');
  16 |     this.styleMasterCodeDisplay = page.locator('[id*="DataField::code::Field-display"], [id*="DataField::Code::Field-display"]');
  17 |     this.saveButton = page.locator('button[id$="::FooterBar::StandardAction::Save"]');
  18 |   }
  19 | 
  20 |   async waitForFormLoad() {
> 21 |     await this.styleMasterCodeInput.waitFor({ state: 'visible', timeout: 30000 });
     |                                     ^ TimeoutError: locator.waitFor: Timeout 30000ms exceeded.
  22 |   }
  23 | 
  24 |   async fillStyleMasterCode(code: string) {
  25 |     await this.styleMasterCodeInput.fill(code);
  26 |   }
  27 | 
  28 |   async fillStyleMasterName(name: string) {
  29 |     await this.styleMasterNameInput.fill(name);
  30 |   }
  31 | 
  32 |   async fillStatus(status: string) {
  33 |     await this.statusInput.fill(status);
  34 |     await this.page.waitForTimeout(300);
  35 | 
  36 |     // Click value help button to open dropdown if status has value help
  37 |     const valueHelpButton = this.page.locator('span[aria-label="Show Value Help"]').last();
  38 |     try {
  39 |       await valueHelpButton.click({ timeout: 5000 });
  40 |       await this.page.waitForLoadState('networkidle');
  41 |       await this.page.waitForTimeout(800);
  42 | 
  43 |       // Wait for dropdown table
  44 |       const tableBody = this.page.locator('tbody[id*="SuggestTable-tblBody"]');
  45 |       await tableBody.waitFor({ state: 'attached', timeout: 10000 });
  46 |       await this.page.waitForTimeout(500);
  47 | 
  48 |       // Find and click the status option in the table
  49 |       const statusOptionRow = this.page.locator(`//span[text()="${status}"]/ancestor::tr[@role="row"]`);
  50 |       await statusOptionRow.first().click();
  51 |       await this.page.waitForLoadState('networkidle');
  52 |       await this.page.waitForTimeout(500);
  53 |     } catch {
  54 |       // Status may not have value help, skip dropdown selection
  55 |       console.log('No value help dropdown for status field');
  56 |     }
  57 |   }
  58 | 
  59 |   async captureAndSaveFormData(filePath: string) {
  60 |     const fs = require('fs');
  61 |     const path = require('path');
  62 | 
  63 |     // Capture style master form data
  64 |     const styleMasterCode = await this.styleMasterCodeInput.inputValue().catch(() => '');
  65 |     const styleMasterName = await this.styleMasterNameInput.inputValue().catch(() => '');
  66 |     const status = await this.statusInput.inputValue().catch(() => '');
  67 | 
  68 |     // Create the data structure
  69 |     const formData = {
  70 |       styleMasterCode: styleMasterCode.trim(),
  71 |       styleMasterName: styleMasterName.trim(),
  72 |       status: status.trim()
  73 |     };
  74 | 
  75 |     // Ensure directory exists
  76 |     const dir = path.dirname(filePath);
  77 |     if (!fs.existsSync(dir)) {
  78 |       fs.mkdirSync(dir, { recursive: true });
  79 |     }
  80 | 
  81 |     // Save to file with UTF-8 encoding without BOM
  82 |     const jsonString = JSON.stringify(formData, null, 2);
  83 |     fs.writeFileSync(filePath, jsonString, { encoding: 'utf-8' });
  84 |     console.log(`Style Master data captured and saved to ${filePath}`);
  85 |   }
  86 | 
  87 |   async clickSaveButton() {
  88 |     await this.saveButton.click();
  89 |     await this.page.waitForLoadState('networkidle');
  90 |   }
  91 | }
  92 | 
```