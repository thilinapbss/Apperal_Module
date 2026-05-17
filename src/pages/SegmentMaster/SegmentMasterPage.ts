import { Page, Locator } from '@playwright/test';

export class SegmentMasterPage {
  readonly page: Page;

  readonly listTable: Locator;
  readonly firstListRow: Locator;
  readonly listCreateButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.listTable = page.locator('[id*="SegmentMasterList"][id*="LineItem-innerTable"]');
    this.firstListRow = page.locator('[id*="SegmentMasterList"][id*="LineItem-innerTable"] tbody tr').first();
    this.listCreateButton = page.locator('button[id*="SegmentMasterList--fe::table"][id*="LineItem::StandardAction::Create"]');
  }

  // Returns true if the list Create button is visible within 5 s.
  // Short timeout prevents a long hang that can stale the browser CDP session.
  async isListReady(): Promise<boolean> {
    return this.listCreateButton
      .waitFor({ state: 'visible', timeout: 5000 })
      .then(() => true)
      .catch(() => false);
  }

  async clickCreateButton() {
    await this.listCreateButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async getFirstRowCellText(columnIndex: number): Promise<string> {
    const cell = this.firstListRow.locator('td').nth(columnIndex);
    return (await cell.textContent())?.trim() ?? '';
  }
}
