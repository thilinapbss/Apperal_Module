import { Page, Locator } from '@playwright/test';

export class SegmentMasterCreate {
  readonly page: Page;

  // Header form
  readonly nameInput: Locator;
  readonly saveButton: Locator;

  // Line items table
  readonly lineItemCreateButton: Locator;
  readonly lineItemTable: Locator;
  readonly firstLineItemRow: Locator;

  // First row inputs using XPath — input0 = Segment Code, input1 = Segment Name
  readonly firstRowSegmentCodeInput: Locator;

  constructor(page: Page) {
    this.page = page;

    this.nameInput = page.locator('[id*="DataField::Name::Field-edit-inner"]');
    this.saveButton = page.locator('button[id*="SegmentMasterObjectPage"][id*="FooterBar"][id*="StandardAction"][id*="Save"]');

    this.lineItemCreateButton = page.locator(
      'button[id*="SegmentMasterObjectPage--fe::table::GeneralInformation::LineItem::Details::StandardAction::Create"]'
    );
    this.lineItemTable = page.locator(
      '[id*="GeneralInformation::LineItem::Details-innerTable-listUl"]'
    );

    this.firstLineItemRow = page
      .locator('tr[id*="GeneralInformation::LineItem::Details-innerTableRow"]')
      .first();

    this.firstRowSegmentCodeInput = page.locator(
      "xpath=(//input[contains(@id,'input0') and contains(@id,'inner')])[1]"
    );
  }

  async waitForFormLoad() {
    await this.nameInput.waitFor({ state: 'visible', timeout: 30000 });
  }

  async fillName(name: string) {
    await this.nameInput.fill(name);
  }

  async clickLineItemCreateButton() {
    await this.lineItemCreateButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async waitForLineItemRow() {
    await this.firstLineItemRow.waitFor({ state: 'visible', timeout: 10000 });
  }

  async fillLineItemRow(segmentCode: string, segmentName: string) {
    await this.firstRowSegmentCodeInput.waitFor({ state: 'visible', timeout: 10000 });
    await this.firstRowSegmentCodeInput.fill(segmentCode);
  }

  async fillAllLineItemRows(segments: { segmentCode: string; segmentName: string }[]) {
    for (let i = 0; i < segments.length; i++) {
      await this.lineItemCreateButton.click();
      await this.page.waitForLoadState('networkidle');
      await this.page.waitForTimeout(2000);

      const codeInput = this.page
        .locator("xpath=(//input)[11]")
        .last();
      const nameInput = this.page
        .locator("xpath=(//input)[12]")
        .last();

      await codeInput.pressSequentially(segments[i].segmentCode, { delay: 50 });
      await this.page.keyboard.press('Tab');

      await nameInput.pressSequentially(segments[i].segmentName, { delay: 50 });
      await this.page.keyboard.press('Tab');
    }
  }

  async getLineItemRowCount(): Promise<number> {
    return this.page
      .locator('tr[id*="GeneralInformation::LineItem::Details-innerTableRow"]')
      .count();
  }

  async clickSaveButton() {
    await this.saveButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async captureAndSaveFormData(filePath: string) {
    const fs = require('fs');
    const path = require('path');

    // Capture code from display field
    const codeValue = await this.page
      .locator('[id*="DataField::Code::Field-display"]')
      .textContent()
      .catch(() => '');

    // Capture header data
    const nameValue = await this.nameInput.inputValue().catch(() => '');

    // Capture status from the visible value
    const statusElement = await this.page.locator('[id*="DataField::Status::Field-edit-inner"]').inputValue().catch(() => '');

    // Capture line item data from table
    const lineItems = [];
    const tableBody = this.page.locator('[id*="GeneralInformation::LineItem::Details-innerTable-tblBody"]');
    const rows = tableBody.locator('tr[id*="innerTableRow"]');
    const rowCount = await rows.count();

    for (let i = 0; i < rowCount; i++) {
      const row = rows.nth(i);

      // Get all input fields in this row
      const inputs = row.locator('input[type="text"]');
      const inputCount = await inputs.count();

      if (inputCount >= 2) {
        const segmentCode = await inputs.nth(0).inputValue().catch(() => '');
        const segmentName = await inputs.nth(1).inputValue().catch(() => '');
        const index = await inputs.nth(2).inputValue().catch(() => `${i + 1}`);

        if (segmentCode) {
          lineItems.push({
            segmentCode: segmentCode,
            segmentName: segmentName,
            index: parseInt(index) || i + 1
          });
        }
      }
    }

    // Create the data structure
    const formData = {
      code: codeValue?.trim() || '',
      name: nameValue,
      status: statusElement,
      segments: lineItems
    };

    // Ensure directory exists
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Save to file
    fs.writeFileSync(filePath, JSON.stringify(formData, null, 2), 'utf-8');
    console.log(`Form data captured and saved to ${filePath}`);
  }
}
