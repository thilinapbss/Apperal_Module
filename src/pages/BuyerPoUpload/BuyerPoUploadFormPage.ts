import { Page, Locator } from '@playwright/test';

export class BuyerPoUploadFormPage {
  readonly page: Page;

  readonly formContainer: Locator;
  readonly formTitle: Locator;
  readonly submitButton: Locator;
  readonly saveButton: Locator;
  readonly cancelButton: Locator;
  readonly excelUploadButton: Locator;
  readonly fileInput: Locator;
  readonly buyerInput: Locator;
  readonly styleNoInput: Locator;
  readonly styleDescriptionInput: Locator;
  readonly styleColorInput: Locator;
  readonly seasonInput: Locator;
  readonly successMessage: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;

    // Form selectors - update based on actual form structure
    this.formContainer = page.locator('form, [role="main"]').first();
    this.formTitle = page.locator('h1, h2').filter({ hasText: /Buyer.*PO|Create/ }).first();
    this.submitButton = page.locator('button:has-text("Submit"), button[type="submit"]').first();
    this.saveButton = page.locator('button:has-text("Save")').first();
    this.cancelButton = page.locator('button:has-text("Cancel")').first();
    this.excelUploadButton = page.locator('button:has-text("ExcelUpload"), button[id*="__button10"]').first();
    this.fileInput = page.locator('input[type="file"]');

    // Input field selectors for data verification
    this.buyerInput = page.locator('input[id*="::Buyer::Field-edit-inner"]').first();
    this.styleNoInput = page.locator('input[id*="StyleNo::Field-edit-inner"], input[id*="Style_No::Field-edit-inner"]').first();
    this.styleDescriptionInput = page.locator('input[id*="StyleDescription::Field-edit-inner"]').first();
    this.styleColorInput = page.locator('input[id*="StyleColor::Field-edit-inner"]').first();
    this.seasonInput = page.locator('input[id*="Season::Field-edit-inner"]').first();

    this.successMessage = page.locator('[role="alert"]').filter({ hasText: /success|saved|created|uploaded/i }).first();
    this.errorMessage = page.locator('[role="alert"]').filter({ hasText: /error|failed/i }).first();
  }

  async waitForFormLoad() {
    await this.formContainer.waitFor({ state: 'visible', timeout: 90000 });
  }

  async fillFormField(fieldName: string, value: string) {
    const input = this.page.locator(`input[name*="${fieldName}"], input[aria-label*="${fieldName}"], input[placeholder*="${fieldName}"]`).first();
    await input.fill(value);
  }

  async uploadExcelFile(filePath: string) {
    try {
      console.log(`Attempting to upload file: ${filePath}`);

      // Strategy 1: Check for hidden file input on the page
      let fileInputs = await this.page.locator('input[type="file"]').all();
      if (fileInputs.length > 0) {
        console.log(`Found ${fileInputs.length} hidden file input(s)`);
        for (const input of fileInputs) {
          await input.setInputFiles(filePath);
        }
        await this.page.waitForTimeout(1000);
        return;
      }

      // Strategy 2: Wait for file chooser while clicking simultaneously
      console.log('No file input found, trying file chooser method');
      let fileChooserFired = false;

      const fileChooserPromise = this.page.waitForEvent('filechooser').then(async (fileChooser) => {
        fileChooserFired = true;
        console.log('File chooser event fired');
        await fileChooser.setFiles(filePath);
      }).catch((err) => {
        console.log('File chooser promise rejected:', err.message);
      });

      // Click the button to trigger file chooser
      await this.excelUploadButton.click();
      console.log('Clicked ExcelUpload button');

      // Wait briefly for file chooser to be triggered
      await this.page.waitForTimeout(500);

      // If file chooser was triggered, wait for it to complete
      if (fileChooserFired) {
        console.log('File uploaded via file chooser');
        await fileChooserPromise;
      } else {
        // Strategy 3: Check if a file input appeared after click
        await this.page.waitForTimeout(500);
        fileInputs = await this.page.locator('input[type="file"]').all();
        if (fileInputs.length > 0) {
          console.log('File input appeared after click, using it');
          const lastInput = fileInputs[fileInputs.length - 1];
          await lastInput.setInputFiles(filePath);
        } else {
          console.warn('No file input found, file chooser did not trigger');
        }
      }

      await this.page.waitForTimeout(2000);
    } catch (error) {
      console.error(`Error uploading file: ${error}`);
      throw error;
    }
  }

  async clickExcelUploadButton() {
    // Just click the button, file upload is handled in uploadExcelFile
    await this.excelUploadButton.click();
  }

  async isExcelUploadButtonVisible(): Promise<boolean> {
    return await this.excelUploadButton.isVisible();
  }

  async clickSubmitButton() {
    await this.submitButton.click();
  }

  async clickSaveButton() {
    await this.saveButton.click();
  }

  async clickCancelButton() {
    await this.cancelButton.click();
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

  // Verification methods for data fields
  async getBuyerValue(): Promise<string> {
    return await this.buyerInput.inputValue();
  }

  async getStyleNoValue(): Promise<string> {
    return await this.styleNoInput.inputValue();
  }

  async getStyleDescriptionValue(): Promise<string> {
    return await this.styleDescriptionInput.inputValue();
  }

  async getStyleColorValue(): Promise<string> {
    return await this.styleColorInput.inputValue();
  }

  async getSeasonValue(): Promise<string> {
    return await this.seasonInput.inputValue();
  }

  async verifyDataLoaded(expectedData: { buyer?: string; styleNo?: string; styleDescription?: string; styleColor?: string; season?: string }): Promise<boolean> {
    try {
      if (expectedData.buyer) {
        const buyerValue = await this.getBuyerValue();
        if (buyerValue !== expectedData.buyer) {
          console.log(`Buyer mismatch: expected "${expectedData.buyer}", got "${buyerValue}"`);
          return false;
        }
      }

      if (expectedData.styleNo) {
        const styleNoValue = await this.getStyleNoValue();
        if (styleNoValue !== expectedData.styleNo) {
          console.log(`Style No mismatch: expected "${expectedData.styleNo}", got "${styleNoValue}"`);
          return false;
        }
      }

      if (expectedData.styleDescription) {
        const styleDescValue = await this.getStyleDescriptionValue();
        if (styleDescValue !== expectedData.styleDescription) {
          console.log(`Style Description mismatch: expected "${expectedData.styleDescription}", got "${styleDescValue}"`);
          return false;
        }
      }

      if (expectedData.styleColor) {
        const styleColorValue = await this.getStyleColorValue();
        if (styleColorValue !== expectedData.styleColor) {
          console.log(`Style Color mismatch: expected "${expectedData.styleColor}", got "${styleColorValue}"`);
          return false;
        }
      }

      if (expectedData.season) {
        const seasonValue = await this.getSeasonValue();
        if (seasonValue !== expectedData.season) {
          console.log(`Season mismatch: expected "${expectedData.season}", got "${seasonValue}"`);
          return false;
        }
      }

      return true;
    } catch (error) {
      console.log(`Error verifying data: ${error}`);
      return false;
    }
  }
}
