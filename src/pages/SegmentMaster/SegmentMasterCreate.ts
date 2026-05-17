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
    this.saveButton = page.locator('[id*="SegmentMasterObjectPage"][id*="FooterBar"][id*="Save"]');

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
        .locator("xpath=//input[contains(@id,'input0') and contains(@id,'inner')]")
        .last();
      const nameInput = this.page
        .locator("xpath=//input[contains(@id,'input1') and contains(@id,'inner')]")
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
}
