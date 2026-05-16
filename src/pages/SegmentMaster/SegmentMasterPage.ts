import { Page, Locator } from '@playwright/test';

export class SegmentMasterPage {
  readonly page: Page;

  readonly listTable: Locator;
  readonly firstListRow: Locator;
  readonly detailsCreateButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.listTable = page.locator('[id*="SegmentMasterList"][id*="LineItem-innerTable"]');
    this.firstListRow = page.locator('[id*="SegmentMasterList"][id*="LineItem-innerTable"] tbody tr').first();
    this.detailsCreateButton = page.locator('[id*="SegmentMasterObjectPage"][id*="Details::StandardAction::Create"]');
  }

  async waitForListLoad() {
    await this.page.waitForSelector('[id*="SegmentMasterList"]', { timeout: 30000 });
    await this.page.waitForLoadState('networkidle');
  }

  async clickFirstRecord() {
    await this.firstListRow.waitFor({ state: 'visible', timeout: 15000 });
    await this.firstListRow.click();
    await this.page.waitForLoadState('networkidle');
  }

  async waitForObjectPageLoad() {
    await this.page.waitForSelector('[id*="SegmentMasterObjectPage"]', { timeout: 30000 });
    await this.page.waitForLoadState('networkidle');
  }

  async clickDetailsCreateButton() {
    await this.detailsCreateButton.waitFor({ state: 'visible', timeout: 15000 });
    await this.detailsCreateButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async getFirstRowCellText(columnIndex: number): Promise<string> {
    const cell = this.firstListRow.locator('td').nth(columnIndex);
    return (await cell.textContent())?.trim() ?? '';
  }
}
