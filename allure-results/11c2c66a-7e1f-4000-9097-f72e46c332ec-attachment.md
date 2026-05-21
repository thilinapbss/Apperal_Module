# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: apparel_regression_testing.spec.ts >> Apperal Module | Regression Test Suite >> 42. Fill Vendor Form and Save
- Location: e2e\apparel_regression_testing.spec.ts:542:7

# Error details

```
Error: locator.click: Error: strict mode violation: locator('button[id*="VendorObjectPage--fe::FooterBar"][id*="StandardAction::Save"], button[id*="StandardAction::Create"]') resolved to 2 elements:
    1) <button data-sap-ui-render="" data-ui5-accesskey="c" aria-describedby="__text20" aria-keyshortcuts="Ctrl+Enter" class="sapMBtnBase sapMBtn sapMBarChild" id="apperal.vendor::VendorList--fe::table::Vendor::LineItem::StandardAction::Create" data-sap-ui="apperal.vendor::VendorList--fe::table::Vendor::LineItem::StandardAction::Create">…</button> aka locator('[id="apperal.vendor::VendorList--fe::table::Vendor::LineItem::StandardAction::Create"]')
    2) <button data-sap-ui-render="" data-ui5-accesskey="c" aria-keyshortcuts="Ctrl+S" aria-describedby="__text12" class="sapMBtnBase sapMBtn sapMBtnInverted sapMBarChild" id="apperal.vendor::VendorObjectPage--fe::FooterBar::StandardAction::Save" data-sap-ui="apperal.vendor::VendorObjectPage--fe::FooterBar::StandardAction::Save" aria-labelledby="apperal.vendor::VendorObjectPage--fe::FooterBar::StandardAction::Save-content">…</button> aka getByRole('button', { name: 'Create' })

Call log:
  - waiting for locator('button[id*="VendorObjectPage--fe::FooterBar"][id*="StandardAction::Save"], button[id*="StandardAction::Create"]')

```

# Test source

```ts
  1  | import { Page, Locator } from '@playwright/test';
  2  | 
  3  | export class VendorCreate {
  4  |   readonly page: Page;
  5  |   readonly vendorNameInput: Locator;
  6  |   readonly statusInput: Locator;
  7  |   readonly vendorCodeDisplay: Locator;
  8  |   readonly saveButton: Locator;
  9  | 
  10 |   constructor(page: Page) {
  11 |     this.page = page;
  12 |     this.vendorNameInput = page.locator('input[id*="DataField::name::Field-edit-inner"]');
  13 |     this.statusInput = page.locator('input[id*="DataField::status::Field-edit-inner-inner"]');
  14 |     this.vendorCodeDisplay = page.locator('[id*="DataField::code::Field-display"], [id*="DataField::Code::Field-display"]');
  15 |     this.saveButton = page.locator('button[id*="VendorObjectPage--fe::FooterBar"][id*="StandardAction::Save"], button[id*="StandardAction::Create"]');
  16 |   }
  17 | 
  18 |   async waitForFormLoad() {
  19 |     await this.vendorNameInput.waitFor({ state: 'visible', timeout: 30000 });
  20 |   }
  21 | 
  22 |   async fillVendorName(name: string) {
  23 |     await this.vendorNameInput.fill(name);
  24 |   }
  25 | 
  26 |   async fillStatus(status: string) {
  27 |     await this.statusInput.fill(status);
  28 |     await this.page.waitForTimeout(300);
  29 | 
  30 |     // Click value help button to open dropdown if status has value help
  31 |     const valueHelpButton = this.page.locator('span[aria-label="Show Value Help"]').last();
  32 |     try {
  33 |       await valueHelpButton.click({ timeout: 5000 });
  34 |       await this.page.waitForLoadState('networkidle');
  35 |       await this.page.waitForTimeout(800);
  36 | 
  37 |       // Wait for dropdown table
  38 |       const tableBody = this.page.locator('tbody[id*="SuggestTable-tblBody"]');
  39 |       await tableBody.waitFor({ state: 'attached', timeout: 10000 });
  40 |       await this.page.waitForTimeout(500);
  41 | 
  42 |       // Find and click the status option in the table
  43 |       const statusOptionRow = this.page.locator(`//span[text()="${status}"]/ancestor::tr[@role="row"]`);
  44 |       await statusOptionRow.first().click();
  45 |       await this.page.waitForLoadState('networkidle');
  46 |       await this.page.waitForTimeout(500);
  47 |     } catch {
  48 |       // Status may not have value help, skip dropdown selection
  49 |       console.log('No value help dropdown for status field');
  50 |     }
  51 |   }
  52 | 
  53 |   async captureAndSaveFormData(filePath: string) {
  54 |     const fs = require('fs');
  55 |     const path = require('path');
  56 | 
  57 |     // Capture vendor header data
  58 |     const vendorName = await this.vendorNameInput.inputValue().catch(() => '');
  59 |     const status = await this.statusInput.inputValue().catch(() => '');
  60 |     const vendorCode = await this.vendorCodeDisplay.textContent().catch(() => '');
  61 | 
  62 |     // Create the data structure
  63 |     const formData = {
  64 |       vendorCode: vendorCode?.trim() || '',
  65 |       vendorName: vendorName.trim(),
  66 |       status: status.trim()
  67 |     };
  68 | 
  69 |     // Ensure directory exists
  70 |     const dir = path.dirname(filePath);
  71 |     if (!fs.existsSync(dir)) {
  72 |       fs.mkdirSync(dir, { recursive: true });
  73 |     }
  74 | 
  75 |     // Save to file with UTF-8 encoding without BOM
  76 |     const utf8Encoding = new (require('util')).TextEncoder();
  77 |     const jsonString = JSON.stringify(formData, null, 2);
  78 |     fs.writeFileSync(filePath, jsonString, { encoding: 'utf-8' });
  79 |     console.log(`Vendor data captured and saved to ${filePath}`);
  80 |   }
  81 | 
  82 |   async clickSaveButton() {
> 83 |     await this.saveButton.click();
     |                           ^ Error: locator.click: Error: strict mode violation: locator('button[id*="VendorObjectPage--fe::FooterBar"][id*="StandardAction::Save"], button[id*="StandardAction::Create"]') resolved to 2 elements:
  84 |     await this.page.waitForLoadState('networkidle');
  85 |   }
  86 | }
  87 | 
```