import { Page, Locator } from '@playwright/test';

export class BuyerPoUploadPage {
  readonly page: Page;

  readonly pageTitle: Locator;
  readonly uploadContainer: Locator;
  readonly fileInput: Locator;
  readonly uploadButton: Locator;
  readonly createButton: Locator;
  readonly successMessage: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;

    // Use more specific selectors for the upload page
    // Wait for the page URL to change to the upload page
    this.pageTitle = page.locator('h1, h2').filter({ hasText: /Buyer.*PO/ }).first();
    this.uploadContainer = page.locator('[data-testid="upload-container"], form, .upload-section, [role="main"]').first();
    this.fileInput = page.locator('input[type="file"]');
    this.uploadButton = page.locator('button:has-text("Upload"), button[type="submit"]').first();
    this.createButton = page.locator('button[id*="StandardAction::Create"]');
    this.successMessage = page.locator('[role="alert"]').filter({ hasText: /success|uploaded/i }).first();
    this.errorMessage = page.locator('[role="alert"]').filter({ hasText: /error|failed/i }).first();
  }

  async waitForPageLoad() {
    // Wait for the page to navigate away from dashboard
    await this.page.waitForURL(/(?!.*dashboard)/, { timeout: 90000 });
    // Wait for upload form to be visible
    await this.uploadContainer.waitFor({ state: 'visible', timeout: 90000 });
  }

  async uploadFile(filePath: string) {
    await this.fileInput.setInputFiles(filePath);
  }

  async clickUploadButton() {
    await this.uploadButton.click();
  }

  async clickCreateButton() {
    await this.createButton.click();
  }

  async isCreateButtonVisible(): Promise<boolean> {
    return await this.createButton.isVisible();
  }

  async waitForSuccessMessage() {
    await this.successMessage.waitFor({ state: 'visible', timeout: 30000 });
  }

  async isSuccessMessageVisible(): Promise<boolean> {
    return await this.successMessage.isVisible();
  }

  async getSuccessMessage(): Promise<string> {
    return await this.successMessage.textContent() || '';
  }
}
