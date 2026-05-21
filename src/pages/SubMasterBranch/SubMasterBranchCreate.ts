import { Page, Locator } from '@playwright/test';

export class SubMasterBranchCreate {
  readonly page: Page;
  readonly branchCodeInput: Locator;
  readonly branchNameInput: Locator;
  readonly statusInput: Locator;
  readonly saveButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.branchCodeInput = page.locator('input[id*="DataField::code::Field-edit-inner"]');
    this.branchNameInput = page.locator('input[id*="DataField::name::Field-edit-inner"]');
    this.statusInput = page.locator('input[id*="DataField::status::Field-edit-inner-inner"]');
    this.saveButton = page.locator('button[id$="::FooterBar::StandardAction::Save"]');
  }

  async waitForFormLoad() {
    await this.branchCodeInput.waitFor({ state: 'visible', timeout: 30000 });
  }

  async fillBranchCode(code: string) {
    await this.branchCodeInput.fill(code);
  }

  async fillBranchName(name: string) {
    await this.branchNameInput.fill(name);
  }

  async fillStatus(status: string) {
    await this.statusInput.fill(status);
    await this.page.waitForTimeout(300);

    // Click value help button to open dropdown if status has value help
    const valueHelpButton = this.page.locator('span[aria-label="Show Value Help"]').last();
    try {
      await valueHelpButton.click({ timeout: 5000 });
      await this.page.waitForLoadState('networkidle');
      await this.page.waitForTimeout(800);

      // Wait for dropdown table
      const tableBody = this.page.locator('tbody[id*="SuggestTable-tblBody"]');
      await tableBody.waitFor({ state: 'attached', timeout: 10000 });
      await this.page.waitForTimeout(500);

      // Find and click the status option in the table
      const statusOptionRow = this.page.locator(`//span[text()="${status}"]/ancestor::tr[@role="row"]`);
      await statusOptionRow.first().click();
      await this.page.waitForLoadState('networkidle');
      await this.page.waitForTimeout(500);
    } catch {
      // Status may not have value help, skip dropdown selection
      console.log('No value help dropdown for status field');
    }
  }

  async captureAndSaveFormData(filePath: string) {
    const fs = require('fs');
    const path = require('path');

    // Capture branch data
    const branchCode = await this.branchCodeInput.inputValue().catch(() => '');
    const branchName = await this.branchNameInput.inputValue().catch(() => '');
    const status = await this.statusInput.inputValue().catch(() => '');

    // Create the data structure
    const formData = {
      branchCode: branchCode.trim(),
      branchName: branchName.trim(),
      status: status.trim()
    };

    // Ensure directory exists
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Save to file with UTF-8 encoding without BOM
    const jsonString = JSON.stringify(formData, null, 2);
    fs.writeFileSync(filePath, jsonString, { encoding: 'utf-8' });
    console.log(`Sub Master Branch data captured and saved to ${filePath}`);
  }

  async clickSaveButton() {
    await this.saveButton.click();
    await this.page.waitForLoadState('networkidle');
  }
}
