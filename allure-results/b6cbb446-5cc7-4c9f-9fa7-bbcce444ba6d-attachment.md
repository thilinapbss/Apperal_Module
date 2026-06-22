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
  - waiting for locator('button[id*="StandardAction::Create"]')

```

# Test source

```ts
  1  | import { Page, Locator } from '@playwright/test';
  2  | 
  3  | export class BuyerPoUploadPage {
  4  |   readonly page: Page;
  5  | 
  6  |   readonly pageTitle: Locator;
  7  |   readonly uploadContainer: Locator;
  8  |   readonly fileInput: Locator;
  9  |   readonly uploadButton: Locator;
  10 |   readonly createButton: Locator;
  11 |   readonly successMessage: Locator;
  12 |   readonly errorMessage: Locator;
  13 | 
  14 |   constructor(page: Page) {
  15 |     this.page = page;
  16 | 
  17 |     // Use more specific selectors for the upload page
  18 |     // Wait for the page URL to change to the upload page
  19 |     this.pageTitle = page.locator('h1, h2').filter({ hasText: /Buyer.*PO/ }).first();
  20 |     this.uploadContainer = page.locator('[data-testid="upload-container"], form, .upload-section, [role="main"]').first();
  21 |     this.fileInput = page.locator('input[type="file"]');
  22 |     this.uploadButton = page.locator('button:has-text("Upload"), button[type="submit"]').first();
  23 |     this.createButton = page.locator('button[id*="StandardAction::Create"]');
  24 |     this.successMessage = page.locator('[role="alert"]').filter({ hasText: /success|uploaded/i }).first();
  25 |     this.errorMessage = page.locator('[role="alert"]').filter({ hasText: /error|failed/i }).first();
  26 |   }
  27 | 
  28 |   async waitForPageLoad() {
  29 |     // Wait for the page to navigate away from dashboard
  30 |     await this.page.waitForURL(/(?!.*dashboard)/, { timeout: 90000 });
  31 |     // Wait for upload form to be visible
  32 |     await this.uploadContainer.waitFor({ state: 'visible', timeout: 90000 });
  33 |   }
  34 | 
  35 |   async uploadFile(filePath: string) {
  36 |     await this.fileInput.setInputFiles(filePath);
  37 |   }
  38 | 
  39 |   async clickUploadButton() {
  40 |     await this.uploadButton.click();
  41 |   }
  42 | 
  43 |   async clickCreateButton() {
> 44 |     await this.createButton.click();
     |                             ^ TimeoutError: locator.click: Timeout 30000ms exceeded.
  45 |   }
  46 | 
  47 |   async isCreateButtonVisible(): Promise<boolean> {
  48 |     return await this.createButton.isVisible();
  49 |   }
  50 | 
  51 |   async waitForSuccessMessage() {
  52 |     await this.successMessage.waitFor({ state: 'visible', timeout: 30000 });
  53 |   }
  54 | 
  55 |   async isSuccessMessageVisible(): Promise<boolean> {
  56 |     return await this.successMessage.isVisible();
  57 |   }
  58 | 
  59 |   async getSuccessMessage(): Promise<string> {
  60 |     return await this.successMessage.textContent() || '';
  61 |   }
  62 | }
  63 | 
```